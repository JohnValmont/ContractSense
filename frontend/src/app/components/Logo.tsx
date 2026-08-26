/* ContractSense — Wordmark Logo (SVG)
   A refined monogram: "CS" letterform inside a clean badge frame.
   No gimmicks. The kind of mark a serious legal-tech firm would commission. */

export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  const h = size;
  const w = Math.round(size * 0.9); // slight landscape ratio

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContractSense"
    >
      {/* Outer rounded rectangle frame */}
      <rect x="1" y="1" width="34" height="38" rx="7" ry="7"
        fill="#1A1208" stroke="rgba(196,154,78,0.5)" strokeWidth="1.25" />

      {/* Top gold rule line */}
      <rect x="8" y="10" width="20" height="1.5" rx="0.75" fill="#C49A4E" />

      {/* Stylized "C" — left arc */}
      <path
        d="M21.5 16.5C20.2 15.6 18.6 15 17 15C13.1 15 10 18.1 10 22C10 25.9 13.1 29 17 29C18.6 29 20.2 28.4 21.5 27.5"
        stroke="#F8F6F0"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
      />

      {/* Stylized inner serif accent bar cutting through C */}
      <path
        d="M21 21H26"
        stroke="#C49A4E"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Bottom gold rule line */}
      <rect x="8" y="28.5" width="20" height="1.5" rx="0.75" fill="#C49A4E" opacity="0.4" />
    </svg>
  );
}
