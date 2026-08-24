import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-serif" });

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
      <body className={`${inter.variable} ${merriweather.variable}`}>
        {children}
      </body>
    </html>
  );
}
