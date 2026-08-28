"use client";

import { useEffect, useState } from "react";

const BRAND = "ContractSense";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep]           = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);

  useEffect(() => {
    const s1 = setTimeout(() => setStep(1), 200);   // start drawing
    const s2 = setTimeout(() => setStep(2), 2000);  // start rocking + type name
    const s3 = setTimeout(() => setStep(3), 3100);  // subtitle
    const s4 = setTimeout(() => setStep(4), 3900);  // fade out
    const s5 = setTimeout(() => onDone(),   4700);
    return () => [s1, s2, s3, s4, s5].forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    if (step < 2) { setLetterIdx(0); return; }
    if (letterIdx >= BRAND.length) return;
    const t = setTimeout(() => setLetterIdx(i => i + 1), 68);
    return () => clearTimeout(t);
  }, [step, letterIdx]);

  const isDrawing  = step >= 1;
  const isRocking  = step >= 2;
  const isTyping   = step >= 2;
  const showSub    = step >= 3;
  const fadingOut  = step >= 4;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#09070A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fadingOut ? 0 : 1,
      transition: fadingOut ? "opacity 0.8s cubic-bezier(.4,0,.2,1)" : "none",
    }}>
      <style>{`
        /* ── Draw animation: shared base ── */
        .splash-svg path,
        .splash-svg line,
        .splash-svg ellipse,
        .splash-svg circle:not(.no-dash) {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
        }

        /* Structural draw order */
        .d-ring1  { stroke:#B8742E; stroke-width:1.4; animation: drawStroke 0.55s ease forwards 0.0s; }
        .d-ring2  { stroke:#B8742E; stroke-width:0.5; opacity:0.3; animation: drawStroke 0.4s ease forwards 0.1s; }
        .d-pillar { stroke:#D4924A; stroke-width:2.2; animation: drawStroke 0.3s ease forwards 0.4s; }
        .d-beam   { stroke:#D4924A; stroke-width:2.2; animation: drawStroke 0.4s ease forwards 0.65s; }
        .d-chl    { stroke:#C17D3C; stroke-width:1.4; animation: drawStroke 0.22s ease forwards 0.95s; }
        .d-chr    { stroke:#C17D3C; stroke-width:1.4; animation: drawStroke 0.22s ease forwards 1.05s; }
        .d-panl   { stroke:#D4924A; stroke-width:1.9; animation: drawStroke 0.3s ease forwards 1.18s; }
        .d-panr   { stroke:#D4924A; stroke-width:1.9; animation: drawStroke 0.3s ease forwards 1.28s; }
        .d-base   { stroke:#D4924A; stroke-width:2.4; animation: drawStroke 0.2s ease forwards 1.42s; }

        /* Icon draw — contract doc */
        .d-doc-box  { stroke:#E8A86A; stroke-width:1.1; animation: drawStroke 0.25s ease forwards 1.5s; }
        .d-doc-l1   { stroke:#E8A86A; stroke-width:0.8; opacity:0.75; animation: drawStroke 0.15s ease forwards 1.62s; }
        .d-doc-l2   { stroke:#E8A86A; stroke-width:0.8; opacity:0.65; animation: drawStroke 0.15s ease forwards 1.7s; }
        .d-doc-l3   { stroke:#E8A86A; stroke-width:0.8; opacity:0.5; animation: drawStroke 0.12s ease forwards 1.78s; }
        .d-doc-seal { stroke:#E8A86A; stroke-width:0.8; opacity:0.6; animation: drawStroke 0.15s ease forwards 1.82s; }

        @keyframes drawStroke { to { stroke-dashoffset: 0; } }

        /* ── Rupee text fade ── */
        .d-rupee {
          opacity: 0;
          animation: fadeEl 0.3s ease forwards 1.68s;
        }
        @keyframes fadeEl { to { opacity: 1; } }

        /* ── Scales rocking: the beam group pivots around center-top ── */
        .scales-beam-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .scales-beam-group.rocking {
          animation: scalesRock 2.2s cubic-bezier(.37,0,.63,1) infinite;
        }
        @keyframes scalesRock {
          0%   { transform: rotate(-7deg); }
          50%  { transform: rotate(7deg);  }
          100% { transform: rotate(-7deg); }
        }

        /* ── Glow pulse on full SVG ── */
        .scales-glow {
          animation: glowPulse 2.4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100% { filter: drop-shadow(0 0 5px rgba(184,116,46,0.25)); }
          50%     { filter: drop-shadow(0 0 18px rgba(184,116,46,0.55)); }
        }

        /* ── Separator sweep ── */
        @keyframes sweepX {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .sep-line {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #B8742E 30%, #E8C87A 50%, #B8742E 70%, transparent 100%);
          transform-origin: center;
          animation: sweepX 0.7s cubic-bezier(.16,1,.3,1) forwards;
        }

        /* ── Letter by letter ── */
        @keyframes letterIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ltr { display:inline-block; animation: letterIn 0.14s ease forwards; }

        /* ── Subtitle ── */
        @keyframes subIn {
          from { opacity:0; letter-spacing:0.3em; }
          to   { opacity:1; letter-spacing:0.2em; }
        }
        .sub { animation: subIn 0.6s ease forwards; }

        /* ── Ambient particles ── */
        @keyframes floatDot {
          0%,100% { opacity:0; transform:translateY(0); }
          50%     { opacity:0.35; transform:translateY(-14px); }
        }
      `}</style>

      {/* Ambient background glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 55% 38% at 50% 52%, rgba(184,116,46,0.08) 0%, transparent 70%)",
      }}/>

      {/* Top separator */}
      <div style={{ width:280, marginBottom:44 }}>
        {isDrawing && <div className="sep-line" />}
      </div>

      {/* ─── Main Scales SVG ─────────────────── */}
      <div className={isRocking ? "scales-glow" : ""} style={{ marginBottom:30 }}>
        <svg
          className="splash-svg"
          viewBox="0 0 120 120"
          width={118}
          height={118}
        >
          {/* Fixed: rings, pillar, base — NOT in rocking group */}
          <circle className="d-ring1" cx="60" cy="60" r="55" />
          <circle className="d-ring2" cx="60" cy="60" r="47" />
          <line  className="d-pillar" x1="60" y1="24" x2="60" y2="92" />
          <line  className="d-base"   x1="50" y1="92" x2="70" y2="92" />

          {/* ── Rocking group: beam + chains + pans + icons ── */}
          <g className={`scales-beam-group${isRocking ? " rocking" : ""}`}>
            {/* Beam */}
            <line className="d-beam" x1="18" y1="42" x2="102" y2="42" />

            {/* Left chain */}
            <line className="d-chl" x1="21" y1="42" x2="17" y2="62" />
            {/* Right chain — longer so right pan hangs lower before rocking */}
            <line className="d-chr" x1="99" y1="42" x2="103" y2="66" />

            {/* Left pan (contract side — level) */}
            <path className="d-panl" d="M9 62 Q17 70 25 62" />
            {/* Right pan (money side — slightly lower) */}
            <path className="d-panr" d="M95 66 Q103 74 111 66" />

            {/* ── Contract document on left pan ── */}
            {/* Paper body */}
            <rect className="d-doc-box" x="10.5" y="51" width="13" height="17" rx="1.5" />
            {/* Folded corner */}
            <path className="d-doc-box" d="M20.5 51 L23.5 54 L20.5 54 Z" />
            {/* Text lines */}
            <line className="d-doc-l1" x1="12.5" y1="57"   x2="21.5" y2="57" />
            <line className="d-doc-l2" x1="12.5" y1="60.5" x2="21.5" y2="60.5" />
            <line className="d-doc-l3" x1="12.5" y1="64"   x2="18.5" y2="64" />
            {/* Seal / stamp */}
            <circle className="d-doc-seal" cx="20" cy="64" r="1.8" />

            {/* ── Rupee ₹ on right pan ── */}
            <text
              className="d-rupee"
              x="103" y="65"
              textAnchor="middle"
              fontSize="13"
              fontFamily="'EB Garamond', Georgia, serif"
              fontWeight="700"
              fill="#E8A86A"
            >₹</text>
            {/* Rupee coin circle border */}
            <circle className="d-doc-seal" cx="103" cy="62" r="7" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* ─── Brand Name ──────────────────────── */}
      <div style={{
        fontFamily:"'EB Garamond', Georgia, serif",
        fontSize:"clamp(2rem,4.5vw,2.75rem)",
        fontWeight:500,
        letterSpacing:"-0.02em",
        lineHeight:1,
        height:"1.2em",
        marginBottom:12,
        minWidth:340,
        textAlign:"center",
      }}>
        {isTyping && BRAND.split("").slice(0, letterIdx).map((ch, i) => {
          const isSecondWord = i >= 8; // "Contract" = 8 chars
          return (
            <span key={i} className="ltr" style={{
              color: isSecondWord ? "#D4924A" : "#F5F0E8",
              fontStyle: isSecondWord ? "italic" : "normal",
            }}>{ch}</span>
          );
        })}
      </div>

      {/* ─── Subtitle ────────────────────────── */}
      <div style={{ height:22 }}>
        {showSub && (
          <div className="sub" style={{
            fontSize:"0.63rem",
            fontWeight:700,
            letterSpacing:"0.2em",
            textTransform:"uppercase",
            color:"#B8742E",
            textAlign:"center",
          }}>
            Protecting Indian MSMEs · Est. 2026
          </div>
        )}
      </div>

      {/* Bottom separator */}
      <div style={{ width:280, marginTop:44 }}>
        {isDrawing && <div className="sep-line" style={{ animationDelay:"0.15s" }} />}
      </div>

      {/* Ambient float dots */}
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{
          position:"absolute",
          width:2.5, height:2.5, borderRadius:"50%",
          background:"#B8742E",
          left:`${14 + i*14}%`,
          bottom:`${18 + (i%3)*10}%`,
          animation:`floatDot ${2.5+i*0.4}s ease-in-out infinite`,
          animationDelay:`${i*0.32}s`,
          opacity:0,
        }}/>
      ))}
    </div>
  );
}
