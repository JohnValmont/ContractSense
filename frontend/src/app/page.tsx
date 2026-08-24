import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>ContractSense</h1>
        <p className={styles.subtitle}>
          AI-powered clause-risk analyzer designed for Indian MSMEs. Instantly evaluate vendor contracts for unfair terms and compliance with the MSME Development Act.
        </p>
        <div className={styles.ctaContainer}>
          <Link href="/dashboard" className="btn-primary delay-100 animate-fade-in">
            Analyze a Contract
          </Link>
          <a href="#features" className="btn-secondary delay-200 animate-fade-in">
            Learn More
          </a>
        </div>
      </header>

      <section id="features" className={`${styles.features} animate-fade-in delay-300`}>
        <div className={`glass-panel ${styles.featureCard}`}>
          <div className={styles.featureIcon}>🔍</div>
          <h3 className={styles.featureTitle}>Smart Clause Extraction</h3>
          <p className={styles.featureDesc}>
            Upload any scanned or digital PDF contract. Our AI automatically extracts and categorizes key commercial and legal clauses.
          </p>
        </div>
        <div className={`glass-panel ${styles.featureCard}`}>
          <div className={styles.featureIcon}>⚖️</div>
          <h3 className={styles.featureTitle}>MSME Risk Scoring</h3>
          <p className={styles.featureDesc}>
            Clauses are instantly scored based on Indian commercial conventions and MSME statutory protections (e.g., delayed payments).
          </p>
        </div>
        <div className={`glass-panel ${styles.featureCard}`}>
          <div className={styles.featureIcon}>✍️</div>
          <h3 className={styles.featureTitle}>Redline Suggestions</h3>
          <p className={styles.featureDesc}>
            Don't just identify risk—resolve it. Get plain-language explanations and auto-generated redline suggestions to negotiate fairer terms.
          </p>
        </div>
      </section>
    </main>
  );
}
