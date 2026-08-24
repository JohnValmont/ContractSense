import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ContractSense | AI MSME Contract Analyzer",
  description: "AI-powered clause-risk analyzer for Indian MSME vendor contracts. Detects unfair terms, references the MSME Development Act 2006, and provides redline suggestions.",
  keywords: ["MSME", "contract analysis", "AI", "vendor contract", "India", "legal tech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
