"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Logo from "./components/Logo";

/* ─── Scroll-reveal hook ─────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Count-up hook ─────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const pct = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setVal(Math.floor(ease * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

/* ─── Animated CTA button ────────────────── */
function Btn({ href, dark, children, style = {} }: { href: string; dark?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <Link href={href}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", padding: "0.9rem 2rem", borderRadius: 3,
        background: dark ? (h ? "#2A1D0F" : "#18120A") : (h ? "rgba(255,255,255,0.08)" : "transparent"),
        color: dark ? "#F5F0E8" : "inherit",
        border: dark ? "1.5px solid #18120A" : "1.5px solid rgba(24,18,10,0.2)",
        fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.01em",
        transition: "all 0.25s cubic-bezier(.25,.46,.45,.94)",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h ? (dark ? "0 14px 36px rgba(24,18,10,0.28)" : "0 6px 20px rgba(24,18,10,0.08)") : "none",
        whiteSpace: "nowrap",
        ...style,
      }}>{children}</Link>
  );
}

/* ─── Testimonials data removed ────────────── */

const WHO = [
  { title: "MSMEs & Suppliers", desc: "Protect your payment rights. Flag voidable indemnity clauses, illegal arbitration terms, and unfair termination rights — before you sign.", cta: "Audit a Contract →", color: "#1A1208" },
  { title: "Procurement Teams", desc: "Review supplier contracts at scale. Generate statutory redlines, score risk, and produce boardroom-ready audit reports in under 30 seconds.", cta: "Explore Features →", color: "#2D1F0A" },
  { title: "Legal Professionals", desc: "Translate, audit, and redline complex agreements. Export professionally formatted reports with Indian statutory citations and cross-references.", cta: "See Capabilities →", color: "#18120A" },
];

const ZIGZAG = [
  {
    eyebrow: "Statutory Compliance Engine", title: "31 predatory clause patterns. Every contract.", body: "The engine specifically isolates payment terms and benchmarks them against Section 15 of the MSMED Act 2006, instantly flagging anything exceeding the 45-day statutory limit. It cross-references the Indian Contract Act, 1872 for voidable clauses.",
    visual: (
      <div style={{ background: "#0F0B06", borderRadius: 10, padding: "1.5rem", fontFamily: "monospace", fontSize: "0.775rem", lineHeight: 1.75, color: "rgba(255,255,255,0.65)" }}>
        <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem" }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ color: "#6B9BFA" }}>const <span style={{ color: "#E8A86A" }}>payment_terms</span> = <span style={{ color: "#85E89D" }}>"90 days"</span>;</div>
        <div style={{ color: "#6B9BFA" }}>if (terms &gt; <span style={{ color: "#F97583" }}>45</span>) {'{'}</div>
        <div style={{ color: "#E8A86A", paddingLeft: "1rem" }}>flagViolation(<span style={{ color: "#85E89D" }}>MSMED_ACT_SEC_15</span>);</div>
        <div style={{ color: "#6B9BFA" }}>{'}'}</div>
        <div style={{ marginTop: "1rem", background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)", padding: "0.75rem", borderRadius: 6 }}>
          <div style={{ color: "#F87171", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.25rem" }}>● HIGH RISK IDENTIFIED</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Payment term of 90 days violates statutory 45-day limit.<br />Clause is voidable under Section 15.</div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Precision Regional Translation", title: "Legal accuracy in 7 Indian languages.", body: "Our translation layer converts complex enterprise agreements into Hindi, Marathi, Bengali, Tamil, Telugu, and Urdu while maintaining strict jurisdictional tone and formatting, ensuring local vendors fully comprehend what they sign.",
    visual: (
      <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, padding: "1.75rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A89C8F", marginBottom: "0.875rem" }}>Original → Translated</div>
        {[
          { lang: "EN", text: "Payment shall be made within 90 days of invoice.", flag: "🇬🇧" },
          { lang: "HI", text: "भुगतान चालान की तारीख से 90 दिनों के भीतर किया जाएगा।", flag: "🇮🇳" },
          { lang: "BN", text: "চালানের তারিখ থেকে ৯০ দিনের মধ্যে অর্থ প্রদান করতে হবে।", flag: "🇮🇳" },
        ].map(r => (
          <div key={r.lang} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", marginBottom: "0.5rem", background: r.lang === "EN" ? "rgba(220,38,38,0.04)" : "rgba(22,163,74,0.04)", border: `1px solid ${r.lang === "EN" ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)"}`, borderRadius: 6 }}>
            <span style={{ fontSize: "1rem" }}>{r.flag}</span>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#A89C8F", letterSpacing: "0.06em", marginBottom: 2 }}>{r.lang}</div>
              <div style={{ fontSize: "0.775rem", color: "#18120A", lineHeight: 1.5 }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "Boardroom-Ready Export", title: "From upload to signed-off report in minutes.", body: "Instantly export a professionally formatted risk report with precise statutory cross-references, giving your procurement team the exact text they need to negotiate secure, compliant terms.",
    visual: (
      <div style={{ background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ background: "#18120A", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(245,240,232,0.7)" }}>Vendor_Agreement_Q3_Report.pdf</span>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
          </div>
        </div>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ height: 10, background: "#EDE9E1", borderRadius: 3, marginBottom: "0.5rem" }} />
          <div style={{ height: 10, background: "#EDE9E1", borderRadius: 3, width: "80%", marginBottom: "0.5rem" }} />
          <div style={{ height: 10, background: "rgba(220,38,38,0.15)", borderRadius: 3, width: "90%", marginBottom: "0.5rem" }} />
          <div style={{ height: 10, background: "#EDE9E1", borderRadius: 3, width: "70%", marginBottom: "1rem" }} />
          <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 6, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", marginBottom: "0.25rem" }}>✓ REDLINE SUGGESTED</div>
            <div style={{ fontSize: "0.72rem", color: "#18120A", lineHeight: 1.5 }}>Replace: <span style={{ textDecoration: "line-through", color: "#dc2626" }}>"90 days"</span> → <span style={{ color: "#16a34a", fontWeight: 600 }}>"45 days (MSMED Act, S.15)"</span></div>
          </div>
        </div>
      </div>
    ),
  },
];

const USECASES = [
  { icon: "🏭", title: "Small Vendors & Suppliers", desc: "Protect payment rights. Flag voidable clauses. Navigate compliance without a lawyer on retainer.", link: "/capabilities" },
  { icon: "🏢", title: "Mid-Size MSMEs", desc: "Review 30+ contracts monthly at scale. Generate redlines your legal team can act on instantly.", link: "/capabilities" },
  { icon: "📋", title: "Procurement Departments", desc: "Standardize contract intake, automate risk scoring, and produce boardroom-ready audit trails.", link: "/capabilities" },
  { icon: "⚖", title: "Legal Professionals", desc: "Complement your expertise with AI-powered clause analysis. Generate citations, redlines, and reports.", link: "/capabilities" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Home() {
  /* Hero typewriter */
  const ACCENT = "Built for Indian MSMEs.";
  const [typed, setTyped] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!heroReady) return;
    let i = 0;
    const iv = setInterval(() => {
      setTyped(ACCENT.slice(0, ++i));
      if (i >= ACCENT.length) clearInterval(iv);
    }, 52);
    return () => clearInterval(iv);
  }, [heroReady]);

  /* Stats */
  const statsReveal = useReveal();
  const c1 = useCountUp(31,  1600, statsReveal.visible);
  const c2 = useCountUp(45,  1200, statsReveal.visible);
  const c3 = useCountUp(100, 2000, statsReveal.visible);
  const c4 = useCountUp(30,  1400, statsReveal.visible);

  /* Section reveals */
  const whoReveal  = useReveal();
  const zigReveal  = useReveal();
  const banReveal  = useReveal();
  const archReveal = useReveal();
  const ucReveal   = useReveal();
  const ctaReveal  = useReveal();


  const fadeUp = (delay = 0, visible = true): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms, transform 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms`,
  });

  const fadeRight = (delay = 0, visible = true): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-40px)",
    transition: `opacity 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms, transform 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms`,
  });

  const fadeLeft = (delay = 0, visible = true): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(40px)",
    transition: `opacity 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms, transform 0.75s cubic-bezier(.25,.46,.45,.94) ${delay}ms`,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#18120A" }}>
      <style>{`
        @keyframes gradpan  { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
        @keyframes floatA   { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(-4px)}50%{transform:translateY(5px)} }
        @keyframes pulse2   { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)} }
        @keyframes blink    { 0%,100%{opacity:1}50%{opacity:0} }
        .nav-a { position:relative; transition:color 0.18s; }
        .nav-a::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#18120A; transition:width 0.22s ease; border-radius:2px; }
        .nav-a:hover { color:#18120A !important; }
        .nav-a:hover::after { width:100%; }
        .who-card:hover .who-img { transform:scale(1.06) !important; }
        .who-card { transition:transform 0.3s cubic-bezier(.25,.46,.45,.94), box-shadow 0.3s cubic-bezier(.25,.46,.45,.94); }
        .who-card:hover { transform:translateY(-7px); box-shadow:0 28px 64px rgba(24,18,10,0.14); }
        .uc-card { transition:all 0.25s cubic-bezier(.25,.46,.45,.94); cursor:default; }
        .uc-card:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(24,18,10,0.1); border-color:rgba(184,116,46,0.3) !important; background:#FBF9F5 !important; }
        .dot-btn { transition:all 0.2s; }
        .dot-btn:hover { transform:scale(1.3); }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════ */}
      <header style={{ background: "rgba(245,240,232,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(24,18,10,0.07)", position: "sticky", top: 0, zIndex: 100 }}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.125rem 3rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.85rem", textDecoration: "none" }}>
            <Logo size={46} />
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.65rem", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
              <span style={{ color: "#18120A" }}>Contract</span><span style={{ color: "#B8742E", fontStyle: "italic" }}>Sense</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {[["How it Works", "#how-it-works"], ["Capabilities", "/capabilities"], ["Pricing", "/pricing"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-a" style={{ fontSize: "0.845rem", fontWeight: 500, color: "#6B5F52", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link href="/dashboard" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5F0E8", padding: "0.48rem 1.2rem", borderRadius: 3, background: "#18120A", textDecoration: "none", transition: "all 0.2s" }}>Open Dashboard</Link>
          </div>
        </nav>
      </header>

      {/* ══ HERO — Dark cinematic ═══════════════ */}
      <section style={{ background: "#0F0B06", position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "center" }}>
        {/* Animated gradient orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "20%", left: "60%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,116,46,0.18) 0%, transparent 70%)", animation: "floatA 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(193,125,60,0.1) 0%, transparent 70%)", animation: "floatB 10s ease-in-out infinite" }} />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "6rem 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", position: "relative", zIndex: 1 }}>
          {/* Left */}
          <div>
            <div style={{ ...fadeUp(0, heroReady), display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.875rem", borderRadius: 100, background: "rgba(184,116,46,0.12)", border: "1px solid rgba(184,116,46,0.25)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4924A", marginBottom: "2rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C17D3C", display: "inline-block", animation: "pulse2 2.5s ease-in-out infinite" }} />
              MSME Development Act, 2006 Compliance
            </div>

            <h1 style={{ ...fadeUp(100, heroReady), fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(3rem,5.5vw,5rem)", fontWeight: 500, lineHeight: 1.04, letterSpacing: "-0.04em", color: "#F5F0E8", marginBottom: "1.75rem" }}>
              Contract Auditing<br />
              <span style={{ color: "#D4924A", fontStyle: "italic" }}>
                {typed}
                <span style={{ animation: "blink 1.1s step-end infinite", color: "#D4924A" }}>|</span>
              </span>
            </h1>

            <p style={{ ...fadeUp(220, heroReady), fontSize: "1rem", color: "rgba(245,240,232,0.58)", lineHeight: 1.8, maxWidth: 440, marginBottom: "2.75rem" }}>
              Identify illegal payment traps, enforce your statutory rights under the MSMED Act 2006, and generate boardroom-ready redlines — all before you sign.
            </p>

            <div style={{ ...fadeUp(320, heroReady), display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "2rem" }}>
              <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "0.875rem 2rem", borderRadius: 3, background: "#D4924A", color: "#0F0B06", fontSize: "0.875rem", fontWeight: 800, textDecoration: "none", letterSpacing: "0.01em", transition: "all 0.2s", boxShadow: "0 8px 28px rgba(184,116,46,0.35)" }}>
                Audit a Contract Now →
              </Link>
              <Link href="/capabilities" style={{ display: "inline-flex", alignItems: "center", padding: "0.875rem 2rem", borderRadius: 3, background: "transparent", color: "rgba(245,240,232,0.75)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em", border: "1.5px solid rgba(245,240,232,0.18)", transition: "all 0.2s" }}>
                See Capabilities
              </Link>
            </div>

            <div style={{ ...fadeUp(400, heroReady), display: "flex", alignItems: "center", gap: "1.75rem" }}>
              {["No data retained", "Powered by AI", "Free to start"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.38)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — product card */}
          <div style={{ ...fadeUp(180, heroReady), position: "relative" }}>
            <div style={{ position: "absolute", top: "-1.5rem", right: "0", zIndex: 10, background: "#fff", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 8, padding: "0.45rem 0.875rem", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.775rem", fontWeight: 600, color: "#166534", animation: "floatA 4s ease-in-out infinite" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Analysis complete
            </div>
            <div style={{ position: "absolute", bottom: "-1.5rem", left: "0", zIndex: 10, background: "#fff", border: "1px solid rgba(24,18,10,0.08)", borderRadius: 8, padding: "0.45rem 0.875rem", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.775rem", fontWeight: 600, color: "#92400e", animation: "floatB 4s ease-in-out infinite 1.5s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              3 high-risk clauses flagged
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(24,18,10,0.09)", borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(184,116,46,0.2)" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#B8742E,#E8A86A)" }} />
              <div style={{ padding: "1.5rem 1.625rem 1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 34, height: 34, background: "#F5F0E8", borderRadius: 7, border: "1px solid rgba(24,18,10,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}><Logo size={17} /></div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#18120A" }}>Vendor_Agreement_Q3.pdf</div>
                    <div style={{ fontSize: "0.7rem", color: "#7A6E64", marginTop: 1 }}>Risk Analysis · MSME Compliance Audit</div>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A89C8F", marginBottom: "0.45rem" }}>Overall Risk Score</div>
                  <div style={{ height: 3, background: "#EDE9E1", borderRadius: 2, marginBottom: "0.4rem" }}><div style={{ height: "100%", width: "73%", background: "#dc2626", borderRadius: 2 }} /></div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#dc2626" }}>73 / 100 — High Risk</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {[{ name: "Payment Terms (90 Days)", badge: "HIGH", bg: "#fef2f2", col: "#dc2626" }, { name: "Exclusive Arbitration — Delhi", badge: "MED", bg: "#fffbeb", col: "#d97706" }, { name: "Liability Cap — Uncapped", badge: "HIGH", bg: "#fef2f2", col: "#dc2626" }, { name: "Force Majeure", badge: "LOW", bg: "#f0fdf4", col: "#16a34a" }].map(row => (
                    <div key={row.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: 5, background: "#FAFAF8", border: "1px solid rgba(24,18,10,0.06)" }}>
                      <span style={{ fontSize: "0.775rem", fontWeight: 500, color: "#18120A" }}>{row.name}</span>
                      <span style={{ fontSize: "0.63rem", fontWeight: 800, padding: "0.12rem 0.45rem", borderRadius: 100, background: row.bg, color: row.col, letterSpacing: "0.05em" }}>{row.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, #F5F0E8)", pointerEvents: "none" }} />
      </section>

      {/* ══ ANIMATED STATS ════════════════════════ */}
      <section ref={statsReveal.ref} style={{ background: "#F5F0E8", padding: "5rem 3rem", borderBottom: "1px solid rgba(24,18,10,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }}>
          {[
            { val: c1, suffix: "",   label: "Predatory Clause Patterns", desc: "Detected across all contract types" },
            { val: c2, suffix: " Days", label: "MSMED Act Deadline",    desc: "Buyers cannot legally exceed this" },
            { val: c4, suffix: "s",   label: "Analysis Turnaround",      desc: "Full clause-level statutory review" },
            { val: c3, suffix: "%",   label: "Data Privacy",             desc: "Zero retention, in-memory processing" },
          ].map((s, i) => (
            <div key={i} style={{ ...fadeUp(i * 80, statsReveal.visible), paddingRight: "2rem", borderRight: i < 3 ? "1px solid rgba(24,18,10,0.08)" : "none" }}>
              <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "3.5rem", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em", color: "#18120A", marginBottom: "0.5rem" }}>
                {i === 2 ? "<" : ""}{s.val}<span style={{ color: "#B8742E" }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: "0.775rem", fontWeight: 700, color: "#18120A", marginBottom: "0.2rem", letterSpacing: "-0.01em" }}>{s.label}</div>
              <div style={{ fontSize: "0.72rem", color: "#7A6E64", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHO WE SERVE ══════════════════════════ */}
      <section ref={whoReveal.ref} style={{ background: "#F5F0E8", padding: "6rem 3rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ ...fadeUp(0, whoReveal.visible), textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8742E", marginBottom: "0.875rem" }}>Who We Serve</p>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, letterSpacing: "-0.03em", color: "#18120A", lineHeight: 1.1 }}>
              Every contract.<br />Every stakeholder.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {WHO.map((w, i) => (
              <div key={w.title} className="who-card" style={{ ...fadeUp(i * 120, whoReveal.visible), background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.07)", borderRadius: 10, overflow: "hidden" }}>
                {/* Color band top */}
                <div style={{ height: 160, background: w.color, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 30%, rgba(184,116,46,0.3) 0%, transparent 60%)` }} />
                  <div style={{ position: "absolute", bottom: 20, left: 24, fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2.5rem", color: "rgba(245,240,232,0.12)", fontWeight: 500 }}>
                    {i === 0 ? "MSME" : i === 1 ? "PRO" : "LEGAL"}
                  </div>
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.3rem", fontWeight: 500, color: "#18120A", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{w.title}</h3>
                  <p style={{ fontSize: "0.825rem", color: "#5A5048", lineHeight: 1.7, marginBottom: "1.25rem" }}>{w.desc}</p>
                  <Link href="/dashboard" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#B8742E", textDecoration: "none", letterSpacing: "0.01em" }}>{w.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ZIGZAG FEATURES ═══════════════════════ */}
      <section id="how-it-works" ref={zigReveal.ref} style={{ background: "#FDFCF8", borderTop: "1px solid rgba(24,18,10,0.06)", borderBottom: "1px solid rgba(24,18,10,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {ZIGZAG.map((z, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={z.eyebrow} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", padding: "5rem 3rem", borderBottom: i < ZIGZAG.length - 1 ? "1px solid rgba(24,18,10,0.05)" : "none" }}>
                <div style={{ order: isEven ? 1 : 2, ...fadeRight(0, zigReveal.visible) }}>
                  {z.visual}
                </div>
                <div style={{ order: isEven ? 2 : 1, ...fadeLeft(120, zigReveal.visible) }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8742E", marginBottom: "0.875rem" }}>{z.eyebrow}</p>
                  <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 500, color: "#18120A", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.25rem" }}>{z.title}</h2>
                  <p style={{ fontSize: "0.875rem", color: "#5A5048", lineHeight: 1.8, marginBottom: "1.75rem" }}>{z.body}</p>
                  <Btn href="/capabilities" dark={false} style={{ color: "#18120A" }}>Learn More →</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ SAFFRON BANNER ════════════════════════ */}
      <section ref={banReveal.ref} style={{ background: "linear-gradient(135deg, #8B4A1C, #C17D3C, #E8A860)", padding: "5rem 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ ...fadeUp(0, banReveal.visible), fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 500, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: "1.75rem" }}>
            31 predatory clause patterns.<br />Every contract. Every time.
          </p>
          <div style={{ ...fadeUp(200, banReveal.visible) }}>
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "0.9rem 2.25rem", borderRadius: 3, background: "#fff", color: "#8B4A1C", fontSize: "0.875rem", fontWeight: 800, textDecoration: "none", letterSpacing: "0.01em", boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
              Audit Your Contract Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ ARCHITECTURE ══════════════════════════ */}
      <section ref={archReveal.ref} style={{ background: "#18120A", padding: "6rem 3rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ ...fadeUp(0, archReveal.visible), textAlign: "center", marginBottom: "4.5rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8742E", marginBottom: "0.875rem" }}>Under the Hood</p>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 500, color: "#F5F0E8", letterSpacing: "-0.03em" }}>
              How ContractSense works.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { num: "01", title: "Document Ingestion & OCR", desc: "Digital PDFs are parsed natively. Scanned image-only PDFs trigger an automatic fallback to Tesseract OCR for seamless text extraction." },
              { num: "02", title: "Offline / Cloud Routing", desc: "Users select between 'Secure Offline' mode (regex-based heuristic engine) or 'AI-Powered' mode (LLM processing) based on data sensitivity." },
              { num: "03", title: "Statutory NLP Analysis", desc: "The contract is analyzed against Indian commercial law, cross-referencing the MSMED Act to flag predatory clauses and generate fair redlines." }
            ].map((step, i) => (
              <div key={step.num} style={{ ...fadeUp(100 + i * 100, archReveal.visible), background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "2.5rem" }}>
                <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "3.5rem", fontWeight: 500, color: "rgba(212,146,74,0.15)", lineHeight: 1, marginBottom: "1.5rem" }}>{step.num}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F5F0E8", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.6)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USE CASE GRID ═════════════════════════ */}
      <section ref={ucReveal.ref} style={{ background: "#F5F0E8", padding: "6rem 3rem", borderTop: "1px solid rgba(24,18,10,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ ...fadeUp(0, ucReveal.visible), display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#B8742E", marginBottom: "0.875rem" }}>Solutions</p>
              <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 500, color: "#18120A", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Raising the bar<br />for every use case.
              </h2>
            </div>
            <Link href="/capabilities" style={{ fontSize: "0.825rem", fontWeight: 600, color: "#B8742E", textDecoration: "none", letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0, marginBottom: "0.25rem" }}>
              View All Capabilities →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
            {USECASES.map((u, i) => (
              <div key={u.title} className="uc-card" style={{ ...fadeUp(i * 90, ucReveal.visible), background: "#FBF9F5", border: "1px solid rgba(24,18,10,0.07)", borderRadius: 8, padding: "1.75rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{u.icon}</div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#18120A", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{u.title}</h3>
                <p style={{ fontSize: "0.775rem", color: "#7A6E64", lineHeight: 1.65, marginBottom: "1.25rem" }}>{u.desc}</p>
                <Link href={u.link} style={{ fontSize: "0.775rem", fontWeight: 600, color: "#B8742E", textDecoration: "none" }}>Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════ */}
      <section ref={ctaReveal.ref} style={{ background: "#F5F0E8", padding: "7rem 3rem" }}>
        <div style={{ ...fadeUp(0, ctaReveal.visible), maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(2.25rem,4vw,3.25rem)", fontWeight: 500, color: "#18120A", letterSpacing: "-0.035em", marginBottom: "1.25rem", lineHeight: 1.08 }}>
            Protect your business<br />before you sign.
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#5A5048", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 2.75rem" }}>
            Upload your next contract for a free statutory compliance audit — no account required.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <Btn href="/dashboard" dark style={{ color: "#F5F0E8", border: "1.5px solid #18120A" }}>Audit Without Account →</Btn>
            <Btn href="/pricing">View Pricing</Btn>
          </div>
        </div>
      </section>

      {/* ══ RICH FOOTER ════════════════════════════ */}
      <footer style={{ background: "#18120A", padding: "5rem 3rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
            {/* Brand col */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Logo size={24} dark />
                <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#F5F0E8", letterSpacing: "-0.025em" }}>ContractSense</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.35)", lineHeight: 1.7, maxWidth: 260, marginBottom: "1.5rem" }}>
                AI-powered contract intelligence built for Indian MSMEs. Statutory compliance, regional translations, and boardroom-ready reports.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {["GH","LI","TW"].map(s => (
                  <div key={s} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "rgba(245,240,232,0.4)", cursor: "pointer" }}>{s}</div>
                ))}
              </div>
            </div>
            {/* Link cols */}
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", marginBottom: "1rem" }}>Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Risk Analysis", href: "/dashboard" },
                  { label: "Translation", href: "/dashboard" },
                  { label: "Legal Library", href: "/dashboard" },
                ].map(link => (
                  <Link key={link.label} href={link.href} style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,240,232,0.85)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.45)")}
                  >{link.label}</Link>
                ))}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", marginBottom: "1rem" }}>Resources</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Capabilities", href: "/capabilities" },
                  { label: "Pricing", href: "/pricing" },
                ].map(link => (
                  <Link key={link.label} href={link.href} style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,240,232,0.85)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.45)")}
                  >{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", marginBottom: "1rem" }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "About", href: "/" },
                  { label: "Privacy Policy", href: "/" },
                  { label: "Terms of Service", href: "/" },
                  { label: "Zero Retention Policy", href: "/" },
                ].map(link => (
                  <Link key={link.label} href={link.href} style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,240,232,0.85)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.45)")}
                  >{link.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.25)" }}>© 2026 ContractSense. All rights reserved. Built for Smart India Hackathon.</span>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["MSME Compliance", "Zero Data Retention", "Indian Contract Act, 1872"].map(t => (
                <span key={t} style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.2)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
