"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
// @ts-ignore
import html2pdf from "html2pdf.js";

interface TranslationResult {
  translated_title: string;
  translated_text: string;
}

export default function TranslationReport() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("contract_translation");
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
        Processing Full Document Translation...
      </div>
    );
  }

  const handleExportPDF = () => {
    const element = reportRef.current;
    if (!element) return;
    const opt = {
      margin:       1,
      filename:     'ContractSense_Formal_Translation.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.reportWrapper} ref={reportRef}>
        {/* ── Page header ───────────────────── */}
        <header className={`${styles.header} animate-fade-in`}>
          <div>
            <h1 className={styles.title}>
              {result.translated_title || "Formal Document Translation"}
            </h1>
            <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
              Certified by ContractSense Premium Legal Translation Engine
            </p>
          </div>
          <button className="btn-secondary" onClick={handleExportPDF} data-html2canvas-ignore>
            📄 Download Translated PDF
          </button>
        </header>

        {/* ── Document Body ─────────────── */}
        <div className={`${styles.documentBody} animate-fade-in delay-100`}>
          {result.translated_text}
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────── */}
      <div className="bottomCta animate-fade-in delay-200" style={{ marginTop: "3rem", display: "flex", gap: "1rem" }} data-html2canvas-ignore>
        <Link href="/dashboard" className="btn-primary">
          Translate Another Document
        </Link>
        <Link href="/" className="btn-secondary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
