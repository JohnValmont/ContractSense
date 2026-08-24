import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          ContractSense
        </Link>
        <div className={styles.links}>
          <Link href="/#how-it-works" className={styles.link}>How it Works</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
            Analyze →
          </Link>
        </div>
      </div>
    </nav>
  );
}
