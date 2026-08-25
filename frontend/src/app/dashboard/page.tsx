"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import LegalResources from "../components/LegalResources";

type Mode = "analyze" | "translate" | "resources";

export default function Dashboard() {
  const [mode, setMode] = useState<Mode>("analyze");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.collapsed : ""}`}>
        <div className={styles.logo}>
          ⚖️ ContractSense
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${mode === "analyze" ? styles.active : ""}`}
            onClick={() => setMode("analyze")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Statutory Risk Analysis
          </button>
          <button 
            className={`${styles.navItem} ${mode === "translate" ? styles.active : ""}`}
            onClick={() => setMode("translate")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Full Document Translation
          </button>
          <button 
            className={`${styles.navItem} ${mode === "resources" ? styles.active : ""}`}
            onClick={() => setMode("resources")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Legal Resources Library
          </button>
        </nav>
        
        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <Link href="/" className={styles.navItem} style={{ color: "rgba(252, 251, 248, 0.5)", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Return to Homepage
          </Link>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.toggleBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {mode === "resources" ? (
          <LegalResources />
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
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>, text: "Enterprise-Grade Accuracy" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>, text: "Statutory Law Aligned" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, text: "Multi-Model Fallback Architecture" },
              ].map((c) => (
                <div key={c.text} className={styles.infoCard}>
                  <span style={{ color: "var(--accent-color)", display: "flex" }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
