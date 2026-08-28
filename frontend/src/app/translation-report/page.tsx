"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

interface TranslationResult {
  translated_title: string;
  translated_text: string;
  _meta?: {
    sha256: string;
    ocr_used: boolean;
    processing_mode: string;
  };
}

export default function TranslationReport() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("contract_translation");
    if (data) {
      setResult(JSON.parse(data));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!result) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F5F0E8", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ width: 40, height: 40, border: "2px solid rgba(24,18,10,0.1)", borderTopColor: "#D4924A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "rgba(24,18,10,0.6)", fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Translating formal document…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        /* PDF Export / Print Styles */
        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body { background: #fff !important; color: #000 !important; }
          .hide-on-print { display: none !important; }
          .print-container { background: #fff !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; }
          .print-text { color: #000 !important; font-size: 11pt !important; line-height: 1.6 !important; }
          .print-title { font-size: 20pt !important; border-bottom: 2px solid #000; padding-bottom: 0.5cm; margin-bottom: 1cm; }
        }
      `}</style>

      {/* ── TOP NAV BAR (Hidden on Print) ────────────────────── */}
      <header className="hide-on-print" style={{
        height: 64, background: "#0F0B06", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", position: "sticky", top: 0, zIndex: 10
      }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <Logo size={22} />
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "#F5F0E8" }}>ContractSense</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: 6, background: "transparent", border: "1px solid rgba(245,240,232,0.2)", color: "#F5F0E8", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(245,240,232,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem", borderRadius: 6, background: "#F5F0E8", color: "#0F0B06", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#fff"} onMouseLeave={e => e.currentTarget.style.background = "#F5F0E8"}>
            Translate Another
          </Link>
        </div>
      </header>

      {/* ── DOCUMENT PANE ────────────────────── */}
      <main style={{ padding: "4rem 2rem 6rem", display: "flex", justifyContent: "center" }}>
        <div className="print-container" style={{ width: "100%", maxWidth: 900, background: "#fff", borderRadius: 12, padding: "4rem 5rem", boxShadow: "0 20px 40px rgba(24,18,10,0.04), 0 1px 3px rgba(24,18,10,0.02)", border: "1px solid rgba(24,18,10,0.05)" }}>
          
          <div className="print-title" style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(24,18,10,0.1)" }}>
            <div className="hide-on-print" style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4924A", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(212,146,74,0.1)", padding: "0.4rem 0.8rem", borderRadius: 100 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4924A" }} />
              Certified Translation
            </div>
            {result._meta?.ocr_used && (
              <div className="hide-on-print" style={{ marginLeft: "0.5rem", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e40af", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(99,179,237,0.15)", padding: "0.4rem 0.8rem", borderRadius: 100, border: "1px solid rgba(99,179,237,0.3)" }}>
                📷 OCR Scanned
              </div>
            )}
            <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "2.5rem", fontWeight: 600, color: "#18120A", lineHeight: 1.2, margin: 0 }}>
              {result.translated_title || "Formal Document Translation"}
            </h1>
          </div>

          <div className="print-text" style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", lineHeight: 1.85, color: "#2D261F", whiteSpace: "pre-wrap" }}>
            {result.translated_text}
          </div>

        </div>
      </main>

    </div>
  );
}
