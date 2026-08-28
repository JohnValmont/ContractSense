/* ContractSense — Modern Enterprise Logo (SVG)
   A sleek, modern geometric mark combining a shield, document, and network node.
   Conveys security, legal compliance, and AI/Blockchain technology. */

export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  const h = size;
  const w = size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContractSense"
    >
      {/* Background Shield/Node */}
      <path d="M16 2L3 7v8.5C3 22.5 8.5 28.5 16 31c7.5-2.5 13-8.5 13-15.5V7l-13-5z" fill="url(#grad1)" stroke="#C17D3C" strokeWidth="1.5" strokeLinejoin="round"/>
      
      {/* Inner geometric lines (Document/Network) */}
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
