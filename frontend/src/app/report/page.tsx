"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface Clause {
  title: string;
  content: string;
  risk_level: string;
  explanation: string;
  redline_suggestion: string | null;
}

interface AnalysisResult {
  summary: string;
  risk_score: number;
  clauses: Clause[];
}

export default function Report() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("contract_analysis");
    if (data) {
      setResult(JSON.parse(data));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!result) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>;

  const getRiskColor = (score: number) => {
    if (score < 30) return "var(--success-color)";
    if (score < 70) return "var(--warning-color)";
    return "var(--danger-color)";
  };

  const getBadgeClass = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes("high")) return styles.badgeHigh;
    if (l.includes("medium")) return styles.badgeMedium;
    return styles.badgeLow;
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <div>
          <h1 className={styles.title}>Contract Analysis Report</h1>
          <p style={{ color: "#94a3b8" }}>MSME Vendor Contract Evaluation</p>
        </div>
        <div className={`glass-panel ${styles.scoreCard}`}>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem", textTransform: "uppercase" }}>Overall Risk</div>
          <div className={styles.scoreValue} style={{ color: getRiskColor(result.risk_score) }}>
            {result.risk_score}/100
          </div>
        </div>
      </header>

      <div className={`glass-panel ${styles.summary} animate-fade-in delay-100`}>
        <div className={styles.contentLabel}>Executive Summary</div>
        <p>{result.summary}</p>
      </div>

      <div className={styles.clausesGrid}>
        {result.clauses.map((clause, idx) => (
          <div key={idx} className={`glass-panel ${styles.clauseCard} animate-fade-in delay-200`}>
            <div className={styles.clauseHeader}>
              <h3 className={styles.clauseTitle}>{clause.title}</h3>
              <span className={`${styles.badge} ${getBadgeClass(clause.risk_level)}`}>
                {clause.risk_level} Risk
              </span>
            </div>
            
            <div>
              <div className={styles.contentLabel}>Original Clause</div>
              <div className={styles.originalContent}>{clause.content}</div>
            </div>

            <div>
              <div className={styles.contentLabel}>MSME Act Impact / Explanation</div>
              <div className={styles.explanation}>{clause.explanation}</div>
            </div>

            {clause.redline_suggestion && (
              <div>
                <div className={styles.contentLabel}>Suggested Redline</div>
                <div className={styles.redline}>{clause.redline_suggestion}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <Link href="/dashboard" className="btn-secondary">
          Analyze Another Contract
        </Link>
      </div>
    </div>
  );
}
