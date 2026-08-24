"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
// @ts-ignore
import html2pdf from "html2pdf.js";

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
  const color = score < 30 ? "#16a34a" : score < 70 ? "#d97706" : "#dc2626";
  const label = score < 30 ? "Low Risk" : score < 70 ? "Moderate Risk" : "High Risk";

  return (
    <div className={styles.meterWrap}>
      <div className={styles.meterLabel}>{label}</div>
      <div className={styles.meterTrack}>
        <div
          className={styles.meterFill}
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <div className={styles.meterScore} style={{ color }}>{score}/100</div>
    </div>
  );
}

export default function Report() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

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
        Loading formal report...
      </div>
    );
  }

  const getBadgeClass = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes("high"))   return styles.badgeHigh;
    if (l.includes("medium")) return styles.badgeMedium;
    return styles.badgeLow;
  };

  const handleExportPDF = () => {
    const element = reportRef.current;
    if (!element) return;
    const opt = {
      margin:       0.5,
      filename:     'Contract_Risk_Analysis_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const highCount   = result.clauses.filter(c => c.risk_level.toLowerCase().includes("high")).length;
  const medCount    = result.clauses.filter(c => c.risk_level.toLowerCase().includes("medium")).length;
  const lowCount    = result.clauses.filter(c => !c.risk_level.toLowerCase().includes("high") && !c.risk_level.toLowerCase().includes("medium")).length;

  return (
    <div className={styles.container}>
      
      <div className={styles.reportWrapper} ref={reportRef}>
        {/* ── Page header ───────────────────── */}
        <header className={`${styles.header} animate-fade-in`}>
          <div>
            <h1 className={styles.title}>Legal Risk Analysis Report</h1>
            <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
              {result.clauses.length} clauses evaluated against the MSME Development Act, 2006
            </p>
          </div>
          <button className="btn-secondary" onClick={handleExportPDF} data-html2canvas-ignore>
            📄 Download PDF Report
          </button>
        </header>

        {/* ── Risk overview strip ───────────── */}
        <div className={`${styles.overviewStrip} animate-fade-in delay-100`}>
          <RiskMeter score={result.risk_score} />
          <div className={styles.clauseCounts}>
            <div className={styles.countBadge} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}>
              🔴 {highCount} High
            </div>
            <div className={styles.countBadge} style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>
              🟡 {medCount} Medium
            </div>
            <div className={styles.countBadge} style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
              🟢 {lowCount} Low
            </div>
          </div>
        </div>

        {/* ── Executive summary ─────────────── */}
        <div className={`${styles.summary} animate-fade-in delay-100`}>
          <div className={styles.sectionLabel}>Executive Summary</div>
          <p>{result.summary}</p>
        </div>

        {/* ── Clause cards ──────────────────── */}
        <div className={styles.sectionLabel} style={{ marginBottom: "1rem" }}>
          Clause-by-Clause Evaluation
        </div>
        <div className={styles.clausesGrid}>
          {result.clauses.map((clause, idx) => (
            <div key={idx} className={`${styles.clauseCard} animate-fade-in delay-200`}>
              <div className={styles.clauseHeader}>
                <h3 className={styles.clauseTitle}>{clause.title}</h3>
                <span className={`${styles.badge} ${getBadgeClass(clause.risk_level)}`}>
                  {clause.risk_level} Risk
                </span>
              </div>

              <div>
                <div className={styles.fieldLabel}>Original Clause Text</div>
                <div className={styles.originalContent}>{clause.content}</div>
              </div>

              <div>
                <div className={styles.fieldLabel}>⚖️ Statutory Analysis</div>
                <div className={styles.explanation}>{clause.explanation}</div>
              </div>

              {clause.redline_suggestion && (
                <div>
                  <div className={styles.fieldLabel}>✏️ Proposed Redline</div>
                  <div className={styles.redline}>{clause.redline_suggestion}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────── */}
      <div className={styles.bottomCta} data-html2canvas-ignore>
        <Link href="/dashboard" className="btn-primary">
          Analyze Another Document
        </Link>
        <Link href="/" className="btn-secondary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
