import os
import json
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pdfplumber

from db import init_db
from auth import auth_bp

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
                "name":   f"Gemini 3.5 Flash{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-3.5-flash:generateContent?key={key}",
            },
            {
                "name":   f"Gemini 2.5 Pro{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-2.5-pro:generateContent?key={key}",
            },
            {
                "name":   f"Gemini 2.5 Flash{suffix}",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-2.5-flash:generateContent?key={key}",
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
                                "content": "You are an expert Indian corporate lawyer specializing in the MSME Development Act, 2006. Always respond with valid raw JSON only — no markdown, no explanation.",
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
#  MSME Analysis Prompt
# ─────────────────────────────────────────────
def build_prompt(contract_text: str, language: str = "English") -> str:
    return f"""
You are an expert Indian corporate lawyer specializing in the MSME Development Act, 2006.

Carefully analyze the following vendor contract. For each key clause:
1. Identify the clause title and extract its text verbatim (in English).
2. Evaluate the risk level for the MSME vendor: Low, Medium, or High (in English).
3. Provide a plain-language explanation in simple terms, referencing specific sections of the MSME Development Act, 2006, the Indian Contract Act, 1872, or other relevant law wherever applicable. Write this explanation in {language}.
4. If the clause is risky (Medium or High), propose a specific, fair redline suggestion. Write this redline suggestion in {language}.

Also compute an overall risk_score (0-100, where 100 is extremely risky for the MSME).

Respond ONLY with a single valid JSON object. Do not include any markdown, code fences, or explanatory text — just raw JSON.

Format:
{{
  "summary": "2-3 sentence executive summary of the contract and its overall risk to the MSME vendor, written in {language}.",
  "risk_score": <integer 0-100>,
  "clauses": [
    {{
      "title": "Payment Terms",
      "content": "Exact text of this clause from the contract.",
      "risk_level": "High",
      "explanation": "Explanation written in {language} about why it is risky...",
      "redline_suggestion": "Suggested redline rewritten in {language}..."
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

    # ── Extract text from PDF ──────────────────
    contract_text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    contract_text += extracted + "\n"
    except Exception as e:
        return jsonify({"detail": f"Failed to read PDF: {str(e)}"}), 500

    if not contract_text.strip():
        return jsonify({"detail": "No readable text found in the PDF. Make sure it is not a scanned image-only PDF."}), 400

    # ── Trim to ~12,000 chars to stay within token limits ──
    if len(contract_text) > 12000:
        contract_text = contract_text[:12000] + "\n...[truncated for length]"

    # ── No API key → return demo response ─────
    if not build_fallback_chain():
        return jsonify({
            "summary": "Demo mode: no API keys configured. Add GEMINI_API_KEY to backend/.env to enable live analysis.",
            "risk_score": 55,
            "clauses": [
                {
                    "title": "Payment Terms",
                    "content": "The Buyer shall make payment within 90 days of receipt of invoice.",
                    "risk_level": "High",
                    "explanation": "Section 15 of the MSME Development Act, 2006 mandates payment within 45 days. A 90-day term directly violates this and exposes the buyer to compound interest at 3× the RBI bank rate.",
                    "redline_suggestion": "Payment shall be made within 45 days of receipt of invoice, in compliance with the MSME Development Act, 2006.",
                },
                {
                    "title": "Dispute Resolution",
                    "content": "All disputes shall be resolved exclusively through arbitration in Delhi.",
                    "risk_level": "Medium",
                    "explanation": "Exclusive arbitration in a distant city creates a financial burden for smaller MSME vendors. The MSME Samadhan (MSEFC) portal offers a cheaper, faster statutory remedy.",
                    "redline_suggestion": "Disputes shall first be referred to the Micro and Small Enterprise Facilitation Council (MSEFC) under Section 18 of the MSME Development Act, 2006. Arbitration may follow if conciliation fails.",
                },
            ],
        })

    # ── Call AI with fallback chain ────────────
    try:
        prompt = build_prompt(contract_text, language)
        result = call_llm_with_fallback(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

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

    # ── Extract text from PDF ──────────────────
    contract_text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    contract_text += extracted + "\n"
    except Exception as e:
        return jsonify({"detail": f"Failed to read PDF: {str(e)}"}), 500

    if not contract_text.strip():
        return jsonify({"detail": "No readable text found in the PDF."}), 400

    # ── Trim to ~12,000 chars to stay within token limits ──
    if len(contract_text) > 12000:
        contract_text = contract_text[:12000] + "\n...[truncated for length]"

    if not build_fallback_chain():
        return jsonify({
            "translated_title": f"Demo Translation ({language})",
            "translated_text": "Demo mode: no API keys configured. Add API keys to backend/.env to enable live translation."
        })

    # ── Call AI with fallback chain ────────────
    try:
        prompt = build_translation_prompt(contract_text, language)
        result = call_llm_with_fallback(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
