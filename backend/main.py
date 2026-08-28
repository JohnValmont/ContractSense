import os
import json
import re
import hashlib
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pdfplumber

from local_analyzer import analyze_contract_local

from db import init_db
from auth import auth_bp

# ─────────────────────────────────────────────
#  PDF Text Extraction with OCR Fallback
# ─────────────────────────────────────────────
def extract_pdf_text(file_stream) -> tuple[str, bool]:
    """
    Returns (text, used_ocr).
    Tries pdfplumber first (fast, for digital PDFs).
    Falls back to pytesseract OCR for scanned image-only PDFs.
    """
    text = ""
    used_ocr = False

    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"[ContractSense] pdfplumber failed: {e}")

    # If no text found, try OCR fallback
    if not text.strip():
        try:
            from pdf2image import convert_from_bytes
            import pytesseract
            from PIL import Image

            file_stream.seek(0)
            pdf_bytes = file_stream.read()
            images = convert_from_bytes(pdf_bytes, dpi=300)
            for img in images:
                ocr_text = pytesseract.image_to_string(img, lang='eng+hin')
                if ocr_text:
                    text += ocr_text + "\n"
            used_ocr = True
            print(f"[ContractSense] OCR extracted {len(text)} chars from scanned PDF")
        except Exception as e:
            print(f"[ContractSense] OCR fallback failed: {e}")

    return text.strip(), used_ocr


def sha256_hash(file_stream) -> str:
    """Compute SHA-256 fingerprint of the uploaded file."""
    file_stream.seek(0)
    h = hashlib.sha256()
    for chunk in iter(lambda: file_stream.read(8192), b""):
        h.update(chunk)
    file_stream.seek(0)
    return h.hexdigest()

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

# Initialize DB on startup
init_db()

# Register auth blueprint
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# ─────────────────────────────────────────────
#  API Keys
# ─────────────────────────────────────────────
def get_multiple_keys(prefix: str) -> list:
    keys = []
    # Check default (no suffix)
    default = os.getenv(prefix, "")
    if default:
        keys.append(default)
    # Check suffixes _1, _2, _3... up to 10
    for i in range(1, 11):
        key = os.getenv(f"{prefix}_{i}", "")
        if key and key not in keys:
            keys.append(key)
    return keys

# ─────────────────────────────────────────────
#  Fallback Chain  (tried in order until one succeeds)
# ─────────────────────────────────────────────
#  Gemini model names that are live as of Aug 2026:
#    gemini-2.0-flash   → fast, cheap, great quality
#    gemini-1.5-flash   → previous gen flash
#    gemini-1.5-pro     → previous gen pro  (still working but rate-limited)
#
#  NOTE: "gemini-pro" and "gemini-1.0-pro" are DEPRECATED → do not use them.
# ─────────────────────────────────────────────
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

def build_fallback_chain() -> list:
    chain = []

    # 1️⃣  Gemini (Google) — free tier, 15 RPM
    gemini_keys = get_multiple_keys("GEMINI_API_KEY")
    for idx, key in enumerate(gemini_keys):
        suffix = f" {idx+1}" if idx > 0 else ""
        chain += [
            {
                "name":   f"Gemini 2.0 Flash{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-2.0-flash:generateContent?key={key}",
            },
            {
                "name":   f"Gemini 1.5 Pro{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-1.5-pro:generateContent?key={key}",
            },
            {
                "name":   f"Gemini 1.5 Flash{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-1.5-flash:generateContent?key={key}",
            },
        ]

    # 2️⃣  Groq (OpenAI OSS)
    groq_keys = get_multiple_keys("GROQ_API_KEY")
    for idx, key in enumerate(groq_keys):
        suffix = f" {idx+1}" if idx > 0 else ""
        chain += [
            {
                "name":  f"Groq GPT-OSS-120b{suffix}",
                "type":  "openai_compat",
                "model": "openai/gpt-oss-120b",
                "base":  "https://api.groq.com/openai/v1",
                "key":   key,
            },
        ]

    # 3️⃣  Grok (xAI) — free tier, OpenAI-compatible
    grok_keys = get_multiple_keys("GROK_API_KEY")
    for idx, key in enumerate(grok_keys):
        suffix = f" {idx+1}" if idx > 0 else ""
        chain += [
            {
                "name":  f"Grok 3 Mini{suffix}",
                "type":  "openai_compat",
                "model": "grok-3-mini",
                "base":  "https://api.x.ai/v1",
                "key":   key,
            },
        ]

    # 4️⃣  OpenAI — paid, most reliable
    openai_keys = get_multiple_keys("OPENAI_API_KEY")
    for idx, key in enumerate(openai_keys):
        suffix = f" {idx+1}" if idx > 0 else ""
        chain += [
            {
                "name":  f"OpenAI GPT-4o{suffix}",
                "type":  "openai_compat",
                "model": "gpt-4o",
                "base":  "https://api.openai.com/v1",
                "key":   key,
            },
            {
                "name":  f"OpenAI GPT-4o-mini{suffix}",
                "type":  "openai_compat",
                "model": "gpt-4o-mini",
                "base":  "https://api.openai.com/v1",
                "key":   key,
            },
        ]

    return chain

# ─────────────────────────────────────────────
#  JSON extraction helper (strips markdown fences)
# ─────────────────────────────────────────────
def extract_json(text: str) -> dict:
    # Remove markdown code fences
    text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    text = re.sub(r"\s*```$",          "", text.strip(), flags=re.MULTILINE)
    return json.loads(text.strip())

# ─────────────────────────────────────────────
#  Core LLM caller with fallback
# ─────────────────────────────────────────────
def call_llm_with_fallback(prompt: str) -> dict:
    chain = build_fallback_chain()

    if not chain:
        raise Exception("No API keys configured. Add at least one of: GEMINI_API_KEY, GROQ_API_KEY, GROK_API_KEY, OPENAI_API_KEY (with optional _1, _2 suffixes) to backend/.env")

    errors = []
    for api in chain:
        try:
            print(f"[ContractSense] Trying: {api['name']}")

            if api["type"] == "gemini":
                resp = requests.post(
                    api["url"],
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {
                            "temperature":    0.2,
                            "topP":           0.8,
                            "maxOutputTokens": 8192,
                        },
                    },
                    timeout=60,
                )
                resp.raise_for_status()
                raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                result = extract_json(raw)
                print(f"[ContractSense] Success with {api['name']}")
                return result

            elif api["type"] == "openai_compat":
                # Works for OpenAI, Groq, Grok — all are OpenAI-compatible
                resp = requests.post(
                    f"{api['base']}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api['key']}",
                        "Content-Type":  "application/json",
                    },
                    json={
                        "model":       api["model"],
                        "temperature": 0.2,
                        "messages": [
                            {
                                "role":    "system",
                                "content": "You are an elite Indian corporate lawyer and auditor specializing in the MSME Development Act 2006, the Indian Contract Act 1872, and the Sale of Goods Act 1930. You evaluate contracts strictly against common Indian commercial contract patterns. You exhaustively identify ALL risks, and ALWAYS respond with valid raw JSON only — no markdown fences, no conversational text.",
                            },
                            {"role": "user", "content": prompt},
                        ],
                    },
                    timeout=60,
                )
                resp.raise_for_status()
                raw = resp.json()["choices"][0]["message"]["content"]
                result = extract_json(raw)
                print(f"[ContractSense] Success with {api['name']}")
                return result

        except Exception as e:
            msg = f"{api['name']} failed: {e}"
            print(f"[ContractSense] {msg}")
            errors.append(msg)
            continue

    raise Exception("All APIs in the fallback chain failed.\n" + "\n".join(errors))

# ─────────────────────────────────────────────
#  MSME Analysis Prompt (Advanced Taxonomy & CoT)
# ─────────────────────────────────────────────
def build_prompt(contract_text: str, language: str = "English") -> str:
    return f"""
You are an elite Indian corporate lawyer and auditor specializing in the MSME Development Act 2006, the Indian Contract Act 1872, the Sale of Goods Act 1930, and common Indian commercial contract patterns. Your sole purpose is to protect MSME vendors from predatory corporate contracting practices prevalent in the Indian legal context.

--- RISK TAXONOMY & INDIAN LEGAL CONTEXT CHECKLIST ---
When analyzing this contract, systematically check for EACH of the following known risk patterns. Do not rely only on general impression — actively verify the presence or absence of each category below, and flag any that are present, even if phrased in standard-sounding legal language:

1. Payment terms exceeding 45 days, or payment conditioned on subjective/undefined acceptance criteria, or no late-payment interest specified
2. Termination rights available to only one party, or asymmetric notice periods, or no compensation for work-in-progress on termination
3. One-sided indemnification obligations, or asymmetric liability caps, or liability carve-outs applying to only one party
4. IP assignment broader than the specific deliverables of this engagement, or no license-back for vendor's pre-existing tools/methods
5. Confidentiality obligations that are asymmetric in duration or scope between the parties
6. Non-compete, exclusivity, or non-solicitation obligations extending beyond 12 months post-termination or covering an unreasonably broad category of business
7. Automatic renewal with a narrow non-renewal notice window, or unilateral amendment rights with "deemed acceptance" language
8. Force majeure relief that is asymmetric between the parties
9. Dispute resolution venue or arbitrator-selection rights that favor one party's location or control
10. Assignment rights that are asymmetric between the parties
11. Audit rights that are broad, frequent, or short-notice with no reciprocal obligation
12. Notice provisions that could be used to claim deemed receipt without actual receipt
13. Warranty periods or disclaimers that are shorter/broader for one party than commercially typical

For each pattern found, report: which clause/section it appears in, a plain-language explanation of the specific risk, and a risk level (High/Medium/Low) based on severity and how disadvantageous it is relative to normal commercial practice. If you are uncertain whether something qualifies, include it as Low risk rather than omitting it — err toward flagging over silence. Write this explanation in {language}.

Crucially, for every risk identified, you MUST explicitly cite the specific statutory section of the MSME Development Act, 2006, the Indian Contract Act, 1872, or the Sale of Goods Act, 1930 that is relevant. If no specific section applies, provide the general legal doctrine in the Indian context.

Also provide a fair, specific redline suggestion to neutralize the risk. Write this in {language}.
Finally, compute a brutal, realistic risk_score (0-100) based on how predatory the contract is overall.

Respond ONLY with a single valid JSON object. No markdown fences. No explanatory text.

Format:
{{
  "summary": "Detailed executive summary of the contract's predatory nature and overall risk to the MSME, written in {language}.",
  "risk_score": <integer 0-100>,
  "clauses": [
    {{
      "title": "Article X.Y",
      "content": "Exact text...",
      "risk_level": "High",
      "explanation": "Explanation in {language}...",
      "msme_act_reference": "Section 15 of MSME Act, 2006 (or other relevant statute/doctrine)",
      "redline_suggestion": "Suggested redline in {language}..."
    }}
  ]
}}

Contract Text:
\"\"\"
{contract_text}
\"\"\"
""".strip()

def build_translation_prompt(contract_text: str, language: str) -> str:
    return f"""
You are an expert legal translator. Your task is to accurately translate the entire following legal document into {language}.
Preserve the formal legal tone, formatting, and specific legal terminology.

Respond ONLY with a single valid JSON object containing the translated text. Do not include markdown, code fences, or explanatory text — just raw JSON.

Format:
{{
  "translated_title": "Translated title of the document in {language}",
  "translated_text": "The full translated text of the document in {language}. Use \n for paragraph breaks."
}}

Document Text:
\"\"\"
{contract_text}
\"\"\"
""".strip()

# ─────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────
@app.route("/", methods=["GET"])
def read_root():
    chain = build_fallback_chain()
    return jsonify({
        "service": "ContractSense API",
        "status":  "online",
        "models_configured": [m["name"] for m in chain],
    })

@app.route("/api/analyze", methods=["POST"])
def analyze_contract():
    if "file" not in request.files:
        return jsonify({"detail": "No file part in request. Send a multipart/form-data POST with key 'file'."}), 400

    file = request.files["file"]
    language = request.form.get("language", "English")

    if not file.filename:
        return jsonify({"detail": "No file selected."}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"detail": "Only PDF files are supported."}), 400

    # ── Compute SHA-256 fingerprint before reading ──
    doc_fingerprint = sha256_hash(file)

    # ── Extract text from PDF (with OCR fallback) ──────────────────
    contract_text, used_ocr = extract_pdf_text(file)

    if not contract_text:
        return jsonify({"detail": "No readable text found in the PDF. The file may be corrupted or password-protected."}), 400

    # ── Trim to ~300,000 chars to stay within token limits ──
    if len(contract_text) > 300000:
        contract_text = contract_text[:300000] + "\n...[truncated for length]"

    # ── Call AI or Local Fallback ────────────
    fallback_chain = build_fallback_chain()
    
    def attach_meta(result: dict) -> dict:
        """Attach security metadata to every analysis result."""
        result["_meta"] = {
            "sha256": doc_fingerprint,
            "ocr_used": used_ocr,
            "processing_mode": "ai",
        }
        return result

    if fallback_chain:
        try:
            prompt = build_prompt(contract_text, language)
            result = call_llm_with_fallback(prompt)
            return jsonify(attach_meta(result))
        except Exception as e:
            print(f"[ContractSense] API call failed, falling back to local heuristic engine: {e}")
    else:
        print("[ContractSense] No API keys configured, using local heuristic engine.")

    # ── Fallback: Try local dynamic extraction ──
    local_result = analyze_contract_local(contract_text, language)
    if local_result:
        local_result["_meta"] = {"sha256": doc_fingerprint, "ocr_used": used_ocr, "processing_mode": "offline_fallback"}
        return jsonify(local_result)

    # ── Final Fallback: Static Demo ──
    try:
        filename = "demo_risk_analysis.json"
        if language.lower() == "hindi":
            filename = "demo_risk_analysis_hindi.json"
        with open(filename, "r", encoding="utf-8") as f:
            demo = json.load(f)
            demo["_meta"] = {"sha256": doc_fingerprint, "ocr_used": used_ocr, "processing_mode": "demo"}
            return jsonify(demo)
    except Exception as inner_e:
        return jsonify({"detail": f"APIs failed and Demo file missing: {inner_e}"}), 500


@app.route("/api/analyze-local", methods=["POST"])
def analyze_contract_offline():
    """Dedicated offline endpoint — skips all LLM calls. Zero data leaves the server."""
    if "file" not in request.files:
        return jsonify({"detail": "No file part in request."}), 400

    file = request.files["file"]
    language = request.form.get("language", "English")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        return jsonify({"detail": "Only PDF files are supported."}), 400

    doc_fingerprint = sha256_hash(file)
    contract_text, used_ocr = extract_pdf_text(file)

    if not contract_text:
        return jsonify({"detail": "No readable text found in PDF."}), 400

    if len(contract_text) > 300000:
        contract_text = contract_text[:300000]

    # analyze_contract_local now always returns a valid result (never None).
    # It returns a clean-bill-of-health for safe contracts and a risk report for risky ones.
    # We NEVER fall through to demo data for a real document upload.
    local_result = analyze_contract_local(contract_text, language)
    local_result["_meta"] = {
        "sha256": doc_fingerprint,
        "ocr_used": used_ocr,
        "processing_mode": "offline",
    }
    return jsonify(local_result)

@app.route("/api/translate", methods=["POST"])
def translate_contract():
    if "file" not in request.files:
        return jsonify({"detail": "No file part in request. Send a multipart/form-data POST with key 'file'."}), 400

    file = request.files["file"]
    language = request.form.get("language", "Urdu")

    if not file.filename:
        return jsonify({"detail": "No file selected."}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"detail": "Only PDF files are supported."}), 400

    # ── Compute SHA-256 fingerprint before reading ──
    doc_fingerprint = sha256_hash(file)

    # ── Extract text from PDF (with OCR fallback) ──────────────────
    contract_text, used_ocr = extract_pdf_text(file)

    if not contract_text:
        return jsonify({"detail": "No readable text found in the PDF."}), 400

    # ── Trim to ~300,000 chars to stay within token limits ──
    if len(contract_text) > 300000:
        contract_text = contract_text[:300000] + "\n...[truncated for length]"

    if not build_fallback_chain():
        if language == "Hindi":
            demo_text = "डेमो मोड: कोई एपीआई कुंजी कॉन्फ़िगर नहीं की गई है। लाइव अनुवाद सक्षम करने के लिए backend/.env में एपीआई कुंजी जोड़ें।"
        else:
            demo_text = "Demo mode: no API keys configured. Add API keys to backend/.env to enable live translation."

        return jsonify({
            "translated_title": f"Demo Translation ({language})",
            "translated_text": demo_text
        })

    # ── Call AI with fallback chain ────────────
    def attach_meta(result: dict, mode: str) -> dict:
        result["_meta"] = {
            "sha256": doc_fingerprint,
            "ocr_used": used_ocr,
            "processing_mode": mode,
        }
        return result

    try:
        prompt = build_translation_prompt(contract_text, language)
        result = call_llm_with_fallback(prompt)
        return jsonify(attach_meta(result, "ai"))
    except Exception as e:
        print(f"[ContractSense] Translation API call failed, falling back to demo: {e}")
        
        if language == "Hindi":
            demo_text = "यह एक डेमो अनुवाद है क्योंकि एपीआई कॉल विफल हो गया है। उत्पादन वातावरण में, यहां पूरा अनुबंध अनुवाद दिखाई देगा।"
        else:
            demo_text = f"This is a fallback demo response because the API call failed ({e}). In a production environment with active API keys, the full contract translation will appear here."

        demo_result = {
            "translated_title": f"Demo Translation ({language})",
            "translated_text": demo_text
        }
        return jsonify(attach_meta(demo_result, "demo"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
