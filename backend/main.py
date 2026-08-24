import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pdfplumber

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={API_KEY}"

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Welcome to ContractSense API (Flask)"})

@app.route("/api/analyze", methods=["POST"])
def analyze_contract():
    if "file" not in request.files:
        return jsonify({"detail": "No file provided."}), 400
    
    file = request.files["file"]
    if not file.filename.endswith('.pdf'):
        return jsonify({"detail": "Only PDF files are supported."}), 400
    
    text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        return jsonify({"detail": f"Error reading PDF: {str(e)}"}), 500

    if not text.strip():
        return jsonify({"detail": "Could not extract text from the PDF."}), 400

    if not API_KEY:
        # Fallback dummy response if no API key is provided
        return jsonify({
            "summary": "This is a placeholder summary. Please configure GEMINI_API_KEY in the backend .env to enable AI parsing.",
            "risk_score": 50,
            "clauses": [
                {
                    "title": "Payment Terms",
                    "content": "Payment within 90 days.",
                    "risk_level": "High",
                    "explanation": "According to the MSME Development Act, 2006, the buyer must make payment on or before the agreed date, which cannot exceed 45 days.",
                    "redline_suggestion": "Payment within 45 days."
                }
            ]
        })

    prompt = f"""
    You are an expert Indian corporate lawyer specializing in the MSME Development Act, 2006.
    Analyze the following vendor contract. 
    Extract the key clauses, evaluate their risk for the MSME vendor (Low, Medium, High), 
    and provide a plain-language explanation referencing the MSME Act where applicable.
    If a clause is risky, provide a redline suggestion to make it fair.
    
    Respond ONLY with a JSON object in the following format (no markdown code blocks, just raw JSON):
    {{
        "summary": "Overall contract summary and risk assessment...",
        "risk_score": 0-100 (where 100 is highly risky),
        "clauses": [
            {{
                "title": "Clause Title",
                "content": "Original clause text...",
                "risk_level": "Low/Medium/High",
                "explanation": "Why this is risky/fair...",
                "redline_suggestion": "Suggested revised text or null if fair"
            }}
        ]
    }}
    
    Contract Text:
    {text}
    """

    try:
        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        response.raise_for_status()
        data = response.json()
        
        # Extract the text from Gemini response
        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        
        # Parse JSON
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json\n", "").replace("```", "")
        
        result = json.loads(response_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"detail": f"Error analyzing contract with AI: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
