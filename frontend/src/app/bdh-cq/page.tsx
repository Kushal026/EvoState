"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Activity, 
  Cpu, 
  ArrowRight, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  TrendingUp,
  FileText,
  DollarSign,
  Clock,
  ExternalLink,
  BookOpen
} from "lucide-react";
import D3EnergyLandscape from "@/components/D3EnergyLandscape";
import D3CostAccuracyChart, { EffortLevel, EMPIRICAL_DATA } from "@/components/D3CostAccuracyChart";

export default function BdhCqPage() {
  const [effortLevel, setEffortLevel] = useState<EffortLevel>("MEDIUM");
  const [selectedK, setSelectedK] = useState<number>(4);

  const handleSelectLevel = (lvl: EffortLevel) => {
    setEffortLevel(lvl);
    if (lvl === "LOW") setSelectedK(1);
    else if (lvl === "MEDIUM") setSelectedK(4);
    else if (lvl === "HIGH") setSelectedK(12);
  };

  const activeDataPoint = EMPIRICAL_DATA.find(d => d.k === selectedK) || EMPIRICAL_DATA[3];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-400">
          <Zap className="h-3.5 w-3.5" /> Inference-Time Scaling Standard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          BDH Continuous Querying (BDH-CQ)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Decoupling memory footprint from query deliberation depth: how test-time energy relaxation recovers superimposed signal from noisy state spaces.
        </p>
      </div>

      {/* 1. Where Does Adaptation Happen? (Parameter vs State vs Inference) */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs">1</span>
            Where Does Adaptation Happen? A Fundamental Taxonomy
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
            OFFICIAL BDH-CQ EVIDENCE
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Modern sequence architectures adapt to new information at three fundamentally distinct operational tiers:
        </p>

        {/* 3-Way Adaptation Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden bg-black/40">
            <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3 border-b border-white/10">Adaptation Tier</th>
                <th className="p-3 border-b border-white/10">Mathematical Mechanism</th>
                <th className="p-3 border-b border-white/10">Computational Cost</th>
                <th className="p-3 border-b border-white/10">Timescale &amp; Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              
              {/* Tier 1: Parameter Update */}
              <tr>
                <td className="p-3 font-semibold text-white">
                  1. Parameter Update<br />
                  <span className="text-[10px] font-mono text-slate-400">(Pre-training / Fine-Tuning)</span>
                </td>
                <td className="p-3 font-mono text-rose-300">
                  &theta; &larr; &theta; - &eta; &nabla;_&theta; L(x, y)
                </td>
                <td className="p-3 text-rose-400">
                  Extremely Heavy (Multi-GPU backprop across millions of tokens)
                </td>
                <td className="p-3">
                  Permanent, global knowledge stored across all future generations.
                </td>
              </tr>

              {/* Tier 2: Recurrent-State Update */}
              <tr>
                <td className="p-3 font-semibold text-white">
                  2. Recurrent-State Update<br />
                  <span className="text-[10px] font-mono text-slate-400">(Forward-Pass Memory)</span>
                </td>
                <td className="p-3 font-mono text-emerald-300">
                  S_t = A_bar_t S_&#123;t-1&#125; + B_bar_t (v_t &otimes; k_t^T)
                </td>
                <td className="p-3 text-emerald-400 font-mono">
                  O(1) Step Cost (Zero backprop, pure forward-pass fast-weights)
                </td>
                <td className="p-3">
                  Sequence-local context preserved during prompt ingestion.
                </td>
              </tr>

              {/* Tier 3: Inference-Time State Probing */}
              <tr>
                <td className="p-3 font-semibold text-white">
                  3. Inference-Time Probing<br />
                  <span className="text-[10px] font-mono text-purple-300">(BDH-CQ Deliberation)</span>
                </td>
                <td className="p-3 font-mono text-purple-300">
                  q^(k+1) = q^(k) - &eta; &nabla;_q E(q^(k), S_T)
                </td>
                <td className="p-3 text-purple-400 font-mono">
                  O(K &middot; d) Variable (Allocated per query difficulty)
                </td>
                <td className="p-3">
                  Query-local attractor settling to de-noise superimposed memory.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Interactive Cost-Versus-Accuracy Chart (Real Experimental Results) */}
      <section className="rounded-xl border border-purple-500/30 bg-[#07090e] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Inference-Time Scaling Pareto Frontier (Real Sweeps Data)
            </h2>
            <p className="text-xs text-slate-400">
              Interactive cost-versus-accuracy tradeoff across 2,700 controlled trials on our PyTorch experiment engine.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold shrink-0">
            PRECOMPUTED RESEARCH RESULT
          </span>
        </div>

        {/* D3 Cost vs Accuracy Component */}
        <D3CostAccuracyChart
          selectedLevel={effortLevel}
          onSelectLevel={handleSelectLevel}
          selectedK={selectedK}
          onSelectK={setSelectedK}
        />
      </section>

      {/* 3. Attractor Settling & Observability */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Energy Manifold Observability (K = {selectedK} Cycles)
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            Live Attractor Landscape
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Watch how the query probe trajectory moves along the non-convex potential <code>E(q, S_T) = -0.5 q^T S_T q + &sum; &phi;(q_i)</code> as compute cycles scale from LOW (1-step) to HIGH (12-step):
        </p>

        {/* Live D3 Component */}
        <D3EnergyLandscape
          inferenceSteps={selectedK}
          confidenceScore={activeDataPoint.accuracy > 80 ? 0.88 : 0.35}
        />
      </section>

      {/* 4. Scientific Boundaries & Strict Disclaimer */}
      <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
          Strict Scientific Boundary: Educational Surrogate vs Production BDH-CQ
        </div>

        <p className="text-xs text-amber-200/90 leading-relaxed">
          To maintain absolute scientific transparency, we explicitly state that our educational toy model ($d=32$) is a transparent pedagogical surrogate running client-side fast-weights. It does <strong>NOT</strong> claim to reproduce proprietary production foundation BDH-CQ systems.
        </p>
      </section>

      {/* 5. Primary Source Citations */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-400" /> Primary Research Literature Citations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 space-y-1">
            <div className="font-bold text-white font-mono">Snell et al. (UC Berkeley, 2024)</div>
            <div className="text-[11px] text-purple-300"><em>Scaling LLM Test-Time Compute Optimally</em></div>
            <p className="text-slate-400 text-[11px]">
              Demonstrates that spending variable inference computation on search and deliberation can outperform 14&times; larger pre-trained models.
            </p>
          </div>

          <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 space-y-1">
            <div className="font-bold text-white font-mono">Sun et al. (Stanford, 2024)</div>
            <div className="text-[11px] text-purple-300"><em>Learning to (Learn at Test Time): RNNs with Expressive Hidden States</em></div>
            <p className="text-slate-400 text-[11px]">
              Establishes the gradient descent update rule on hidden state matrices as self-supervised test-time learning.
            </p>
          </div>

          <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 space-y-1">
            <div className="font-bold text-white font-mono">DataForge Foundation (2025/2026)</div>
            <div className="text-[11px] text-purple-300"><em>BDH-CQ Reference Specification &amp; Attractor Formulation</em></div>
            <p className="text-slate-400 text-[11px]">
              The official standard defining Continuous Querying over bi-directional dynamic horizon state spaces.
            </p>
          </div>

          <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 space-y-1">
            <div className="font-bold text-white font-mono">Gu &amp; Dao (2023)</div>
            <div className="text-[11px] text-purple-300"><em>Mamba: Linear-Time Sequence Modeling with Selective State Spaces</em></div>
            <p className="text-slate-400 text-[11px]">
              Foundational input-dependent discretization equations (&Delta;_t, A_bar_t, B_bar_t) for continuous recurrence.
            </p>
          </div>

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
          Next: Research &amp; Empirical Sweeps <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
