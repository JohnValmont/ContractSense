/* ContractSense — Hand-crafted premium SVG logo
   Clean geometric scales of justice mark. No AI image. */

export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContractSense"
    >
      {/* Outer circle ring */}
      <circle cx="24" cy="24" r="22" stroke="#B8742E" strokeWidth="1.4" fill="none" opacity="0.7" />

      {/* Inner thin ring */}
      <circle cx="24" cy="24" r="19" stroke="#B8742E" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Center column / pillar */}
      <line x1="24" y1="12" x2="24" y2="38" stroke="#D4924A" strokeWidth="1.6" strokeLinecap="round" />

      {/* Top beam of scales */}
      <line x1="11" y1="18" x2="37" y2="18" stroke="#D4924A" strokeWidth="1.6" strokeLinecap="round" />

      {/* Left scale chain */}
      <line x1="13" y1="18" x2="11" y2="26" stroke="#C17D3C" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right scale chain */}
      <line x1="35" y1="18" x2="37" y2="26" stroke="#C17D3C" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left scale pan */}
      <path d="M7 26 Q11 29.5 15 26" stroke="#D4924A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Right scale pan — slightly lower (unbalanced = risk) */}
      <path d="M33 28 Q37 31.5 41 28" stroke="#D4924A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Base of pillar */}
      <line x1="20" y1="38" x2="28" y2="38" stroke="#D4924A" strokeWidth="1.8" strokeLinecap="round" />

      {/* Tiny document lines on left pan */}
      <line x1="9.5" y1="25.5" x2="12.5" y2="25.5" stroke="#E8A86A" strokeWidth="0.8" opacity="0.7" />
      <line x1="9.5" y1="27" x2="12.5" y2="27" stroke="#E8A86A" strokeWidth="0.8" opacity="0.5" />

      {/* Tiny coin stack on right pan */}
      <ellipse cx="37" cy="28.5" rx="2.5" ry="0.8" stroke="#E8A86A" strokeWidth="0.8" fill="none" opacity="0.7" />
      <ellipse cx="37" cy="27.5" rx="2.5" ry="0.8" stroke="#E8A86A" strokeWidth="0.8" fill="none" opacity="0.5" />
    </svg>
  );
}
