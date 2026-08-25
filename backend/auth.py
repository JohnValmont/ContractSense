import os
import random
import string
import requests
import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from db import get_db

auth_bp = Blueprint('auth', __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-default-key")
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def send_brevo_email(to_email, otp):
    if not BREVO_API_KEY:
        print(f"[ContractSense] SIMULATED EMAIL to {to_email}: OTP is {otp}")
        return True
        
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    payload = {
        "sender": {"name": "ContractSense", "email": "noreply@contractsense.com"},
        "to": [{"email": to_email}],
        "subject": "Your ContractSense Login Code",
        "htmlContent": f"<html><body><h1>Your login code is: <strong>{otp}</strong></h1><p>This code expires in 10 minutes.</p></body></html>"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Brevo API error: {e}")
        return False

@auth_bp.route("/request-otp", methods=["POST"])
def request_otp():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"detail": "Email is required"}), 400
        
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    conn = get_db()
    c = conn.cursor()
    # Delete old OTPs for this email
    c.execute("DELETE FROM otps WHERE email = ?", (email,))
    # Insert new OTP
    c.execute("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)", (email, otp, expires_at))
    conn.commit()
    conn.close()
    
    success = send_brevo_email(email, otp)
    if not success:
        return jsonify({"detail": "Failed to send email"}), 500
        
    return jsonify({"message": "OTP sent successfully"})

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")
    
    if not email or not otp:
        return jsonify({"detail": "Email and OTP are required"}), 400
        
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM otps WHERE email = ? AND otp = ?", (email, otp))
    record = c.fetchone()
    
    if not record:
        conn.close()
        return jsonify({"detail": "Invalid OTP"}), 400
        
    # Check expiry
    # record["expires_at"] format is typically "YYYY-MM-DD HH:MM:SS.mmmmmm"
    # Because we inserted it using datetime object which sqlite converts.
    try:
        expires_at = datetime.strptime(record["expires_at"], "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        expires_at = datetime.strptime(record["expires_at"], "%Y-%m-%d %H:%M:%S")
        
    if datetime.utcnow() > expires_at:
        conn.close()
        return jsonify({"detail": "OTP expired"}), 400
        
    # Valid OTP -> Clear OTP and create user if not exists
    c.execute("DELETE FROM otps WHERE email = ?", (email,))
    
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    if not user:
        c.execute("INSERT INTO users (email) VALUES (?)", (email,))
        conn.commit()
        c.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = c.fetchone()
        
    conn.commit()
    conn.close()
    
    # Generate JWT
    token = jwt.encode({
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    return jsonify({"token": token, "email": user["email"]})
