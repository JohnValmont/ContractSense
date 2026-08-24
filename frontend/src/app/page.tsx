import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";

const features = [
  {
    icon: "🔍",
    title: "Smart Clause Extraction",
    desc: "Upload any PDF contract. Our system automatically extracts and categorises every key commercial and legal clause — payment terms, IP, liability, termination, and more.",
  },
  {
    icon: "⚖️",
    title: "MSME Act Compliance Scoring",
    desc: "Each clause is evaluated against the MSME Development Act, 2006, the Indian Contract Act, 1872, and industry benchmarks to generate a standardized risk score.",
  },
  {
    icon: "✍️",
    title: "Automated Redlining",
    desc: "Don't just identify risk — resolve it. Get plain-language redline rewrites with specific statutory references, ready to be incorporated into negotiations.",
  },
  {
    icon: "🌐",
    title: "Full Document Translation",
    desc: "Break down language barriers. Translate entire contracts into Urdu, Hindi, Bengali, Tamil, Telugu, or Marathi with our dedicated legal translation engine.",
  },
  {
    icon: "🔒",
    title: "Strict Confidentiality",
    desc: "Contracts are processed securely in-memory and are never stored on our servers. Your sensitive commercial documents remain strictly confidential.",
  },
  {
    icon: "🏛️",
    title: "Formal PDF Export",
    desc: "Download your risk analysis reports and full document translations as professionally formatted legal memos, ready for your boardroom or legal counsel.",
  },
];

const steps = [
  { title: "Upload your contract", desc: "Drag and drop or browse a PDF — vendor agreements, purchase orders, service contracts, NDAs." },
  { title: "Select your service", desc: "Choose between deep Risk Analysis against the MSME Act or Full Document Translation into regional languages." },
  { title: "System processes the document", desc: "Our engine identifies clauses, benchmarks against fair-trade standards, or translates with legal precision." },
  { title: "Download Professional Report", desc: "Review the results in our interactive UI and download a formal, boardroom-ready PDF memo." },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />



      {/* ── Hero ─────────────────────────────── */}
      <section className={`${styles.hero} animate-fade-in`}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚖️</div>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Strict Data Confidentiality · Zero Retention
        </div>
        <h1 className={styles.title}>
          Safeguard Your Commercial Interests<br />With Precision Auditing
        </h1>
        <p className={styles.subtitle}>
          ContractSense provides enterprise-grade contract analysis and translation for Indian MSMEs. Instantly audit vendor agreements against the MSME Development Act, 2006, and generate formal compliance redlines.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className="btn-primary">
            Enter Dashboard
          </Link>
          <a href="#how-it-works" className="btn-secondary">
            View Capabilities
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
          <div className={styles.statLabel}>Average analysis turnaround</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>100%</div>
          <div className={styles.statLabel}>Data privacy (No retention)</div>
        </div>
      </div>

      {/* ── Features ─────────────────────────── */}
      <h2 className={styles.sectionTitle}>Elite tools for your procurement team</h2>
      <p className={styles.sectionSub}>Built specifically for Indian MSMEs navigating complex enterprise agreements and language barriers.</p>
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
      <h2 className={styles.sectionTitle} style={{ marginTop: "5rem" }} id="how-it-works">Process Overview</h2>
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
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏛️</div>
        <h2>Ready to audit your commercial agreements?</h2>
        <p>Ensure statutory compliance and fair trade terms with precision legal auditing.</p>
        <Link href="/dashboard" className="btn-primary">
          Access Portal
        </Link>
      </div>

      <footer className={styles.footer}>
        ContractSense · Premium Legal Technology · Strict Data Confidentiality
      </footer>
    </main>
  );
}
