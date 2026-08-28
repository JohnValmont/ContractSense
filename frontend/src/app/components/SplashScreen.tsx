"use client";

import { useEffect, useState } from "react";

const BRAND = "ContractSense";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [step,      setStep]      = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1),  80),
      setTimeout(() => setStep(2), 1550),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => setStep(4), 3200),
      setTimeout(() => onDone(),   3900),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    if (step < 2) { setLetterIdx(0); return; }
    if (letterIdx >= BRAND.length) return;
    const t = setTimeout(() => setLetterIdx(i => i + 1), 55);
    return () => clearTimeout(t);
  }, [step, letterIdx]);

  const draw = step >= 1;
  const rock = step >= 2;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#08060A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: step >= 4 ? 0 : 1,
      transition: step >= 4 ? "opacity 0.7s ease" : "none",
    }}>
      <style>{`
        /* ── Sequential reveal ── */
        .fa { opacity:0; }
        .fa.show { animation: fadeUp 0.32s ease forwards; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(5px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .d1  { animation-delay:0.05s; }
        .d2  { animation-delay:0.22s; }
        .d3  { animation-delay:0.38s; }
        .d4  { animation-delay:0.52s; }
        .d5  { animation-delay:0.62s; }
        .d6  { animation-delay:0.75s; }
        .d7  { animation-delay:0.88s; }
        .d8  { animation-delay:1.00s; }

        /* ── 3D CSS perspective tilt ── */
        .tilt {
          transform: perspective(900px) rotateX(14deg) rotateY(-7deg);
          transform-style: preserve-3d;
          transition: transform 0.8s ease;
        }

        /* ── Beam group rocking ── */
        .bg { transform-box:fill-box; transform-origin:50% 0%; }
        .bg.rock { animation: rock 2s cubic-bezier(.37,0,.63,1) infinite; }
        @keyframes rock {
          0%   { transform:rotate(-8deg); }
          50%  { transform:rotate(8deg); }
          100% { transform:rotate(-8deg); }
        }

        /* ── SVG glow ── */
        .svgg { animation: svgGlow 2.4s ease-in-out infinite; }
        @keyframes svgGlow {
          0%,100% { filter: drop-shadow(0 10px 24px rgba(212,146,74,0.35)); }
          50%     { filter: drop-shadow(0 10px 38px rgba(212,146,74,0.65)); }
        }

        /* ── Separator ── */
        .sep {
          height:1px;
          background: linear-gradient(90deg, transparent, #B8742E 25%, #EED080 50%, #B8742E 75%, transparent);
          animation: sweepX 0.55s cubic-bezier(.16,1,.3,1) forwards;
          transform: scaleX(0); transform-origin: center;
        }
        @keyframes sweepX { to { transform:scaleX(1); } }

        /* ── Letters ── */
        @keyframes ltr {
          from { opacity:0; transform:translateY(7px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .lc { display:inline-block; animation:ltr 0.11s ease forwards; }

        /* ── Subtitle ── */
        @keyframes subIn {
          from { opacity:0; letter-spacing:.35em; }
          to   { opacity:1; letter-spacing:.2em; }
        }
        .sub { animation:subIn 0.5s ease forwards; }
      `}</style>

      {/* Ambient radial glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 65% 48% at 50% 48%, rgba(184,116,46,0.11) 0%, transparent 68%)",
      }}/>

      {/* Top separator */}
      {draw && <div className="sep" style={{ width:430, marginBottom:48 }}/>}
      {!draw && <div style={{ height:1, width:430, marginBottom:48 }}/>}

      {/* ─────────────── 3D SCALES SVG ─────────────── */}
      <div className={rock ? "svgg" : ""} style={{ marginBottom:32 }}>
        <div className={draw ? "tilt" : ""}>
          <svg viewBox="0 0 300 178" width={330} height={196} overflow="visible">
            <defs>
              {/* Cylindrical pillar gradient */}
              <linearGradient id="gPillar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#3D1F00"/>
                <stop offset="25%"  stopColor="#E0A840"/>
                <stop offset="60%"  stopColor="#C17D3C"/>
                <stop offset="100%" stopColor="#2A1000"/>
              </linearGradient>

              {/* Beam gradient: top-lit rod */}
              <linearGradient id="gBeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F0D070"/>
                <stop offset="45%"  stopColor="#C17D3C"/>
                <stop offset="100%" stopColor="#3D1800"/>
              </linearGradient>

              {/* Pan bowl: radial, lighter at top rim */}
              <radialGradient id="gPan" cx="50%" cy="25%" r="80%">
                <stop offset="0%"   stopColor="#D4924A" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#1A0800" stopOpacity="0.95"/>
              </radialGradient>

              {/* Paper: cream-gold gradient */}
              <linearGradient id="gPaper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#FFFBF0"/>
                <stop offset="100%" stopColor="#DFC880"/>
              </linearGradient>
              {/* Paper right-edge bevel */}
              <linearGradient id="gPaperEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#C8A050"/>
                <stop offset="100%" stopColor="#7A5020"/>
              </linearGradient>

              {/* Coin gold gradient */}
              <radialGradient id="gCoin" cx="38%" cy="32%" r="65%">
                <stop offset="0%"   stopColor="#F4D870"/>
                <stop offset="60%"  stopColor="#C88030"/>
                <stop offset="100%" stopColor="#6B3800"/>
              </radialGradient>
              {/* Coin edge gradient */}
              <linearGradient id="gCoinEdge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4924A"/>
                <stop offset="100%" stopColor="#5A2800"/>
              </linearGradient>

              {/* Drop shadow */}
              <filter id="fShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.75"/>
              </filter>
              {/* Inner glow */}
              <filter id="fGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.8" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ── FIXED PILLAR ─────────────────────── */}
            {draw && <>
              {/* Shadow cast by pillar */}
              <rect className="fa show d1" x="154" y="22" width="10" height="136" rx="4" fill="rgba(0,0,0,0.55)"/>
              {/* Pillar body */}
              <rect className="fa show d1" x="147" y="18" width="14" height="136" rx="6" fill="url(#gPillar)" filter="url(#fGlow)"/>
              {/* Highlight streak */}
              <rect className="fa show d1" x="150" y="20" width="3" height="130" rx="1.5" fill="rgba(255,225,140,0.3)"/>
            </>}

            {/* ── FIXED BASE ───────────────────────── */}
            {draw && <>
              {/* Base shadow */}
              <rect className="fa show d2" x="128" y="157" width="50" height="11" rx="4" fill="rgba(0,0,0,0.5)"/>
              {/* Base body */}
              <rect className="fa show d2" x="124" y="150" width="54" height="13" rx="5" fill="url(#gBeam)" filter="url(#fShadow)"/>
              {/* Base top highlight */}
              <rect className="fa show d2" x="124" y="150" width="54" height="3.5" rx="3" fill="rgba(255,225,120,0.3)"/>
            </>}

            {/* ── ROCKING GROUP ─────────────────────── */}
            <g className={`bg${rock ? " rock" : ""}`}>

              {/* Beam (3D rod) */}
              {draw && <>
                <rect className="fa show d3" x="22" y="48" width="258" height="8" rx="3" fill="rgba(0,0,0,0.5)"/>
                <rect className="fa show d3" x="20" y="41" width="262" height="10" rx="4.5" fill="url(#gBeam)" filter="url(#fGlow)"/>
                <rect className="fa show d3" x="20" y="41" width="262" height="3"   rx="3" fill="rgba(255,230,130,0.38)"/>
              </>}

              {/* Left chain */}
              {draw && <>
                <line className="fa show d4" x1="25" y1="51" x2="18" y2="95" stroke="#5A3000" strokeWidth="4" strokeLinecap="round"/>
                <line className="fa show d4" x1="25" y1="51" x2="18" y2="95" stroke="#D4924A" strokeWidth="2"  strokeLinecap="round"/>
              </>}

              {/* Right chain */}
              {draw && <>
                <line className="fa show d4" x1="277" y1="51" x2="284" y2="99" stroke="#5A3000" strokeWidth="4" strokeLinecap="round"/>
                <line className="fa show d4" x1="277" y1="51" x2="284" y2="99" stroke="#D4924A" strokeWidth="2"  strokeLinecap="round"/>
              </>}

              {/* ── LEFT PAN (3D bowl) ── */}
              {draw && <>
                {/* Bowl shadow underside */}
                <path className="fa show d5" d="M0 99 Q18 112 36 99 L32 104 Q18 115 4 104 Z" fill="rgba(0,0,0,0.45)"/>
                {/* Bowl body */}
                <path className="fa show d5" d="M3 96 Q18 110 33 96 L30 100 Q18 112 6 100 Z" fill="url(#gPan)"/>
                {/* Pan rim (top ellipse) */}
                <ellipse className="fa show d5" cx="18" cy="96" rx="18" ry="7" fill="url(#gPan)" stroke="#C17D3C" strokeWidth="1.8"/>
                {/* Rim highlight */}
                <ellipse className="fa show d5" cx="15" cy="93" rx="11" ry="3.5" fill="none" stroke="rgba(255,220,120,0.3)" strokeWidth="1"/>
              </>}

              {/* ── CONTRACT DOCUMENT ── */}
              {draw && <>
                {/* 3D shadow */}
                <rect className="fa show d6" x="7" y="68" width="26" height="32" rx="2" fill="rgba(0,0,0,0.55)" transform="translate(3,5)"/>
                {/* 3D right bevel */}
                <rect className="fa show d6" x="33" y="68" width="5"  height="32" rx="1.5" fill="url(#gPaperEdge)"/>
                {/* 3D bottom bevel */}
                <rect className="fa show d6" x="7"  y="97" width="31" height="4"  rx="1.5" fill="url(#gPaperEdge)"/>
                {/* Main paper face */}
                <rect className="fa show d6" x="7" y="63" width="26" height="34" rx="2" fill="url(#gPaper)"/>
                {/* Folded corner */}
                <polygon className="fa show d6" points="27,63 33,63 33,69" fill="#C8A050"/>
                <polygon className="fa show d6" points="27,63 33,69 27,69" fill="rgba(255,245,215,0.9)"/>
                {/* Lines (contract text) */}
                <line className="fa show d6" x1="10" y1="73" x2="26" y2="73" stroke="#9B8040" strokeWidth="1.6" strokeLinecap="round"/>
                <line className="fa show d6" x1="10" y1="78" x2="26" y2="78" stroke="#9B8040" strokeWidth="1.6" strokeLinecap="round"/>
                <line className="fa show d6" x1="10" y1="83" x2="21" y2="83" stroke="#9B8040" strokeWidth="1.6" strokeLinecap="round"/>
                {/* Wax seal */}
                <circle className="fa show d6" cx="26" cy="90" r="5.5" fill="#B8742E"/>
                <circle className="fa show d6" cx="26" cy="90" r="4"   fill="none" stroke="rgba(255,210,100,0.7)" strokeWidth="0.8"/>
                <text className="fa show d6" x="26" y="92.5" textAnchor="middle" fontSize="5" fill="rgba(255,230,130,0.9)" fontFamily="serif">✦</text>
              </>}

              {/* ── RIGHT PAN (3D bowl) ── */}
              {draw && <>
                {/* Bowl shadow */}
                <path className="fa show d5" d="M264 103 Q282 116 300 103 L296 108 Q282 118 268 108 Z" fill="rgba(0,0,0,0.45)"/>
                {/* Bowl body */}
                <path className="fa show d5" d="M267 100 Q282 114 297 100 L294 104 Q282 116 270 104 Z" fill="url(#gPan)"/>
                {/* Pan rim */}
                <ellipse className="fa show d5" cx="282" cy="100" rx="18" ry="7" fill="url(#gPan)" stroke="#C17D3C" strokeWidth="1.8"/>
                {/* Rim highlight */}
                <ellipse className="fa show d5" cx="279" cy="97"  rx="11" ry="3.5" fill="none" stroke="rgba(255,220,120,0.3)" strokeWidth="1"/>
              </>}

              {/* ── RUPEE COIN STACK ── */}
              {draw && <>
                {/* Coin shadow */}
                <ellipse className="fa show d7" cx="284" cy="107" rx="17" ry="5.5" fill="rgba(0,0,0,0.55)"/>

                {/* Bottom coin edge */}
                <rect className="fa show d7" x="267" y="84" width="34" height="14" rx="3" fill="url(#gCoinEdge)"/>
                {/* Bottom coin face */}
                <ellipse className="fa show d7" cx="284" cy="84" rx="17" ry="6.5" fill="url(#gCoin)" stroke="#D4924A" strokeWidth="1"/>

                {/* Middle coin edge */}
                <rect className="fa show d7" x="267" y="75" width="34" height="11" rx="3" fill="url(#gCoinEdge)"/>
                {/* Middle coin face */}
                <ellipse className="fa show d7" cx="284" cy="75" rx="17" ry="6.5" fill="url(#gCoin)" stroke="#D4924A" strokeWidth="1"/>

                {/* Top coin edge */}
                <rect className="fa show d8" x="267" y="66" width="34" height="11" rx="3" fill="url(#gCoinEdge)"/>
                {/* Top coin face */}
                <ellipse className="fa show d8" cx="284" cy="66" rx="17" ry="6.5" fill="url(#gCoin)" stroke="#F0D080" strokeWidth="1.5"/>
                {/* Top coin highlight */}
                <ellipse className="fa show d8" cx="279" cy="63" rx="9"  ry="3"   fill="rgba(255,245,190,0.3)"/>
                {/* ₹ symbol */}
                <text className="fa show d8"
                  x="284" y="69.5" textAnchor="middle"
                  fontSize="12" fontFamily="'EB Garamond', Georgia, serif"
                  fontWeight="bold" fill="#1C0800">₹</text>
              </>}
            </g>
          </svg>
        </div>
      </div>

      {/* ─── Brand name ─────────────────────── */}
      <div style={{
        fontFamily:"'EB Garamond', Georgia, serif",
        fontSize:"clamp(2.6rem,5.2vw,3.6rem)",
        fontWeight:500, letterSpacing:"-0.025em", lineHeight:1,
        height:"1.15em", marginBottom:14, minWidth:420, textAlign:"center",
      }}>
        {step >= 2 && BRAND.split("").slice(0, letterIdx).map((ch, i) => (
          <span key={i} className="lc" style={{
            color:     i >= 8 ? "#D4924A" : "#F5F0E8",
            fontStyle: i >= 8 ? "italic"  : "normal",
          }}>{ch}</span>
        ))}
      </div>

      {/* Subtitle */}
      <div style={{ height:22 }}>
        {step >= 3 && <div className="sub" style={{
          fontSize:"0.63rem", fontWeight:700,
          letterSpacing:"0.2em", textTransform:"uppercase",
          color:"#B8742E", textAlign:"center",
        }}>Protecting Indian MSMEs · Est. 2026</div>}
      </div>

      {draw && <div className="sep" style={{ width:430, marginTop:48, animationDelay:"0.1s" }}/>}
      {!draw && <div style={{ height:1, width:430, marginTop:48 }}/>}
    </div>
  );
}
