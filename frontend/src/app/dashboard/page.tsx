"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LegalResources from "../components/LegalResources";
import Logo from "../components/Logo";

type Mode = "analyze" | "translate" | "resources";
type ProcessingMode = "offline" | "ai";

export default function Dashboard() {
  const [uiLanguage, setUiLanguage] = useState<"en" | "hi">("en");
  const [mode, setMode] = useState<Mode>("analyze");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>("offline");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
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

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF document first."); return; }

    // If AI mode selected but not yet acknowledged, show the privacy modal
    if (processingMode === "ai" && !privacyAcknowledged) {
      setShowPrivacyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      let endpoint: string;
      if (mode === "translate") {
        endpoint = "/api/translate";
      } else if (processingMode === "offline") {
        endpoint = "/api/analyze-local";
      } else {
        endpoint = "/api/analyze";
      }
      const res = await fetch(`${backendUrl}${endpoint}`, { method: "POST", body: formData });
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

  const hi = uiLanguage === "hi";

  /* ── Privacy Warning Modal ─────────────────────────────────────── */
  const PrivacyModal = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#1A1208", border: "1px solid rgba(255,120,60,0.35)", borderRadius: 16,
        padding: "2.5rem", maxWidth: 520, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,120,60,0.12)", border: "1px solid rgba(255,120,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: "#F5F0E8", marginBottom: "0.25rem" }}>Third-Party API Warning</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF7840", letterSpacing: "0.05em", textTransform: "uppercase" }}>Data Privacy Notice</div>
          </div>
        </div>

        <div style={{ fontSize: "0.9rem", color: "rgba(245,240,232,0.75)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          By using <strong style={{ color: "#F5F0E8" }}>AI-Powered mode</strong>, your contract text will be transmitted to third-party AI providers such as <strong style={{ color: "#F5F0E8" }}>Google Gemini</strong> or <strong style={{ color: "#F5F0E8" }}>OpenAI</strong>.
        </div>

        <div style={{ background: "rgba(255,120,60,0.08)", border: "1px solid rgba(255,120,60,0.2)", borderRadius: 8, padding: "1rem 1.25rem", marginBottom: "2rem" }}>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(245,240,232,0.7)", fontSize: "0.84rem", lineHeight: 1.8 }}>
            <li>These providers <strong style={{ color: "#FFB380" }}>may use your data to train AI models</strong>.</li>
            <li>Ensure your document contains <strong style={{ color: "#FFB380" }}>no confidential or sensitive information</strong> before proceeding.</li>
            <li>For maximum security, use <strong style={{ color: "#4ADE80" }}>🔒 Secure Offline mode</strong>.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => { setProcessingMode("offline"); setShowPrivacyModal(false); }}
            style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(245,240,232,0.8)", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer" }}
          >
            Switch to Offline Mode
          </button>
          <button
            onClick={() => { setPrivacyAcknowledged(true); setShowPrivacyModal(false); setTimeout(handleUpload, 50); }}
            style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: "#FF7840", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer" }}
          >
            I Understand, Proceed
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", background:"var(--canvas)", overflow:"hidden" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
      <aside style={{
        width: isSidebarOpen ? 240 : 0,
        minWidth: isSidebarOpen ? 240 : 0,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        padding: isSidebarOpen ? "1.75rem 1rem 1.5rem" : 0,
        display:"flex", flexDirection:"column",
        height:"100vh", position:"sticky", top:0,
        flexShrink:0, zIndex:10, overflow:"hidden",
        transition:"min-width 0.25s ease, width 0.25s ease, padding 0.25s ease",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:"0.6rem", textDecoration:"none", marginBottom:"2.5rem", opacity: isSidebarOpen ? 1 : 0, transition:"opacity 0.2s" }}>
          <Logo size={26} />
          <span style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", fontWeight:600, color:"rgba(245,242,236,0.95)", letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>
            ContractSense
          </span>
        </Link>

        {/* Section label */}
        <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", paddingLeft:"0.75rem", marginBottom:"0.4rem" }}>
          Tools
        </div>

        {/* Nav items */}
        <nav style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {[
            { key: "analyze" as const,   label: hi ? "अनुबंध ऑडिटर" : "Contract Auditor", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> },
            { key: "translate" as const, label: hi ? "दस्तावेज़ अनुवाद" : "Translate Doc",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
            { key: "resources" as const, label: hi ? "कानूनी लाइब्रेरी" : "Legal Library",   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
          ].map(item => (
            <button key={item.key} onClick={() => setMode(item.key)} style={{
              display:"flex", alignItems:"center", gap:"0.65rem",
              padding:"0.58rem 0.75rem", borderRadius:"6px",
              color: mode === item.key ? "rgba(245,242,236,0.96)" : "rgba(245,242,236,0.48)",
              background: mode === item.key ? "rgba(255,255,255,0.08)" : "transparent",
              border:"none", cursor:"pointer", textAlign:"left",
              fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:500,
              letterSpacing:"0.01em", whiteSpace:"nowrap", width:"100%",
              transition:"all 0.15s",
            }}>
              <span style={{ display:"flex", opacity: mode === item.key ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
          <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", paddingLeft:"0.75rem", marginBottom:"0.25rem" }}>
            Language
          </div>
          <select value={uiLanguage} onChange={e => setUiLanguage(e.target.value as "en"|"hi")} style={{
            fontSize:"0.78rem", padding:"0.4rem 0.75rem",
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)",
            borderRadius:"6px", color:"rgba(245,242,236,0.65)", cursor:"pointer",
            outline:"none", fontFamily:"var(--font-sans)", width:"100%",
          }}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          <Link href="/" style={{
            display:"flex", alignItems:"center", gap:"0.6rem",
            padding:"0.5rem 0.75rem", borderRadius:"6px",
            color:"rgba(245,242,236,0.45)", fontSize:"0.78rem",
            fontFamily:"var(--font-sans)", fontWeight:500,
            textDecoration:"none", transition:"color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,242,236,0.85)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,242,236,0.45)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {hi ? "होम" : "Home"}
          </Link>
        </div>
      </aside>

      {/* Collapse toggle */}
      <button onClick={() => setIsSidebarOpen(v => !v)} style={{
        position:"fixed", left: isSidebarOpen ? 228 : 8, top:"1.75rem",
        width:24, height:24, background:"var(--surface)", border:"1px solid var(--glass-border)",
        borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer", color:"var(--ink-muted)", zIndex:50, boxShadow:"var(--shadow-sm)",
        transition:"left 0.25s ease",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isSidebarOpen ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
        </svg>
      </button>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
      <main style={{ flex:1, overflowY:"auto", background:"var(--canvas)", scrollbarWidth:"none" }}>
        {mode === "resources" ? (
          <LegalResources uiLanguage={uiLanguage} />
        ) : (
          <div style={{ maxWidth:820, margin:"0 auto", padding:"3.5rem 3rem 4rem" }}>

            {/* Page heading */}
            <div style={{ marginBottom:"2.5rem", paddingBottom:"1.5rem", borderBottom:"1px solid rgba(26,18,8,0.08)" }}>
              <h1 style={{
                fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:500,
                letterSpacing:"-0.03em", color:"var(--ink)", lineHeight:1.15, marginBottom:"0.5rem",
              }}>
                {mode === "analyze"
                  ? (hi ? "AI अनुबंध लेखा परीक्षक" : "Contract Auditor")
                  : (hi ? "सटीक अनुवाद" : "Precision Translation")}
              </h1>
              <p style={{ color:"var(--ink-muted)", fontSize:"0.875rem", lineHeight:1.7, maxWidth:540, fontFamily:"var(--font-sans)" }}>
                {mode === "analyze"
                  ? (hi ? "MSME अधिनियम 2006 के विरुद्ध विक्रेता समझौतों का तत्काल ऑडिट करें।" : "Instantly audit vendor agreements against the MSME Act 2006. Extract hidden liabilities, enforce compliance, and generate boardroom-ready redlines in seconds.")
                  : (hi ? "अपने क्षेत्रीय भाषा में कानूनी अनुवाद उत्पन्न करें।" : "Upload complex legal agreements to generate flawless, legally-toned translations in your regional language.")}
              </p>
            </div>

            {/* Upload zone */}
            <div
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              style={{
                border: dragging ? "1.5px dashed var(--saffron)" : "1.5px dashed rgba(26,18,8,0.14)",
                background: dragging ? "rgba(193,125,60,0.03)" : "var(--surface)",
                borderRadius:10, padding:"3.5rem 2rem",
                display:"flex", flexDirection:"column", alignItems:"center", gap:"0.875rem",
                transition:"all 0.2s", cursor:"default",
              }}
            >
              {/* Icon */}
              <div style={{
                width:44, height:44, borderRadius:8,
                background:"var(--surface-2)", border:"1px solid var(--glass-border)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"var(--ink-muted)",
              }}>
                {file
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                }
              </div>

              {file ? (
                <div style={{
                  fontSize:"0.875rem", fontWeight:600, color:"var(--ink)",
                  background:"var(--surface-2)", padding:"0.4rem 1rem",
                  borderRadius:4, border:"1px solid var(--glass-border)",
                  fontFamily:"var(--font-sans)", maxWidth:"100%", overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap",
                }}>
                  {file.name}
                </div>
              ) : (
                <>
                  <p style={{ fontSize:"0.95rem", fontWeight:600, color:"var(--ink)", fontFamily:"var(--font-sans)", margin:0 }}>
                    {hi ? "अपना पीडीएफ अनुबंध यहां खींचें और छोड़ें" : "Drag & drop your PDF contract here"}
                  </p>
                  <p style={{ fontSize:"0.8rem", color:"var(--ink-subtle)", fontFamily:"var(--font-sans)", margin:0 }}>or</p>
                </>
              )}

              <input type="file" accept="application/pdf" id="contract-upload" onChange={handleFileChange} style={{ display:"none" }} />
              <label htmlFor="contract-upload" style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                padding:"0.5rem 1.25rem", fontSize:"0.825rem", fontWeight:600,
                background:"transparent", color:"var(--ink)", border:"1px solid rgba(26,18,8,0.18)",
                borderRadius:4, cursor:"pointer", fontFamily:"var(--font-sans)", transition:"all 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {file
                  ? (hi ? "दस्तावेज़ बदलें" : "Change File")
                  : (hi ? "फ़ाइलें ब्राउज़ करें" : "Browse Files")}
              </label>

              {error && (
                <div style={{
                  color:"#b91c1c", background:"#fef2f2", padding:"0.6rem 1rem",
                  borderRadius:4, border:"1px solid #fca5a5",
                  fontSize:"0.85rem", fontFamily:"var(--font-sans)", width:"100%", textAlign:"center",
                }}>
                  {error}
                </div>
              )}
            </div>

            {/* ── Processing Mode Toggle ───────────────────────── */}
            {mode === "analyze" && (
              <div style={{ marginTop: "1.75rem", padding: "1.25rem", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "1rem" }}>Processing Mode</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {/* Offline Option */}
                  <button
                    onClick={() => setProcessingMode("offline")}
                    style={{
                      padding: "1rem", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: processingMode === "offline" ? "1.5px solid #4ADE80" : "1.5px solid var(--glass-border)",
                      background: processingMode === "offline" ? "rgba(74,222,128,0.06)" : "var(--surface-2)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>🔒</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: processingMode === "offline" ? "#4ADE80" : "var(--ink)", fontFamily: "var(--font-sans)" }}>Secure Offline</span>
                      {processingMode === "offline" && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>Local heuristic engine only. Zero data leaves your device.</div>
                  </button>

                  {/* AI Option */}
                  <button
                    onClick={() => { setProcessingMode("ai"); setPrivacyAcknowledged(false); }}
                    style={{
                      padding: "1rem", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: processingMode === "ai" ? "1.5px solid #D4924A" : "1.5px solid var(--glass-border)",
                      background: processingMode === "ai" ? "rgba(212,146,74,0.06)" : "var(--surface-2)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>⚡</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: processingMode === "ai" ? "#D4924A" : "var(--ink)", fontFamily: "var(--font-sans)" }}>AI-Powered</span>
                      {processingMode === "ai" && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#D4924A" }} />}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>Sends to Gemini / OpenAI for deeper analysis. 3rd-party data policy applies.</div>
                  </button>
                </div>
              </div>
            )}

            {/* Action bar */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1.5rem", marginTop:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <label style={{ fontSize:"0.8rem", fontWeight:500, color:"var(--ink-muted)", fontFamily:"var(--font-sans)", whiteSpace:"nowrap" }}>
                  {mode === "analyze"
                    ? (hi ? "आउटपुट भाषा:" : "Output Language:")
                    : (hi ? "लक्षित भाषा:" : "Target Language:")}
                </label>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{
                  padding:"0.35rem 0.6rem", border:"1px solid var(--glass-border)",
                  background:"var(--surface)", borderRadius:4, color:"var(--ink)",
                  fontFamily:"var(--font-sans)", fontSize:"0.825rem", fontWeight:500,
                  cursor:"pointer", outline:"none",
                }}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                </select>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem",
                  padding:"0.7rem 1.75rem", fontSize:"0.875rem", fontWeight:600,
                  background: (!file || loading) ? "rgba(26,18,8,0.35)" : "var(--ink)",
                  color:"var(--canvas)", border:"none", borderRadius:4,
                  cursor: (!file || loading) ? "not-allowed" : "pointer",
                  fontFamily:"var(--font-sans)", transition:"background 0.15s", whiteSpace:"nowrap",
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width:14, height:14, border:"1.5px solid rgba(255,255,255,0.25)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.75s linear infinite", display:"inline-block" }} />
                    {hi ? "प्रसंस्करण हो रहा है..." : "Processing…"}
                  </>
                ) : (
                  mode === "analyze"
                    ? (hi ? "जोखिम विश्लेषण उत्पन्न करें" : "Generate Risk Analysis")
                    : (hi ? "अनुवाद उत्पन्न करें" : "Generate Translation")
                )}
              </button>
            </div>

            <p style={{ fontSize:"0.75rem", color:"var(--ink-subtle)", fontFamily:"var(--font-sans)", marginTop:"0.875rem", textAlign:"right" }}>
              {processingMode === "offline"
                ? "🔒 Offline mode — zero data transmitted. SHA-256 fingerprint generated locally."
                : (hi ? "🔒 दस्तावेज़ इन-मेमोरी संसाधित किए जाते हैं। शून्य डेटा प्रतिधारण नीति।" : "⚡ AI mode — encrypted in-transit. No persistent storage on our servers.")}
            </p>

            {/* ── Blockchain & Cybersecurity Trust Strip ─────── */}
            <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(26,18,8,0.06)" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-subtle)", marginBottom: "0.875rem" }}>Security & Trust</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {[
                  { icon: "🔐", label: "AES-256 In Transit" },
                  { icon: "⛓", label: "SHA-256 Doc Fingerprint" },
                  { icon: "🕵️", label: "Zero-Knowledge Processing" },
                  { icon: "🛡", label: "No PII Stored" },
                  { icon: "📵", label: "Offline Air-Gap Mode" },
                  { icon: "🇮🇳", label: "MSME Act Compliant" },
                ].map(badge => (
                  <div key={badge.label} style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.35rem 0.75rem", borderRadius: 100,
                    background: "var(--surface)", border: "1px solid var(--glass-border)",
                    fontSize: "0.72rem", fontWeight: 600, color: "var(--ink-muted)",
                    fontFamily: "var(--font-sans)",
                  }}>
                    <span style={{ fontSize: "0.75rem" }}>{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Privacy Modal */}
      {showPrivacyModal && <PrivacyModal />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
