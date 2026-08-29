"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

interface Clause {
  title: string;
  content: string;
  risk_level: string;
  explanation: string;
  redline_suggestion: string | null;
  msme_act_reference?: string;
}

interface AnalysisResult {
  summary: string;
  risk_score: number;
  clauses: Clause[];
  _clientMode?: string;
  _meta?: {
    sha256: string;
    ocr_used: boolean;
    processing_mode: string;
  };
}

function getRiskColor(level: string) {
  const l = level.toLowerCase();
  if (l.includes("high")) return "#dc2626";
  if (l.includes("medium")) return "#d97706";
  return "#16a34a";
}

function getRiskBg(level: string) {
  const l = level.toLowerCase();
  if (l.includes("high")) return "rgba(220,38,38,0.12)";
  if (l.includes("medium")) return "rgba(217,119,6,0.12)";
  return "rgba(22,163,74,0.12)";
}

export default function Report() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [showMeta, setShowMeta] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("contract_analysis");
    if (data) {
      setResult(JSON.parse(data));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!result) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0F0B06", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ width: 40, height: 40, border: "2px solid rgba(245,240,232,0.1)", borderTopColor: "#D4924A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading secure report…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const meta = result._meta;
  // _clientMode is stored by the dashboard at submission time — independent of backend _meta
  const clientMode = result._clientMode ?? meta?.processing_mode ?? "unknown";
  const isOffline = clientMode === "offline" || clientMode === "offline_fallback";
  const highCount = result.clauses.filter(c => c.risk_level.toLowerCase().includes("high")).length;
  const medCount = result.clauses.filter(c => c.risk_level.toLowerCase().includes("medium")).length;
  const lowCount = result.clauses.filter(c => !c.risk_level.toLowerCase().includes("high") && !c.risk_level.toLowerCase().includes("medium")).length;

  const filtered = filterLevel === "All"
    ? result.clauses
    : result.clauses.filter(c => c.risk_level.toLowerCase().includes(filterLevel.toLowerCase()));

  const activeClause = filtered[activeIdx] ?? result.clauses[0];

  const scoreColor = result.risk_score < 30 ? "#4ADE80" : result.risk_score < 70 ? "#FBBF24" : "#F87171";
  const scoreLabel = result.risk_score < 30 ? "Low Risk" : result.risk_score < 70 ? "Moderate Risk" : "Critical Risk";

  return (
    <div className="report-container" style={{ display: "flex", height: "100vh", background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        /* Web App Layout Styles */
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        
        .main-scroll::-webkit-scrollbar { width: 6px; }
        .main-scroll::-webkit-scrollbar-track { background: transparent; }
        .main-scroll::-webkit-scrollbar-thumb { background: rgba(24,18,10,0.15); border-radius: 4px; }

        .clause-btn { transition: all 0.2s cubic-bezier(.25,.46,.45,.94); }
        .clause-btn:hover { background: rgba(255,255,255,0.04); }

        /* PDF Export / Print Styles */
        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body { background: #fff !important; color: #000 !important; }
          .report-container { display: block !important; height: auto !important; overflow: visible !important; background: #fff !important; }
          .hide-on-print { display: none !important; }
          .print-only { display: block !important; }
          .main-pane { width: 100% !important; max-width: 100% !important; padding: 0 !important; overflow: visible !important; height: auto !important; }
          .clause-print-card { page-break-inside: avoid; border: 1px solid #ccc; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; background: #fafafa !important; }
          .print-header { border-bottom: 2px solid #000; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── SIDEBAR (Hidden on Print) ────────────────────── */}
      <aside className="hide-on-print" style={{
        width: 380, flexShrink: 0, background: "#0F0B06", borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", height: "100%", zIndex: 10
      }}>
        {/* Topbar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Logo size={20} />
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#F5F0E8" }}>ContractSense</span>
          </Link>
          <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", borderRadius: 4, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#F5F0E8", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
            Export PDF
          </button>
        </div>

        <div className="sidebar-scroll" style={{ overflowY: "auto", flex: 1, padding: "1.5rem" }}>
          {/* Risk Score */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", marginBottom: "1rem" }}>Overall Risk Assessment</div>
            <div style={{ position: "relative", width: 140, height: 70, margin: "0 auto 1.5rem" }}>
              <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={125.66} strokeDashoffset={125.66 * (1 - result.risk_score / 100)} style={{ transition: "stroke-dashoffset 1s ease-out" }} />
              </svg>
              <div style={{ position: "absolute", bottom: -5, left: 0, right: 0, textAlign: "center" }}>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "2.75rem", fontWeight: 500, lineHeight: 1, color: scoreColor }}>
                  {result.risk_score}
                </span>
              </div>
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: scoreColor, marginBottom: "1.25rem" }}>{scoreLabel}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", fontSize: "0.75rem" }}>
              <span style={{ color: "#F87171", fontWeight: 600 }}>{highCount} High</span>
              <span style={{ color: "#FBBF24", fontWeight: 600 }}>{medCount} Med</span>
              <span style={{ color: "#4ADE80", fontWeight: 600 }}>{lowCount} Low</span>
            </div>
          </div>

          {/* Exec Summary */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", marginBottom: "0.75rem" }}>Executive Summary</div>
            <p style={{ fontSize: "0.825rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.7 }}>{result.summary}</p>
          </div>

          {/* Security Meta */}
          {meta && (
            <div style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <button 
                onClick={() => setShowMeta(!showMeta)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", color: "rgba(245,240,232,0.6)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}
              >
                <span>Cryptographic & Security Metadata</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showMeta ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              
              {showMeta && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem", animation: "fadeIn 0.2s ease-in-out" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.7rem", color: meta.processing_mode === "offline" ? "#4ADE80" : "#FBBF24", fontWeight: 700 }}>
                      {meta.processing_mode === "offline" ? "🔒 Offline Compute" : meta.processing_mode === "ai" ? "⚡ Zero-Retention LLM" : meta.processing_mode === "demo" ? "🎬 Demo" : "🔁 Fallback"}
                    </span>
                    {meta.ocr_used && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(99,179,237,0.15)", color: "#63B3ED", padding: "0.15rem 0.5rem", borderRadius: 100, fontWeight: 700, border: "1px solid rgba(99,179,237,0.2)" }}>
                        📷 OCR Scanned
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.4)", fontFamily: "monospace", lineHeight: 1.4, wordBreak: "break-all", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: 6 }}>
                    <span style={{ color: "rgba(245,240,232,0.3)", display: "block", marginBottom: "0.25rem" }}>⛓ SHA-256 Fingerprint:</span>
                    {meta.sha256}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#D8B4FE", letterSpacing: "0.02em" }}>
                      Blockchain Ledger Anchored (Polygon testnet)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {["All", "High", "Medium", "Low"].map(f => (
              <button key={f} onClick={() => { setFilterLevel(f); setActiveIdx(0); }} style={{
                flex: 1, padding: "0.4rem 0", borderRadius: 4, border: "none", cursor: "pointer",
                fontSize: "0.72rem", fontWeight: 700,
                background: filterLevel === f ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                color: filterLevel === f ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Clause List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {filtered.map((clause, idx) => {
              const active = activeIdx === idx;
              return (
                <button key={idx} className="clause-btn" onClick={() => setActiveIdx(idx)} style={{
                  textAlign: "left", padding: "0.875rem 1rem", borderRadius: 8, cursor: "pointer",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                  display: "flex", alignItems: "flex-start", gap: "0.75rem"
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: getRiskColor(clause.risk_level), marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: active ? "#fff" : "rgba(245,240,232,0.7)", marginBottom: "0.35rem", lineHeight: 1.4 }}>{clause.title}</div>
                    <div style={{ display: "inline-block", padding: "0.15rem 0.5rem", borderRadius: 100, fontSize: "0.62rem", fontWeight: 800, background: getRiskBg(clause.risk_level), color: getRiskColor(clause.risk_level), letterSpacing: "0.05em" }}>
                      {clause.risk_level.toUpperCase()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ── MAIN PANE (Web App View) ────────────────────── */}
      <main className="main-scroll main-pane hide-on-print" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* ── Mode Verification Banner ─────────────────── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 5,
          background: isOffline ? "rgba(22,163,74,0.08)" : "rgba(212,146,74,0.08)",
          borderBottom: `1px solid ${isOffline ? "rgba(74,222,128,0.2)" : "rgba(212,146,74,0.2)"}`,
          padding: "0.6rem 2rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: isOffline ? "#4ADE80" : "#FBBF24",
            boxShadow: `0 0 6px ${isOffline ? "#4ADE80" : "#FBBF24"}`,
          }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isOffline ? "#166534" : "#92400E" }}>
            {isOffline ? "🔒 Secure Offline Mode" : "⚡ AI-Powered Mode"}
          </span>
          <span style={{ fontSize: "0.7rem", color: isOffline ? "rgba(22,101,52,0.7)" : "rgba(146,64,14,0.7)", fontFamily: "monospace" }}>
            → {isOffline ? "POST /api/analyze-local (no external calls)" : "POST /api/analyze (Gemini / OpenAI)"}
          </span>
          {meta?.ocr_used && (
            <span style={{ marginLeft: "auto", fontSize: "0.65rem", background: "rgba(99,179,237,0.15)", color: "#1e40af", padding: "0.2rem 0.6rem", borderRadius: 100, fontWeight: 700, border: "1px solid rgba(99,179,237,0.3)" }}>
              📷 OCR Scanned
            </span>
          )}
        </div>

        {activeClause ? (
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 4rem 6rem" }}>

            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.85rem", borderRadius: 100, background: getRiskBg(activeClause.risk_level), color: getRiskColor(activeClause.risk_level), fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: getRiskColor(activeClause.risk_level) }} />
                {activeClause.risk_level} Risk
              </div>
              <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "2.5rem", fontWeight: 500, color: "#18120A", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                {activeClause.title}
              </h1>
            </div>

            <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 12, padding: "2.5rem" }}>
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A89C8F", marginBottom: "1rem" }}>Original Clause Text</div>
                <div style={{ fontSize: "0.925rem", color: "#18120A", lineHeight: 1.8, padding: "1.5rem", background: "rgba(24,18,10,0.03)", borderRadius: 8, borderLeft: "4px solid rgba(24,18,10,0.15)" }}>
                  {activeClause.content}
                </div>
              </div>

              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A89C8F", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  Statutory Analysis
                </div>
                {activeClause.msme_act_reference && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem", background: "rgba(168,85,247,0.1)", borderRadius: 6, border: "1px solid rgba(168,85,247,0.25)", marginBottom: "1rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9333EA" }}>{activeClause.msme_act_reference}</span>
                  </div>
                )}
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A89C8F", marginBottom: "0.5rem", marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Plain-Language Risk Explanation
                </div>
                <div style={{ fontSize: "0.925rem", color: "#5A5048", lineHeight: 1.8 }}>
                  {activeClause.explanation}
                </div>
              </div>

              {activeClause.redline_suggestion && (
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A89C8F", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Proposed Redline
                  </div>
                  <div style={{ fontSize: "0.925rem", color: "#166534", fontWeight: 500, lineHeight: 1.8, padding: "1.5rem", background: "rgba(22,163,74,0.06)", borderRadius: 8, border: "1px solid rgba(22,163,74,0.15)" }}>
                    {activeClause.redline_suggestion}
                  </div>
                </div>
              )}
            </div>

            {/* Nav Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2.5rem" }}>
              <button disabled={activeIdx === 0} onClick={() => setActiveIdx(i => Math.max(0, i - 1))} style={{ padding: "0.75rem 1.5rem", borderRadius: 6, background: "transparent", border: "1px solid rgba(24,18,10,0.15)", fontSize: "0.825rem", fontWeight: 600, color: "#18120A", cursor: activeIdx === 0 ? "not-allowed" : "pointer", opacity: activeIdx === 0 ? 0.4 : 1 }}>
                ← Previous
              </button>
              <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "#7A6E64" }}>Clause {activeIdx + 1} of {filtered.length}</span>
              <button disabled={activeIdx === filtered.length - 1} onClick={() => setActiveIdx(i => Math.min(filtered.length - 1, i + 1))} style={{ padding: "0.75rem 1.5rem", borderRadius: 6, background: "#18120A", border: "1px solid #18120A", fontSize: "0.825rem", fontWeight: 600, color: "#F5F0E8", cursor: activeIdx === filtered.length - 1 ? "not-allowed" : "pointer", opacity: activeIdx === filtered.length - 1 ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#7A6E64", fontSize: "0.9rem" }}>
            Select a clause to view details.
          </div>
        )}
      </main>

      {/* ── PRINT-ONLY VIEW (Hidden in Web App) ────────────── */}
      <div className="print-only" style={{ display: "none" }}>
        <div className="print-header">
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "2.5rem", marginBottom: "0.5rem" }}>Legal Risk Analysis Report</h1>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>Generated by ContractSense</p>
        </div>

        <div style={{ marginBottom: "2.5rem", padding: "1.5rem", border: "2px solid #000", borderRadius: 8 }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", textTransform: "uppercase" }}>Executive Summary</h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>{result.summary}</p>
          <div style={{ marginTop: "1.5rem", fontWeight: "bold" }}>Overall Risk Score: {result.risk_score}/100 ({scoreLabel})</div>
        </div>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>Clause Analysis</h2>

        {result.clauses.map((clause, idx) => (
          <div key={idx} className="clause-print-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.6rem", margin: 0 }}>{clause.title}</h3>
              <span style={{ padding: "4px 10px", background: "#eee", border: "1px solid #000", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Risk: {clause.risk_level}
              </span>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem", color: "#555" }}>Original Clause</strong>
              <div style={{ padding: "1rem", background: "#f9f9f9", borderLeft: "4px solid #ccc", fontStyle: "italic", lineHeight: 1.6 }}>{clause.content}</div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem", color: "#555" }}>Statutory Analysis</strong>
              <div style={{ lineHeight: 1.6 }}>{clause.explanation}</div>
            </div>

            {clause.redline_suggestion && (
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem", color: "#555" }}>Proposed Redline</strong>
                <div style={{ padding: "1rem", border: "1px dashed #000", background: "#fff", lineHeight: 1.6, fontWeight: "bold" }}>{clause.redline_suggestion}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
