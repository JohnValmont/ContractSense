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

function RiskMeter({ score }: { score: number }) {
  const color = score < 30 ? "#22c55e" : score < 70 ? "#eab308" : "#ef4444";
  const label = score < 30 ? "Low Risk" : score < 70 ? "Moderate Risk" : "High Risk";

  return (
    <div className={styles.meterWrap}>
      <div className={styles.meterLabel}>{label}</div>
      <div className={styles.meterTrack}>
        <div
          className={styles.meterFill}
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 12px ${color}80` }}
        />
      </div>
      <div className={styles.meterScore} style={{ color }}>{score}/100</div>
    </div>
  );
}

export default function Report() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied]  = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("contract_analysis");
    if (data) {
      setResult(JSON.parse(data));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!result) {
    return (
      <div style={{ padding: "8rem", textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        Loading report...
      </div>
    );
  }

  const getBadgeClass = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes("high"))   return styles.badgeHigh;
    if (l.includes("medium")) return styles.badgeMedium;
    return styles.badgeLow;
  };

  const handleExport = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highCount   = result.clauses.filter(c => c.risk_level.toLowerCase().includes("high")).length;
  const medCount    = result.clauses.filter(c => c.risk_level.toLowerCase().includes("medium")).length;
  const lowCount    = result.clauses.filter(c => !c.risk_level.toLowerCase().includes("high") && !c.risk_level.toLowerCase().includes("medium")).length;

  return (
    <div className={styles.container}>

      {/* ── Page header ───────────────────── */}
      <header className={`${styles.header} animate-fade-in`}>
        <div>
          <h1 className={styles.title}>Analysis Report</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
            {result.clauses.length} clauses analysed · MSME Development Act 2006
          </p>
        </div>
        <button className="btn-secondary" onClick={handleExport} style={{ fontSize: "0.875rem" }}>
          {copied ? "✅ Copied!" : "📋 Export JSON"}
        </button>
      </header>

      {/* ── Risk overview strip ───────────── */}
      <div className={`glass-panel ${styles.overviewStrip} animate-fade-in delay-100`}>
        <RiskMeter score={result.risk_score} />
        <div className={styles.clauseCounts}>
          <div className={styles.countBadge} style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
            🔴 {highCount} High
          </div>
          <div className={styles.countBadge} style={{ background: "rgba(234,179,8,0.1)", color: "#fde047", border: "1px solid rgba(234,179,8,0.2)" }}>
            🟡 {medCount} Medium
          </div>
          <div className={styles.countBadge} style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>
            🟢 {lowCount} Low
          </div>
        </div>
      </div>

      {/* ── Executive summary ─────────────── */}
      <div className={`glass-panel ${styles.summary} animate-fade-in delay-100`}>
        <div className={styles.sectionLabel}>Executive Summary</div>
        <p>{result.summary}</p>
      </div>

      {/* ── Clause cards ──────────────────── */}
      <div className={styles.sectionLabel} style={{ marginBottom: "1rem" }}>
        Clause-by-Clause Breakdown
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
              <div className={styles.fieldLabel}>Original Clause</div>
              <div className={styles.originalContent}>{clause.content}</div>
            </div>

            <div>
              <div className={styles.fieldLabel}>⚖️ MSME Act Analysis</div>
              <div className={styles.explanation}>{clause.explanation}</div>
            </div>

            {clause.redline_suggestion && (
              <div>
                <div className={styles.fieldLabel}>✏️ Suggested Redline</div>
                <div className={styles.redline}>{clause.redline_suggestion}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ───────────────────── */}
      <div className={styles.bottomCta}>
        <Link href="/dashboard" className="btn-primary">
          ← Analyze Another Contract
        </Link>
        <Link href="/" className="btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
