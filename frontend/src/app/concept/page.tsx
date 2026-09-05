import React from "react";
import Link from "next/link";
import { Layers, Cpu, ShieldAlert, Zap, ArrowRight, Activity, Terminal } from "lucide-react";

import RigorousArchitectureComparison from "@/components/RigorousArchitectureComparison";

export default function ConceptPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-mono text-indigo-400">
          <Layers className="h-3.5 w-3.5" /> Theoretical Foundations
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Long-Horizon Evolving States
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          How constant-sized latent representations preserve prefix information across long sequences, 
          and why geometric superposition forces an accuracy-compression tradeoff.
        </p>
      </div>

      {/* 1. Mathematical Formulation */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 text-blue-400 font-mono text-xs">1</span>
          Mathematical Definition of an Evolving State
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          In sequence modeling, an <strong className="text-white">Evolving State</strong> is a bounded dynamical system where history is recursively compressed into a fixed-dimensional latent representation <code>h_t &isin; &reals;^d</code>:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-blue-300 space-y-2 overflow-x-auto">
          <div>h_t = f_&theta;(h_&#123;t-1&#125;, x_t) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[State Transition Operator, |h_t| = O(1)]</div>
          <div>y_t = g_&theta;(h_t, x_t) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Readout Emission Operator]</div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Unlike standard Transformers where memory scales linearly <code>O(T &middot; d)</code> with every prefix token, an evolving state maintains an <code>O(1)</code> spatial memory footprint and processes tokens in constant per-step time <code>O(1)</code>.
        </p>
      </section>

      {/* 2. Superposition & The Capacity Bottleneck */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs">2</span>
          Information Superposition &amp; Interference Crosstalk
        </h2>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          When storing N key-value pairs <code>(k_i, v_i)</code> into a matrix fast-weight state <code>M_t &isin; &reals;^(d_v &times; d_k)</code> via outer-product updates:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-purple-300 overflow-x-auto">
          M_T = &sum;<sub>i=1..N</sub> &lambda;^(T - t_i) &Delta;_&#123;t_i&#125; (v_i &otimes; k_i^T)
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When queried with target key <code>q = k_target</code>, linear readout projects the entire accumulated state:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          v_hat = M_T &middot; q = [&alpha;_target &middot; v_target] + [&sum;<sub>j&ne;target</sub> &alpha;_j v_j &lang;k_j, q&rang;] + [&epsilon;_noise]
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
            <div className="text-xs font-semibold text-emerald-400 mb-1">Orthogonal Regime (N &le; d)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When keys are mutually orthogonal (&lang;k_i, k_j&rang; = 0), crosstalk vanishes and retrieval is exact (SNR &rarr; &infin;).
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
            <div className="text-xs font-semibold text-red-400 mb-1">Superposition Breakdown (N &gt; &alpha;_c d)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By the Johnson-Lindenstrauss lemma, packing N &gt; d vectors forces non-zero dot products, causing destructive crosstalk noise during readout.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Inference-Time Recovery Connection */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">3</span>
          Why Test-Time Compute Can Recover Superimposed Signal
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          In a single-pass linear readout (C_infer = 1), the model must immediately project the noisy state sum. When we allocate additional inference-time compute (C_infer &gt; 1), the system executes iterative attractor settling over the state energy landscape:
        </p>

        <div className="rounded-lg bg-purple-950/20 border border-purple-500/20 p-4 font-mono text-xs text-purple-300 space-y-1 overflow-x-auto">
          <div>1. Initial Readout: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v^(0) = M_T &middot; q</div>
          <div>2. Key Reconstruction: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k_recon = M_T^T &middot; Normalize(v^(k))</div>
          <div>3. Attractor Settling Step: v^(k+1) = Update(M_T, Sharpen(q, k_recon))</div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This non-linear iterative unrolling acts as an associative de-noising filter, pulling the candidate vector out of orthogonal clutter and into the target attractor well.
        </p>
      </section>

      {/* 4. Technically Rigorous Architecture Comparison Matrix */}
      <RigorousArchitectureComparison />

      {/* CTA Box */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Test these equations live in EvoLab</div>
          <p className="text-xs text-slate-300">Run parameter sweeps across load ratio &alpha; = N/d and test-time budgets.</p>
        </div>
        <Link
          href="/lab"
          className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-all shadow-md shrink-0"
        >
          <Terminal className="h-3.5 w-3.5" /> Launch Lab Simulator
        </Link>
      </div>

    </div>
  );
}
