"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Cpu, Database, BookOpen, Layers, ShieldCheck, Terminal, Sparkles, Scale } from "lucide-react";
import { checkBackendHealth } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/lab", label: "Memory Lab", icon: Terminal, highlight: true },
  { href: "/why-it-matters", label: "Why It Matters", icon: Layers },
  { href: "/bdh", label: "BDH", icon: ShieldCheck },
  { href: "/bdh-cq", label: "BDH-CQ", icon: Cpu },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/research", label: "Research", icon: Database },
  { href: "/about", label: "About", icon: BookOpen }
];

export default function Navbar() {
  const pathname = usePathname();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendOnline(res.connected);
    });
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => setBackendOnline(res.connected));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05070d]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#090d16]">
              <Activity className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white">DATAFORGE</span>
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-blue-400 border border-blue-500/20">
                EvoState
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Evolving Memory Lab</p>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : link.highlight
                    ? "text-blue-300 hover:bg-blue-500/10 hover:text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Badge & Lab Launch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono">
            <span
              className={`h-2 w-2 rounded-full animate-pulse ${
                backendOnline === null
                  ? "bg-amber-400"
                  : backendOnline
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
              }`}
            />
            <span className="text-slate-300 hidden sm:inline">
              {backendOnline === null ? "Detecting..." : backendOnline ? "FastAPI Live" : "Client Engine"}
            </span>
          </div>

          <Link
            href="/lab"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30 active:scale-95"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Memory Lab</span>
            <span className="sm:hidden">Lab</span>
          </Link>
        </div>

      </div>

      {/* Mobile Scrollable Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-white/5 px-4 py-2 gap-1.5 scrollbar-none bg-[#07090e]">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-md font-medium shrink-0 ${
                isActive ? "bg-blue-500/20 text-blue-300 font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
