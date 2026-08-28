import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractSense | Legal Risk Analysis Platform",
  description: "Automated clause-risk analyzer for Indian MSME vendor contracts. Detects unfair terms, references the MSME Development Act 2006, and provides redline suggestions.",
  keywords: ["MSME", "contract analysis", "vendor contract", "India", "legal tech", "compliance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
