import { useState } from "react";
import styles from "./LegalResources.module.css";

type Tab = "guidelines" | "glossary" | "templates";

export default function LegalResources() {
  const [activeTab, setActiveTab] = useState<Tab>("guidelines");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Legal Resources Library</h1>
        <p className={styles.subtitle}>
          Access comprehensive compliance guidelines, a plain-English legal glossary, and secure document templates.
        </p>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "guidelines" ? styles.active : ""}`}
          onClick={() => setActiveTab("guidelines")}
        >
          MSME Guidelines
        </button>
        <button
          className={`${styles.tab} ${activeTab === "glossary" ? styles.active : ""}`}
          onClick={() => setActiveTab("glossary")}
        >
          Corporate Glossary
        </button>
        <button
          className={`${styles.tab} ${activeTab === "templates" ? styles.active : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          Document Templates
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === "guidelines" && (
          <div className="animate-fade-in">
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Strict 45-Day Payment Timeline</h3>
              <p className={styles.itemText}>
                Under the MSME Development Act, a buyer must make payment for goods/services within 45 days of acceptance. Any contract clause extending this beyond 45 days is legally void. If the contract does not specify a timeline, the default is 15 days.
              </p>
              <span className={styles.itemRef}>Ref: Section 15, MSMED Act, 2006</span>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Compound Interest on Delayed Payments</h3>
              <p className={styles.itemText}>
                If a buyer fails to pay within the statutory limit, they are legally obligated to pay compound interest with monthly rests to the supplier. This interest rate is set at three times the bank rate notified by the Reserve Bank of India (RBI).
              </p>
              <span className={styles.itemRef}>Ref: Section 16, MSMED Act, 2006</span>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>MSME Samadhaan (Dispute Resolution)</h3>
              <p className={styles.itemText}>
                MSMEs are not forced into expensive corporate arbitration. You can file a claim through the MSME Samadhaan portal to the Micro and Small Enterprises Facilitation Council (MSEFC) for mandatory conciliation and expedited arbitration.
              </p>
              <span className={styles.itemRef}>Ref: Section 18, MSMED Act, 2006</span>
            </div>
          </div>
        )}

        {activeTab === "glossary" && (
          <div className="animate-fade-in">
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Indemnification</h3>
              <p className={styles.itemText}>
                A clause where one party promises to compensate the other for any harm, liability, or loss arising out of the contract. MSMEs should watch out for "uncapped" indemnities that expose them to unlimited financial risk.
              </p>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Limitation of Liability</h3>
              <p className={styles.itemText}>
                A protective clause that caps the maximum financial damages a party must pay if they breach the contract (often capped at the total contract value). Crucial for MSMEs to prevent bankruptcy from a single lawsuit.
              </p>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Severability</h3>
              <p className={styles.itemText}>
                Ensures that if a judge rules one specific clause of the contract is illegal or unenforceable, the rest of the contract remains valid and intact.
              </p>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Force Majeure</h3>
              <p className={styles.itemText}>
                Frees both parties from liability or obligation when an extraordinary event or circumstance beyond their control (e.g., war, strike, pandemic) prevents them from fulfilling their obligations.
              </p>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className={`animate-fade-in ${styles.templatesGrid}`}>
            <div className={styles.templateCard}>
              <h3 className={styles.templateTitle}>Mutual Non-Disclosure (NDA)</h3>
              <p className={styles.templateDesc}>
                A standard, balanced NDA protecting the confidential information of both the MSME and the Enterprise client.
              </p>
              <button className="btn-secondary" style={{ width: "100%", padding: "0.5rem" }} onClick={() => alert("Downloading Secure NDA Template...")}>
                Download .DOCX
              </button>
            </div>
            <div className={styles.templateCard}>
              <h3 className={styles.templateTitle}>MSME-Compliant Vendor Agreement</h3>
              <p className={styles.templateDesc}>
                A master services agreement with built-in Section 15 payment terms and liability caps favoring the vendor.
              </p>
              <button className="btn-secondary" style={{ width: "100%", padding: "0.5rem" }} onClick={() => alert("Downloading Secure Vendor Template...")}>
                Download .DOCX
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
