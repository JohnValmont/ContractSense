"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

const TABS = [
  {
    id: "risk", label: "Risk Analysis", icon: "⚖",
    headline: "Clause-level statutory risk scoring.",
    body: "ContractSense dissects every clause and benchmarks it against the MSMED Act 2006 and Indian Contract Act 1872. Each clause receives a risk score from 0–100, with a detailed statutory rationale and the exact legal section being violated.",
    details: [
      { title: "31 Predatory Patterns", desc: "Covers payment traps, uncapped indemnities, unilateral termination, unfair arbitration clauses, and more." },
      { title: "MSMED Act Section 15", desc: "Automatically flags any payment term exceeding the 45-day statutory limit with section-level citations." },
      { title: "Clause-Level Scoring", desc: "Each clause receives its own risk score — not just an overall document score. Drill down to the exact risk." },
      { title: "Voidability Alerts", desc: "Flags clauses that are legally voidable under the Indian Contract Act, giving you immediate legal standing." },
    ],
    preview: (
      <div style={{ background: "#0F0B06", borderRadius: 10, padding: "1.5rem", fontFamily: "monospace", fontSize: "0.775rem", lineHeight: 2, color: "rgba(255,255,255,0.7)" }}>
        <div style={{ color: "#6B9BFA" }}>ANALYSING: <span style={{ color: "#E8A86A" }}>Vendor_Agreement_Q3.pdf</span></div>
        <div style={{ color: "rgba(255,255,255,0.3)", marginTop: 8 }}>────────────────────────────────</div>
        {[
          { clause: "Clause 4.1 — Payment Terms", score: 87, badge: "HIGH", col: "#F87171" },
          { clause: "Clause 7.3 — Arbitration Seat", score: 62, badge: "MED",  col: "#FBBF24" },
          { clause: "Clause 9.1 — Liability Cap",   score: 91, badge: "HIGH", col: "#F87171" },
          { clause: "Clause 11 — Force Majeure",    score: 14, badge: "LOW",  col: "#4ADE80" },
        ].map(r => (
          <div key={r.clause} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.35rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "rgba(255,255,255,0.65)" }}>{r.clause}</span>
            <span style={{ background: "rgba(255,255,255,0.06)", padding: "0.12rem 0.5rem", borderRadius: 100, fontSize: "0.65rem", fontWeight: 700, color: r.col }}>{r.badge} {r.score}</span>
          </div>
        ))}
        <div style={{ marginTop: "1rem", color: "#F87171", fontWeight: 700 }}>● 3 HIGH RISK clauses require immediate attention.</div>
      </div>
    ),
  },
  {
    id: "translate", label: "Translation", icon: "🌐",
    headline: "Legal precision in 7 Indian languages.",
    body: "Translate complex enterprise agreements into Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, and Urdu while maintaining strict jurisdictional tone. Local vendors understand exactly what they are signing.",
    details: [
      { title: "7 Indian Languages", desc: "Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Urdu — covering 900M+ speakers." },
      { title: "Jurisdictional Tone", desc: "Maintains the formal, legal register appropriate for court-admissible documents." },
      { title: "Side-by-Side View", desc: "Original and translated clauses shown in parallel for easy cross-referencing." },
      { title: "Export Ready", desc: "Download the translated document as a formatted PDF ready for distribution." },
    ],
    preview: (
      <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, padding: "1.5rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A89C8F", marginBottom: "1rem" }}>Live Translation Preview</div>
        {[
          { lang: "English", flag: "🇬🇧", text: "The Buyer shall make payment within ninety (90) days of the invoice date.", risk: true },
          { lang: "Hindi", flag: "🇮🇳", text: "क्रेता चालान की तारीख से नब्बे (90) दिनों के भीतर भुगतान करेगा।", risk: false },
          { lang: "Marathi", flag: "🇮🇳", text: "खरेदीदार चालानाच्या तारखेपासून नव्वद (90) दिवसांत पेमेंट करेल.", risk: false },
          { lang: "Bengali", flag: "🇮🇳", text: "ক্রেতা চালানের তারিখ থেকে নব্বই (90) দিনের মধ্যে অর্থ প্রদান করবে।", risk: false },
        ].map(r => (
          <div key={r.lang} style={{ display: "flex", gap: "0.875rem", padding: "0.75rem", marginBottom: "0.5rem", borderRadius: 6, background: r.risk ? "rgba(220,38,38,0.04)" : "#fff", border: `1px solid ${r.risk ? "rgba(220,38,38,0.15)" : "rgba(24,18,10,0.07)"}` }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{r.flag}</span>
            <div>
              <div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#A89C8F", letterSpacing: "0.06em", marginBottom: 2 }}>{r.lang.toUpperCase()}</div>
              <div style={{ fontSize: "0.8rem", color: "#18120A", lineHeight: 1.55 }}>{r.text}</div>
            </div>
            {r.risk && <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#dc2626", alignSelf: "flex-start", flexShrink: 0 }}>⚠ RISKY</span>}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "redline", label: "Redlining", icon: "✏",
    headline: "Exact replacement text. Ready to negotiate.",
    body: "ContractSense doesn't just flag problems — it generates the precise replacement clause text needed to push back against unfair terms, with statutory justification included.",
    details: [
      { title: "Replacement Text", desc: "Generates exact substitute clause language, not just vague suggestions." },
      { title: "Statutory Justification", desc: "Every redline includes the specific MSMED Act or Indian Contract Act section backing it." },
      { title: "Negotiation Ready", desc: "Output is formatted for direct inclusion in counter-proposals and negotiations." },
      { title: "Track Changes Style", desc: "View original vs. redlined text side by side with colour-coded markup." },
    ],
    preview: (
      <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ background: "#18120A", padding: "0.875rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "rgba(245,240,232,0.6)" }}>Track Changes — Clause 4.1</div>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A89C8F", marginBottom: "0.75rem" }}>Original</div>
          <p style={{ fontSize: "0.825rem", color: "#18120A", lineHeight: 1.65, padding: "0.75rem", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 6, marginBottom: "1rem" }}>
            <span style={{ background: "rgba(220,38,38,0.15)", color: "#dc2626", textDecoration: "line-through", borderRadius: 2, padding: "0 2px" }}>ninety (90) days</span> from the date of invoice.
          </p>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A89C8F", marginBottom: "0.75rem" }}>Redlined Replacement</div>
          <p style={{ fontSize: "0.825rem", color: "#18120A", lineHeight: 1.65, padding: "0.75rem", background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 6, marginBottom: "1rem" }}>
            <span style={{ background: "rgba(22,163,74,0.15)", color: "#16a34a", fontWeight: 600, borderRadius: 2, padding: "0 2px" }}>forty-five (45) days</span> from the date of invoice, in compliance with Section 15 of the MSMED Act, 2006.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#7A6E64", background: "#F5F0E8", padding: "0.625rem", borderRadius: 5 }}>
            📖 Statutory Basis: MSMED Act 2006, Section 15 — payment obligations not exceeding 45 days.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "export", label: "PDF Export", icon: "📄",
    headline: "Boardroom-ready reports in one click.",
    body: "Generate a professionally formatted PDF risk report complete with an executive summary, clause-level analysis, statutory citations, and your redlined recommendations — ready to share with stakeholders.",
    details: [
      { title: "Executive Summary", desc: "One-page summary with overall risk score, top 3 risks, and recommended actions." },
      { title: "Clause Index", desc: "Every analysed clause with its score, category, and statutory reference." },
      { title: "Redline Appendix", desc: "All suggested replacement clauses formatted as a negotiation-ready counter-proposal." },
      { title: "Company Branding", desc: "Reports are clean, minimal, and professional — no ContractSense branding in exports." },
    ],
    preview: (
      <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ background: "#18120A", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(245,240,232,0.7)" }}>ContractSense_Report.pdf</span>
          <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: 100, background: "rgba(22,163,74,0.2)", color: "#4ADE80", fontWeight: 700 }}>Ready</span>
        </div>
        <div style={{ padding: "1.25rem" }}>
          {[
            { h: "Executive Summary", lines: 2 },
            { h: "Risk Score: 73/100 — High", lines: 1 },
            { h: "Clause Analysis (14 clauses)", lines: 3 },
            { h: "Redline Recommendations", lines: 2 },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: "0.875rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#18120A", marginBottom: "0.35rem" }}>{s.h}</div>
              {Array.from({ length: s.lines }).map((_, j) => (
                <div key={j} style={{ height: 8, background: "#EDE9E1", borderRadius: 2, marginBottom: "0.25rem", width: j === s.lines - 1 ? "70%" : "100%" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState("risk");
  const active = TABS.find(t => t.id === activeTab)!;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#18120A" }}>
      <style>{`
        .tab-btn { transition: all 0.2s; cursor: pointer; }
        .tab-btn:hover { background: rgba(24,18,10,0.06) !important; }
      `}</style>

      {/* Navbar */}
      <header style={{ background: "rgba(245,240,232,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(24,18,10,0.07)", position: "sticky", top: 0, zIndex: 100 }}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.125rem 3rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
            <Logo size={26} />
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#18120A", letterSpacing: "-0.025em" }}>ContractSense</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {[["How it Works", "/#how-it-works"], ["Capabilities", "/capabilities"], ["Pricing", "/pricing"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: "0.845rem", fontWeight: label === "Capabilities" ? 700 : 500, color: label === "Capabilities" ? "#18120A" : "#6B5F52", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link href="/login"     style={{ fontSize: "0.82rem", fontWeight: 600, color: "#18120A", padding: "0.48rem 1.1rem", borderRadius: 3, border: "1.5px solid rgba(24,18,10,0.2)", textDecoration: "none" }}>Login</Link>
            <Link href="/dashboard" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5F0E8", padding: "0.48rem 1.2rem", borderRadius: 3, background: "#18120A", textDecoration: "none" }}>Request a Demo</Link>
          </div>
        </nav>
      </header>

      {/* Page hero */}
      <section style={{ background: "#18120A", padding: "5rem 3rem 4rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4924A", marginBottom: "1rem" }}>Platform Capabilities</p>
          <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 500, color: "#F5F0E8", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1.25rem", maxWidth: 720 }}>
            Every tool your legal<br />team actually needs.
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(245,240,232,0.45)", maxWidth: 520, lineHeight: 1.75 }}>
            From initial risk scoring to final boardroom report — ContractSense covers the full contract review lifecycle, built for India's statutory framework.
          </p>
        </div>
      </section>

      {/* Tab interface */}
      <div style={{ background: "#FDFCF8", borderBottom: "1px solid rgba(24,18,10,0.07)", position: "sticky", top: 65, zIndex: 90 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 3rem", display: "flex", gap: "0.25rem" }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)} style={{
              padding: "1rem 1.5rem", border: "none", background: "transparent", cursor: "pointer",
              fontSize: "0.845rem", fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? "#18120A" : "#7A6E64",
              borderBottom: activeTab === t.id ? "2px solid #B8742E" : "2px solid transparent",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 500, color: "#18120A", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.25rem" }}>
              {active.headline}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#5A5048", lineHeight: 1.8, marginBottom: "2.5rem" }}>{active.body}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
              {active.details.map(d => (
                <div key={d.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8742E", flexShrink: 0, marginTop: 7 }} />
                  <div>
                    <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "#18120A", marginBottom: "0.2rem" }}>{d.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#7A6E64", lineHeight: 1.6 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "0.875rem 2rem", borderRadius: 3, background: "#18120A", color: "#F5F0E8", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.01em" }}>
              Try It Free →
            </Link>
          </div>
          {/* Right */}
          <div>{active.preview}</div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#18120A", padding: "5rem 3rem", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2.25rem", fontWeight: 500, color: "#F5F0E8", letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.15 }}>
            Ready to audit your first contract?
          </h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(245,240,232,0.4)", marginBottom: "2rem" }}>No account required. Upload and get results in under 30 seconds.</p>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "0.9rem 2.5rem", borderRadius: 3, background: "#D4924A", color: "#0F0B06", fontSize: "0.875rem", fontWeight: 800, textDecoration: "none", letterSpacing: "0.01em" }}>
            Audit Without Account →
          </Link>
        </div>
      </section>

      <footer style={{ background: "#120E08", padding: "1.5rem 3rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.775rem", color: "rgba(245,240,232,0.25)" }}><Logo size={16} /> © 2026 ContractSense</div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[["Home", "/"], ["Pricing", "/pricing"], ["Dashboard", "/dashboard"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.25)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
