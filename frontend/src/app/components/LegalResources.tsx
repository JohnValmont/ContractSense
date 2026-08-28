import { useState } from "react";

type Tab = "guidelines" | "glossary" | "templates";

interface Props {
  uiLanguage?: string;
}

const translations: Record<string, any> = {
  en: {
    title: "Legal Resources Library",
    subtitle: "Search comprehensive compliance guidelines, plain-English legal definitions, and secure templates.",
    searchPlaceholder: "Search resources...",
    tabs: {
      guidelines: "MSME Guidelines",
      glossary: "Corporate Glossary",
      templates: "Document Templates"
    },
    guidelines: [
      {
        tag: "Payment Compliance",
        title: "Strict 45-Day Payment Timeline",
        text: "Under the MSME Development Act, a buyer must make payment for goods/services within 45 days of acceptance. Any contract clause extending this beyond 45 days is legally void. If the contract does not specify a timeline, the default is 15 days.",
        ref: "Section 15, MSMED Act, 2006"
      },
      {
        tag: "Penalty Enforcement",
        title: "Compound Interest on Delayed Payments",
        text: "If a buyer fails to pay within the statutory limit, they are legally obligated to pay compound interest with monthly rests to the supplier. This interest rate is set at three times the bank rate notified by the Reserve Bank of India (RBI).",
        ref: "Section 16, MSMED Act, 2006"
      },
      {
        tag: "Dispute Resolution",
        title: "MSME Samadhaan Portal",
        text: "MSMEs are not forced into expensive corporate arbitration. You can file a claim through the MSME Samadhaan portal to the Micro and Small Enterprises Facilitation Council (MSEFC) for mandatory conciliation and expedited arbitration.",
        ref: "Section 18, MSMED Act, 2006"
      },
      {
        tag: "Statutory Right",
        title: "Recovery of Amount Due",
        text: "For any goods supplied or services rendered by the supplier, the buyer shall be liable to pay the amount with interest thereon as provided under Section 16. The buyer cannot contractually waive this liability.",
        ref: "Section 17, MSMED Act, 2006"
      }
    ],
    glossary: [
      { title: "Indemnification", text: "A clause where one party promises to compensate the other for any harm, liability, or loss arising out of the contract. MSMEs should watch out for 'uncapped' indemnities that expose them to unlimited financial risk." },
      { title: "Limitation of Liability", text: "A protective clause that caps the maximum financial damages a party must pay if they breach the contract. Crucial for MSMEs to prevent bankruptcy from a single lawsuit." },
      { title: "Severability", text: "Ensures that if a judge rules one specific clause of the contract is illegal or unenforceable, the rest of the contract remains valid and intact." },
      { title: "Force Majeure", text: "Frees both parties from liability or obligation when an extraordinary event or circumstance beyond their control (e.g., war, strike, pandemic) prevents them from fulfilling their obligations." },
      { title: "Liquidated Damages", text: "A predetermined sum agreed upon during the contract formation that a party must pay if they breach specific terms (often used for delays). MSMEs should ensure these are reasonable and capped." },
      { title: "Governing Law and Jurisdiction", text: "Specifies which state's laws apply to the contract and which courts have authority to hear disputes. MSMEs should negotiate for their local jurisdiction to avoid costly interstate litigation." }
    ],
    templates: [
      { title: "Mutual Non-Disclosure (NDA)", desc: "A standard, balanced NDA protecting the confidential information of both the MSME and the Enterprise client.", format: "DOCX", size: "24 KB" },
      { title: "MSME-Compliant Vendor Agreement", desc: "A master services agreement with built-in Section 15 payment terms and liability caps favoring the vendor.", format: "DOCX", size: "48 KB" },
      { title: "IT & Software Services Agreement", desc: "Tailored for IT MSMEs, protecting IP rights and providing clear acceptance criteria to trigger the 45-day payment clock.", format: "DOCX", size: "52 KB" }
    ]
  },
  hi: {
    title: "कानूनी संसाधन पुस्तकालय",
    subtitle: "व्यापक अनुपालन दिशानिर्देश, कानूनी परिभाषाएं और सुरक्षित दस्तावेज़ टेम्पलेट्स खोजें।",
    searchPlaceholder: "संसाधन खोजें...",
    tabs: {
      guidelines: "MSME दिशानिर्देश",
      glossary: "कॉर्पोरेट शब्दावली",
      templates: "दस्तावेज़ टेम्पलेट्स"
    },
    guidelines: [
      { tag: "भुगतान अनुपालन", title: "सख्त 45-दिवसीय भुगतान समयरेखा", text: "MSME विकास अधिनियम के तहत, एक खरीदार को स्वीकृति के 45 दिनों के भीतर माल/सेवाओं के लिए भुगतान करना होगा। 45 दिनों से अधिक का कोई भी अनुबंध खंड कानूनी रूप से शून्य है। यदि अनुबंध समयरेखा निर्दिष्ट नहीं करता है, तो डिफ़ॉल्ट 15 दिन है।", ref: "धारा 15, MSMED अधिनियम, 2006" },
      { tag: "जुर्माना प्रवर्तन", title: "विलंबित भुगतान पर चक्रवृद्धि ब्याज", text: "यदि कोई खरीदार वैधानिक सीमा के भीतर भुगतान करने में विफल रहता है, तो वे आपूर्तिकर्ता को मासिक विश्राम के साथ चक्रवृद्धि ब्याज का भुगतान करने के लिए कानूनी रूप से बाध्य हैं। यह ब्याज दर भारतीय रिज़र्व बैंक (RBI) द्वारा अधिसूचित बैंक दर के तीन गुना पर निर्धारित की जाती है।", ref: "धारा 16, MSMED अधिनियम, 2006" },
      { tag: "विवाद समाधान", title: "MSME समाधान पोर्टल", text: "MSME को महंगी कॉर्पोरेट मध्यस्थता के लिए मजबूर नहीं किया जा सकता है। आप अनिवार्य सुलह और त्वरित मध्यस्थता के लिए सूक्ष्म और लघु उद्यम सुविधा परिषद (MSEFC) में MSME समाधान पोर्टल के माध्यम से दावा दायर कर सकते हैं।", ref: "धारा 18, MSMED अधिनियम, 2006" },
      { tag: "वैधानिक अधिकार", title: "देय राशि की वसूली", text: "आपूर्तिकर्ता द्वारा आपूर्ति किए गए किसी भी सामान या प्रदान की गई सेवाओं के लिए, खरीदार धारा 16 के तहत प्रदान किए गए ब्याज के साथ राशि का भुगतान करने के लिए उत्तरदायी होगा। खरीदार इस दायित्व को अनुबंध के आधार पर माफ नहीं कर सकता है।", ref: "धारा 17, MSMED अधिनियम, 2006" }
    ],
    glossary: [
      { title: "क्षतिपूर्ति (Indemnification)", text: "एक खंड जहां एक पक्ष दूसरे को अनुबंध से उत्पन्न होने वाले किसी भी नुकसान, दायित्व या हानि की भरपाई करने का वादा करता है। MSME को असीमित वित्तीय जोखिम के लिए उजागर करने वाली 'अनकैप्ड' क्षतिपूर्ति से सावधान रहना चाहिए।" },
      { title: "दायित्व की सीमा (Limitation of Liability)", text: "एक सुरक्षात्मक खंड जो किसी पक्ष को अनुबंध तोड़ने पर अधिकतम वित्तीय नुकसान का भुगतान करने को सीमित करता है। MSME के लिए एकल मुकदमे से दिवालियापन को रोकने के लिए महत्वपूर्ण।" },
      { title: "विच्छेदनीयता (Severability)", text: "यह सुनिश्चित करता है कि यदि कोई न्यायाधीश अनुबंध के एक विशिष्ट खंड को अवैध या अप्रवर्तनीय ठहराता है, तो शेष अनुबंध वैध और बरकरार रहता है।" },
      { title: "अप्रत्याशित घटना (Force Majeure)", text: "अनुबंध के दायित्व से दोनों पक्षों को मुक्त करता है जब कोई असाधारण घटना उनके नियंत्रण से बाहर (जैसे युद्ध, हड़ताल, महामारी) उन्हें अपने दायित्वों को पूरा करने से रोकती है।" },
      { title: "परिनिर्धारित नुकसान (Liquidated Damages)", text: "अनुबंध गठन के दौरान सहमत एक पूर्व निर्धारित राशि जो किसी पक्ष को विशिष्ट शर्तों को तोड़ने पर चुकानी होगी (अक्सर देरी के लिए उपयोग की जाती है)। MSME को यह सुनिश्चित करना चाहिए कि ये उचित और कैप्ड हैं।" },
      { title: "शासी कानून और अधिकार क्षेत्र", text: "निर्दिष्ट करता है कि अनुबंध पर कौन से राज्य के कानून लागू होते हैं और किन अदालतों को विवाद सुनने का अधिकार है। MSME को महंगे अंतरराज्यीय मुकदमेबाजी से बचने के लिए अपने स्थानीय अधिकार क्षेत्र के लिए बातचीत करनी चाहिए।" }
    ],
    templates: [
      { title: "म्यूचुअल नॉन-डिस्क्लोजर (NDA)", desc: "MSME और एंटरप्राइज क्लाइंट दोनों की गोपनीय जानकारी की रक्षा करने वाला एक मानक, संतुलित NDA।", format: "DOCX", size: "24 KB" },
      { title: "MSME-अनुपालन विक्रेता समझौता", desc: "विक्रेता के पक्ष में अंतर्निहित धारा 15 भुगतान शर्तों और देयता कैप के साथ एक मास्टर सेवा समझौता।", format: "DOCX", size: "48 KB" },
      { title: "आईटी और सॉफ्टवेयर सेवा समझौता", desc: "IT MSME के लिए तैयार, बौद्धिक संपदा अधिकारों की रक्षा करना और 45-दिन की भुगतान घड़ी को ट्रिगर करने के लिए स्पष्ट स्वीकृति मानदंड प्रदान करना।", format: "DOCX", size: "52 KB" }
    ]
  }
};

export default function LegalResources({ uiLanguage = "en" }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("guidelines");
  const [searchTerm, setSearchTerm] = useState("");
  const t = translations[uiLanguage] || translations["en"];

  const filteredItems = (items: any[]) => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(item =>
      (item.title && item.title.toLowerCase().includes(lower)) ||
      (item.text && item.text.toLowerCase().includes(lower)) ||
      (item.desc && item.desc.toLowerCase().includes(lower))
    );
  };

  const getIconForTab = (tab: Tab) => {
    switch (tab) {
      case "guidelines": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
      case "glossary": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
      case "templates": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    }
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem", minHeight: "100vh" }}>
      
      {/* ── HEADER ── */}
      <header style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1 className="premium-gradient-text" style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
          {t.title}
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--ink-muted)", maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
          {t.subtitle}
        </p>

        {/* Search Bar */}
        <div style={{ marginTop: "1rem", position: "relative", maxWidth: 480 }}>
          <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--ink-muted)", pointerEvents: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: "100%", padding: "0.85rem 1rem 0.85rem 3rem",
              background: "rgba(255,255,255,0.6)", border: "1px solid var(--glass-border)",
              borderRadius: "12px", fontSize: "0.95rem", color: "var(--ink)",
              outline: "none", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </header>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: "0.5rem", background: "rgba(26,18,8,0.04)", padding: "0.4rem", borderRadius: "10px", width: "fit-content" }}>
        {(["guidelines", "glossary", "templates"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.6rem 1.25rem", borderRadius: "8px", border: "none",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: activeTab === tab ? "var(--surface)" : "transparent",
              color: activeTab === tab ? "var(--ink)" : "var(--ink-muted)",
              boxShadow: activeTab === tab ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {getIconForTab(tab)}
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {/* ── CONTENT GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        
        {/* GUIDELINES */}
        {activeTab === "guidelines" && filteredItems(t.guidelines).map((item, idx) => (
          <div key={idx} className="library-card" style={{
            background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "16px",
            padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)", transition: "transform 0.2s, box-shadow 0.2s"
          }}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(184,116,46,0.1)", color: "#9A5D1F", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
                {item.tag}
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>
                {item.title}
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", lineHeight: 1.7, margin: 0, flexGrow: 1 }}>
              {item.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(26,18,8,0.06)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A5D1F" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9A5D1F" }}>{item.ref}</span>
            </div>
          </div>
        ))}

        {/* GLOSSARY */}
        {activeTab === "glossary" && filteredItems(t.glossary).map((item, idx) => (
          <div key={idx} className="library-card" style={{
            background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "16px",
            padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(26,18,8,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>{item.title.charAt(0)}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                {item.title}
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.65, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}

        {/* TEMPLATES */}
        {activeTab === "templates" && filteredItems(t.templates).map((item, idx) => (
          <div key={idx} className="library-card" style={{
            background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "16px",
            padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ width: 42, height: 48, borderRadius: "6px", background: "rgba(184,116,46,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A5D1F" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div style={{ position: "absolute", bottom: -6, background: "#9A5D1F", color: "#fff", fontSize: "0.5rem", fontWeight: 800, padding: "2px 4px", borderRadius: "3px" }}>{item.format}</div>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 0.35rem 0", lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: "0.7rem", color: "var(--ink-subtle)", fontWeight: 500 }}>{item.size}</span>
              </div>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--ink-muted)", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
              {item.desc}
            </p>
            <button
              onClick={() => alert("Downloading Secure Template...")}
              style={{
                width: "100%", padding: "0.75rem", marginTop: "0.5rem",
                background: "var(--ink)", color: "var(--canvas)",
                border: "none", borderRadius: "8px", fontSize: "0.825rem", fontWeight: 600,
                cursor: "pointer", transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#000"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
            >
              Download Template
            </button>
          </div>
        ))}

        {filteredItems(t[activeTab]).length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--ink-muted)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: "1rem", opacity: 0.5 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p style={{ fontSize: "1rem", fontWeight: 500, margin: 0 }}>No resources found for "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", border: "1px solid var(--glass-border)", background: "transparent", borderRadius: "6px", cursor: "pointer", color: "var(--ink)" }}>Clear Search</button>
          </div>
        )}
      </div>

      <style>{`
        .library-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important; }
      `}</style>
    </div>
  );
}
