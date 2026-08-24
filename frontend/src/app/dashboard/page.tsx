"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

export default function Dashboard() {
  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
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
    if (!file) { setError("Please select a PDF file first."); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      sessionStorage.setItem("contract_analysis", JSON.stringify(data));
      router.push("/report");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <h1 className={styles.title}>Upload Your Contract</h1>
        <p className={styles.subtitle}>
          We'll extract every clause, score it against the MSME Development Act 2006, and give you redline suggestions — in under 30 seconds.
        </p>
      </header>

      {/* Drop zone */}
      <div
        className={`glass-panel ${styles.dropZone} ${dragging ? styles.dragging : ""} animate-fade-in delay-100`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.uploadIcon}>
          {file ? "📄" : "☁️"}
        </div>

        {file ? (
          <div className={styles.fileName}>{file.name}</div>
        ) : (
          <>
            <div className={styles.dropText}>Drag & drop your PDF here</div>
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
          {file ? "Change File" : "Browse Files"}
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
            fontSize: "1rem",
            opacity: (!file || loading) ? 0.55 : 1,
            cursor: (!file || loading) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <span className={styles.spinner} /> Analyzing with AI…
            </span>
          ) : (
            "⚡ Analyze Contract"
          )}
        </button>
        <p className={styles.hint}>
          🔒 Your file is processed in-memory and never stored.
        </p>
      </div>

      {/* Info cards */}
      <div className={`${styles.infoCards} animate-fade-in delay-300`}>
        {[
          { icon: "🔍", text: "Clause extraction via pdfplumber OCR" },
          { icon: "⚖️", text: "Risk scored against MSME Act 2006" },
          { icon: "🤖", text: "Powered by Gemini 2.0 with 4-model fallback" },
        ].map((c) => (
          <div key={c.text} className={`glass-panel ${styles.infoCard}`}>
            <span>{c.icon}</span>
            <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{c.text}</span>
          </div>
        ))}
      </div>

      <Link href="/" style={{ color: "#3b82f6", fontSize: "0.9rem", marginTop: "1rem" }}>
        ← Back to Home
      </Link>
    </div>
  );
}
