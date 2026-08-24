import Link from "next/link";
import styles from "./page.module.css";

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
    title: "Multi-Language Support",
    desc: "Generate your compliance reports and redline suggestions in English or key regional Indian languages for better local stakeholder alignment.",
  },
  {
    icon: "🔒",
    title: "Strict Confidentiality",
    desc: "Contracts are processed securely in-memory and are never stored on our servers. Your sensitive commercial documents remain strictly confidential.",
  },
  {
    icon: "⚡",
    title: "Instant Legal Analysis",
    desc: "Comprehensive results in under 30 seconds for most contracts. Export the full risk report as a professional PDF or view it in our interactive UI.",
  },
];

const steps = [
  { title: "Upload your contract", desc: "Drag and drop or browse a PDF — vendor agreements, purchase orders, service contracts, NDAs." },
  { title: "System extracts clauses", desc: "Our OCR and NLP pipeline identifies and categorises each clause systematically." },
  { title: "Risk is evaluated against law", desc: "Clauses are benchmarked against the MSME Development Act, 2006, payment norms, and fair-trade standards." },
  { title: "Download Professional Report", desc: "Review clause-by-clause risk badges, read plain-language explanations, and download a formal PDF memo." },
];

export default function Home() {
  return (
    <main className={styles.main}>

      {/* ── Nav ──────────────────────────────── */}
      <nav className={styles.nav}>
        <span className={styles.logo}>ContractSense</span>
        <span className={styles.navBadge}>Enterprise Legal Compliance</span>
        <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
          Get Started
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <section className={`${styles.hero} animate-fade-in`}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          MSME Development Act 2006 Compliance · Zero Retention
        </div>
        <h1 className={styles.title}>
          Identify Every Risk in<br />Your Vendor Contracts
        </h1>
        <p className={styles.subtitle}>
          ContractSense scans MSME vendor contracts, flags unfair clauses, cites the exact statutory protections, and generates formal redline suggestions in under 30 seconds.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className="btn-primary">
            Analyze a Contract
          </Link>
          <a href="#how-it-works" className="btn-secondary">
            Learn More
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
      <h2 className={styles.sectionTitle}>Equip your procurement team</h2>
      <p className={styles.sectionSub}>Built specifically for Indian MSMEs navigating complex enterprise agreements.</p>
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
        <h2>Ready to protect your commercial interests?</h2>
        <p>Ensure regulatory compliance and fair trade terms with automated analysis.</p>
        <Link href="/dashboard" className="btn-primary">
          Analyze a Document
        </Link>
      </div>

      <footer className={styles.footer}>
        ContractSense · Legal Tech Solutions · Strict Data Confidentiality
      </footer>
    </main>
  );
}
