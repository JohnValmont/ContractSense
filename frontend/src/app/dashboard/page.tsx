"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

type Mode = "analyze" | "translate" | "resources";

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
    <div className={styles.layout}>
      {/* ── Sidebar ──────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          ⚖️ ContractSense
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${mode === "analyze" ? styles.active : ""}`}
            onClick={() => setMode("analyze")}
          >
            <span className={styles.navIcon}>🔍</span> Statutory Risk Analysis
          </button>
          <button 
            className={`${styles.navItem} ${mode === "translate" ? styles.active : ""}`}
            onClick={() => setMode("translate")}
          >
            <span className={styles.navIcon}>🌐</span> Full Document Translation
          </button>
          <button 
            className={`${styles.navItem} ${mode === "resources" ? styles.active : ""}`}
            onClick={() => setMode("resources")}
          >
            <span className={styles.navIcon}>📚</span> Legal Resources Library
          </button>
        </nav>
        
        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>
            ← Return Home
          </Link>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main className={styles.main}>
        {mode === "resources" ? (
          <div className="animate-fade-in" style={{ textAlign: "center", paddingTop: "4rem" }}>
            <h1 className={styles.title}>Legal Resources Library</h1>
            <p className={styles.subtitle}>
              Access a comprehensive glossary of Indian legal terminology, standard contract templates, and guidelines on MSME compliance.
            </p>
            <div style={{ marginTop: "3rem", padding: "3rem", border: "1px dashed #cbd5e1", borderRadius: "8px", color: "#64748b" }}>
              Feature coming soon.
            </div>
          </div>
        ) : (
          <div className={`${styles.contentCard} animate-fade-in`}>
            <header className={styles.header}>
              <h1 className={styles.title}>
                {mode === "analyze" ? "Statutory Risk Analysis" : "Document Translation"}
              </h1>
              <p className={styles.subtitle}>
                {mode === "analyze" 
                  ? "Upload an agreement to extract critical clauses, evaluate MSME Development Act 2006 compliance, and generate formal redlines."
                  : "Upload a formal agreement to generate a precise, legally-toned translation in your chosen regional language."}
              </p>
            </header>

            <div className={styles.formGroup}>
              <label htmlFor="language-select" className={styles.label}>
                {mode === "analyze" ? "Output Language (Report & Redlines)" : "Target Translation Language"}
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

            <div
              className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
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
              <label htmlFor="contract-upload" className="btn-secondary" style={{ cursor: "pointer", marginTop: "0.5rem" }}>
                {file ? "Change Document" : "Browse Files"}
              </label>

              {error && <div className={styles.error}>{error}</div>}
            </div>

            <div>
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
                    <span className={styles.spinner} /> Processing Formal Document...
                  </span>
                ) : (
                  mode === "analyze" ? "Generate Risk Analysis" : "Generate Translation"
                )}
              </button>
              <p className={styles.hint}>
                🔒 Documents are processed in-memory. Zero data retention policy.
              </p>
            </div>

            <div className={styles.infoCards}>
              {[
                { icon: "🏛️", text: "Enterprise-Grade Accuracy" },
                { icon: "⚖️", text: "Statutory Law Aligned" },
                { icon: "🛡️", text: "Multi-Model Fallback Architecture" },
              ].map((c) => (
                <div key={c.text} className={styles.infoCard}>
                  <span>{c.icon}</span>
                  <span style={{ color: "#475569", fontWeight: 600 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
