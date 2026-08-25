"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./page.module.css";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send OTP");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP");
      
      login(data.email, data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏛️</span>
            <h1 className={styles.title}>Access Portal</h1>
            <p className={styles.subtitle}>
              {step === "email" ? "Enter your email to receive a secure login code." : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Corporate Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Sending Code..." : "Continue with Email"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Secure Login Code</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
              <button 
                type="button" 
                className={styles.backBtn}
                onClick={() => setStep("email")}
              >
                ← Use a different email
              </button>
            </form>
          )}

          <div className={styles.footer}>
            <p>Don't want to create an account right now?</p>
            <Link href="/dashboard" className={styles.guestLink}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
