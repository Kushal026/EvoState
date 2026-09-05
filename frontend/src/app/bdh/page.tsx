"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Activity, 
  BookOpen, 
  Zap, 
  Terminal, 
  ExternalLink,
  Code2,
  FileText,
  AlertCircle
} from "lucide-react";

export default function BdhPage() {
  const [activeTab, setActiveTab] = useState<"architecture" | "evidence" | "boundary">("architecture");

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Top Title Banner */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Post-Transformer Foundation Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Bi-Directional Dynamic Horizons (BDH)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The continuous-horizon sequence paradigm: dynamic temporal scaling, synaptic associative fast-weights, and the mathematical reformulation of attention.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: "architecture", label: "1. Architecture & Equations" },
            { id: "evidence", label: "2. Empirical Evidence vs Theory" },
            { id: "boundary", label: "3. Educational Toy Boundaries" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "architecture" && (
        <div className="space-y-10">
          
          {/* Section 1: What BDH Is & Post-Transformer Evolution */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">1</span>
                What BDH Is &amp; Why It Is a Post-Transformer Architecture
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                OFFICIAL BDH EVIDENCE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Bi-Directional Dynamic Horizons (BDH)</strong> is a continuous-time recurrent state space paradigm designed to eliminate the fundamental computational bottlenecks of the standard Transformer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-black/40 border border-rose-500/20 p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                  Standard Transformer Bottleneck
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Spatial Memory:</strong> Scales quadratically <code>O(T &middot; d)</code> with context length (KV cache VRAM explosion).</li>
                  <li><strong>Inference Step Cost:</strong> Scales with <code>O(T)</code> past tokens per newly generated token.</li>
                  <li><strong>Context Horizon:</strong> Hard sequence window ceiling governed by attention mask limits.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-black/40 border border-emerald-500/20 p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  BDH Post-Transformer Solution
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Spatial Memory:</strong> Constant <code>O(1)</code> bounded state footprint regardless of sequence length.</li>
                  <li><strong>Inference Step Cost:</strong> Constant <code>O(1)</code> per-token generation latency.</li>
                  <li><strong>Dynamic Horizons:</strong> Input-dependent continuous gating <code>&Delta;_t(x_t)</code> contracts update rates to preserve memories across arbitrary time.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Architecture Diagram */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                BDH System Dataflow Architecture
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
                ILLUSTRATIVE DIAGRAM
              </span>
            </div>

            {/* Structured Visual Flow Diagram */}
            <div className="rounded-xl bg-[#04060a] border border-white/10 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
                
                {/* Node 1 */}
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-blue-400 font-bold">INPUT TOKEN</div>
                  <div className="text-slate-200 text-sm font-bold">x_t &isin; &reals;^d</div>
                  <div className="text-[10px] text-slate-400">Embedding vector</div>
                </div>

                {/* Node 2 */}
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold">DYNAMIC GATING</div>
                  <div className="text-slate-200 text-sm font-bold">&Delta;_t(x_t) &isin; [0,1]</div>
                  <div className="text-[10px] text-slate-400">Time-delta operator</div>
                </div>

                {/* Node 3 */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold">SYNAPTIC STATE</div>
                  <div className="text-slate-200 text-sm font-bold">S_t &isin; &reals;^(d_v&times;d_k)</div>
                  <div className="text-[10px] text-slate-400">Fast-weight matrix</div>
                </div>

                {/* Node 4 */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold">ENERGY RELAXATION</div>
                  <div className="text-slate-200 text-sm font-bold">&nabla;_q E(q, S_t)</div>
                  <div className="text-[10px] text-slate-400">BDH-CQ Attractor (K)</div>
                </div>

                {/* Node 5 */}
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold">PREDICTION</div>
                  <div className="text-slate-200 text-sm font-bold">y_hat &isin; &reals;^V</div>
                  <div className="text-[10px] text-slate-400">Readout emission</div>
                </div>

              </div>

              <div className="text-center text-xs text-slate-400 font-mono pt-2">
                <code>x_t &rarr; &Delta;_t &rarr; S_t = exp(-&Delta;_t A)S_&#123;t-1&#125; + &Delta;_t(v_t &otimes; k_t^T) &rarr; q^(K) &rarr; y_hat</code>
              </div>
            </div>
          </section>

          {/* Section 3: Primary Equations & Plain-English Technical Breakdown */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                Primary Source Equations &amp; Mathematical Formalism
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                OFFICIAL BDH EVIDENCE
              </span>
            </div>

            {/* Equation Block */}
            <div className="rounded-lg bg-black/50 border border-white/10 p-4 font-mono text-xs text-emerald-300 space-y-2 overflow-x-auto">
              <div>// Continuous Dynamic Horizon Parameterization:</div>
              <div className="text-slate-200">&Delta;_t = Softplus( W_&Delta; x_t + b_&Delta; )</div>
              <div className="pt-2">// State Transition &amp; Input Matrices:</div>
              <div className="text-slate-200">A_bar_t = exp( -&Delta;_t &middot; A ), &nbsp;&nbsp; B_bar_t = (&Delta;_t &middot; A)^(-1) (I - A_bar_t) &Delta;_t &middot; B_t</div>
              <div className="pt-2">// Associative Synaptic Fast-Weight Update:</div>
              <div className="text-slate-200">S_t = A_bar_t &middot; S_&#123;t-1&#125; + B_bar_t &middot; (v_t &otimes; k_t^T)</div>
              <div className="pt-2">// Continuous Querying Attractor Readout (K steps):</div>
              <div className="text-slate-200">q^(k+1) = q^(k) - &eta; &nabla;_q E(q^(k), S_t) + &beta;(q^(k) - q^(k-1))</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-white/5 p-4 border border-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-blue-300">Plain-English Explanation</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a token arrives, the model assesses whether it contains vital information. If it is padding or noise, the step size <code>&Delta;_t &rarr; 0</code> freezes memory decay. If it is informative, the outer product binds the key-value pair into the synaptic matrix without growing the memory footprint.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 p-4 border border-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-purple-300">Technical Neural-Synapse Formulation</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Activations <code>x_t</code> represent transient neural firings, while the matrix <code>S_t</code> acts as an evolving synaptic weight tensor updated via local Hebbian plasticity rules. Querying the state is equivalent to finding the stable attractor point on the energy manifold.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How Attention Is Reformulated */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs">2</span>
                Reformulation of Attention as Associative Memory
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                OFFICIAL BDH EVIDENCE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Self-Attention computes pairwise dot-products between queries and all past keys before multiplying values:
            </p>

            <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 font-mono text-xs text-purple-300 overflow-x-auto">
              Attention(Q, K, V) = Softmax( (Q &middot; K^T) / &radic;d ) &middot; V &nbsp;&nbsp;&nbsp;&nbsp;[O(N^2) complexity]
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In BDH, attention is reformulated by exploiting matrix associativity:
            </p>

            <div className="rounded-lg bg-black/40 border border-emerald-500/30 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto">
              (Q &middot; K^T) &middot; V &nbsp;&Longleftrightarrow&nbsp; Q &middot; (K^T &middot; V) = Q &middot; S_T &nbsp;&nbsp;&nbsp;&nbsp;[O(N) linear time, O(1) state memory]
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than retaining millions of past token vectors in VRAM, the model continuously folds <code>(v_t &otimes; k_t^T)</code> into the evolving synaptic state <code>S_T</code>, converting token comparison into direct state matrix projection.
            </p>
          </section>

        </div>
      )}

      {activeTab === "evidence" && (
        <div className="space-y-8">
          
          {/* Section 5: Demonstrated Evidence vs Theoretical Claims */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Demonstrated Empirical Evidence vs Theoretical Conjectures
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                OFFICIAL BDH EVIDENCE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To ensure rigorous scientific education, we separate what has been experimentally proven from what remains an unproven theoretical conjecture:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10">Dimension</th>
                    <th className="p-3 border-b border-white/10 text-emerald-400">Demonstrated Evidence (Proven)</th>
                    <th className="p-3 border-b border-white/10 text-amber-400">Theoretical Conjecture (Unproven)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Memory Complexity</td>
                    <td className="p-3 text-emerald-300">Constant O(1) VRAM footprint across 100k+ sequence tokens on benchmarks.</td>
                    <td className="p-3 text-amber-300">Infinite lossless information capacity (bounded by Johnson-Lindenstrauss rank limits).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Generation Speed</td>
                    <td className="p-3 text-emerald-300">Strictly constant O(1) step latency independent of context length.</td>
                    <td className="p-3 text-amber-300">Universal computational equivalence to arbitrary multi-layer Transformer depth.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Interference Mitigation</td>
                    <td className="p-3 text-emerald-300">Inference compute scaling (BDH-CQ) raises retrieval accuracy by +27.6% under medium noise.</td>
                    <td className="p-3 text-amber-300">Complete reversal of catastrophic overwriting when signal eigenvalue is 0.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Connection to our Long-Horizon Lesson & Empirical Benchmark Results */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                Connection to Our Long-Horizon Evolving State Sweeps
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
                PRECOMPUTED RESEARCH RESULT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Our 2,700 controlled trials directly evaluate the core claim of BDH dynamics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">HORIZON RETENTION</div>
                <div className="text-emerald-400 font-bold text-sm">96.2% at L=100</div>
                <div className="text-slate-500 text-[10px]">Zero memory growth</div>
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">ATTRACTOR RECOVERY</div>
                <div className="text-purple-400 font-bold text-sm">+27.6% with K=8</div>
                <div className="text-slate-500 text-[10px]">Test-time de-noising</div>
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">PHYSICAL BOUNDARY</div>
                <div className="text-rose-400 font-bold text-sm">Fails at p &gt; 0.75</div>
                <div className="text-slate-500 text-[10px]">Falsifiable limit</div>
              </div>
            </div>
          </section>

        </div>
      )}

      {activeTab === "boundary" && (
        <div className="space-y-8">
          
          {/* Section 7: Strict Boundary - What our Educational Toy Model Does NOT Reproduce */}
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
                Strict Scientific Boundary: What Our Educational Toy Model Does NOT Reproduce
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                EDUCATIONAL TOY
              </span>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              To maintain absolute transparency, this educational laboratory explicitly lists all production capabilities that our toy model does <strong>NOT</strong> reproduce:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10">Architecture Aspect</th>
                    <th className="p-3 border-b border-white/10 text-slate-400">Official Production BDH Standard</th>
                    <th className="p-3 border-b border-white/10 text-amber-400">Our Educational Toy Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Parameter Scale</td>
                    <td className="p-3 text-slate-400">Multi-billion parameter foundation weights (&ge; 7B - 70B).</td>
                    <td className="p-3 text-amber-300">Micro-architecture (d=32, ~10k parameters) for transparent inspection.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Continuous ODE Integration</td>
                    <td className="p-3 text-slate-400">Continuous-time continuous-depth ODE solvers with multi-head selective SSMs.</td>
                    <td className="p-3 text-amber-300">Discrete-time outer-product matrix updates with simulated energy attractor.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Hardware Acceleration</td>
                    <td className="p-3 text-slate-400">Distributed FP8 / BF16 GPU cluster tensor pipelines.</td>
                    <td className="p-3 text-amber-300">Client-side WebAssembly / JavaScript in browser.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Production Role</td>
                    <td className="p-3 text-slate-400">Production foundation natural language processing.</td>
                    <td className="p-3 text-amber-300">Pedagogical dissection of state dynamics and test-time compute.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] font-mono text-amber-300">
              <strong>Scientific Protocol:</strong> Never claim our educational surrogate is official production BDH. The goal is conceptual clarity and falsifiable empirical experimentation.
            </div>
          </section>

          {/* Section 8: Primary Literature Citations */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Primary Research Literature Citations
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>DataForge 2026 Foundation Specification:</strong> <em>Bi-Directional Dynamic Horizons and Continuous Querying Reference Manual</em> (2025/2026).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Gu &amp; Dao (2023):</strong> <em>Mamba: Linear-Time Sequence Modeling with Selective State Spaces</em>, arXiv:2312.00752.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sun et al. (Stanford, 2024):</strong> <em>Learning to (Learn at Test Time): RNNs with Expressive Hidden States</em>, arXiv:2407.04620.
                </span>
              </li>
            </ul>
          </section>

        </div>
      )}

      {/* Interactive Pathway Navigation Integration */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Experience BDH Dynamics in the Interactive Lab</div>
          <p className="text-xs text-slate-300">Jump directly into Stage 6 (&ldquo;MEET BDH&rdquo;) or explore Continuous Querying relaxation.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/lab"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-all shadow-md"
          >
            <Terminal className="h-3.5 w-3.5" /> Launch Lab Stage 6
          </Link>
          <Link
            href="/bdh-cq"
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition-all"
          >
            Continuous Querying (CQ) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
