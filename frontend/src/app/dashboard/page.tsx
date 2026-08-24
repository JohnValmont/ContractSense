"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Analysis failed.");
      }

      const data = await res.json();
      
      // Store result in sessionStorage to pass to the report page
      sessionStorage.setItem("contract_analysis", JSON.stringify(data));
      router.push("/report");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload Contract</h1>
        <p className={styles.subtitle}>Upload your PDF vendor contract for AI analysis.</p>
      </header>

      <div className={`glass-panel ${styles.uploadCard} animate-fade-in`}>
        <div className={styles.uploadIcon}>📄</div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <input 
          type="file" 
          accept="application/pdf" 
          id="contract-upload" 
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        
        <label htmlFor="contract-upload" className={`btn-secondary ${styles.uploadBtn}`}>
          {file ? file.name : "Choose PDF File"}
        </label>

        <button 
          className="btn-primary" 
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ opacity: (!file || loading) ? 0.6 : 1 }}
        >
          {loading ? <span className={styles.loader}></span> : "Analyze Contract"}
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
         <Link href="/" style={{ color: "var(--accent-color)" }}>&larr; Back Home</Link>
      </div>
    </div>
  );
}
