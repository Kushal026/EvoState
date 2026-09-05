import React from "react";
import Link from "next/link";
import { Scale, Terminal, Database, BookOpen, Layers } from "lucide-react";
import RigorousArchitectureComparison from "@/components/RigorousArchitectureComparison";

export default function ComparePage() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-400">
          <Scale className="h-3.5 w-3.5" /> Architecture Benchmarking
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Rigorous Architecture Comparison
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comparing 5 sequence modeling paradigms across 8 technical dimensions supported by primary sources. 
          Every claim is strictly classified by evidence tier: Published results, Independent theorems, Empirical sweeps, and Educational simplifications.
        </p>
      </div>

      {/* Main Architecture Matrix Component */}
      <section>
        <RigorousArchitectureComparison />
      </section>

      {/* Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <Link
          href="/lab"
          className="rounded-xl border border-white/10 bg-[#07090e] p-4 hover:border-blue-500/40 transition-all block"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Terminal className="h-4 w-4" /> Interactive Lab
          </div>
          <p className="text-[11px] text-slate-400">Test these architectural differences directly in the simulator.</p>
        </Link>

        <Link
          href="/bdh"
          className="rounded-xl border border-white/10 bg-[#07090e] p-4 hover:border-emerald-500/40 transition-all block"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Layers className="h-4 w-4" /> BDH Architecture
          </div>
          <p className="text-[11px] text-slate-400">Deep dive into the BDH synaptic equations from primary literature.</p>
        </Link>

        <Link
          href="/research"
          className="rounded-xl border border-white/10 bg-[#07090e] p-4 hover:border-cyan-500/40 transition-all block"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Database className="h-4 w-4" /> Empirical Sweeps
          </div>
          <p className="text-[11px] text-slate-400">Inspect 2,700 real benchmark trials and 300 DPI publication plots.</p>
        </Link>
      </div>

    </div>
  );
}
