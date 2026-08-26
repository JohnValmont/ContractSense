"use client";

import { useState } from "react";
import styles from "./FeaturesShowcase.module.css";

const features = [
  {
    id: "msme",
    title: "Statutory Compliance & MSME Engine",
    desc: "The engine specifically isolates payment terms and benchmarks them against Section 15 of the MSME Act, 2006, instantly flagging anything exceeding the 45-day statutory limit. It cross-references the Indian Contract Act, 1872 for voidable clauses.",
    visual: (
      <div className={styles.engineVisual}>
        <div className={styles.codeWindow}>
          <div className={styles.windowHeader}>
            <div className={styles.macDot} />
            <div className={styles.macDot} />
            <div className={styles.macDot} />
          </div>
          <div className={styles.codeContent}>
            <span style={{ color: "#c678dd" }}>const</span> <span style={{ color: "#e5c07b" }}>payment_terms</span> = <span style={{ color: "#98c379" }}>"90 days"</span>;<br/>
            <span style={{ color: "#c678dd" }}>if</span> (terms &gt; <span className={styles.highlightRed}>45</span>) {'{'}
            <br/>&nbsp;&nbsp;<span style={{ color: "#61afef" }}>flagViolation</span>(MSMED_ACT_SEC_15);<br/>
            {'}'}
          </div>
        </div>
        <div className={styles.engineAnalysis}>
          <div className={styles.analysisBadge}>
            <div className={styles.pulseDot} />
            High Risk Identified
          </div>
          <div className={styles.analysisText}>
            Payment term of 90 days violates statutory 45-day limit. Clause is voidable under Section 15.
          </div>
        </div>
      </div>
    )
  },
  {
    id: "translate",
    title: "Precision Regional Legal Translation",
    desc: "Proprietary translation layer converts complex enterprise agreements into Hindi, Marathi, Bengali, Tamil, Telugu, and Urdu while maintaining strict jurisdictional tone and formatting, ensuring local vendors fully comprehend what they sign.",
    visual: (
      <div className={styles.translationVisual}>
        <div className={styles.transScanner} />
        <div className={styles.transPane}>
          <div className={styles.transLabel}>English (Original)</div>
          <div className={styles.transText}>
            Neither party shall be liable for any delay or failure to perform its obligations under this Agreement if such delay is due to Force Majeure.
          </div>
        </div>
        <div className={styles.transPane} style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
          <div className={styles.transLabel} style={{ color: 'var(--gold)' }}>Hindi (Translated)</div>
          <div className={styles.transText}>
            यदि ऐसी देरी अप्रत्याशित घटना (Force Majeure) के कारण होती है, तो कोई भी पक्ष इस समझौते के तहत...
          </div>
        </div>
      </div>
    )
  },
  {
    id: "reliability",
    title: "High-Availability Audit Infrastructure",
    desc: "Engineered for zero-downtime enterprise deployment. Our deterministic routing engine operates across a redundant network cascade, instantly hot-swapping processing nodes during latency spikes to guarantee sub-30-second audit turnarounds under peak loads.",
    visual: (
      <div className={styles.topologyVisual}>
        <div className={styles.serverNode}>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeName}>Mumbai (ap-south-1)</span>
            <span className={styles.nodeMetrics}>Latency: 14ms | Load: 98%</span>
          </div>
          <div className={styles.statusIndicator} style={{ background: '#ef4444', boxShadow: '0 0 15px #ef4444' }} />
        </div>
        <div className={styles.serverNode} style={{ opacity: 0.5 }}>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeName}>Singapore (ap-southeast-1)</span>
            <span className={styles.nodeMetrics}>Routing...</span>
          </div>
        </div>
        <div className={`${styles.serverNode} ${styles.nodeActive}`}>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeName}>London (eu-west-2)</span>
            <span className={styles.nodeMetrics}>Latency: 42ms | Active Node</span>
          </div>
          <div className={styles.statusIndicator} />
        </div>
      </div>
    )
  },
  {
    id: "export",
    title: "Boardroom-Ready PDF Export",
    desc: "Instantly export a professionally formatted risk memo. It includes automated clause remediation (redlines) with precise statutory cross-references, giving your procurement team exactly what they need to negotiate secure, compliant terms.",
    visual: (
      <div className={styles.exportVisual}>
        <div className={styles.docStack} style={{ transform: 'translateZ(-40px) rotateY(-15deg) rotateX(10deg)', opacity: 0.2 }} />
        <div className={styles.docStack} style={{ transform: 'translateZ(-20px) rotateY(-15deg) rotateX(10deg)', opacity: 0.5 }} />
        <div className={styles.docStack}>
          <div className={styles.docHeader}>
            <div className={styles.docLogo} />
            <div>
              <div className={styles.docTitle}>Risk Audit Memo</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Generated by ContractSense</div>
            </div>
          </div>
          <div className={styles.docSkeleton}>
            <div className={styles.skelLine} style={{ width: '100%' }} />
            <div className={styles.skelLine} style={{ width: '85%' }} />
            <div className={`${styles.skelLine} ${styles.skelRed}`} style={{ width: '90%', height: '24px', marginTop: '16px' }} />
            <div className={styles.skelLine} style={{ width: '60%', marginTop: '16px' }} />
            <div className={styles.skelLine} style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    )
  }
];

export default function FeaturesShowcase() {
  const [activeId, setActiveId] = useState(features[0].id);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Platform Capabilities</div>
        <h2 className={styles.title}>
          Architected for precision.<br />Built for MSMEs.
        </h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          {features.map((f) => {
            const isActive = activeId === f.id;
            return (
              <button
                key={f.id}
                className={`${styles.navItem} ${isActive ? styles.activeItem : ""}`}
                onClick={() => setActiveId(f.id)}
                onMouseEnter={() => setActiveId(f.id)}
              >
                <h3 className={styles.navTitle}>{f.title}</h3>
                <p className={styles.navDesc}>{f.desc}</p>
              </button>
            );
          })}
        </div>

        <div className={styles.viewer}>
          {features.map((f) => (
            <div
              key={f.id}
              className={`${styles.visualWrapper} ${activeId === f.id ? styles.visualActive : ""}`}
            >
              {f.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
