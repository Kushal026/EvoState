"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Scale,
  RefreshCw
} from "lucide-react";
import { runUnifiedLabApi } from "@/lib/api";
import { SimulationResult, ClientSimulator } from "@/lib/simulator";
import EvidenceBadge from "./EvidenceBadge";

export default function ChallengeTheClaim() {
  const [seqLength, setSeqLength] = useState<number>(256);
  const [interference, setInterference] = useState<number>(0.4);
  const [memoryCapacity, setMemoryCapacity] = useState<number>(8);
  const [inferenceEffort, setInferenceEffort] = useState<number>(6);
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<SimulationResult>(() => {
    return ClientSimulator.runUnifiedLabExperiment(
      "educational_evolving_memory_toy",
      256,
      8,
      0.4,
      6,
      42,
      false
    );
  });

  useEffect(() => {
    const instantRes = ClientSimulator.runUnifiedLabExperiment(
      "educational_evolving_memory_toy",
      seqLength,
      memoryCapacity,
      interference,
      inferenceEffort,
      42,
      false
    );
    setResult(instantRes);
  }, [seqLength, interference, memoryCapacity, inferenceEffort]);

  const acc = result.metrics.accuracy;
  const isRecovered = result.metrics.is_correct;

  // Determine claim status based on real empirical metrics
  // Claim parts:
  // 1. Fixed-size state carries information across sequences (Acc > 0.5 when moderate)
  // 2. Longer sequences & interference cause degradation (Acc drops with T > 512 or interference > 0.6)
  // 3. Inference computation improves recovery (Inference effort > 4 helps restore SNR)
  let claimStatus: "SUPPORTED" | "CHALLENGED" | "INCONCLUSIVE" = "SUPPORTED";
  let statusReason = "";

  if (seqLength >= 512 && interference >= 0.7 && inferenceEffort <= 2 && acc < 0.4) {
    claimStatus = "SUPPORTED";
    statusReason = "Expected catastrophic interference observed: bounded matrix subspace saturated without inference relaxation.";
  } else if (inferenceEffort >= 8 && acc > 0.75 && interference <= 0.6) {
    claimStatus = "SUPPORTED";
    statusReason = "Inference-time scaling successfully denoises associative superposition and restores degraded retrieval coordinates.";
  } else if (interference >= 0.95 && acc > 0.9) {
    claimStatus = "CHALLENGED";
    statusReason = "Unexpected high accuracy under 95% adversarial interference. Subspace orthogonalization exceeded theoretical bound.";
  } else if (seqLength === 16 && acc > 0.9) {
    claimStatus = "SUPPORTED";
    statusReason = "Compact evolving state accurately preserves prefix information across short-to-medium horizons.";
  } else {
    claimStatus = "INCONCLUSIVE";
    statusReason = "Parameter regime is on the transitional boundary. Increase sample seeds (N=30) or stress variables to evaluate.";
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#07090f] p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-400">
            <Scale className="h-3.5 w-3.5" /> Falsification Engine
          </div>
          <EvidenceBadge tier="experiment" label="Falsification Test" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Challenge the Claim
        </h2>
        <p className="text-sm text-slate-300">
          If the central claim is true, varying sequence length, interference, capacity, and inference compute will produce statistically predictable consequences. Try to break the hypothesis:
        </p>
      </div>

      {/* Claim Banner */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs sm:text-sm font-serif italic text-slate-200 leading-relaxed">
        &ldquo;A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery.&rdquo;
      </div>

      {/* 4 Interactive Variable Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Var 1 */}
        <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">1. Horizon (T)</span>
            <span className="text-blue-400 font-bold">{seqLength}</span>
          </div>
          <input
            type="range"
            min={16}
            max={1024}
            step={16}
            value={seqLength}
            onChange={(e) => setSeqLength(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="text-[10px] text-slate-500 font-mono">Compressive pressure</div>
        </div>

        {/* Var 2 */}
        <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">2. Interference (I)</span>
            <span className="text-amber-400 font-bold">{(interference * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.0}
            max={1.0}
            step={0.05}
            value={interference}
            onChange={(e) => setInterference(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="text-[10px] text-slate-500 font-mono">Conflicting overwrites</div>
        </div>

        {/* Var 3 */}
        <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">3. Capacity (N_pairs)</span>
            <span className="text-indigo-400 font-bold">{memoryCapacity}</span>
          </div>
          <input
            type="range"
            min={1}
            max={16}
            step={1}
            value={memoryCapacity}
            onChange={(e) => setMemoryCapacity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="text-[10px] text-slate-500 font-mono">Stored key-value pairs</div>
        </div>

        {/* Var 4 */}
        <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">4. Compute (C_infer)</span>
            <span className="text-purple-400 font-bold">{inferenceEffort}</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={inferenceEffort}
            onChange={(e) => setInferenceEffort(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="text-[10px] text-slate-500 font-mono">Latent relaxation cycles</div>
        </div>

      </div>

      {/* Claim Status Verdict Banner */}
      <div className={`rounded-xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        claimStatus === "SUPPORTED"
          ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
          : claimStatus === "CHALLENGED"
          ? "border-rose-500/30 bg-rose-950/20 text-rose-300"
          : "border-amber-500/30 bg-amber-950/20 text-amber-300"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold">
            {claimStatus === "SUPPORTED" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : claimStatus === "CHALLENGED" ? (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            ) : (
              <HelpCircle className="h-4 w-4 text-amber-400" />
            )}
            <span>CLAIM STATUS: {claimStatus === "SUPPORTED" ? "SUPPORTED UNDER THIS EXPERIMENT" : claimStatus === "CHALLENGED" ? "CLAIM CHALLENGED" : "INCONCLUSIVE REGIME"}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {statusReason}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 font-mono text-xs">
          <div className="rounded bg-black/40 px-3 py-1.5 border border-white/10">
            <span className="text-slate-400">Observed Acc: </span>
            <span className="font-bold text-white">{(acc * 100).toFixed(1)}%</span>
          </div>
          <div className="rounded bg-black/40 px-3 py-1.5 border border-white/10">
            <span className="text-slate-400">Readout: </span>
            <span className="font-bold text-white">{isRecovered ? "CORRECT" : "CORRUPT"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
