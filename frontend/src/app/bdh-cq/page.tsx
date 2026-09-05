"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Activity, Cpu, ArrowRight, Layers, HelpCircle, CheckCircle2, ShieldAlert, Sliders } from "lucide-react";
import D3EnergyLandscape from "@/components/D3EnergyLandscape";

export default function BdhCqPage() {
  const [steps, setSteps] = useState<number>(6);

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-400">
          <Zap className="h-3.5 w-3.5" /> Inference-Time Scaling Standard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          BDH Continuous Querying (BDH-CQ)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The continuous inference-time state-probing protocol: decoupling memory footprint from query deliberation depth via recurrent energy relaxation.
        </p>
      </div>

      {/* 1. Interactive Energy Landscape Visualizer */}
      <section className="rounded-xl border border-purple-500/30 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            Interactive Attractor Landscape &amp; Settling Dynamics
          </h2>
          <span className="text-[10px] font-mono text-purple-400/80 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
            Live D3 Simulation
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Test how additional inference compute steps (<code>K</code>) allow the query probe to escape distractor local minima and settle into the true memory attractor basin.
        </p>

        {/* Interactive Step Slider */}
        <div className="flex items-center gap-4 rounded-lg bg-black/40 border border-white/5 p-3">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300 shrink-0">
            <Sliders className="h-3.5 w-3.5" />
            Inference Steps (K): <span className="font-bold text-white">{steps}</span>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            step="1"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {steps === 1 ? "1-Pass Direct" : steps <= 4 ? "Early Descent" : steps <= 8 ? "Deep Relaxation" : "Attractor Settled"}
          </span>
        </div>

        {/* Live D3 Component */}
        <D3EnergyLandscape inferenceSteps={steps} />
      </section>

      {/* 2. Mathematical Formalism */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs">1</span>
          Mathematical Energy Minimization Framework
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          Under standard 1-step inference, decoding the evolving memory state <code>S_T</code> is a static projection <code>y_hat = W_out &middot; &sigma;(W_in &middot; q + S_T)</code>. When <code>S_T</code> has absorbed hundreds of intermediate updates, cross-talk noise corrupts the direct readout.
        </p>

        <p className="text-xs text-slate-300 leading-relaxed">
          BDH Continuous Querying (BDH-CQ) treats retrieval as finding the minimum of an energy functional <code>E(q, S_T)</code>:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-purple-300 space-y-2 overflow-x-auto">
          <div>E(q; S_T) = - 0.5 &middot; q^T &middot; S_T &middot; q + &sum; &phi;(q_i)</div>
          <div>q^(k+1) = q^(k) - &eta;_k &middot; &nabla;_q E(q^(k); S_T) + &beta; (q^(k) - q^(k-1))</div>
          <div>y_hat = Softmax( W_readout &middot; q^(K) )</div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          As inference iterations <code>K &rarr; &infin;</code>, the state vector <code>q^(K)</code> converges exponentially to the nearest orthogonal key projection stored in matrix <code>S_T</code>, filtering out background distractor noise.
        </p>
      </section>

      {/* 3. When Scaling Works vs When It Fails */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 text-blue-400 font-mono text-xs">2</span>
          Regimes of Scaling Efficacy & Catastrophic Overwriting
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Solvable via Inference Scaling
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Orthogonal Distractor Noise:</strong> Keys stored in distinct subspace directions with high dot-product interference.</li>
              <li><strong>Sub-optimal Probe Alignment:</strong> Queries needing multiple refinement steps to align with stored associative traces.</li>
              <li><strong>Low-to-Medium Interference:</strong> When the signal-to-noise ratio SNR &gt; -6 dB.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-rose-400 font-mono flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Irrecoverable (Capacity Collapsed)
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Direct Value Overwrite:</strong> Exact key re-assignment with large learning rate &alpha;, erasing previous weight norm.</li>
              <li><strong>Dimension Saturation:</strong> Storing N &gt;&gt; d keys in a d-dimensional state (singular values flatten to white noise).</li>
              <li><strong>Energy Basin Flattening:</strong> When attractor gradients &nabla;E &rarr; 0 identically everywhere.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
          Query Architecture Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3 border-b border-white/10">Mechanism</th>
                <th className="p-3 border-b border-white/10">Computational Complexity</th>
                <th className="p-3 border-b border-white/10">Memory Scaling</th>
                <th className="p-3 border-b border-white/10">Noise Robustness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">Direct Feedforward (1-Step)</td>
                <td className="p-3 font-mono text-emerald-400">O(d)</td>
                <td className="p-3 font-mono text-emerald-400">O(1)</td>
                <td className="p-3 text-rose-400">Low (susceptible to cross-talk)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">BDH Continuous Querying (K-Steps)</td>
                <td className="p-3 font-mono text-purple-400">O(K &middot; d)</td>
                <td className="p-3 font-mono text-emerald-400">O(1)</td>
                <td className="p-3 text-emerald-400">High (converges to energy minima)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Standard KV Softmax Attention</td>
                <td className="p-3 font-mono text-rose-400">O(N &middot; d)</td>
                <td className="p-3 font-mono text-rose-400">O(N &middot; d)</td>
                <td className="p-3 text-blue-400">Exact (at infinite memory cost)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <Link href="/bdh" className="text-xs text-slate-400 hover:text-white font-mono">
          ← Back to BDH Standard
        </Link>
        <Link
          href="/research"
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-mono font-medium"
        >
          Next: Research & Empirical Sweeps <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
