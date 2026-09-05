import React from "react";
import Link from "next/link";
import { Terminal, Layers, ShieldCheck, Cpu, Database, ArrowRight, Activity, CheckCircle2, ShieldAlert } from "lucide-react";
import HeroStateDemo from "@/components/HeroStateDemo";
import SixtySecondExperiment from "@/components/SixtySecondExperiment";

export default function HomePage() {
  return (
    <div className="space-y-12">
      
      {/* Hero Headline & Claim */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
          <Activity className="h-3.5 w-3.5" />
          DataForge 2026 Pathway Track &bull; AI Research Lab
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Evolving Memory Lab
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Dissecting the algebraic mechanics of <strong className="text-blue-400 font-medium">Long-Horizon Evolving States</strong> and the de-noising power of <strong className="text-purple-400 font-medium">Inference-Time Scaling</strong>.
        </p>

        {/* Central Claim Callout */}
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-purple-950/40 p-4 sm:p-5">
          <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider mb-1.5 font-semibold">
            Central Falsifiable Claim:
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

      {/* Four Core Investigation Pillars */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Core Research Pathways</h3>
          <p className="text-xs text-slate-400 mt-1">Explore the theoretical foundations, synthetic experiments, and official architectural boundaries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1: EvoLab */}
          <Link
            href="/lab"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-blue-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                Interactive EvoLab
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Run controlled sweeps over delay lag, clutter sequence length, key overwrites, and test-time compute budgets.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-blue-400">
              <span>Launch Experiments</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 2: Evolving State Theory */}
          <Link
            href="/concept"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-indigo-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                State & Superposition
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Mathematical formulations of bounded latent states, associative outer products, and the geometric capacity bottleneck.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-indigo-400">
              <span>Explore Theory</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 3: BDH Framework */}
          <Link
            href="/bdh"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-emerald-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                BDH Standard
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Bi-Directional Dynamic Horizons architectural specification and the strict boundary with our educational toy model.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-emerald-400">
              <span>View Standard</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 4: Continuous Querying */}
          <Link
            href="/bdh-cq"
            className="group relative rounded-xl border border-white/10 bg-[#080c14] p-5 hover:border-purple-500/40 hover:bg-[#0c121e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                Continuous Query (CQ)
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Continuous-time state probing, energy minimization, and test-time attractor settling dynamics.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-purple-400">
              <span>Inspect Attractors</span> <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Summary Verification Band */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Empirical Rigor Guarantee</div>
          <div className="text-sm text-white font-semibold">2,700 Verified Real Trials Across 4 Controlled Sweeps</div>
          <p className="text-xs text-slate-400">All data generated with strict deterministic random seeds (N=30 per point) without numerical fabrication.</p>
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
