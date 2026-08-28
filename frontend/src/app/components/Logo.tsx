/* ContractSense — Premium Logo Component
   Uses the generated AAA-grade Lady Justice emblem image.
   Falls back to inline SVG for tiny sizes (< 24px). */

import Image from "next/image";

export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  if (size < 24) {
    // Inline SVG fallback for tiny usages (favicons, small icons)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="ContractSense"
      >
        <path d="M16 2L3 7v8.5C3 22.5 8.5 28.5 16 31c7.5-2.5 13-8.5 13-15.5V7l-13-5z" fill="url(#grad1)" stroke="#C17D3C" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M16 8v16M10 13l6-3 6 3M10 19l6 3 6-3" stroke="#F5F2EC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="16" r="3" fill="#1A1208" stroke="#F5F2EC" strokeWidth="1.5"/>
        <defs>
          <linearGradient id="grad1" x1="16" y1="2" x2="16" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A1208" />
            <stop offset="1" stopColor="#3D2B1A" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "1.5px solid rgba(184,116,46,0.5)",
        boxShadow: "0 2px 12px rgba(184,116,46,0.15)",
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo-premium.jpg"
        alt="ContractSense"
        width={size}
        height={size}
        style={{ objectFit: "cover", display: "block" }}
        priority
      />
    </div>
  );
}
