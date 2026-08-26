"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

const TIERS = [
  {
    name: "Free",
    tagline: "For individuals & exploration",
    price: { monthly: "₹0", annual: "₹0" },
    cta: "Get Started Free",
    ctaHref: "/dashboard",
    dark: false,
    features: [
      { text: "5 contract audits per month", available: true },
      { text: "Overall risk score", available: true },
      { text: "Clause-level flagging", available: true },
      { text: "PDF report export", available: false },
      { text: "Redline suggestions", available: false },
      { text: "Regional language translation", available: false },
      { text: "API access", available: false },
      { text: "Priority support", available: false },
    ],
  },
  {
    name: "MSME Pro",
    tagline: "For growing MSMEs & suppliers",
    price: { monthly: "₹1,999/mo", annual: "₹1,499/mo" },
    cta: "Start 14-Day Trial",
    ctaHref: "/dashboard",
    dark: true,
    highlight: "Most Popular",
    features: [
      { text: "Unlimited contract audits", available: true },
      { text: "Overall risk score", available: true },
      { text: "Clause-level flagging", available: true },
      { text: "PDF report export", available: true },
      { text: "Redline suggestions", available: true },
      { text: "Regional language translation (3 languages)", available: true },
      { text: "API access", available: false },
      { text: "Priority support", available: false },
    ],
  },
  {
    name: "Enterprise",
    tagline: "For procurement teams & law firms",
    price: { monthly: "Custom", annual: "Custom" },
    cta: "Contact Sales",
    ctaHref: "/dashboard",
    dark: false,
    features: [
      { text: "Unlimited contract audits", available: true },
      { text: "Overall risk score", available: true },
      { text: "Clause-level flagging", available: true },
      { text: "PDF report export", available: true },
      { text: "Redline suggestions", available: true },
      { text: "All 7 regional languages", available: true },
      { text: "API access + webhooks", available: true },
      { text: "Dedicated support & onboarding", available: true },
    ],
  },
];

const COMPARE_ROWS = [
  { label: "Contract Audits/mo",     free: "5", pro: "Unlimited", ent: "Unlimited" },
  { label: "Risk Score",             free: "✓", pro: "✓",         ent: "✓" },
  { label: "Clause-Level Analysis",  free: "✓", pro: "✓",         ent: "✓" },
  { label: "PDF Export",             free: "—", pro: "✓",         ent: "✓" },
  { label: "Redline Suggestions",    free: "—", pro: "✓",         ent: "✓" },
  { label: "Translation Languages",  free: "—", pro: "3",         ent: "7" },
  { label: "API Access",             free: "—", pro: "—",         ent: "✓" },
  { label: "SSO / Team Seats",       free: "—", pro: "—",         ent: "✓" },
  { label: "Dedicated Support",      free: "—", pro: "Email",     ent: "Dedicated CSM" },
  { label: "Offline / Air-Gapped",   free: "—", pro: "—",         ent: "✓" },
];

const FAQS = [
  { q: "Is my contract data stored anywhere?", a: "No. All documents are processed in-memory and never written to disk or stored in any database. Zero data retention is a core architectural guarantee, not just a policy." },
  { q: "What does 'Clause-Level Analysis' mean?", a: "Instead of an overall document score, we analyse each individual clause independently — giving you a risk score, a statutory citation, and a recommended redline for each flagged clause." },
  { q: "Which version of the MSMED Act do you use?", a: "We use the MSMED Act 2006 as amended, with specific attention to Section 15 (payment obligations) and Section 23 (dispute resolution). We also reference the Indian Contract Act, 1872." },
  { q: "Can I try before buying?", a: "Yes. The Free tier gives you 5 full contract audits per month with no credit card required. The MSME Pro trial gives you 14 days of unlimited access." },
  { q: "Do you offer a discount for SIH / student projects?", a: "Reach out to us directly. We actively support student teams, government-aligned startups, and SIH participants with extended trial access." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#18120A" }}>
      <style>{`
        .tier-card { transition: transform 0.3s cubic-bezier(.25,.46,.45,.94), box-shadow 0.3s; }
        .tier-card:hover { transform: translateY(-6px); }
        .faq-btn { cursor:pointer; background:none; border:none; width:100%; text-align:left; transition: color 0.15s; }
        .faq-btn:hover { color: #B8742E !important; }
        .toggle-track { position:relative; width:44px; height:24px; background: #C8C0B4; border-radius:100px; cursor:pointer; transition: background 0.2s; }
        .toggle-track.on { background: #18120A; }
        .toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; borderRadius:50%; background:#fff; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .toggle-thumb.on { left: 23px; }
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
              <Link key={label} href={href} style={{ fontSize: "0.845rem", fontWeight: label === "Pricing" ? 700 : 500, color: label === "Pricing" ? "#18120A" : "#6B5F52", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link href="/login"     style={{ fontSize: "0.82rem", fontWeight: 600, color: "#18120A", padding: "0.48rem 1.1rem", borderRadius: 3, border: "1.5px solid rgba(24,18,10,0.2)", textDecoration: "none" }}>Login</Link>
            <Link href="/dashboard" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5F0E8", padding: "0.48rem 1.2rem", borderRadius: 3, background: "#18120A", textDecoration: "none" }}>Request a Demo</Link>
          </div>
        </nav>
      </header>

      {/* Page header */}
      <section style={{ padding: "5rem 3rem 4rem", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8742E", marginBottom: "1rem" }}>Pricing</p>
        <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(2.5rem,5vw,3.75rem)", fontWeight: 500, color: "#18120A", letterSpacing: "-0.04em", lineHeight: 1.06, marginBottom: "1.25rem" }}>
          Simple, transparent pricing.
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#5A5048", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 2.5rem" }}>
          Start free. Scale as your contract volume grows. All plans include full MSMED Act compliance analysis.
        </p>
        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.825rem", fontWeight: 500, color: annual ? "#7A6E64" : "#18120A" }}>Monthly</span>
          <div className={`toggle-track${annual ? " on" : ""}`} onClick={() => setAnnual(!annual)}>
            <div className={`toggle-thumb${annual ? " on" : ""}`} />
          </div>
          <span style={{ fontSize: "0.825rem", fontWeight: 500, color: annual ? "#18120A" : "#7A6E64" }}>
            Annual <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", background: "rgba(22,163,74,0.1)", padding: "0.1rem 0.4rem", borderRadius: 100 }}>Save 25%</span>
          </span>
        </div>
      </section>

      {/* Tier cards */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 3rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", alignItems: "start" }}>
          {TIERS.map(tier => (
            <div key={tier.name} className="tier-card" style={{
              borderRadius: 10, overflow: "hidden",
              background: tier.dark ? "#18120A" : "#FBF9F5",
              border: tier.dark ? "none" : "1px solid rgba(24,18,10,0.08)",
              boxShadow: tier.dark ? "0 32px 80px rgba(24,18,10,0.25)" : "0 4px 12px rgba(24,18,10,0.04)",
              position: "relative",
            }}>
              {tier.highlight && (
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.2rem 0.6rem", borderRadius: 100, background: "#D4924A", color: "#0F0B06" }}>
                  {tier.highlight}
                </div>
              )}
              {tier.dark && <div style={{ height: 3, background: "linear-gradient(90deg,#B8742E,#E8A86A)" }} />}
              <div style={{ padding: "2rem 1.75rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: tier.dark ? "#D4924A" : "#B8742E", marginBottom: "0.35rem" }}>{tier.name}</div>
                <div style={{ fontSize: "0.8rem", color: tier.dark ? "rgba(245,240,232,0.45)" : "#7A6E64", marginBottom: "1.5rem" }}>{tier.tagline}</div>
                <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2.25rem", fontWeight: 500, color: tier.dark ? "#F5F0E8" : "#18120A", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
                  {annual ? tier.price.annual : tier.price.monthly}
                </div>
                {tier.price.monthly !== "₹0" && tier.price.monthly !== "Custom" && (
                  <div style={{ fontSize: "0.72rem", color: tier.dark ? "rgba(245,240,232,0.3)" : "#A89C8F", marginBottom: "1.75rem" }}>per month, billed {annual ? "annually" : "monthly"}</div>
                )}
                <Link href={tier.ctaHref} style={{
                  display: "block", textAlign: "center", padding: "0.825rem 1.5rem", borderRadius: 3,
                  background: tier.dark ? "#D4924A" : "#18120A",
                  color: tier.dark ? "#0F0B06" : "#F5F0E8",
                  fontSize: "0.825rem", fontWeight: 800, textDecoration: "none", letterSpacing: "0.01em",
                  marginBottom: "1.75rem", marginTop: "0.5rem",
                }}>
                  {tier.cta}
                </Link>
                <div style={{ height: 1, background: tier.dark ? "rgba(255,255,255,0.07)" : "rgba(24,18,10,0.07)", marginBottom: "1.25rem" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {tier.features.map(f => (
                    <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "0.6rem", opacity: f.available ? 1 : 0.35 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.available ? (tier.dark ? "#4ADE80" : "#16a34a") : (tier.dark ? "rgba(245,240,232,0.3)" : "#C8C0B4")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {f.available ? <polyline points="20 6 9 17 4 12" /> : <line x1="18" y1="6" x2="6" y2="18" />}
                      </svg>
                      <span style={{ fontSize: "0.795rem", color: tier.dark ? (f.available ? "rgba(245,240,232,0.8)" : "rgba(245,240,232,0.3)") : (f.available ? "#18120A" : "#A89C8F") }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 3rem 6rem" }}>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 500, color: "#18120A", letterSpacing: "-0.03em", marginBottom: "2.5rem", textAlign: "center" }}>
          Full feature comparison.
        </h2>
        <div style={{ border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#18120A", padding: "1rem 1.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(245,240,232,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Feature</div>
            {["Free", "MSME Pro", "Enterprise"].map(h => <div key={h} style={{ fontSize: "0.72rem", fontWeight: 700, color: h === "MSME Pro" ? "#D4924A" : "rgba(245,240,232,0.5)", letterSpacing: "0.04em", textTransform: "uppercase" as const, textAlign: "center" }}>{h}</div>)}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={row.label} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "0.875rem 1.5rem", background: i % 2 === 0 ? "#FBF9F5" : "#F5F0E8", borderBottom: "1px solid rgba(24,18,10,0.05)" }}>
              <div style={{ fontSize: "0.815rem", fontWeight: 500, color: "#18120A" }}>{row.label}</div>
              {[row.free, row.pro, row.ent].map((v, j) => (
                <div key={j} style={{ textAlign: "center", fontSize: "0.815rem", fontWeight: v === "✓" ? 700 : 400, color: v === "✓" ? "#16a34a" : v === "—" ? "#C8C0B4" : "#18120A" }}>{v}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 3rem 6rem" }}>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 500, color: "#18120A", letterSpacing: "-0.03em", marginBottom: "2.5rem", textAlign: "center" }}>
          Frequently asked questions.
        </h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(24,18,10,0.08)" }}>
            <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#18120A", width: "100%" }}>
              <span style={{ fontSize: "0.925rem", fontWeight: 600 }}>{faq.q}</span>
              <span style={{ fontSize: "1.25rem", color: "#B8742E", flexShrink: 0, marginLeft: "1rem", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: "0.85rem", color: "#5A5048", lineHeight: 1.8, paddingBottom: "1.25rem" }}>{faq.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #8B4A1C, #C17D3C)", padding: "5rem 3rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2.5rem", fontWeight: 500, color: "#fff", letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.15 }}>
          Start auditing for free today.
        </h2>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", marginBottom: "2rem" }}>No credit card. No account required for your first 5 audits.</p>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "0.9rem 2.5rem", borderRadius: 3, background: "#fff", color: "#8B4A1C", fontSize: "0.875rem", fontWeight: 800, textDecoration: "none" }}>
          Get Started Free →
        </Link>
      </section>

      <footer style={{ background: "#120E08", padding: "1.5rem 3rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.775rem", color: "rgba(245,240,232,0.25)" }}><Logo size={16} /> © 2026 ContractSense</div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[["Home", "/"], ["Capabilities", "/capabilities"], ["Dashboard", "/dashboard"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.25)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
