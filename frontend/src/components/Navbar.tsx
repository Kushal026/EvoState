"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Scale, 
  Database, 
  BookOpen, 
  ArrowRight,
  Menu,
  X,
  Sparkles
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/lab", label: "Lab", icon: Terminal, highlight: true },
  { href: "/concept", label: "Concept", icon: Layers },
  { href: "/bdh", label: "BDH", icon: ShieldCheck },
  { href: "/bdh-cq", label: "BDH-CQ", icon: Cpu },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/research", label: "Research", icon: Database },
  { href: "/about", label: "Defense & FAQ", icon: BookOpen }
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05070d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#090d16]">
              <Activity className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">EVOSTATE</span>
            <p className="text-[11px] text-slate-400 leading-tight">Evolving Memory Lab</p>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
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

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/lab"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30 active:scale-95"
          >
            <span>Launch Lab</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#060810]/98 px-4 py-4 space-y-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/lab"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Interactive Lab →</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
