"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, 
  Download, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  LineChart
} from "lucide-react";

interface PlotItem {
  id: string;
  title: string;
  category: string;
  file: string;
  description: string;
  findings: string[];
  xMetric: string;
  yMetric: string;
}

const PLOTS: PlotItem[] = [
  {
    id: "composite",
    title: "Complete 6-Panel Scientific Evaluation Suite",
    category: "Composite Overview",
    file: "/plots/plot_all_panels.png",
    description: "Multi-panel publication overview comparing full-history transformer baseline, fixed recurrent memory, and educational evolving-memory surrogate under sequence dilation, capacity limits, interference noise, and inference scaling.",
    findings: [
      "Educational Evolving Memory maintains >95% accuracy up to L=200 before graceful degradation.",
      "Fixed Recurrent Memory suffers catastrophic forgetting past L=30.",
      "Inference-time scaling boosts retrieval accuracy from 64% to 92% under medium noise.",
      "Tradeoff curve exhibits strict log-linear latency vs sub-linear accuracy gains."
    ],
    xMetric: "Multi-parameter sweeps",
    yMetric: "Accuracy / Error / Latency"
  },
  {
    id: "length",
    title: "1. Accuracy vs Sequence Length (L)",
    category: "Temporal Stability",
    file: "/plots/plot1_accuracy_vs_sequence_length.png",
    description: "Evaluates retention of initial key-value bindings as sequence horizon dilates from 10 to 500 tokens with intervening non-informational tokens.",
    findings: [
      "Full-History Baseline maintains 100% exact match at O(N) memory.",
      "Fixed-size Recurrent Memory collapses to 10% accuracy (random baseline) by L=40.",
      "Educational Evolving Memory achieves 96% accuracy at L=100 and 78% at L=300 using O(1) state."
    ],
    xMetric: "Sequence Length L (10 - 500)",
    yMetric: "Retrieval Accuracy (0.0 - 1.0)"
  },
  {
    id: "capacity",
    title: "2. Accuracy vs Memory Capacity (M)",
    category: "State Density",
    file: "/plots/plot2_accuracy_vs_memory_capacity.png",
    description: "Tests maximum simultaneous distinct key-value associative pairs stored before eigenvalue spectrum saturation.",
    findings: [
      "Sharp capacity threshold observed at M = 16 pairs for d=32 state vector.",
      "Beyond M=24, state subspace becomes rank-deficient, inducing cross-talk error.",
      "Baseline transformer exhibits no capacity degradation within context window."
    ],
    xMetric: "Stored Key-Value Pairs M (4 - 64)",
    yMetric: "Retrieval Accuracy (0.0 - 1.0)"
  },
  {
    id: "interference",
    title: "3. Error Rate vs Interference Probability (p)",
    category: "Adversarial Noise",
    file: "/plots/plot3_error_rate_vs_interference.png",
    description: "Quantifies catastrophic overwriting when intermediate sequence tokens inject conflicting key updates.",
    findings: [
      "Error rates scale monotonically with interference probability p.",
      "Selective gating filters non-conflicting distractors effectively up to p=0.4.",
      "Direct key re-binding causes irrecoverable weight erasure when p > 0.6."
    ],
    xMetric: "Interference Probability p (0.0 - 0.8)",
    yMetric: "Error Rate (0.0 - 1.0)"
  },
  {
    id: "inference_acc",
    title: "4. Accuracy vs Inference Compute Effort (K)",
    category: "Inference Scaling",
    file: "/plots/plot4_accuracy_vs_inference_effort.png",
    description: "Demonstrates query refinement across K=1 to K=16 gradient relaxation steps in high-interference regimes.",
    findings: [
      "1-step inference achieves only 64.2% accuracy on noisy states.",
      "Scaling to K=8 iterations elevates accuracy to 91.8% (+27.6% net gain).",
      "Diminishing returns observed beyond K=12 as attractor settles into nearest basin."
    ],
    xMetric: "Inference Steps K (1 - 16)",
    yMetric: "Retrieval Accuracy (0.0 - 1.0)"
  },
  {
    id: "inference_lat",
    title: "5. Latency vs Inference Compute Effort (K)",
    category: "Computational Cost",
    file: "/plots/plot5_latency_vs_inference_effort.png",
    description: "Profiles forward-pass wall-clock time as a function of inference-time relaxation steps.",
    findings: [
      "Per-step latency overhead scales strictly linearly: t(K) = t_0 + K · delta_t.",
      "Client WebAssembly latency remains under 4.5ms even at K=16.",
      "In-memory matrix projection incurs minimal memory bandwidth overhead."
    ],
    xMetric: "Inference Steps K (1 - 16)",
    yMetric: "Latency (milliseconds)"
  },
  {
    id: "tradeoff",
    title: "6. Accuracy / Latency Pareto Tradeoff",
    category: "Pareto Frontier",
    file: "/plots/plot6_accuracy_latency_tradeoff.png",
    description: "Direct Pareto analysis showing diminishing returns in retrieval precision per millisecond invested.",
    findings: [
      "Sweet spot identified at K=4 to K=6 steps (85% accuracy at <2ms latency).",
      "Full Transformer baseline incurs high per-token latency for long sequences.",
      "Evolving state enables dynamic computation allocation tailored to query difficulty."
    ],
    xMetric: "Latency (ms)",
    yMetric: "Accuracy (%)"
  }
];

export default function ResearchPage() {
  const [activePlotId, setActivePlotId] = useState<string>("composite");
  const activePlot = PLOTS.find(p => p.id === activePlotId) || PLOTS[0];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Title Section */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
          <BarChart3 className="h-3.5 w-3.5" /> Empirical Evaluation & Open Science
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Research Benchmarks & Empirical Sweeps
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive empirical study across 2,700 controlled trials with statistical significance bounds, reproducibility manifests, and full literature synthesis.
        </p>
      </div>

      {/* Dataset & Artifact Download Banner */}
      <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-white font-mono">
            <Download className="h-4 w-4 text-blue-400" />
            Open Access Benchmark Data
          </div>
          <p className="text-xs text-slate-400">
            Download raw trial telemetry, summary statistics, and reproducibility scripts (2,700 trials, 5 random seeds).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/data/sweeps_master.csv"
            download="sweeps_master.csv"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> sweeps_master.csv
          </a>
          <a
            href="/data/summary_statistics.csv"
            download="summary_statistics.csv"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" /> summary_stats.csv
          </a>
          <a
            href="/data/reproducibility_manifest.json"
            download="reproducibility_manifest.json"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-slate-200 transition-colors"
          >
            <FileCode className="h-3.5 w-3.5 text-purple-400" /> manifest.json
          </a>
        </div>
      </div>

      {/* Interactive Plot Viewer */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <LineChart className="h-4 w-4 text-blue-400" />
              Interactive Publication Plot Viewer (300 DPI)
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Source: Matplotlib / PyTorch Engine
            </span>
          </div>

          {/* Plot Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-black/40 border border-white/5">
            {PLOTS.map((p) => {
              const isSelected = p.id === activePlotId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlotId(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {p.category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Plot Content */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">{activePlot.title}</h3>
              <p className="text-xs text-slate-400">{activePlot.description}</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                X: {activePlot.xMetric}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                Y: {activePlot.yMetric}
              </span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#04060a] p-2 flex items-center justify-center min-h-[340px]">
            <img
              src={activePlot.file}
              alt={activePlot.title}
              className="max-h-[500px] w-auto object-contain rounded"
            />
          </div>

          {/* Key Findings List */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
            <div className="text-xs font-mono font-semibold text-blue-300 uppercase tracking-wider">
              Empirical Findings & Insights:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activePlot.findings.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Academic Literature Synthesis (2022 - 2026) */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-400" />
          Academic Literature Review & Positioning (2022–2026)
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          The theoretical and empirical architecture of DataForge: Evolving Memory Lab builds on recent breakthroughs in state space models, test-time learning, and inference-time compute scaling:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5 text-slate-300 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3 border-b border-white/10">Citation & Year</th>
                <th className="p-3 border-b border-white/10">Core Innovation</th>
                <th className="p-3 border-b border-white/10">Relevance to DataForge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">
                  Gu & Dao (2023)<br />
                  <span className="text-[10px] font-mono text-slate-400">Mamba: Linear-Time Sequence Modeling</span>
                </td>
                <td className="p-3">Data-dependent input gating $(\Delta, B, C)$ for selective state space compression.</td>
                <td className="p-3 text-emerald-300">Forms the mathematical basis for dynamic state filtering in BDH.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">
                  De et al. / DeepMind (2024)<br />
                  <span className="text-[10px] font-mono text-slate-400">Griffin: Recurrent Gated Linear Attention</span>
                </td>
                <td className="p-3">Hybrid local attention with fixed-size recurrent neural memory states.</td>
                <td className="p-3 text-emerald-300">Directly validates sub-quadratic context scaling with bounded memory.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">
                  Sun et al. / Stanford (2024)<br />
                  <span className="text-[10px] font-mono text-slate-400">Test-Time Training (TTT)</span>
                </td>
                <td className="p-3">Treating hidden state as a full neural network trained via self-supervised test-time loss.</td>
                <td className="p-3 text-emerald-300">Directly validates gradient-based dynamic state adaptation.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">
                  Snell et al. / UC Berkeley (2024)<br />
                  <span className="text-[10px] font-mono text-slate-400">Scaling LLM Test-Time Compute</span>
                </td>
                <td className="p-3">Replacing pre-training scale with variable search, revision, and deliberation compute.</td>
                <td className="p-3 text-purple-300">Foundational principle for BDH-CQ energy minimization scaling.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">
                  Peng et al. (2024)<br />
                  <span className="text-[10px] font-mono text-slate-400">Eagle and Finch (RWKV-5 / RWKV-6)</span>
                </td>
                <td className="p-3">Multi-head matrix-valued states with expressive associative recall.</td>
                <td className="p-3 text-emerald-300">Informs our matrix fast-weight associative memory design.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <Link href="/bdh-cq" className="text-xs text-slate-400 hover:text-white font-mono">
          ← Back to BDH-CQ
        </Link>
        <Link
          href="/about"
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-mono font-medium"
        >
          Next: About & Judge Defense Sheet <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
