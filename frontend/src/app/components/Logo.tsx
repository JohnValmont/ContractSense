export default function Logo({ size = 32, className = "", dark = false }: { size?: number; className?: string; dark?: boolean }) {
  return (
    <img
      src="/custom_logo.jpg"
      alt="ContractSense Logo"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        mixBlendMode: dark ? "screen" : "multiply",
        filter: dark ? "invert(1) hue-rotate(180deg) brightness(1.5)" : "none",
        borderRadius: "50%",
      }}
    />
  );
}
