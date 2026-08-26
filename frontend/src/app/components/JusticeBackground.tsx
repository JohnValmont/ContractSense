import React from "react";

export default function JusticeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "120vw",
        height: "120vh",
        zIndex: -1,
        opacity: 0.04,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "80%", height: "80%", maxWidth: "800px" }}
      >
        {/* Lady of Justice / Scales of Justice abstract line art */}
        <path
          d="M50 10 L50 90 M30 30 L70 30 M30 30 L20 60 M30 30 L40 60 M20 60 L40 60 M70 30 L60 60 M70 30 L80 60 M60 60 L80 60 M40 90 L60 90"
          stroke="var(--accent-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="15" r="5" stroke="var(--accent-color)" strokeWidth="2" />
        <path d="M45 25 L55 25 L55 85 L45 85 Z" fill="var(--accent-color)" opacity="0.5" />
      </svg>
    </div>
  );
}
