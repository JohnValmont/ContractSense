import Link from "next/link";
import Logo from "../components/Logo";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", background: "#FDFCF8", color: "#18120A", fontFamily: "var(--font-sans)" }}>
      <header style={{ borderBottom: "1px solid rgba(24,18,10,0.06)", background: "#F5F0E8" }}>
        <nav style={{ maxWidth: 800, margin: "0 auto", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Logo size={28} />
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "#18120A" }}>ContractSense</span>
          </Link>
          <Link href="/" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#B8742E", textDecoration: "none" }}>← Back to Home</Link>
        </nav>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "2.5rem", fontWeight: 500, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Privacy & Zero Retention Policy</h1>
          <p style={{ color: "rgba(24,18,10,0.5)", fontSize: "0.85rem" }}>Last Updated: August 28, 2026</p>
        </div>

        <div style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#4A4036", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#18120A", marginBottom: "0.75rem" }}>1. The "Zero Retention" Guarantee</h2>
            <p>At ContractSense, we process sensitive legal and financial agreements. We operate on a strict <strong>Zero Data Retention Policy</strong>. This means:</p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>Files uploaded for analysis are processed exclusively in volatile memory (RAM).</li>
              <li>Once the risk analysis report is generated and the session ends, the file is instantaneously and permanently purged from our servers.</li>
              <li>We do not use your proprietary contracts to train our base AI models.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#18120A", marginBottom: "0.75rem" }}>2. Information We Collect</h2>
            <p>To provide our services, we only collect the minimum required information:</p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><strong>Account Information:</strong> Name, email address, and company details when you register.</li>
              <li><strong>Usage Data:</strong> Anonymous telemetry regarding the features used (e.g., "Translation feature accessed") to improve service reliability.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#18120A", marginBottom: "0.75rem" }}>3. Data Security & Encryption</h2>
            <p>All data in transit is encrypted using industry-standard TLS 1.3. We employ advanced infrastructure security to ensure that while your contract is being analyzed in memory, it remains isolated and inaccessible to unauthorized processes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#18120A", marginBottom: "0.75rem" }}>4. Third-Party Subprocessors</h2>
            <p>We utilize secure, enterprise-grade LLM APIs to perform statutory analysis. We have executed strict Data Processing Agreements (DPAs) with these providers ensuring that data passed via API is not retained, logged, or used for model training.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#18120A", marginBottom: "0.75rem" }}>5. Contact Us</h2>
            <p>For any privacy-related concerns or to request the deletion of your account data, please contact our compliance team at <strong>privacy@contractsense.com</strong>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
