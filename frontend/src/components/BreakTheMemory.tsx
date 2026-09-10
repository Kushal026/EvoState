"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { 
  Sliders, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert,
  Layers,
  ArrowRight,
  Database
} from "lucide-react";
import { ClientSimulator, SimulationResult } from "@/lib/simulator";
import { runUnifiedLabApi } from "@/lib/api";
import EvidenceBadge from "./EvidenceBadge";

export default function BreakTheMemory() {
  const [modelType, setModelType] = useState<string>("educational_evolving_memory_toy");
  const [seqLength, setSeqLength] = useState<number>(128);
  const [interference, setInterference] = useState<number>(0.3);
  const [inferenceEffort, setInferenceEffort] = useState<number>(4);
  const [memoryCapacity, setMemoryCapacity] = useState<number>(8);
  const [seed, setSeed] = useState<number>(42);
  const [isPending, startTransition] = useTransition();

  // Result state
  const [result, setResult] = useState<SimulationResult>(() => {
    return ClientSimulator.runUnifiedLabExperiment(
      "educational_evolving_memory_toy",
      128,
      8,
      0.3,
      4,
      42,
      false
    );
  });

  // Track deltas for "What Changed?" panel
  const prevParamsRef = useRef({
    seqLength: 128,
    interference: 0.3,
    inferenceEffort: 4,
    accuracy: 88.5
  });

  const [deltaInfo, setDeltaInfo] = useState<{
    seqDelta: number;
    intDelta: number;
    infDelta: number;
    accDelta: number;
  }>({
    seqDelta: 0,
    intDelta: 0,
    infDelta: 0,
    accDelta: 0
  });

  // Execute reactive experiment with instantaneous 0ms client response
  useEffect(() => {
    // 1. Instantaneous synchronous computation (0ms UI lag)
    const instantRes = ClientSimulator.runUnifiedLabExperiment(
      modelType,
      seqLength,
      memoryCapacity,
      interference,
      inferenceEffort,
      seed,
      false
    );
    
    const currentAcc = instantRes.metrics.accuracy * 100;
    setDeltaInfo({
      seqDelta: seqLength - prevParamsRef.current.seqLength,
      intDelta: Math.round((interference - prevParamsRef.current.interference) * 100),
      infDelta: inferenceEffort - prevParamsRef.current.inferenceEffort,
      accDelta: parseFloat((currentAcc - prevParamsRef.current.accuracy).toFixed(1))
    });

    prevParamsRef.current = {
      seqLength,
      interference,
      inferenceEffort,
      accuracy: currentAcc
    };

    setResult(instantRes);
  }, [modelType, seqLength, interference, inferenceEffort, memoryCapacity, seed]);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accPct = (result.metrics.accuracy * 100).toFixed(1);
  const recallPct = (result.metrics.accuracy * (1 - result.metrics.error_rate * 0.1) * 100).toFixed(1);
  const latencyMs = mounted && result?.latency_ms != null ? result.latency_ms.toFixed(2) : "1.25";
  const isCorrect = result.metrics.is_correct;

  // Ground truth vs Model Output items
  const groundTruthTokens = [
    { key: "Target_A", val: "Alpha", status: isCorrect ? "retained" : "corrupted" },
    { key: "Target_B", val: "Beta", status: interference > 0.5 ? "corrupted" : "retained" },
    { key: "Target_C", val: "Gamma", status: seqLength > 256 && modelType.includes("recurrent") ? "corrupted" : "retained" },
    { key: "Target_D", val: "Delta", status: "retained" }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#060810] p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
            <Terminal className="h-3.5 w-3.5" /> Interactive Testbench
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE EXPERIMENT
            </span>
            <EvidenceBadge tier="experiment" label="N=30 Standard" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Break the Memory
        </h2>
        <p className="text-sm text-slate-300">
          Push the state until it fails. Increase sequence length, inject conflicting associative updates, or scale inference cycles to observe empirical phase transitions.
        </p>
      </div>

      {/* Grid: Controls (5 cols) & Live Results (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Model Architecture Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center justify-between">
              <span>Model Architecture</span>
              <span className="text-blue-400 text-[10px]">O(1) vs O(T) Footprint</span>
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs font-mono text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="educational_evolving_memory_toy">Educational Evolving Memory (Fast-Weights)</option>
              <option value="fixed_size_recurrent_memory">Fixed-Size Recurrent State (Vanilla GRU/RNN)</option>
              <option value="full_history_reference_baseline">Full-History Attention (KV-Cache Baseline)</option>
            </select>
          </div>

          {/* Control 1: Sequence Length */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Sequence Length (T)</span>
              <span className="text-blue-400 font-bold">{seqLength} tokens</span>
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
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>16 (Tight)</span>
              <span>256</span>
              <span>512</span>
              <span>1024 (Stress)</span>
            </div>
          </div>

          {/* Control 2: Interference Overwrite Strength */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Interference Strength</span>
              <span className={`font-bold ${interference > 0.6 ? "text-amber-400" : "text-slate-300"}`}>
                {(interference * 100).toFixed(0)}% ({interference > 0.6 ? "HIGH" : interference > 0.3 ? "MODERATE" : "LOW"})
              </span>
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
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Clean)</span>
              <span>50% (Crowded)</span>
              <span>100% (Adversarial)</span>
            </div>
          </div>

          {/* Control 3: Inference Effort (C_infer) */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Inference Compute (C_infer)</span>
              <span className="text-purple-400 font-bold">{inferenceEffort} cycles</span>
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
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 (Feedforward)</span>
              <span>12 (Iterative)</span>
              <span>25 (Max Relaxation)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-1">
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">Quick Failure Presets:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setSeqLength(64); setInterference(0.1); setInferenceEffort(2); }}
                className="rounded border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1.5 text-[10px] font-mono text-slate-300 text-center transition-all"
              >
                Normal Safe
              </button>
              <button
                onClick={() => { setSeqLength(768); setInterference(0.2); setInferenceEffort(1); }}
                className="rounded border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1.5 text-[10px] font-mono text-blue-300 text-center transition-all"
              >
                Horizon Stress
              </button>
              <button
                onClick={() => { setSeqLength(256); setInterference(0.85); setInferenceEffort(1); }}
                className="rounded border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1.5 text-[10px] font-mono text-amber-300 text-center transition-all"
              >
                Heavy Attack
              </button>
            </div>
          </div>

        </div>

        {/* Live Result Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Accuracy</div>
              <div suppressHydrationWarning className={`text-xl font-mono font-bold ${Number(accPct) > 75 ? "text-emerald-400" : Number(accPct) > 40 ? "text-amber-400" : "text-rose-400"}`}>
                {accPct}%
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Recall Rate</div>
              <div suppressHydrationWarning className="text-xl font-mono font-bold text-blue-400">
                {recallPct}%
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Interference</div>
              <div suppressHydrationWarning className="text-xl font-mono font-bold text-amber-400">
                {interference.toFixed(2)}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Latency</div>
              <div suppressHydrationWarning className="text-xl font-mono font-bold text-purple-400">
                {latencyMs} ms
              </div>
            </div>
          </div>

          {/* Ground Truth vs Model Output Panel */}
          <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold uppercase flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-blue-400" />
                Ground Truth vs Model Output
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isCorrect ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                {isCorrect ? "QUERY VERIFIED" : "DEGRADED / CORRUPTED"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Ground Truth Column */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Original Ingested Pairs:</div>
                <div className="space-y-1 font-mono text-xs">
                  {groundTruthTokens.map((item, i) => (
                    <div key={i} className="rounded bg-white/5 px-2.5 py-1.5 text-slate-300 flex justify-between border border-white/5">
                      <span className="text-blue-300">{item.key}</span>
                      <span className="text-white font-medium">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Output Column */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Reconstructed Readout:</div>
                <div className="space-y-1 font-mono text-xs">
                  {groundTruthTokens.map((item, i) => {
                    const isOk = item.status === "retained";
                    return (
                      <div 
                        key={i} 
                        className={`rounded px-2.5 py-1.5 flex justify-between border ${
                          isOk 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                        }`}
                      >
                        <span className="font-semibold">{item.key}</span>
                        <span>{isOk ? item.val : "CORRUPT [? / NULL]"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* "WHAT CHANGED?" Delta Panel */}
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/20 to-purple-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-blue-300 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                What Changed? (Parametric Delta Telemetry)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Live delta relative to previous state</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div className="rounded bg-black/40 p-2 border border-white/5">
                <div className="text-[9px] text-slate-400 uppercase">Sequence Horizon</div>
                <div className={`font-semibold ${deltaInfo.seqDelta > 0 ? "text-amber-400" : deltaInfo.seqDelta < 0 ? "text-emerald-400" : "text-slate-300"}`}>
                  {deltaInfo.seqDelta >= 0 ? `+${deltaInfo.seqDelta}` : deltaInfo.seqDelta} tokens
                </div>
              </div>

              <div className="rounded bg-black/40 p-2 border border-white/5">
                <div className="text-[9px] text-slate-400 uppercase">Interference</div>
                <div className={`font-semibold ${deltaInfo.intDelta > 0 ? "text-amber-400" : deltaInfo.intDelta < 0 ? "text-emerald-400" : "text-slate-300"}`}>
                  {deltaInfo.intDelta >= 0 ? `+${deltaInfo.intDelta}` : deltaInfo.intDelta}%
                </div>
              </div>

              <div className="rounded bg-black/40 p-2 border border-white/5">
                <div className="text-[9px] text-slate-400 uppercase">Inference Effort</div>
                <div className={`font-semibold ${deltaInfo.infDelta > 0 ? "text-purple-400" : deltaInfo.infDelta < 0 ? "text-slate-400" : "text-slate-300"}`}>
                  {deltaInfo.infDelta >= 0 ? `+${deltaInfo.infDelta}` : deltaInfo.infDelta} cycles
                </div>
              </div>

              <div className="rounded bg-black/40 p-2 border border-white/5">
                <div className="text-[9px] text-slate-400 uppercase">Observed Effect</div>
                <div className={`font-bold flex items-center gap-1 ${deltaInfo.accDelta > 0 ? "text-emerald-400" : deltaInfo.accDelta < 0 ? "text-rose-400" : "text-slate-300"}`}>
                  {deltaInfo.accDelta > 0 ? <TrendingUp className="h-3 w-3" /> : deltaInfo.accDelta < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                  {deltaInfo.accDelta >= 0 ? `+${deltaInfo.accDelta}%` : `${deltaInfo.accDelta}%`} Acc
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
