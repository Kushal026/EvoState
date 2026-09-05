import React from "react";
import Link from "next/link";
import { Terminal, Layers, ShieldCheck, Cpu, Database, ArrowRight, Activity, Sparkles, Scale, BookOpen } from "lucide-react";
import HeroStateDemo from "@/components/HeroStateDemo";
import SixtySecondExperiment from "@/components/SixtySecondExperiment";

export default function HomePage() {
  return (
    <div className="space-y-12">
      
      {/* Hero Headline & Key Scientific Question */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
          <Activity className="h-3.5 w-3.5" />
          DataForge 2026 Pathway Track &bull; Evolving Memory Lab
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Can a tiny state remember a long sequence?
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Dissecting the algebraic mechanics of <strong className="text-blue-400 font-medium">Long-Horizon Evolving States</strong>, the limits of information superposition, and the de-noising power of <strong className="text-purple-400 font-medium">Inference-Time Scaling</strong>.
        </p>

        {/* Central Falsifiable Claim Callout */}
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-purple-950/40 p-4 sm:p-5">
          <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider mb-1.5 font-semibold">
            Central Falsifiable Claim Tested:
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed italic">
            &ldquo;A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery.&rdquo;
          </p>
        </div>
      </div>

      {/* 60-Second Rapid Run Interactive Section */}
      <section className="space-y-3">
        <SixtySecondExperiment />
      </section>

      {/* Immediate Interactive Concept Demonstration */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-400" /> State Memory Compression vs Full KV Cache
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">Zero Authentication &bull; Real-time Client Execution</span>
        </div>
        
        <HeroStateDemo />
      </section>

      {/* Structured Investigation Pathways */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Structured Laboratory Pathways</h3>
          <p className="text-xs text-slate-400 mt-1">Explore interactive benchmarks, mathematical theory, post-transformer architectures, and empirical sweeps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Pathway 1: Memory Lab */}
          <Link
            href="/lab"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-blue-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                Memory Lab (5 Core Stages)
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Step-by-step guided exploration: Remember, Stretch, Attack, Recover, and Look Inside with real-time state traces.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-blue-400">
              <span>Launch Lab</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pathway 2: Why It Matters */}
          <Link
            href="/why-it-matters"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-indigo-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Why It Matters
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                The crisis of quadratic KV-cache memory, Johnson-Lindenstrauss limits, and the promise of constant-memory sequence models.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-indigo-400">
              <span>Read Foundations</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pathway 3: BDH Standard */}
          <Link
            href="/bdh"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-emerald-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                BDH Architecture &amp; Synaptic Memory
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Primary equations from Sun et al. (2025), neuron/synapse duality, linear time complexity, and official evidence boundaries.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-emerald-400">
              <span>View BDH Standard</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pathway 4: BDH-CQ Scaling */}
          <Link
            href="/bdh-cq"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-purple-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                BDH-CQ &amp; Inference Scaling
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Contextual adaptation vs parameter updates, interactive D3 energy landscapes, and test-time Pareto cost curves.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-purple-400">
              <span>Inspect Attractors</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pathway 5: Model Comparison */}
          <Link
            href="/compare"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-amber-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <Scale className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Rigorous Architecture Comparison
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                5 sequence modeling paradigms evaluated across 8 dimensions with strict evidence tier badges and citations.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-amber-400">
              <span>Compare Models</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pathway 6: Research & Defense */}
          <Link
            href="/research"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-cyan-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <Database className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Empirical Sweeps &amp; Defense
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                2,700 real trials, 7 publication figures at 300 DPI, raw CSV/JSON data downloads, and the Judge Defense Sheet.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-cyan-400">
              <span>View Data &amp; Defense</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Summary Verification Band */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Empirical Rigor Guarantee</div>
          <div className="text-sm text-white font-semibold">2,700 Verified Real Trials Across 5 Controlled Sweeps</div>
          <p className="text-xs text-slate-400">All data generated with strict deterministic random seeds without numerical fabrication or forced verdicts.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/research"
            className="rounded-lg border border-white/20 hover:bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition-all"
          >
            View Benchmarks
          </Link>
          <Link
            href="/about"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30"
          >
            Judge Defense Sheet
          </Link>
        </div>
      </section>

    </div>
  );
}
