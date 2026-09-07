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
          <ShieldCheck className="h-3.5 w-3.5" /> Biologically Inspired Sequence Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          BDH: The Dragon Hatchling
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The missing link between Transformers and models of the brain: evolving internal associative states, local interaction dynamics, and linear-time sequence processing.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: "architecture", label: "1. Architecture & Mechanics" },
            { id: "evidence", label: "2. Empirical Findings vs Theory" },
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
                What BDH Is &amp; Why It Explores Beyond Standard Transformers
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                PUBLISHED RESULT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>BDH (The Dragon Hatchling)</strong> (Kosowski et al., 2025) is a biologically inspired language-model architecture that explores alternatives to standard Transformer-style quadratic processing. By incorporating an evolving internal associative state with local synaptic plasticity dynamics, it bridges deep learning attention mechanisms with biological recurrent principles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-black/40 border border-rose-500/20 p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                  Standard Transformer Bottleneck
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Spatial Memory:</strong> Scales linearly with sequence length <code>O(T &middot; d)</code> (KV cache VRAM explosion).</li>
                  <li><strong>Inference Step Cost:</strong> Scales with <code>O(T)</code> past tokens per newly generated token.</li>
                  <li><strong>Context Horizon:</strong> Hard sequence window limits governed by quadratic attention matrix memory bounds.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-black/40 border border-emerald-500/20 p-4 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  BDH Evolving State Principle
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Spatial Memory:</strong> Compact bounded internal state footprint independent of sequence length.</li>
                  <li><strong>Inference Step Cost:</strong> Constant <code>O(1)</code> per-token recurrent update latency.</li>
                  <li><strong>Internal State:</strong> Evolving associative representations updated via local interaction dynamics without unbounded KV accumulation.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Architecture Diagram */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                Conceptual Evolving State Dataflow
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
                EDUCATIONAL SIMPLIFICATION
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
                  <div className="text-[10px] text-purple-400 font-bold">SELECTIVE GATING</div>
                  <div className="text-slate-200 text-sm font-bold">&Delta;_t(x_t) &isin; [0,1]</div>
                  <div className="text-[10px] text-slate-400">Dynamic retention gate</div>
                </div>

                {/* Node 3 */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold">SYNAPTIC STATE</div>
                  <div className="text-slate-200 text-sm font-bold">S_t &isin; &reals;^(d_v&times;d_k)</div>
                  <div className="text-[10px] text-slate-400">Associative state matrix</div>
                </div>

                {/* Node 4 */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold">LATENT DELIBERATION</div>
                  <div className="text-slate-200 text-sm font-bold">&nabla;_q E(q, S_t)</div>
                  <div className="text-[10px] text-slate-400">Test-time recovery (K)</div>
                </div>

                {/* Node 5 */}
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold">PREDICTION</div>
                  <div className="text-slate-200 text-sm font-bold">y_hat &isin; &reals;^V</div>
                  <div className="text-[10px] text-slate-400">Readout emission</div>
                </div>

              </div>

              <div className="text-center text-xs text-slate-400 font-mono pt-2">
                <code>x_t &rarr; &Delta;_t &rarr; S_t = &lambda; S_&#123;t-1&#125; + &Delta;_t(v_t &otimes; k_t^T) &rarr; q^(K) &rarr; y_hat</code>
              </div>
            </div>
          </section>

          {/* Section 3: Primary Equations & Plain-English Technical Breakdown */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                Mathematical Mechanics of Associative State Recurrence
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                PUBLISHED RESULT &amp; PEDAGOGICAL MODEL
              </span>
            </div>

            {/* Equation Block */}
            <div className="rounded-lg bg-black/50 border border-white/10 p-4 font-mono text-xs text-emerald-300 space-y-2 overflow-x-auto">
              <div>// Dynamic Retention Parameterization:</div>
              <div className="text-slate-200">&Delta;_t = &sigma;( W_&Delta; x_t + b_&Delta; )</div>
              <div className="pt-2">// Evolving Associative Matrix Update:</div>
              <div className="text-slate-200">S_t = (1 - &Delta;_t) &middot; S_&#123;t-1&#125; + &Delta;_t &middot; (v_t &otimes; k_t^T)</div>
              <div className="pt-2">// Readout / Query Projection:</div>
              <div className="text-slate-200">y_t = S_t &middot; q_t</div>
              <div className="pt-2">// Optional Test-Time Latent Deliberation (K steps):</div>
              <div className="text-slate-200">q^(k+1) = (1 - &eta;) q^(k) + &eta; &middot; S_t &middot; &sigma;(q^(k))</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-white/5 p-4 border border-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-blue-300">Plain-English Explanation</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a token arrives, dynamic gating determines whether to absorb the new key-value pair into the matrix state or retain previous memory. Informative pairs are bound via outer products into the state without growing the physical memory footprint.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 p-4 border border-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-purple-300">Neural-Synaptic Analogy</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Activations <code>x_t</code> represent transient signal activations, while the matrix <code>S_t</code> acts as an evolving synaptic weight state updated via local interaction dynamics. Querying retrieves associations via matrix-vector multiplication.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How Attention Relates to Associative Memory */}
          <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400 font-mono text-xs">2</span>
                Reformulation of Attention as Associative Memory Retrieval
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                PUBLISHED RESULT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Self-Attention computes pairwise dot-products between queries and all past keys before weighting values:
            </p>

            <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 font-mono text-xs text-purple-300 overflow-x-auto">
              Attention(Q, K, V) = Softmax( (Q &middot; K^T) / &radic;d ) &middot; V &nbsp;&nbsp;&nbsp;&nbsp;[O(N^2) token complexity, O(T·d) KV cache]
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In linear recurrent and associative memory models, attention is reformulated by exploiting matrix associativity:
            </p>

            <div className="rounded-lg bg-black/40 border border-emerald-500/30 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto">
              (Q &middot; K^T) &middot; V &nbsp;&Longleftrightarrow&nbsp; Q &middot; (K^T &middot; V) = Q &middot; S_T &nbsp;&nbsp;&nbsp;&nbsp;[O(N) linear time, O(1) state memory]
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than storing every historic token vector in VRAM, the model folds <code>(v_t &otimes; k_t^T)</code> into the compact evolving state <code>S_T</code>, turning historical token matching into direct matrix projection.
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
                Demonstrated Empirical Findings vs Theoretical Boundaries
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                EVIDENCE BOUNDARIES
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To ensure rigorous scientific education, we separate what has been demonstrated in controlled experiments from theoretical boundaries and limitations:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10">Dimension</th>
                    <th className="p-3 border-b border-white/10 text-emerald-400">Demonstrated Experimental Observation</th>
                    <th className="p-3 border-b border-white/10 text-amber-400">Known Theoretical &amp; Practical Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Memory Complexity</td>
                    <td className="p-3 text-emerald-300">Fixed-size state achieves O(1) state memory footprint independent of sequence length.</td>
                    <td className="p-3 text-amber-300">Finite dimensional state cannot store infinite orthogonal vectors (Hopfield/Johnson-Lindenstrauss limits).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Generation Latency</td>
                    <td className="p-3 text-emerald-300">Constant per-step recurrent update time across long sequence evaluations.</td>
                    <td className="p-3 text-amber-300">Fixed-capacity recurrence may suffer from crosstalk interference under high sequence clutter.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Inference Recovery</td>
                    <td className="p-3 text-emerald-300">Iterative test-time deliberation improves retrieval accuracy under mild-to-moderate noise.</td>
                    <td className="p-3 text-amber-300">Cannot reconstruct information that has been completely overwritten or zeroed from the state subspace.</td>
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
                Connection to EvoState Controlled Experiments
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
                OUR EXPERIMENT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Our 2,700 controlled synthetic trials evaluate the core dynamics of evolving state architectures:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">HORIZON RETENTION</div>
                <div className="text-emerald-400 font-bold text-sm">100% at L=128 (Lag)</div>
                <div className="text-slate-500 text-[10px]">Gated retention under pad</div>
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">INFERENCE RECOVERY</div>
                <div className="text-purple-400 font-bold text-sm">+27.6% under Noise</div>
                <div className="text-slate-500 text-[10px]">Test-time compute boost</div>
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 space-y-1">
                <div className="text-slate-400 text-[10px]">CAPACITY BOUNDARY</div>
                <div className="text-rose-400 font-bold text-sm">Phase drop at N &gt; 4</div>
                <div className="text-slate-500 text-[10px]">d=32 rank limit</div>
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
                Strict Scientific Boundary: Educational Toy Model vs Published BDH Literature
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                EDUCATIONAL SIMPLIFICATION
              </span>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              EvoState does <strong>NOT</strong> implement the official full-scale BDH architecture. Instead, EvoState provides an educational simplified model inspired by the broader idea of an evolving internal state, allowing learners to observe persistence, interference, capacity limitations, and recovery under controlled experiments.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10">Architecture Aspect</th>
                    <th className="p-3 border-b border-white/10 text-slate-400">Published BDH Architecture</th>
                    <th className="p-3 border-b border-white/10 text-amber-400">EvoState Educational Toy Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Parameter Scale</td>
                    <td className="p-3 text-slate-400">Large-scale deep language model architecture.</td>
                    <td className="p-3 text-amber-300">Micro-architecture (d=32) designed for transparent, real-time inspection.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Recurrent State Mechanism</td>
                    <td className="p-3 text-slate-400">Deep multi-layer state mechanism with brain-inspired synaptic plasticity.</td>
                    <td className="p-3 text-amber-300">Discrete-time outer-product matrix updates with selective gating.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Compute Environment</td>
                    <td className="p-3 text-slate-400">Multi-GPU distributed training and inference clusters.</td>
                    <td className="p-3 text-amber-300">Client-side interactive JavaScript / PyTorch test harness.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Primary Purpose</td>
                    <td className="p-3 text-slate-400">Post-Transformer sequence modeling research.</td>
                    <td className="p-3 text-amber-300">Pedagogical dissection of memory persistence, interference, and recovery.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] font-mono text-amber-300">
              <strong>Scientific Standard:</strong> We never market our educational toy as official BDH weights or claim it proves properties of BDH that are not supported by the primary literature.
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
                  <strong>Kosowski, Uznański, Chorowski, Stamirowska, &amp; Bartoszkiewicz (2025):</strong> <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em>, arXiv:2509.26507.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Engdahl et al. (2026):</strong> <em>BDH-CQ: In-Context Learning with Recurrent Latent Reasoning</em>, arXiv:2608.09888.
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
                  <strong>Snell, Lee, Xu, &amp; Kumar (2024):</strong> <em>Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Pre-training</em>, arXiv:2408.03314.
                </span>
              </li>
            </ul>
          </section>

        </div>
      )}

      {/* Interactive Pathway Navigation Integration */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Experience Evolving State Dynamics in the Interactive Lab</div>
          <p className="text-xs text-slate-300">Test state persistence, capacity limits, and test-time recovery in real time.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/lab"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-all shadow-md"
          >
            <Terminal className="h-3.5 w-3.5" /> Launch Lab
          </Link>
          <Link
            href="/bdh-cq"
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition-all"
          >
            BDH-CQ &amp; Inference Scaling <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
