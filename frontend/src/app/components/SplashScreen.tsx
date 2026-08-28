"use client";

import { useEffect, useState } from "react";

/* ─── Cinematic Splash Screen ────────────────────────────────────────────
   Timeline:
   0.0s  – Line sweeps in from center
   0.5s  – Scales SVG draws itself stroke by stroke
   2.2s  – "ContractSense" name reveals letter by letter
   3.2s  – Subtitle fades in
   4.0s  – Everything fades out
   4.7s  – onDone() called, app appears
*/

const BRAND = "ContractSense";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep]         = useState(0);   // 0=line 1=scales 2=name 3=sub 4=out
  const [letterIdx, setLetterIdx] = useState(0);

  useEffect(() => {
    const s1 = setTimeout(() => setStep(1), 300);
    const s2 = setTimeout(() => setStep(2), 2000);
    const s3 = setTimeout(() => setStep(3), 3100);
    const s4 = setTimeout(() => setStep(4), 3900);
    const s5 = setTimeout(() => onDone(),   4700);
    return () => { [s1,s2,s3,s4,s5].forEach(clearTimeout); };
  }, [onDone]);

  // Letter-by-letter reveal
  useEffect(() => {
    if (step < 2) { setLetterIdx(0); return; }
    if (letterIdx >= BRAND.length) return;
    const t = setTimeout(() => setLetterIdx(i => i + 1), 72);
    return () => clearTimeout(t);
  }, [step, letterIdx]);

  const scalesVisible = step >= 1;
  const nameVisible   = step >= 2;
  const subVisible    = step >= 3;
  const fadingOut     = step >= 4;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#09070A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0,
      opacity: fadingOut ? 0 : 1,
      transition: fadingOut ? "opacity 0.75s cubic-bezier(.4,0,.2,1)" : "none",
    }}>
      <style>{`
        /* ── Scales SVG draw animation ── */
        .splash-svg path,
        .splash-svg line,
        .splash-svg ellipse,
        .splash-svg circle {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
        }

        /* Outer rings */
        .s-ring1 { stroke:#B8742E; stroke-width:1.2; animation: drawS 0.5s ease forwards 0.0s; }
        .s-ring2 { stroke:#B8742E; stroke-width:0.5; opacity:0.35; animation: drawS 0.4s ease forwards 0.1s; }

        /* Pillar */
        .s-pillar { stroke:#D4924A; stroke-width:2; animation: drawS 0.3s ease forwards 0.4s; }

        /* Beam */
        .s-beam { stroke:#D4924A; stroke-width:2; animation: drawS 0.35s ease forwards 0.6s; }

        /* Chains */
        .s-chain-l { stroke:#C17D3C; stroke-width:1.2; animation: drawS 0.22s ease forwards 0.85s; }
        .s-chain-r { stroke:#C17D3C; stroke-width:1.2; animation: drawS 0.22s ease forwards 0.92s; }

        /* Pans */
        .s-pan-l { stroke:#D4924A; stroke-width:1.8; animation: drawS 0.3s ease forwards 1.05s; }
        .s-pan-r { stroke:#D4924A; stroke-width:1.8; animation: drawS 0.3s ease forwards 1.15s; }

        /* Base */
        .s-base { stroke:#D4924A; stroke-width:2.2; animation: drawS 0.2s ease forwards 1.35s; }

        /* Details */
        .s-doc1 { stroke:#E8A86A; stroke-width:1; opacity:0.6; animation: drawS 0.2s ease forwards 1.45s; }
        .s-doc2 { stroke:#E8A86A; stroke-width:1; opacity:0.4; animation: drawS 0.2s ease forwards 1.52s; }
        .s-coin1 { stroke:#E8A86A; stroke-width:1; opacity:0.7; animation: drawS 0.2s ease forwards 1.58s; }
        .s-coin2 { stroke:#E8A86A; stroke-width:1; opacity:0.5; animation: drawS 0.2s ease forwards 1.65s; }

        @keyframes drawS { to { stroke-dashoffset: 0; } }

        /* ── Glow pulse on scales ── */
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(184,116,46,0.3)); }
          50%       { filter: drop-shadow(0 0 16px rgba(184,116,46,0.55)); }
        }
        .scales-glow { animation: glowPulse 2.5s ease-in-out infinite; }

        /* ── Horizontal sweep line ── */
        @keyframes sweepIn {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        .sweep-line {
          animation: sweepIn 0.6s cubic-bezier(.16,1,.3,1) forwards;
          transform-origin: center;
        }

        /* ── Letter reveal ── */
        @keyframes letterPop {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .letter-char { display: inline-block; animation: letterPop 0.15s ease forwards; }

        /* ── Subtitle ── */
        @keyframes subFade {
          from { opacity: 0; letter-spacing: 0.25em; }
          to   { opacity: 1; letter-spacing: 0.18em; }
        }
        .sub-text { animation: subFade 0.6s ease forwards; }

        /* ── Ambient particle dots ── */
        @keyframes floatDot {
          0%, 100% { opacity: 0; transform: translateY(0px); }
          50% { opacity: 0.4; transform: translateY(-12px); }
        }
      `}</style>

      {/* ── Ambient background glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(184,116,46,0.07) 0%, transparent 70%)",
      }} />

      {/* ── Horizontal separator line (first element to appear) ── */}
      <div style={{ width: 260, height: 1, marginBottom: 48, position: "relative" }}>
        {step >= 0 && (
          <div className="sweep-line" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, #B8742E 30%, #E8A86A 50%, #B8742E 70%, transparent 100%)",
          }} />
        )}
      </div>

      {/* ── Scales SVG ── */}
      <div
        className={scalesVisible ? "scales-glow" : ""}
        style={{
          opacity: scalesVisible ? 1 : 0,
          transition: "opacity 0.3s",
          marginBottom: 32,
        }}
      >
        <svg
          className="splash-svg"
          viewBox="0 0 96 96"
          width={110}
          height={110}
        >
          {/* Outer rings */}
          <circle className="s-ring1" cx="48" cy="48" r="44" />
          <circle className="s-ring2" cx="48" cy="48" r="38" />

          {/* Pillar */}
          <line className="s-pillar" x1="48" y1="22" x2="48" y2="76" />

          {/* Top beam */}
          <line className="s-beam" x1="20" y1="34" x2="76" y2="34" />

          {/* Left chain */}
          <line className="s-chain-l" x1="23" y1="34" x2="20" y2="50" />
          {/* Right chain */}
          <line className="s-chain-r" x1="73" y1="34" x2="76" y2="50" />

          {/* Left pan (level) */}
          <path className="s-pan-l" d="M12 50 Q20 57 28 50" />
          {/* Right pan (slightly lower = risk detected) */}
          <path className="s-pan-r" d="M68 54 Q76 61 84 54" />

          {/* Base */}
          <line className="s-base" x1="40" y1="76" x2="56" y2="76" />

          {/* Left pan — document lines */}
          <line className="s-doc1" x1="16" y1="51" x2="24" y2="51" />
          <line className="s-doc2" x1="16" y1="53.5" x2="24" y2="53.5" />

          {/* Right pan — coin circles */}
          <ellipse className="s-coin1" cx="76" cy="55" rx="5" ry="1.5" />
          <ellipse className="s-coin2" cx="76" cy="52.5" rx="5" ry="1.5" />
        </svg>
      </div>

      {/* ── Brand name — letter by letter ── */}
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
        fontWeight: 500,
        color: "#F5F0E8",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        height: "1.2em",
        marginBottom: 14,
        minWidth: 320,
        textAlign: "center",
      }}>
        {nameVisible && BRAND.split("").slice(0, letterIdx).map((ch, i) => (
          <span key={i} className="letter-char" style={{ animationDelay: `${i * 0.001}s` }}>{ch}</span>
        ))}
      </div>

      {/* ── Subtitle ── */}
      <div style={{ height: 22 }}>
        {subVisible && (
          <div className="sub-text" style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#B8742E",
            textAlign: "center",
          }}>
            Protecting Indian MSMEs · Since 2026
          </div>
        )}
      </div>

      {/* ── Bottom separator ── */}
      <div style={{ width: 260, height: 1, marginTop: 48 }}>
        {step >= 0 && (
          <div className="sweep-line" style={{
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, #B8742E 30%, #E8A86A 50%, #B8742E 70%, transparent 100%)",
          }} />
        )}
      </div>

      {/* ── Floating ambient particles ── */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 3, height: 3,
          borderRadius: "50%",
          background: "#B8742E",
          left: `${15 + i * 14}%`,
          bottom: `${20 + (i % 3) * 12}%`,
          animation: `floatDot ${2.5 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.35}s`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}
