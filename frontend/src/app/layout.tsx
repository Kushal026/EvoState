import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DataForge: Evolving Memory Lab | 2026 Pathway Track",
  description:
    "Scientific AI laboratory exploring Long-Horizon Evolving States, information superposition, and Inference-Time Scaling.",
  keywords: [
    "State Space Models",
    "Evolving State",
    "Inference-Time Scaling",
    "BDH",
    "BDH-CQ",
    "Mamba",
    "Linear Recurrence",
    "Deep Learning Research"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05070d] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
