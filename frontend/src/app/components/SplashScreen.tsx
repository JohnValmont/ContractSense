"use client";

import { useEffect, useState } from "react";

const BRAND   = "ContractSense";
const LETTERS = BRAND.split("");

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [step,      setStep]      = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);

  /* ── Timeline (total ≈ 3.8s) ──────────────────── */
  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1),  80),   // start drawing
      setTimeout(() => setStep(2), 1550),  // start rocking + type name
      setTimeout(() => setStep(3), 2450),  // subtitle
      setTimeout(() => setStep(4), 3150),  // fade out
      setTimeout(() => onDone(),   3850),  // unmount
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  /* ── Letter ticker ─────────────────────────────── */
  useEffect(() => {
    if (step < 2) { setLetterIdx(0); return; }
    if (letterIdx >= LETTERS.length) return;
    const t = setTimeout(() => setLetterIdx(i => i + 1), 55);
    return () => clearTimeout(t);
  }, [step, letterIdx]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#08060A",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:0,
      opacity: step >= 4 ? 0 : 1,
      transition: step >= 4 ? "opacity 0.7s ease" : "none",
    }}>
      <style>{`
        /* ── Stroke-draw shared base ── */
        .ss path, .ss line, .ss rect, .ss ellipse, .ss polyline {
          fill:none; stroke-linecap:round; stroke-linejoin:round;
          stroke-dasharray:600; stroke-dashoffset:600;
        }
        .ss circle { fill:none; stroke-linecap:round; }

        /* Draw sequence — fast, punchy */
        .dp { stroke:#D4924A; stroke-width:2.6; }
        .db { stroke:#D4924A; stroke-width:2.8; }
        .dc { stroke:#C17D3C; stroke-width:1.8; }
        .dpl{ stroke:#D4924A; stroke-width:2.2; }
        .dpr{ stroke:#D4924A; stroke-width:2.2; }
        .dbs{ stroke:#D4924A; stroke-width:3;   }
        .ddi{ stroke:#E8A86A; stroke-width:1.4; }
        .ddt{ stroke:#E8A86A; stroke-width:1;   }
        .dcr{ stroke:#E8A86A; stroke-width:1.6; }

        .a0  { animation: drw 0.28s ease forwards 0.08s; }
        .a1  { animation: drw 0.30s ease forwards 0.28s; }
        .a2  { animation: drw 0.18s ease forwards 0.50s; }
        .a3  { animation: drw 0.32s ease forwards 0.58s; }
        .a4  { animation: drw 0.20s ease forwards 0.80s; }
        .a5  { animation: drw 0.20s ease forwards 0.90s; }
        .a6  { animation: drw 0.24s ease forwards 0.98s; }
        .a7  { animation: drw 0.24s ease forwards 1.08s; }
        .a8  { animation: drw 0.16s ease forwards 1.22s; }
        /* doc + rupee appear quickly after pans */
        .a9  { animation: drw 0.20s ease forwards 1.24s; }
        .a10 { animation: drw 0.14s ease forwards 1.34s; }
        .a11 { animation: drw 0.14s ease forwards 1.40s; }
        .a12 { animation: drw 0.14s ease forwards 1.46s; }
        .a13 { animation: drw 0.18s ease forwards 1.30s; }  /* rupee circle */
        .at  { opacity:0; animation: fadeIn 0.25s ease forwards 1.35s; }

        @keyframes drw    { to { stroke-dashoffset:0; } }
        @keyframes fadeIn { to { opacity:1; } }

        /* ── Beam-group rocking ── */
        .beam-grp { transform-box:fill-box; transform-origin:50% 0%; }
        .beam-grp.rock { animation: rock 2s cubic-bezier(.37,0,.63,1) infinite; }
        @keyframes rock {
          0%   { transform:rotate(-9deg); }
          50%  { transform:rotate(9deg);  }
          100% { transform:rotate(-9deg); }
        }

        /* ── Glow ── */
        .svg-glow { animation: glow 2.2s ease-in-out infinite; }
        @keyframes glow {
          0%,100% { filter:drop-shadow(0 0 6px rgba(212,146,74,0.3)); }
          50%     { filter:drop-shadow(0 0 22px rgba(212,146,74,0.6)); }
        }

        /* ── Separator lines ── */
        .sep {
          height:1px;
          background:linear-gradient(90deg,transparent,#B8742E 25%,#E8C87A 50%,#B8742E 75%,transparent);
          transform-origin:center;
          animation: sweepX 0.6s cubic-bezier(.16,1,.3,1) forwards 0.05s;
          transform:scaleX(0);
        }
        @keyframes sweepX { to { transform:scaleX(1); } }

        /* ── Letter reveal ── */
        @keyframes ltr {
          from { opacity:0; transform:translateY(7px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .lc { display:inline-block; animation:ltr 0.12s ease forwards; }

        /* ── Subtitle ── */
        @keyframes subIn {
          from { opacity:0; letter-spacing:0.35em; }
          to   { opacity:1; letter-spacing:0.2em;  }
        }
        .sub { animation:subIn 0.5s ease forwards; }
      `}</style>

      {/* Ambient glow behind everything */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 45% at 50% 48%, rgba(184,116,46,0.1) 0%, transparent 68%)",
      }}/>

      {/* Top line */}
      {step >= 1 && <div className="sep" style={{ width:400, marginBottom:52 }} />}
      {step < 1   && <div style={{ height:1, width:400, marginBottom:52 }} />}

      {/* ─── SCALES SVG ─────────────────────────── */}
      {/* Wide landscape viewBox so scales fill the space */}
      <div className={step >= 2 ? "svg-glow" : ""} style={{ marginBottom:36 }}>
        <svg className="ss" viewBox="0 0 220 140" width={280} height={178}>

          {/* Fixed: pillar + base */}
          <line className="dp a0" x1="110" y1="18" x2="110" y2="118" />
          <line className="dbs a8" x1="95"  y1="118" x2="125" y2="118" />

          {/* Rocking group: beam, chains, pans, icons */}
          <g className={`beam-grp${step >= 2 ? " rock" : ""}`}>

            {/* Beam — nearly full width */}
            <line className="db a1" x1="18" y1="38" x2="202" y2="38" />

            {/* Left chain */}
            <line className="dc a4" x1="21"  y1="38" x2="16"  y2="72" />
            {/* Right chain — slightly longer */}
            <line className="dc a5" x1="199" y1="38" x2="204" y2="76" />

            {/* Left pan — contract side */}
            <path className="dpl a6" d="M4 72 Q16 82 28 72" />
            {/* Right pan — money side, hangs lower */}
            <path className="dpr a7" d="M192 76 Q204 86 216 76" />

            {/* ── CONTRACT DOCUMENT (left pan) ── */}
            {/* Paper body */}
            <rect   className="ddi a9"  x="5"   y="55"  width="22" height="30" rx="2" />
            {/* Folded corner crease */}
            <polyline className="ddi a9" points="22,55 27,60 22,60" />
            {/* Text lines */}
            <line className="ddt a10" x1="8"  y1="64" x2="22" y2="64" />
            <line className="ddt a11" x1="8"  y1="69" x2="22" y2="69" />
            <line className="ddt a12" x1="8"  y1="74" x2="17" y2="74" />
            {/* Wax seal */}
            <circle className="ddi a12" cx="21.5" cy="77" r="3.5"
              style={{ strokeDasharray:100, strokeDashoffset:100 }} />

            {/* ── RUPEE COIN (right pan) ── */}
            {/* Outer coin ring */}
            <circle className="dcr a13" cx="204" cy="72" r="13"
              style={{ strokeDasharray:120, strokeDashoffset:120 }} />
            {/* Inner coin ring */}
            <circle className="ddt a13" cx="204" cy="72" r="9"
              style={{ strokeDasharray:90, strokeDashoffset:90 }} />
            {/* ₹ character */}
            <text className="at" x="204" y="78"
              textAnchor="middle" fontSize="15"
              fontFamily="'EB Garamond', Georgia, serif"
              fontWeight="700" fill="#E8A86A">₹</text>

          </g>
        </svg>
      </div>

      {/* ─── BRAND NAME ─────────────────────────── */}
      <div style={{
        fontFamily:"'EB Garamond', Georgia, serif",
        fontSize:"clamp(2.5rem,5vw,3.4rem)",
        fontWeight:500,
        letterSpacing:"-0.025em",
        lineHeight:1,
        height:"1.15em",
        marginBottom:14,
        minWidth:380,
        textAlign:"center",
      }}>
        {step >= 2 && LETTERS.slice(0, letterIdx).map((ch, i) => (
          <span key={i} className="lc" style={{
            color:     i >= 8 ? "#D4924A"  : "#F5F0E8",
            fontStyle: i >= 8 ? "italic"   : "normal",
          }}>{ch}</span>
        ))}
      </div>

      {/* ─── SUBTITLE ───────────────────────────── */}
      <div style={{ height:22 }}>
        {step >= 3 && (
          <div className="sub" style={{
            fontSize:"0.63rem", fontWeight:700,
            letterSpacing:"0.2em", textTransform:"uppercase",
            color:"#B8742E", textAlign:"center",
          }}>
            Protecting Indian MSMEs · Est. 2026
          </div>
        )}
      </div>

      {/* Bottom line */}
      {step >= 1 && <div className="sep" style={{ width:400, marginTop:52, animationDelay:"0.12s" }} />}
      {step < 1   && <div style={{ height:1, width:400, marginTop:52 }} />}
    </div>
  );
}
