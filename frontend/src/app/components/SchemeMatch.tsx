"use client";

import { useState } from "react";

interface Props {
  uiLanguage?: string;
}

const SCHEMES = [
  {
    id: "cgtmse",
    title: "Credit Guarantee Fund Trust (CGTMSE)",
    hiTitle: "क्रेडिट गारंटी फंड ट्रस्ट (CGTMSE)",
    desc: "Collateral-free credit (up to ₹5 Crore) for MSMEs. Eligible for both manufacturing and service sectors.",
    hiDesc: "MSME के लिए संपार्श्विक-मुक्त (बिना गारंटी के) ऋण (₹5 करोड़ तक)। विनिर्माण और सेवा दोनों क्षेत्रों के लिए पात्र।",
    criteria: { sector: ["manufacturing", "service", "all"], type: ["micro", "small", "all"] },
    url: "https://www.cgtmse.in/",
  },
  {
    id: "pmegp",
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    hiTitle: "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
    desc: "Credit-linked subsidy program for setting up new micro-enterprises. Max project cost ₹50 Lakhs (manufacturing) / ₹20 Lakhs (service).",
    hiDesc: "नए सूक्ष्म-उद्यम स्थापित करने के लिए क्रेडिट-लिंक्ड सब्सिडी कार्यक्रम। अधिकतम परियोजना लागत ₹50 लाख (विनिर्माण) / ₹20 लाख (सेवा)।",
    criteria: { sector: ["manufacturing", "service", "all"], type: ["micro", "all"], ageMax: 5 },
    url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
  },
  {
    id: "zed",
    title: "ZED Certification Scheme",
    hiTitle: "ZED प्रमाणन योजना",
    desc: "Financial assistance for MSMEs to adopt Zero Defect Zero Effect (ZED) practices. Helps improve quality and reduce environmental impact.",
    hiDesc: "जीरो डिफेक्ट जीरो इफेक्ट (ZED) प्रथाओं को अपनाने के लिए MSME को वित्तीय सहायता। गुणवत्ता में सुधार और पर्यावरणीय प्रभाव को कम करने में मदद करता है।",
    criteria: { sector: ["manufacturing", "all"], type: ["micro", "small", "medium", "all"] },
    url: "https://zed.msme.gov.in/",
  },
  {
    id: "samadhaan",
    title: "MSME Samadhaan",
    hiTitle: "MSME समाधान",
    desc: "Delayed payment monitoring system. Helps MSMEs file cases against buyers for delayed payments (beyond 45 days).",
    hiDesc: "विलंबित भुगतान निगरानी प्रणाली। MSME को विलंबित भुगतान (45 दिनों से अधिक) के लिए खरीदारों के खिलाफ मामले दर्ज करने में मदद करता है।",
    criteria: { sector: ["manufacturing", "service", "all"], type: ["micro", "small", "all"] },
    url: "https://samadhaan.msme.gov.in/",
  },
  {
    id: "mudra",
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    hiTitle: "प्रधानमंत्री मुद्रा योजना (PMMY)",
    desc: "Loans up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises. Divided into Shishu, Kishore, and Tarun.",
    hiDesc: "गैर-कॉर्पोरेट, गैर-कृषि छोटे/सूक्ष्म उद्यमों के लिए ₹10 लाख तक का ऋण। शिशु, किशोर और तरुण में विभाजित।",
    criteria: { sector: ["manufacturing", "service", "trading", "all"], type: ["micro", "all"], turnoverMax: 50 },
    url: "https://www.mudra.org.in/",
  }
];

export default function SchemeMatch({ uiLanguage = "en" }: Props) {
  const [turnover, setTurnover] = useState<number | "">("");
  const [sector, setSector] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [age, setAge] = useState<number | "">("");
  
  const [results, setResults] = useState<typeof SCHEMES | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const hi = uiLanguage === "hi";

  const handleEvaluate = () => {
    setIsEvaluating(true);
    // Simulate ZKP / Zero-Knowledge local processing delay
    setTimeout(() => {
      const filtered = SCHEMES.filter(s => {
        // Simple heuristic filtering for the sake of the hackathon
        if (s.criteria.sector && !s.criteria.sector.includes(sector) && sector !== "all") return false;
        if (s.criteria.type && !s.criteria.type.includes(type) && type !== "all") return false;
        if (s.criteria.ageMax && typeof age === "number" && age > s.criteria.ageMax) return false;
        if (s.criteria.turnoverMax && typeof turnover === "number" && turnover > s.criteria.turnoverMax) return false;
        return true;
      });
      setResults(filtered);
      setIsEvaluating(false);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "3.5rem 3rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(26,18,8,0.06)" }}>
        <h1 className="premium-gradient-text" style={{
          fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 600,
          letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.75rem",
        }}>
          {hi ? "ZKP योजना मिलान" : "ZKP Scheme Match"}
        </h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 600, fontFamily: "var(--font-sans)" }}>
          {hi 
            ? "सरकारी योजनाओं के लिए अपनी पात्रता का सुरक्षित रूप से मूल्यांकन करें। शून्य-ज्ञान वास्तुकला यह सुनिश्चित करती है कि आपका वित्तीय डेटा कभी भी आपके ब्राउज़र से बाहर न जाए।"
            : "Securely evaluate your eligibility for government schemes. Zero-Knowledge Proof (ZKP) architecture ensures your financial data never leaves your browser."}
        </p>
      </div>

      <div className="premium-card" style={{ padding: "2.5rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Local Processing Enabled
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", marginBottom: "2.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "0.6rem" }}>
              {hi ? "उद्यम का प्रकार" : "Enterprise Type"}
            </label>
            <select className="premium-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">{hi ? "सभी" : "Any"}</option>
              <option value="micro">{hi ? "सूक्ष्म (Micro)" : "Micro"}</option>
              <option value="small">{hi ? "लघु (Small)" : "Small"}</option>
              <option value="medium">{hi ? "मध्यम (Medium)" : "Medium"}</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "0.6rem" }}>
              {hi ? "व्यापार क्षेत्र" : "Business Sector"}
            </label>
            <select className="premium-input" value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="all">{hi ? "सभी" : "Any"}</option>
              <option value="manufacturing">{hi ? "विनिर्माण (Manufacturing)" : "Manufacturing"}</option>
              <option value="service">{hi ? "सेवा (Service)" : "Service"}</option>
              <option value="trading">{hi ? "व्यापार (Trading)" : "Trading"}</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "0.6rem" }}>
              {hi ? "वार्षिक टर्नओवर (लाख ₹ में)" : "Annual Turnover (in Lakhs ₹)"}
            </label>
            <input className="premium-input" type="number" placeholder="e.g. 50" value={turnover} onChange={(e) => setTurnover(e.target.value ? Number(e.target.value) : "")} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "0.6rem" }}>
              {hi ? "व्यवसाय की आयु (वर्षों में)" : "Years in Business"}
            </label>
            <input className="premium-input" type="number" placeholder="e.g. 3" value={age} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")} />
          </div>
        </div>

        <button 
          onClick={handleEvaluate} 
          disabled={isEvaluating}
          style={{
            width: "100%", padding: "1rem", borderRadius: 6, background: isEvaluating ? "var(--ink-muted)" : "var(--ink)",
            color: "var(--canvas)", fontSize: "0.95rem", fontWeight: 600, border: "none", cursor: isEvaluating ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s"
          }}
        >
          {isEvaluating ? (
            <>
              <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.75s linear infinite", display:"inline-block" }} />
              {hi ? "क्रिप्टोग्राफिक मूल्यांकन चल रहा है..." : "Performing Cryptographic Evaluation..."}
            </>
          ) : (hi ? "मेरी पात्रता सत्यापित करें (ऑफ़लाइन)" : "Verify My Eligibility (Offline)")}
        </button>
      </div>

      {results && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, color: "var(--ink)", marginBottom: "1.25rem" }}>
            {hi ? "पात्र योजनाएं" : "Eligible Schemes"} ({results.length})
          </h2>
          {results.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: 12, color: "var(--ink-muted)" }}>
              {hi ? "दिए गए विवरण के आधार पर कोई योजना नहीं मिली।" : "No schemes found matching your specific criteria."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map(scheme => (
                <div key={scheme.id} className="premium-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{hi ? scheme.hiTitle : scheme.title}</h3>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#B8742E", textDecoration: "none" }}>
                      {hi ? "पोर्टल पर जाएं ↗" : "Visit Portal ↗"}
                    </a>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: 0, lineHeight: 1.6 }}>{hi ? scheme.hiDesc : scheme.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
