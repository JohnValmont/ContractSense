import os
import json
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pdfplumber

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

# ─────────────────────────────────────────────
#  API Keys
# ─────────────────────────────────────────────
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY  = os.getenv("OPENAI_API_KEY", "")
GROK_API_KEY    = os.getenv("GROK_API_KEY", "")    # xAI Grok — console.x.ai
GROQ_API_KEY    = os.getenv("GROQ_API_KEY", "")    # Groq (Llama) — console.groq.com

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

def build_fallback_chain(gemini_key: str, openai_key: str, grok_key: str, groq_key: str) -> list:
    chain = []

    # 1️⃣  Gemini (Google) — free tier, 15 RPM
    if gemini_key:
        chain += [
            {
                "name":   "Gemini 2.0 Flash",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-2.0-flash:generateContent?key={gemini_key}",
            },
            {
                "name":   "Gemini 1.5 Flash",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-1.5-flash:generateContent?key={gemini_key}",
            },
            {
                "name":   "Gemini 1.5 Pro",
                "type":   "gemini",
                "url":    f"{GEMINI_BASE}/gemini-1.5-pro:generateContent?key={gemini_key}",
            },
        ]

    # 2️⃣  Groq (Llama 3) — free, very fast, OpenAI-compatible
    if groq_key:
        chain += [
            {
                "name":  "Groq Llama-3.3-70b",
                "type":  "openai_compat",
                "model": "llama-3.3-70b-versatile",
                "base":  "https://api.groq.com/openai/v1",
                "key":   groq_key,
            },
        ]

    # 3️⃣  Grok (xAI) — free tier, OpenAI-compatible
    if grok_key:
        chain += [
            {
                "name":  "Grok 3 Mini",
                "type":  "openai_compat",
                "model": "grok-3-mini",
                "base":  "https://api.x.ai/v1",
                "key":   grok_key,
            },
        ]

    # 4️⃣  OpenAI — paid, most reliable
    if openai_key:
        chain += [
            {
                "name":  "OpenAI GPT-4o",
                "type":  "openai_compat",
                "model": "gpt-4o",
                "base":  "https://api.openai.com/v1",
                "key":   openai_key,
            },
            {
                "name":  "OpenAI GPT-4o-mini",
                "type":  "openai_compat",
                "model": "gpt-4o-mini",
                "base":  "https://api.openai.com/v1",
                "key":   openai_key,
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
    chain = build_fallback_chain(GEMINI_API_KEY, OPENAI_API_KEY, GROK_API_KEY, GROQ_API_KEY)

    if not chain:
        raise Exception("No API keys configured. Add at least one of: GEMINI_API_KEY, GROQ_API_KEY, GROK_API_KEY, OPENAI_API_KEY to backend/.env")

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
def build_prompt(contract_text: str) -> str:
    return f"""
You are an expert Indian corporate lawyer specializing in the MSME Development Act, 2006.

Carefully analyze the following vendor contract. For each key clause:
1. Identify the clause title and extract its text verbatim.
2. Evaluate the risk level for the MSME vendor: Low, Medium, or High.
3. Provide a plain-language explanation in simple terms, referencing specific sections of the MSME Development Act, 2006, the Indian Contract Act, 1872, or other relevant law wherever applicable.
4. If the clause is risky (Medium or High), propose a specific, fair redline suggestion.

Also compute an overall risk_score (0-100, where 100 is extremely risky for the MSME).

Respond ONLY with a single valid JSON object. Do not include any markdown, code fences, or explanatory text — just raw JSON.

Format:
{{
  "summary": "2-3 sentence executive summary of the contract and its overall risk to the MSME vendor.",
  "risk_score": <integer 0-100>,
  "clauses": [
    {{
      "title": "Payment Terms",
      "content": "Exact text of this clause from the contract.",
      "risk_level": "High",
      "explanation": "Under Section 15 of the MSME Development Act, 2006, buyers must pay within 45 days. This clause mandates 90-day payment, which directly violates that provision and exposes the buyer to compound interest at 3x the RBI lending rate.",
      "redline_suggestion": "Payment shall be made within 45 days of invoice date, as mandated by Section 15 of the Micro, Small and Medium Enterprises Development Act, 2006."
    }}
  ]
}}

Contract Text:
\"\"\"
{contract_text}
\"\"\"
""".strip()

# ─────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────
@app.route("/", methods=["GET"])
def read_root():
    chain = build_fallback_chain(GEMINI_API_KEY, OPENAI_API_KEY, GROK_API_KEY, GROQ_API_KEY)
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
    if not GEMINI_API_KEY and not OPENAI_API_KEY:
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
        prompt = build_prompt(contract_text)
        result = call_llm_with_fallback(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
