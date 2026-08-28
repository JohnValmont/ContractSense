export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContractSense Logo"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="lPillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8A5A28"/>
          <stop offset="30%" stopColor="#E0A840"/>
          <stop offset="70%" stopColor="#C17D3C"/>
          <stop offset="100%" stopColor="#6A3F18"/>
        </linearGradient>
        <linearGradient id="lBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0D070"/>
          <stop offset="50%" stopColor="#C17D3C"/>
          <stop offset="100%" stopColor="#8A5A28"/>
        </linearGradient>
        <radialGradient id="lPan" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E0A840"/>
          <stop offset="100%" stopColor="#5A3000"/>
        </radialGradient>
      </defs>

      {/* Dark premium seal background for contrast on light navbars */}
      <circle cx="60" cy="60" r="58" fill="#18120A" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#3A2D1C" strokeWidth="1.5" />
      
      {/* Background glow circle inside seal */}
      <circle cx="60" cy="60" r="48" fill="rgba(224,168,64,0.08)" />
      
      {/* Pillar */}
      <rect x="56" y="20" width="8" height="80" rx="4" fill="url(#lPillar)" />
      
      {/* Base */}
      <rect x="40" y="96" width="40" height="6" rx="3" fill="url(#lBeam)" />
      <rect x="40" y="96" width="40" height="2" rx="1" fill="rgba(255,230,140,0.4)" />

      {/* Beam */}
      <g transform="rotate(-6 60 40)">
        <rect x="15" y="38" width="90" height="6" rx="3" fill="url(#lBeam)" />
        <rect x="15" y="38" width="90" height="2" rx="1" fill="rgba(255,230,140,0.4)" />

        {/* Left chain */}
        <line x1="20" y1="41" x2="16" y2="68" stroke="#D4924A" strokeWidth="1.5" />
        {/* Right chain */}
        <line x1="100" y1="41" x2="104" y2="76" stroke="#D4924A" strokeWidth="1.5" />

        {/* Left pan (Contract side) */}
        <path d="M4 68 Q16 80 28 68 Z" fill="url(#lPan)" />
        <ellipse cx="16" cy="68" rx="12" ry="4" fill="url(#lPan)" stroke="#D4924A" strokeWidth="1" />
        
        {/* Contract Paper */}
        <g transform="translate(11, 48)">
          <rect x="0" y="0" width="12" height="16" rx="1" fill="#FFFBF0" stroke="#C8A050" strokeWidth="0.8" />
          <polygon points="9,0 12,0 12,3" fill="#C8A050" />
          <line x1="2" y1="6" x2="10" y2="6" stroke="#9B8040" strokeWidth="1" />
          <line x1="2" y1="9" x2="10" y2="9" stroke="#9B8040" strokeWidth="1" />
          <line x1="2" y1="12" x2="7" y2="12" stroke="#9B8040" strokeWidth="1" />
          <circle cx="9.5" cy="13" r="1.5" fill="#B8742E" />
        </g>

        {/* Right pan (Rupee side) */}
        <path d="M92 76 Q104 88 116 76 Z" fill="url(#lPan)" />
        <ellipse cx="104" cy="76" rx="12" ry="4" fill="url(#lPan)" stroke="#D4924A" strokeWidth="1" />

        {/* Rupee Coin */}
        <g transform="translate(104, 73)">
          <ellipse cx="0" cy="0" rx="9" ry="4" fill="#6B3800" />
          <ellipse cx="0" cy="-2" rx="9" ry="4" fill="#C88030" />
          <ellipse cx="0" cy="-4" rx="9" ry="4" fill="#F4D870" />
          <text x="0" y="-1.5" textAnchor="middle" fontSize="6" fontFamily="Georgia, serif" fontWeight="bold" fill="#3D1800">₹</text>
        </g>
      </g>
    </svg>
  );
}
