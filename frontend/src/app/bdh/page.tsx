import React from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export default function BdhPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Architectural Standard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Bi-Directional Dynamic Horizons (BDH)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The architectural paradigm governing continuous-horizon sequence representations, dynamic temporal scaling, and selective state gating.
        </p>
      </div>

      {/* 1. Core Principles of BDH */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">1</span>
          Dynamic Temporal Horizons vs Fixed Decay
        </h2>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          In standard recurrent networks, memory decay is governed by a static scalar <code>&lambda;</code>. Under long horizons, this either causes memory explosion (<code>&lambda; &gt; 1</code>) or catastrophic signal attenuation (<code>&lambda; &lt; 1</code>).
        </p>

        <p className="text-xs text-slate-300 leading-relaxed">
          In the <strong className="text-white">BDH Standard</strong>, temporal horizons are parameterized dynamically as input-dependent operators <code>&Delta;_t(x_t)</code>:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-emerald-300 space-y-2 overflow-x-auto">
          <div>&Delta;_t = Softplus( Parameter(Linear(x_t)) )</div>
          <div>A_bar_t = exp( -&Delta;_t &middot; A ), &nbsp;&nbsp; B_bar_t = (&Delta;_t &middot; A)^(-1) (I - A_bar_t) &Delta;_t &middot; B_t</div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When encountering distractor clutter or non-informative padding, the model dynamically contracts the update rate (<code>&Delta;_t &rarr; 0</code>), preserving state memory indefinitely without degradation.
        </p>
      </section>

      {/* 2. Official vs Educational Surrogate Strict Boundary */}
      <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
          Strict Scientific Boundary: Official BDH vs Educational Toy Surrogate
        </div>

        <p className="text-xs text-amber-200/90 leading-relaxed">
          To maintain absolute scientific integrity, this laboratory enforces a strict separation between official production BDH foundation systems and our educational micro-implementation:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3 border-b border-white/10">Dimension</th>
                <th className="p-3 border-b border-white/10 text-slate-400">Official Production BDH</th>
                <th className="p-3 border-b border-white/10 text-emerald-400">Our Educational Toy Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">Compute Infrastructure</td>
                <td className="p-3 text-slate-400">Multi-GPU / TPU distributed clusters, FP8/BF16 tensor engines</td>
                <td className="p-3 text-emerald-300">Client-side WebAssembly / TypeScript running in browser</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Parameter Scale</td>
                <td className="p-3 text-slate-400">&ge; 7B to 70B parameters, multi-layer hierarchical SSM-attention</td>
                <td className="p-3 text-emerald-300">Micro-architecture (d=32, ~10k parameters) for transparent inspection</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">State Dynamics</td>
                <td className="p-3 text-slate-400">Continuous-time generalized state space with multi-head CQ</td>
                <td className="p-3 text-emerald-300">Discrete selective matrix fast-weights + attractor settling</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Designated Role</td>
                <td className="p-3 text-slate-400">Production foundation modeling & benchmark standard</td>
                <td className="p-3 text-emerald-300">Pedagogical dissection & parameter exploration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Citations & References */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
          Official Standard References
        </h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Bi-Directional Dynamic Horizons (BDH) Technical Specification:</strong> DataForge Foundation / Pathway Track Guidelines (2025/2026).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Selective State Spaces (Mamba):</strong> Gu & Dao (2023/2024), <em>arXiv:2312.00752</em>.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Deep Dive Link */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <Link href="/concept" className="text-xs text-slate-400 hover:text-white font-mono">
          ← Back to Concept
        </Link>
        <Link
          href="/bdh-cq"
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono font-medium"
        >
          Next: Continuous Querying (CQ) <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
