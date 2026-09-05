import React from "react";
import Link from "next/link";
import { Layers, Cpu, ShieldAlert, Zap, ArrowRight, Activity, Terminal, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function WhyItMattersPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-mono text-indigo-400">
          <Layers className="h-3.5 w-3.5" /> Conceptual Motivation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Why Long-Horizon Evolving States Matter
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Why modern frontier AI is colliding with the physical memory wall of the Transformer Key-Value cache, 
          and how bounded associative states redefine the relationship between sequence length, state capacity, and inference compute.
        </p>
      </div>

      {/* 1. The KV-Cache Memory Wall Crisis */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-bold">1</span>
          <h2 className="text-base font-semibold text-white tracking-tight">
            The Physical Memory Wall: KV-Cache Quadratic Saturation
          </h2>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          Standard autoregressive Transformers rely on a non-parametric Key-Value (KV) cache. Every past token generates an embedding vector that must be kept active in GPU High-Bandwidth Memory (HBM):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-4 space-y-2">
            <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> The Transformer Memory Problem
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              At a context of 1,000,000 tokens, a 70B model requires over <strong className="text-white">100 GB of pure VRAM</strong> solely to store previous Key-Value vectors, before allocating a single byte for weights or activations.
            </p>
            <div className="text-[11px] font-mono text-red-300/80 bg-black/40 rounded px-2 py-1">
              Memory Footprint: O(T &middot; d &middot; L_layers) &rarr; Linear with Length
            </div>
          </div>

          <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-4 space-y-2">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> The Bounded Evolving State Solution
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              An evolving recurrent memory updates a fixed-size latent representation (e.g. matrix <code>M_t &isin; &reals;^(d_v &times; d_k)</code>). Memory consumption remains strictly <strong className="text-white">constant</strong> whether processing 10 tokens or 10,000,000 tokens.
            </p>
            <div className="text-[11px] font-mono text-emerald-300/80 bg-black/40 rounded px-2 py-1">
              Memory Footprint: O(d_v &times; d_k) &rarr; Constant O(1)
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Fundamental Law: Superposition & Interference */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs font-bold">2</span>
          <h2 className="text-base font-semibold text-white tracking-tight">
            The Fundamental Tradeoff: Superposition vs. Capacity
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          If a state has fixed dimensions, storing more independent items than the dimensionality allows forces vectors to overlap in high-dimensional angle space. This is governed by the <strong className="text-white">Johnson-Lindenstrauss Lemma</strong> and <strong className="text-white">Associative Memory Superposition Limits</strong>:
        </p>

        <div className="rounded-lg bg-black/40 border border-white/5 p-4 font-mono text-xs text-slate-200 space-y-2 overflow-x-auto">
          <div className="text-purple-300 font-semibold">Associative Outer-Product Binding:</div>
          <div>M_T = &sum;<sub>i=1..N</sub> &lambda;^(T - t_i) &Delta;_&#123;t_i&#125; (v_i &otimes; k_i^T)</div>
          <div className="text-slate-400 text-[11px]">
            &bull; Capacity Threshold: &alpha;_c &approx; 0.14 &middot; d &nbsp;&nbsp;(Hopfield 1982 / Associative Matrix Limit)
          </div>
          <div className="text-slate-400 text-[11px]">
            &bull; N &le; &alpha;_c d: High Signal-to-Noise Ratio (SNR &gt; 30 dB), near lossless recovery.
          </div>
          <div className="text-slate-400 text-[11px]">
            &bull; N &gt; &alpha;_c d: Geometric superposition crosstalk emerges, causing soft information loss.
          </div>
        </div>
      </section>

      {/* 3. The New Frontier: Test-Time Compute as Memory De-Noiser */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">3</span>
          <h2 className="text-base font-semibold text-white tracking-tight">
            The Inference-Time Scaling Horizon
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Why allocate enormous memory hardware if you can trade <strong className="text-emerald-400">test-time computation</strong> for memory recovery? When a state is in superposition, iterative attractor settling (as explored in BDH-CQ and Snell et al. 2024) sharpens the retrieval query through non-linear recurrent steps:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
            <div className="text-xs font-mono text-slate-400 mb-1">Pass 1: Readout</div>
            <div className="text-sm font-semibold text-slate-200">Noisy Superposition</div>
            <p className="text-[11px] text-slate-400 mt-1">Linear readout projects blended signals</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
            <div className="text-xs font-mono text-purple-400 mb-1">Pass 2 to K: Sharpening</div>
            <div className="text-sm font-semibold text-purple-300">Energy Landscape Settling</div>
            <p className="text-[11px] text-slate-400 mt-1">Iterative reverse-projection de-noises key</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
            <div className="text-xs font-mono text-emerald-400 mb-1">Pass Converged: Attractor</div>
            <div className="text-sm font-semibold text-emerald-300">Clean Value Recovery</div>
            <p className="text-[11px] text-slate-400 mt-1">Signal extracted without expanding state size</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Experience this in the Memory Lab</div>
          <p className="text-xs text-slate-300">Interact with the 5 core stages: Remember, Stretch, Attack, Recover, and Look Inside.</p>
        </div>
        <Link
          href="/lab"
          className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-all shadow-md shrink-0"
        >
          <Terminal className="h-3.5 w-3.5" /> Launch Memory Lab
        </Link>
      </div>

    </div>
  );
}
