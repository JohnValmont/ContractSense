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
      <div className={styles.leftPanel}>
        <div className={styles.leftPanelContent}>
          <h1>⚖️<br/>Contract<br/>Sense.</h1>
          <p>
            Statutory compliance and precision contract auditing for Indian MSMEs.
          </p>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.subtitle}>
              {step === "email" ? "Sign in to review your vendor and client contracts." : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Work Email</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="you@yourbusiness.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Sending Code..." : "Sign in →"}
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
                {loading ? "Verifying..." : "Verify & Sign In →"}
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
            <span>Don't want to create an account?</span>
            <Link href="/dashboard" className={styles.guestLink}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
