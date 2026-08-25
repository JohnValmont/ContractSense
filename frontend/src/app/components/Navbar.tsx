"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { email, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          ContractSense
        </Link>
        <div className={styles.links}>
          <Link href="/#how-it-works" className={styles.link}>How it Works</Link>
          
          {email ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>{email}</span>
              <button onClick={logout} className="btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                Log Out
              </button>
              <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
                Analyze →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/login" className={styles.link}>Log In / Create Account</Link>
              <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
                Analyze Without Account →
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
