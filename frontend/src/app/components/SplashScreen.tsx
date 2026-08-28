"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"drawing" | "logo" | "fadeout">("drawing");

  useEffect(() => {
    // Phase 1: draw the lawyer for 2.4s
    const t1 = setTimeout(() => setPhase("logo"), 2400);
    // Phase 2: show logo for 1.2s then fade out
    const t2 = setTimeout(() => setPhase("fadeout"), 3600);
    // Phase 3: unmount after fade
    const t3 = setTimeout(() => onDone(), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0F0B06",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.75s cubic-bezier(.4,0,.2,1)",
        pointerEvents: phase === "fadeout" ? "none" : "all",
      }}
    >
      <style>{`
        /* Each path draws itself in sequence */
        .lawyer-svg path, .lawyer-svg line, .lawyer-svg rect, .lawyer-svg circle, .lawyer-svg polyline {
          fill: none;
          stroke: #B8742E;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
        .draw-1  { animation: drawPath 0.38s ease forwards 0.05s; stroke-width: 2.5; }
        .draw-2  { animation: drawPath 0.35s ease forwards 0.30s; stroke-width: 2.5; }
        .draw-3  { animation: drawPath 0.30s ease forwards 0.55s; stroke-width: 2;   }
        .draw-4  { animation: drawPath 0.28s ease forwards 0.72s; stroke-width: 2;   }
        .draw-5  { animation: drawPath 0.32s ease forwards 0.88s; stroke-width: 2;   }
        .draw-6  { animation: drawPath 0.28s ease forwards 1.05s; stroke-width: 2;   }
        .draw-7  { animation: drawPath 0.26s ease forwards 1.18s; stroke-width: 1.8; }
        .draw-8  { animation: drawPath 0.24s ease forwards 1.32s; stroke-width: 1.8; }
        .draw-9  { animation: drawPath 0.22s ease forwards 1.45s; stroke-width: 1.5; }
        .draw-10 { animation: drawPath 0.20s ease forwards 1.58s; stroke-width: 1.5; }
        .draw-11 { animation: drawPath 0.22s ease forwards 1.70s; stroke-width: 1.5; }
        .draw-12 { animation: drawPath 0.25s ease forwards 1.85s; stroke-width: 1.8; }
        .draw-13 { animation: drawPath 0.28s ease forwards 2.00s; stroke-width: 2;   }
        .draw-14 { animation: drawPath 0.20s ease forwards 2.18s; stroke-width: 1.5; }
        .draw-15 { animation: drawPath 0.18s ease forwards 2.28s; stroke-width: 1.5; }

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        .logo-reveal {
          opacity: 0;
          transform: scale(0.88) translateY(10px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .logo-reveal.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .tagline-reveal {
          opacity: 0;
          transition: opacity 0.5s ease 0.3s;
        }
        .tagline-reveal.visible {
          opacity: 1;
        }

        @keyframes walkCycle {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(8px); }
        }
        .lawyer-walk {
          animation: walkCycle 0.45s ease-in-out infinite alternate;
        }
      `}</style>

      {/* ── Walking Lawyer SVG ────────────────────────── */}
      <div className={phase === "drawing" ? "lawyer-walk" : ""} style={{ opacity: phase === "logo" ? 0 : 1, transition: "opacity 0.4s ease", width: 180, height: 220 }}>
        <svg className="lawyer-svg" viewBox="0 0 120 160" width="180" height="220">

          {/* HEAD */}
          <circle className="draw-1" cx="60" cy="18" r="12" />

          {/* NECK */}
          <line className="draw-2" x1="60" y1="30" x2="60" y2="36" />

          {/* SUIT COLLAR LEFT */}
          <path className="draw-3" d="M60,36 L50,44 L54,50" />
          {/* SUIT COLLAR RIGHT */}
          <path className="draw-4" d="M60,36 L70,44 L66,50" />

          {/* TORSO / JACKET */}
          <path className="draw-5" d="M44,44 Q38,70 40,90 L80,90 Q82,70 76,44 Z" />

          {/* TIE */}
          <path className="draw-6" d="M57,44 L60,56 L63,44" />

          {/* LEFT ARM (swinging) */}
          <path className="draw-7" d="M44,50 Q32,65 28,80" />
          {/* LEFT HAND */}
          <circle className="draw-8" cx="27" cy="82" r="3" />

          {/* RIGHT ARM (holding briefcase) */}
          <path className="draw-9" d="M76,50 Q85,65 88,78" />

          {/* BRIEFCASE HANDLE */}
          <path className="draw-10" d="M84,78 Q86,73 90,73 Q94,73 96,78" />
          {/* BRIEFCASE BODY */}
          <rect className="draw-11" x="82" y="78" width="16" height="11" rx="2" />
          {/* BRIEFCASE CLASP */}
          <line className="draw-12" x1="82" y1="83" x2="98" y2="83" />

          {/* TROUSERS */}
          <path className="draw-13" d="M40,90 L38,130 L54,130 L60,108 L66,130 L82,130 L80,90 Z" />

          {/* LEFT LEG (stepped forward) */}
          <path className="draw-14" d="M38,130 Q36,140 34,148" />
          {/* LEFT SHOE */}
          <path className="draw-15" d="M34,148 Q30,152 26,152 Q24,152 24,150 L30,148 Z" />

          {/* RIGHT LEG (back) */}
          <path className="draw-14" d="M82,130 Q84,140 86,148" />
          {/* RIGHT SHOE */}
          <path className="draw-15" d="M86,148 Q90,152 94,152 Q96,152 96,150 L90,148 Z" />

          {/* HAT */}
          <path className="draw-2" d="M48,8 L72,8" />
          <path className="draw-3" d="M52,8 Q52,2 68,2 L68,8" />

          {/* Motion lines */}
          <line className="draw-14" x1="16" y1="70" x2="22" y2="70" stroke="#B8742E" strokeOpacity="0.4" />
          <line className="draw-15" x1="13" y1="78" x2="20" y2="78" stroke="#B8742E" strokeOpacity="0.3" />
          <line className="draw-15" x1="15" y1="62" x2="20" y2="62" stroke="#B8742E" strokeOpacity="0.2" />
        </svg>
      </div>

      {/* ── Logo + Brand Reveal ───────────────────────── */}
      <div
        className={`logo-reveal ${phase === "logo" ? "visible" : ""}`}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
      >
        <div style={{
          width: 120, height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(184,116,46,0.4)",
          boxShadow: "0 0 40px rgba(184,116,46,0.2), 0 0 80px rgba(184,116,46,0.08)",
        }}>
          <Image
            src="/logo-premium.jpg"
            alt="ContractSense Logo"
            width={120}
            height={120}
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#F5F0E8",
            letterSpacing: "-0.03em",
          }}>
            ContractSense
          </div>
          <div className={`tagline-reveal ${phase === "logo" ? "visible" : ""}`} style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#B8742E",
            marginTop: "0.3rem",
          }}>
            Protecting Indian MSMEs
          </div>
        </div>
      </div>

      {/* Bottom shimmer bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, #B8742E, transparent)",
        animation: "shimmer 2s ease-in-out infinite",
        width: "100%",
        opacity: 0.5,
      }} />
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
