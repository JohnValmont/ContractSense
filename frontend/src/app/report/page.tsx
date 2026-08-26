"use client";

import { useEffect, useState, useRef } from "react";
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

function getRiskColor(level: string) {
  const l = level.toLowerCase();
  if (l.includes("high"))   return "#dc2626";
  if (l.includes("medium")) return "#d97706";
  return "#16a34a";
}

function getRiskBg(level: string) {
  const l = level.toLowerCase();
  if (l.includes("high"))   return "#fef2f2";
  if (l.includes("medium")) return "#fffbeb";
  return "#f0fdf4";
}

export default function Report() {
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [activeIdx, setActiveIdx]     = useState<number>(0);
  const [filterLevel, setFilterLevel] = useState<string>("All");
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
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--canvas)", flexDirection:"column", gap:"1rem" }}>
        <div style={{ width:32, height:32, border:"2px solid var(--glass-border)", borderTopColor:"var(--ink)", borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
        <p style={{ color:"var(--ink-muted)", fontSize:"0.875rem", fontFamily:"var(--font-sans)" }}>Loading report…</p>
      </div>
    );
  }

  const highCount = result.clauses.filter(c => c.risk_level.toLowerCase().includes("high")).length;
  const medCount  = result.clauses.filter(c => c.risk_level.toLowerCase().includes("medium")).length;
  const lowCount  = result.clauses.filter(c => !c.risk_level.toLowerCase().includes("high") && !c.risk_level.toLowerCase().includes("medium")).length;

  const filtered = filterLevel === "All"
    ? result.clauses
    : result.clauses.filter(c => c.risk_level.toLowerCase().includes(filterLevel.toLowerCase()));

  const activeClause = filtered[activeIdx] ?? result.clauses[0];

  const scoreColor = result.risk_score < 30 ? "#16a34a" : result.risk_score < 70 ? "#d97706" : "#dc2626";
  const scoreLabel = result.risk_score < 30 ? "Low Risk"  : result.risk_score < 70 ? "Moderate Risk" : "High Risk";

  return (
    <div className={styles.shell}>

      {/* ══ TOP NAV BAR ══════════════════════════════════ */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/dashboard" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard
          </Link>
          <span className={styles.topbarDivider} />
          <span className={styles.topbarTitle}>Legal Risk Analysis Report</span>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.exportBtn} onClick={() => window.print()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
          <Link href="/dashboard" className={styles.newBtn}>
            Analyze Another
          </Link>
        </div>
      </header>

      {/* ══ BODY: LEFT PANEL + RIGHT DETAIL ══════════════ */}
      <div className={styles.body} ref={reportRef}>

        {/* ── LEFT PANEL ─────────────────────────────── */}
        <aside className={styles.leftPanel}>

          {/* Risk Score Card */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreNumber} style={{ color: scoreColor }}>
              {result.risk_score}
            </div>
            <div className={styles.scoreDenom}>/100</div>
            <div className={styles.scoreLabel} style={{ color: scoreColor }}>{scoreLabel}</div>
            <div className={styles.scoreMeterTrack}>
              <div className={styles.scoreMeterFill} style={{ width: `${result.risk_score}%`, background: scoreColor }} />
            </div>
            <div className={styles.scoreCounts}>
              <span style={{ color:"#dc2626" }}>●&nbsp;{highCount} High</span>
              <span style={{ color:"#d97706" }}>●&nbsp;{medCount} Med</span>
              <span style={{ color:"#16a34a" }}>●&nbsp;{lowCount} Low</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className={styles.summaryCard}>
            <div className={styles.panelLabel}>Executive Summary</div>
            <p className={styles.summaryText}>{result.summary}</p>
          </div>

          {/* Filter */}
          <div className={styles.filterRow}>
            {["All","High","Medium","Low"].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filterLevel === f ? styles.filterActive : ""}`}
                onClick={() => { setFilterLevel(f); setActiveIdx(0); }}
              >{f}</button>
            ))}
          </div>

          {/* Clause list */}
          <div className={styles.clauseList}>
            {filtered.map((clause, idx) => (
              <button
                key={idx}
                className={`${styles.clauseListItem} ${activeIdx === idx ? styles.clauseListActive : ""}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span
                  className={styles.clauseListDot}
                  style={{ background: getRiskColor(clause.risk_level) }}
                />
                <span className={styles.clauseListTitle}>{clause.title}</span>
                <span
                  className={styles.clauseListBadge}
                  style={{ background: getRiskBg(clause.risk_level), color: getRiskColor(clause.risk_level) }}
                >
                  {clause.risk_level}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── RIGHT DETAIL PANE ──────────────────────── */}
        <main className={styles.detailPane}>
          {activeClause ? (
            <div className={styles.detailCard} key={activeClause.title}>

              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailTitle}>{activeClause.title}</h2>
                  <span
                    className={styles.detailBadge}
                    style={{ background: getRiskBg(activeClause.risk_level), color: getRiskColor(activeClause.risk_level) }}
                  >
                    {activeClause.risk_level} Risk
                  </span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>Original Clause Text</div>
                <div className={styles.detailContent}>{activeClause.content}</div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>⚖ Statutory Analysis</div>
                <div className={styles.detailExplanation}>{activeClause.explanation}</div>
              </div>

              {activeClause.redline_suggestion && (
                <div className={styles.detailSection}>
                  <div className={styles.detailLabel}>✏ Proposed Redline</div>
                  <div className={styles.detailRedline}>{activeClause.redline_suggestion}</div>
                </div>
              )}

              {/* Navigation */}
              <div className={styles.detailNav}>
                <button
                  className={styles.detailNavBtn}
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                >
                  ← Previous
                </button>
                <span className={styles.detailNavCount}>{activeIdx + 1} of {filtered.length}</span>
                <button
                  className={styles.detailNavBtn}
                  disabled={activeIdx === filtered.length - 1}
                  onClick={() => setActiveIdx(i => Math.min(filtered.length - 1, i + 1))}
                >
                  Next →
                </button>
              </div>

            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <p>Select a clause from the list to view details.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
