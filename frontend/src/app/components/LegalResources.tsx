import { useState } from "react";
import styles from "./LegalResources.module.css";

type Tab = "guidelines" | "glossary" | "templates";

interface Props {
  uiLanguage?: string;
}

const translations: Record<string, any> = {
  en: {
    title: "Legal Resources Library",
    subtitle: "Access comprehensive compliance guidelines, a plain-English legal glossary, and secure document templates.",
    tabs: {
      guidelines: "MSME Guidelines",
      glossary: "Corporate Glossary",
      templates: "Document Templates"
    },
    guidelines: [
      {
        title: "Strict 45-Day Payment Timeline",
        text: "Under the MSME Development Act, a buyer must make payment for goods/services within 45 days of acceptance. Any contract clause extending this beyond 45 days is legally void. If the contract does not specify a timeline, the default is 15 days.",
        ref: "Ref: Section 15, MSMED Act, 2006"
      },
      {
        title: "Compound Interest on Delayed Payments",
        text: "If a buyer fails to pay within the statutory limit, they are legally obligated to pay compound interest with monthly rests to the supplier. This interest rate is set at three times the bank rate notified by the Reserve Bank of India (RBI).",
        ref: "Ref: Section 16, MSMED Act, 2006"
      },
      {
        title: "MSME Samadhaan (Dispute Resolution)",
        text: "MSMEs are not forced into expensive corporate arbitration. You can file a claim through the MSME Samadhaan portal to the Micro and Small Enterprises Facilitation Council (MSEFC) for mandatory conciliation and expedited arbitration.",
        ref: "Ref: Section 18, MSMED Act, 2006"
      },
      {
        title: "Recovery of Amount Due",
        text: "For any goods supplied or services rendered by the supplier, the buyer shall be liable to pay the amount with interest thereon as provided under Section 16. The buyer cannot contractually waive this liability.",
        ref: "Ref: Section 17, MSMED Act, 2006"
      }
    ],
    glossary: [
      { title: "Indemnification", text: "A clause where one party promises to compensate the other for any harm, liability, or loss arising out of the contract. MSMEs should watch out for \"uncapped\" indemnities that expose them to unlimited financial risk." },
      { title: "Limitation of Liability", text: "A protective clause that caps the maximum financial damages a party must pay if they breach the contract. Crucial for MSMEs to prevent bankruptcy from a single lawsuit." },
      { title: "Severability", text: "Ensures that if a judge rules one specific clause of the contract is illegal or unenforceable, the rest of the contract remains valid and intact." },
      { title: "Force Majeure", text: "Frees both parties from liability or obligation when an extraordinary event or circumstance beyond their control (e.g., war, strike, pandemic) prevents them from fulfilling their obligations." },
      { title: "Liquidated Damages", text: "A predetermined sum agreed upon during the contract formation that a party must pay if they breach specific terms (often used for delays). MSMEs should ensure these are reasonable and capped." },
      { title: "Governing Law and Jurisdiction", text: "Specifies which state's laws apply to the contract and which courts have authority to hear disputes. MSMEs should negotiate for their local jurisdiction to avoid costly interstate litigation." }
    ],
    templates: [
      { title: "Mutual Non-Disclosure (NDA)", desc: "A standard, balanced NDA protecting the confidential information of both the MSME and the Enterprise client.", btn: "Download .DOCX" },
      { title: "MSME-Compliant Vendor Agreement", desc: "A master services agreement with built-in Section 15 payment terms and liability caps favoring the vendor.", btn: "Download .DOCX" },
      { title: "IT & Software Services Agreement", desc: "Tailored for IT MSMEs, protecting IP rights and providing clear acceptance criteria to trigger the 45-day payment clock.", btn: "Download .DOCX" }
    ]
  },
  hi: {
    title: "कानूनी संसाधन पुस्तकालय",
    subtitle: "व्यापक अनुपालन दिशानिर्देश, एक सरल-हिंदी कानूनी शब्दावली, और सुरक्षित दस्तावेज़ टेम्पलेट्स तक पहुंचें।",
    tabs: {
      guidelines: "MSME दिशानिर्देश",
      glossary: "कॉर्पोरेट शब्दावली",
      templates: "दस्तावेज़ टेम्पलेट्स"
    },
    guidelines: [
      {
        title: "सख्त 45-दिवसीय भुगतान समयरेखा",
        text: "MSME विकास अधिनियम के तहत, एक खरीदार को स्वीकृति के 45 दिनों के भीतर माल/सेवाओं के लिए भुगतान करना होगा। 45 दिनों से अधिक का कोई भी अनुबंध खंड कानूनी रूप से शून्य है। यदि अनुबंध समयरेखा निर्दिष्ट नहीं करता है, तो डिफ़ॉल्ट 15 दिन है।",
        ref: "संदर्भ: धारा 15, MSMED अधिनियम, 2006"
      },
      {
        title: "विलंबित भुगतान पर चक्रवृद्धि ब्याज",
        text: "यदि कोई खरीदार वैधानिक सीमा के भीतर भुगतान करने में विफल रहता है, तो वे आपूर्तिकर्ता को मासिक विश्राम के साथ चक्रवृद्धि ब्याज का भुगतान करने के लिए कानूनी रूप से बाध्य हैं। यह ब्याज दर भारतीय रिज़र्व बैंक (RBI) द्वारा अधिसूचित बैंक दर के तीन गुना पर निर्धारित की जाती है।",
        ref: "संदर्भ: धारा 16, MSMED अधिनियम, 2006"
      },
      {
        title: "MSME समाधान (विवाद समाधान)",
        text: "MSME को महंगी कॉर्पोरेट मध्यस्थता के लिए मजबूर नहीं किया जा सकता है। आप अनिवार्य सुलह और त्वरित मध्यस्थता के लिए सूक्ष्म और लघु उद्यम सुविधा परिषद (MSEFC) में MSME समाधान पोर्टल के माध्यम से दावा दायर कर सकते हैं।",
        ref: "संदर्भ: धारा 18, MSMED अधिनियम, 2006"
      },
      {
        title: "देय राशि की वसूली",
        text: "आपूर्तिकर्ता द्वारा आपूर्ति किए गए किसी भी सामान या प्रदान की गई सेवाओं के लिए, खरीदार धारा 16 के तहत प्रदान किए गए ब्याज के साथ राशि का भुगतान करने के लिए उत्तरदायी होगा। खरीदार इस दायित्व को अनुबंध के आधार पर माफ नहीं कर सकता है।",
        ref: "संदर्भ: धारा 17, MSMED अधिनियम, 2006"
      }
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
      { title: "म्यूचुअल नॉन-डिस्क्लोजर (NDA)", desc: "MSME और एंटरप्राइज क्लाइंट दोनों की गोपनीय जानकारी की रक्षा करने वाला एक मानक, संतुलित NDA।", btn: "डाउनलोड .DOCX" },
      { title: "MSME-अनुपालन विक्रेता समझौता", desc: "विक्रेता के पक्ष में अंतर्निहित धारा 15 भुगतान शर्तों और देयता कैप के साथ एक मास्टर सेवा समझौता।", btn: "डाउनलोड .DOCX" },
      { title: "आईटी और सॉफ्टवेयर सेवा समझौता", desc: "IT MSME के लिए तैयार, बौद्धिक संपदा अधिकारों की रक्षा करना और 45-दिन की भुगतान घड़ी को ट्रिगर करने के लिए स्पष्ट स्वीकृति मानदंड प्रदान करना।", btn: "डाउनलोड .DOCX" }
    ]
  }
};

export default function LegalResources({ uiLanguage = "en" }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("guidelines");
  const t = translations[uiLanguage] || translations["en"];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={`${styles.title} premium-gradient-text`}>{t.title}</h1>
        <p className={styles.subtitle}>
          {t.subtitle}
        </p>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "guidelines" ? styles.active : ""}`}
          onClick={() => setActiveTab("guidelines")}
        >
          {t.tabs.guidelines}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "glossary" ? styles.active : ""}`}
          onClick={() => setActiveTab("glossary")}
        >
          {t.tabs.glossary}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "templates" ? styles.active : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          {t.tabs.templates}
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === "guidelines" && (
          <div className={`animate-fade-in ${styles.libraryGrid}`}>
            {t.guidelines.map((item: any, idx: number) => (
              <div key={idx} className={styles.libraryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
                <p className={styles.itemText}>{item.text}</p>
                <div style={{ flexGrow: 1 }} />
                <span className={styles.itemRef}>{item.ref}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "glossary" && (
          <div className={`animate-fade-in ${styles.libraryGrid}`}>
            {t.glossary.map((item: any, idx: number) => (
              <div key={idx} className={styles.libraryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
                <p className={styles.itemText}>{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <div className={`animate-fade-in ${styles.libraryGrid}`}>
            {t.templates.map((item: any, idx: number) => (
              <div key={idx} className={styles.libraryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
                <p className={styles.itemText}>{item.desc}</p>
                <div style={{ flexGrow: 1 }} />
                <button className={styles.downloadBtn} onClick={() => alert("Downloading Secure Template...")}>
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
