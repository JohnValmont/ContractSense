import Link from "next/link";
import styles from "./page.module.css";

const features = [
  {
    icon: "🔍",
    title: "Smart Clause Extraction",
    desc: "Upload any PDF contract. Our AI automatically extracts and categorises every key commercial and legal clause — payment terms, IP, liability, termination, and more.",
  },
  {
    icon: "⚖️",
    title: "MSME Act Risk Scoring",
    desc: "Each clause is scored against the MSME Development Act, 2006, the Indian Contract Act, 1872, and industry benchmarks. Get a single risk score from 0–100.",
  },
  {
    icon: "✍️",
    title: "AI Redline Suggestions",
    desc: "Don't just identify risk — resolve it. Get plain-language redline rewrites with specific statutory references, ready to copy-paste into negotiations.",
  },
  {
    icon: "🛡️",
    title: "Multi-AI Fallback Chain",
    desc: "Powered by Gemini 2.0 Flash as primary, with automatic fallback to Gemini 1.5 Flash → Gemini 1.5 Pro → GPT-4o. Zero downtime during API outages.",
  },
  {
    icon: "🔒",
    title: "Zero Data Retention",
    desc: "Contracts are processed in-memory and never stored on our servers. Your sensitive commercial documents remain strictly confidential.",
  },
  {
    icon: "⚡",
    title: "Instant Analysis",
    desc: "Results in under 30 seconds for most contracts. Export the full risk report as a structured JSON or view it in our interactive UI.",
  },
];

const steps = [
  { title: "Upload your contract", desc: "Drag and drop or browse a PDF — vendor agreements, purchase orders, service contracts, NDAs." },
  { title: "AI extracts every clause", desc: "Our pipeline runs pdfplumber OCR + Gemini NLP to identify and categorise each clause in seconds." },
  { title: "Risk is scored against MSME law", desc: "Clauses are benchmarked against the MSME Development Act, 2006, payment norms, and fair-trade standards." },
  { title: "Get your redline report", desc: "Review clause-by-clause risk badges, read plain-language explanations, and copy suggested redlines." },
];

export default function Home() {
  return (
    <main className={styles.main}>

      {/* ── Nav ──────────────────────────────── */}
      <nav className={styles.nav}>
        <span className={styles.logo}>ContractSense</span>
        <span className={styles.navBadge}>MSME Hackathon 2026 · SW-59</span>
        <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
          Try it Free →
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <section className={`${styles.hero} animate-fade-in`}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          AI-Powered · MSME Development Act 2006 · Zero Retention
        </div>
        <h1 className={styles.title}>
          Know Every Risk in<br />Your Vendor Contract
        </h1>
        <p className={styles.subtitle}>
          ContractSense uses Gemini 2.0 AI to scan MSME vendor contracts, flag unfair clauses, cite the exact law that protects you, and generate redline suggestions in under 30 seconds.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className="btn-primary">
            Analyze a Contract →
          </Link>
          <a href="#how-it-works" className="btn-secondary">
            See How It Works
          </a>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────── */}
      <div className={`${styles.stats} animate-fade-in delay-100`}>
        <div className={styles.stat}>
          <div className={styles.statValue}>45 Days</div>
          <div className={styles.statLabel}>MSME payment deadline (Sec. 15)</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>&lt; 30s</div>
          <div className={styles.statLabel}>Average analysis time</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>3 AI</div>
          <div className={styles.statLabel}>Models in fallback chain</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>0</div>
          <div className={styles.statLabel}>Documents stored on server</div>
        </div>
      </div>

      {/* ── Features ─────────────────────────── */}
      <h2 className={styles.sectionTitle}>Everything you need to negotiate fairly</h2>
      <p className={styles.sectionSub}>Built specifically for Indian MSMEs navigating complex vendor agreements.</p>
      <div className={`${styles.features} animate-fade-in delay-200`}>
        {features.map((f) => (
          <div key={f.title} className={`glass-panel ${styles.featureCard}`}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── How it works ─────────────────────── */}
      <h2 className={styles.sectionTitle} style={{ marginTop: "5rem" }} id="how-it-works">How it works</h2>
      <div className={`${styles.howItWorks} animate-fade-in delay-300`}>
        {steps.map((s, i) => (
          <div key={i} className={styles.step}>
            <span className={styles.stepNum}>{i + 1}</span>
            <div className={styles.stepContent}>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA Banner ───────────────────────── */}
      <div className={`glass-panel ${styles.ctaBanner} animate-fade-in delay-300`}>
        <h2>Ready to protect your business?</h2>
        <p>Upload your first contract free. No login required for the demo.</p>
        <Link href="/dashboard" className="btn-primary">
          Analyze My Contract →
        </Link>
      </div>

      <footer className={styles.footer}>
        ContractSense · Built for MSME Hackathon SW-59 · Powered by Gemini 2.0 · Data never stored
      </footer>
    </main>
  );
}
