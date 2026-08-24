"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

type Mode = "analyze" | "translate";

export default function Dashboard() {
  const [mode, setMode] = useState<Mode>("analyze");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF document first."); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const endpoint = mode === "analyze" ? "/api/analyze" : "/api/translate";
      
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      
      if (mode === "analyze") {
        sessionStorage.setItem("contract_analysis", JSON.stringify(data));
        router.push("/report");
      } else {
        sessionStorage.setItem("contract_translation", JSON.stringify(data));
        router.push("/translation-report");
      }
      
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <h1 className={styles.title}>⚖️ Legal Services Portal</h1>
        <p className={styles.subtitle}>
          Securely process your vendor agreements for statutory MSME compliance risk analysis or full-document translation.
        </p>
      </header>

      {/* Mode Toggle */}
      <div className={`${styles.modeToggle} animate-fade-in delay-100`}>
        <button 
          className={`${styles.modeBtn} ${mode === "analyze" ? styles.active : ""}`}
          onClick={() => setMode("analyze")}
        >
          🔍 Risk Analysis
        </button>
        <button 
          className={`${styles.modeBtn} ${mode === "translate" ? styles.active : ""}`}
          onClick={() => setMode("translate")}
        >
          🌐 Full Translation
        </button>
      </div>

      {/* Language Selector */}
      <div className={`glass-panel animate-fade-in delay-100 ${styles.formGroup}`} style={{ padding: '1.5rem 2rem', background: '#fff', border: '1px solid #e2e8f0' }}>
        <label htmlFor="language-select" className={styles.label}>
          {mode === "analyze" ? "Output Language for Report & Redlines" : "Target Translation Language"}
        </label>
        <select 
          id="language-select" 
          className={styles.languageSelect}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Urdu">Urdu (اردو)</option>
          <option value="Hindi">Hindi (हिंदी)</option>
          <option value="Bengali">Bengali (বাংলা)</option>
          <option value="Tamil">Tamil (தமிழ்)</option>
          <option value="Telugu">Telugu (తెలుగు)</option>
          <option value="Marathi">Marathi (मराठी)</option>
        </select>
      </div>

      {/* Drop zone */}
      <div
        className={`glass-panel ${styles.dropZone} ${dragging ? styles.dragging : ""} animate-fade-in delay-100`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.uploadIcon}>
          {file ? "📄" : "🏛️"}
        </div>

        {file ? (
          <div className={styles.fileName}>{file.name}</div>
        ) : (
          <>
            <div className={styles.dropText}>Drag & drop your PDF contract here</div>
            <div className={styles.orText}>or</div>
          </>
        )}

        <input
          type="file"
          accept="application/pdf"
          id="contract-upload"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        <label htmlFor="contract-upload" className="btn-secondary" style={{ cursor: "pointer" }}>
          {file ? "Change Document" : "Browse Files"}
        </label>

        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* Analyze button */}
      <div className="animate-fade-in delay-200" style={{ width: "100%", maxWidth: "560px" }}>
        <button
          className="btn-primary"
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1.05rem",
            opacity: (!file || loading) ? 0.65 : 1,
            cursor: (!file || loading) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <span className={styles.spinner} /> Processing Document...
            </span>
          ) : (
            mode === "analyze" ? "Analyze Document" : "Translate Document"
          )}
        </button>
        <p className={styles.hint}>
          🔒 Processed securely in-memory. Zero data retention policy.
        </p>
      </div>

      {/* Info cards */}
      <div className={`${styles.infoCards} animate-fade-in delay-300`}>
        {[
          { icon: "🏛️", text: "Enterprise-Grade Accuracy" },
          { icon: "⚖️", text: "Statutory Law Aligned" },
          { icon: "🛡️", text: "Multi-Model Fallback Architecture" },
        ].map((c) => (
          <div key={c.text} className={`glass-panel ${styles.infoCard}`}>
            <span>{c.icon}</span>
            <span style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500 }}>{c.text}</span>
          </div>
        ))}
      </div>

      <Link href="/" style={{ color: "var(--accent-color)", fontSize: "0.95rem", marginTop: "1rem", fontWeight: 600 }}>
        ← Return Home
      </Link>
    </div>
  );
}
