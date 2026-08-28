/* ContractSense — Premium SVG Logo
   Scales of justice: contract paper (left) vs rupee coin (right)
   Consistent with splash screen design */

export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <svg
      width={s} height={s}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContractSense"
    >
      {/* Outer ring */}
      <circle cx="24" cy="24" r="22" stroke="#B8742E" strokeWidth="1.3" opacity="0.8" />
      {/* Inner thin ring */}
      <circle cx="24" cy="24" r="18.5" stroke="#B8742E" strokeWidth="0.4" opacity="0.3" />

      {/* Pillar */}
      <line x1="24" y1="11" x2="24" y2="39" stroke="#D4924A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <line x1="20" y1="39" x2="28" y2="39" stroke="#D4924A" strokeWidth="1.8" strokeLinecap="round" />

      {/* Beam */}
      <line x1="10" y1="17" x2="38" y2="17" stroke="#D4924A" strokeWidth="1.4" strokeLinecap="round" />

      {/* Left chain */}
      <line x1="11.5" y1="17" x2="10" y2="26" stroke="#C17D3C" strokeWidth="1" strokeLinecap="round" />
      {/* Right chain — slightly longer (lower pan = risk side) */}
      <line x1="36.5" y1="17" x2="38" y2="28" stroke="#C17D3C" strokeWidth="1" strokeLinecap="round" />

      {/* Left pan */}
      <path d="M6 26 Q10 29.5 14 26" stroke="#D4924A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Right pan — lower */}
      <path d="M34 28 Q38 31.5 42 28" stroke="#D4924A" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Contract document on left pan */}
      <rect x="7.5" y="22" width="5" height="6.5" rx="0.7" stroke="#E8A86A" strokeWidth="0.8" opacity="0.85" />
      <line x1="8.8" y1="24.2" x2="11.2" y2="24.2" stroke="#E8A86A" strokeWidth="0.5" opacity="0.7" />
      <line x1="8.8" y1="25.5" x2="11.2" y2="25.5" stroke="#E8A86A" strokeWidth="0.5" opacity="0.7" />
      <line x1="8.8" y1="26.8" x2="10.5" y2="26.8" stroke="#E8A86A" strokeWidth="0.5" opacity="0.5" />

      {/* Rupee ₹ on right pan */}
      <text
        x="38" y="28"
        textAnchor="middle"
        fontSize="6"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill="#E8A86A"
        opacity="0.9"
      >₹</text>
    </svg>
  );
}
