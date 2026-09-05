"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { 
  Terminal, 
  Play, 
  Cpu, 
  Zap, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  ArrowDown,
  BookOpen,
  FlaskConical
} from "lucide-react";
import { runUnifiedLabApi } from "@/lib/api";
import { SimulationResult, ClientSimulator } from "@/lib/simulator";
import StateVectorVisualizer from "@/components/StateVectorVisualizer";
import D3EnergyLandscape from "@/components/D3EnergyLandscape";
import InternalStateStepVisualizer from "@/components/InternalStateStepVisualizer";
import GuidedPathwayLab from "@/components/GuidedPathwayLab";

export default function LabPage() {
  const [labMode, setLabMode] = useState<"guided" | "workbench">("guided");
  // 1. Model Architecture
  const [modelType, setModelType] = useState<string>("educational_evolving_memory_toy");

  // 2. The 4 Real Computational Controls
  const [seqLength, setSeqLength] = useState<number>(64);
  const [memoryCapacity, setMemoryCapacity] = useState<number>(6);
  const [interferenceStrength, setInterferenceStrength] = useState<number>(0.2);
  const [inferenceEffort, setInferenceEffort] = useState<number>(4);

  // 3. System & Reproducibility state
  const [seed, setSeed] = useState<number>(42);
  const [forcePrecomputed, setForcePrecomputed] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // 4. Active Result (Opens with running preset experiment)
  const [result, setResult] = useState<SimulationResult>(() => {
    return ClientSimulator.runUnifiedLabExperiment(
      "educational_evolving_memory_toy",
      64,
      6,
      0.2,
      4,
      42,
      false
    );
  });

  // Reactive Execution when any control changes
  const executeExperiment = useCallback(async (
    mType = modelType,
    sLen = seqLength,
    mCap = memoryCapacity,
    iStr = interferenceStrength,
    iEff = inferenceEffort,
    s = seed,
    fPre = forcePrecomputed
  ) => {
    startTransition(async () => {
      const res = await runUnifiedLabApi({
        model_type: mType,
        sequence_length: sLen,
        memory_capacity: mCap,
        interference_strength: iStr,
        inference_effort: iEff,
        seed: s,
        force_precomputed: fPre
      });
      setResult(res);
    });
  }, [modelType, seqLength, memoryCapacity, interferenceStrength, inferenceEffort, seed, forcePrecomputed]);

  // Trigger on any variable change
  useEffect(() => {
    executeExperiment(modelType, seqLength, memoryCapacity, interferenceStrength, inferenceEffort, seed, forcePrecomputed);
  }, [modelType, seqLength, memoryCapacity, interferenceStrength, inferenceEffort, seed, forcePrecomputed, executeExperiment]);

  const isMatch = result.metrics.is_correct;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Laboratory Header & Status */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="h-5 w-5 text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Interactive Evolving Memory Lab
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Real-time scientific workbench: test associative retention, interference noise, and test-time attractor recovery.
        </p>
      </div>

      {/* Mode Selection Tabs & Execution Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setLabMode("guided")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              labMode === "guided"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Guided Discovery (7 Stages)
          </button>
          <button
            onClick={() => setLabMode("workbench")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              labMode === "workbench"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" /> Open Research Workbench
          </button>
        </div>

        {/* Execution Mode Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#080c14] px-3 py-1.5 text-xs font-mono">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                result.execution_mode === "live" 
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" 
                  : "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
              }`}
            />
            <span className="text-slate-200 uppercase font-semibold tracking-wider text-[11px]">
              {result.execution_mode === "live" ? "LIVE EXPERIMENT" : "PRECOMPUTED EXPERIMENT"}
            </span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-blue-400 font-mono text-[11px]">
              {result.latency_ms.toFixed(1)} ms
            </span>
          </div>

          <button
            onClick={() => setForcePrecomputed(!forcePrecomputed)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              forcePrecomputed
                ? "border-purple-500/50 bg-purple-500/20 text-purple-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
            title="Toggle between real-time client computation and precomputed reference"
          >
            {forcePrecomputed ? "Mode: Precomputed" : "Mode: Live"}
          </button>
        </div>
      </div>

      {labMode === "guided" ? (
        <GuidedPathwayLab />
      ) : (
        /* Main Workbench Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Model Selection & 4 Real Computational Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Target Architecture Selection */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-blue-400" /> 1. Model Architecture
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Real Parameter</span>
            </div>

            <div className="space-y-2">
              {[
                { 
                  id: "educational_evolving_memory_toy", 
                  label: "Educational Evolving Toy", 
                  tag: "O(1) State, Dynamic Gating", 
                  color: "text-emerald-400",
                  border: "border-emerald-500/40 bg-emerald-500/10"
                },
                { 
                  id: "fixed_size_recurrent_memory", 
                  label: "Fixed-Size Recurrent", 
                  tag: "O(d) Linear Vector", 
                  color: "text-rose-400",
                  border: "border-rose-500/40 bg-rose-500/10"
                },
                { 
                  id: "full_history_reference_baseline", 
                  label: "Full-History Transformer", 
                  tag: "O(T·d) KV Cache", 
                  color: "text-blue-400",
                  border: "border-blue-500/40 bg-blue-500/10"
                }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModelType(m.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    modelType === m.id
                      ? `${m.border} text-white font-medium shadow-sm`
                      : "border-white/5 bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{m.label}</span>
                    <span className={`text-[10px] font-mono ${m.color}`}>{m.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. The 4 Essential Computational Controls */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-purple-400" /> 2. Computational Controls
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">All Active</span>
            </div>

            {/* Control 1: Sequence Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1">
                  1. Sequence Length (L):
                </span>
                <span className="text-blue-400 font-bold">{seqLength} tokens</span>
              </div>
              <input
                type="range"
                min={10}
                max={300}
                step={10}
                value={seqLength}
                onChange={(e) => setSeqLength(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10 (Short)</span>
                <span>150</span>
                <span>300 (Long-Horizon)</span>
              </div>
            </div>

            {/* Control 2: Memory Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1">
                  2. Memory Capacity (M):
                </span>
                <span className="text-emerald-400 font-bold">{memoryCapacity} pairs</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={memoryCapacity}
                onChange={(e) => setMemoryCapacity(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2 (Orthogonal)</span>
                <span>12</span>
                <span>24 (Subspace Overcrowded)</span>
              </div>
            </div>

            {/* Control 3: Interference Strength */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1">
                  3. Interference Strength (p):
                </span>
                <span className="text-amber-400 font-bold">{(interferenceStrength * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={0.8}
                step={0.05}
                value={interferenceStrength}
                onChange={(e) => setInterferenceStrength(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% (Clean)</span>
                <span>40%</span>
                <span>80% (Severe Noise)</span>
              </div>
            </div>

            {/* Control 4: Inference Effort */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-purple-300 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> 4. Inference Effort (K):
                </span>
                <span className="text-purple-400 font-bold">{inferenceEffort} cycles</span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                step={1}
                value={inferenceEffort}
                onChange={(e) => setInferenceEffort(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>K=1 (Direct)</span>
                <span>K=8</span>
                <span>K=16 (Deep Attractor)</span>
              </div>
            </div>

            {/* Seed & Reproducibility */}
            <div className="space-y-1.5 border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Random Seed:</span>
                <span className="text-slate-200">{seed}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-full rounded bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono text-slate-200"
                />
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                  title="Randomize Seed"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Boundaries Notice */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Educational Surrogate Notice:
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              This interactive model is an educational toy surrogate (d=32 fast-weights). Never call this official production BDH.
            </p>
          </div>

        </div>

        {/* Right Column: The Complete Visual Sequence Flow (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ========================================================================= */}
          {/* 1. INPUT EVENTS SEQUENCE */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  1
                </span>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Input Event Sequence (T = {result.input_sequence.length} tokens)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {memoryCapacity} Bindings &bull; {(interferenceStrength * 100).toFixed(0)}% Noise
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Stream of key-value associations, distractor noise tokens, and the terminal probe query:
            </p>

            {/* Token Stream Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-2 rounded-lg bg-black/40 border border-white/5 scrollbar-none">
              {result.input_sequence.map((tok, i) => {
                const isQuery = tok.startsWith("QUERY:");
                const isKV = tok.includes(":") && !isQuery;
                const isNoise = tok.startsWith("<NOISE");
                return (
                  <span
                    key={i}
                    className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 border transition-all ${
                      isQuery
                        ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold shadow-sm shadow-purple-500/20"
                        : isKV
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                        : "bg-white/5 border-white/5 text-slate-500"
                    }`}
                  >
                    {tok}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="h-4 w-4 text-slate-600 animate-bounce" />
          </div>

          {/* ========================================================================= */}
          {/* 2. EVOLVING MEMORY STATE */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  2
                </span>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Evolving Memory State Dynamics
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-400">Final SNR:</span>
                <span className={`font-bold ${result.metrics.snr_db > 10 ? "text-emerald-400" : "text-rose-400"}`}>
                  {result.metrics.snr_db.toFixed(1)} dB
                </span>
                <span className="text-slate-400 ml-2">Norm:</span>
                <span className="text-slate-200">{result.metrics.final_state_norm.toFixed(2)}</span>
              </div>
            </div>

            {/* Step-by-Step Internal State Evolution Component */}
            <InternalStateStepVisualizer traces={result.state_trace} modelType={result.model_type} />

            {/* D3 State Vector Line & Telemetry */}
            <StateVectorVisualizer traces={result.state_trace} modelType={result.model_type} />
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="h-4 w-4 text-slate-600 animate-bounce" />
          </div>

          {/* ========================================================================= */}
          {/* 3. RETRIEVAL & ATTRACTOR RELAXATION */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                  3
                </span>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Retrieval &amp; Inference-Time Attractor Settling
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                K = {result.metrics.inference_steps} Deliberation Steps
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Iterative query relaxation over the state energy landscape <code>E(q, S_T)</code> de-noises superposition crosstalk:
            </p>

            {/* D3 Attractor Energy Landscape */}
            <D3EnergyLandscape
              inferenceSteps={result.metrics.inference_steps}
              confidenceScore={isMatch ? 0.88 : 0.22}
            />
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="h-4 w-4 text-slate-600 animate-bounce" />
          </div>

          {/* ========================================================================= */}
          {/* 4. PREDICTION VS EXPECTED GROUND TRUTH (SIDE BY SIDE) */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                  4
                </span>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Prediction vs Ground Truth Readout
                </h3>
              </div>

              {/* Match / Mismatch Status */}
              <div className="flex items-center gap-1.5">
                {isMatch ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> EXACT MATCH (CORRECT)
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold">
                    <XCircle className="h-3.5 w-3.5" /> MISMATCH / ATTENUATED (FAILURE)
                  </div>
                )}
              </div>
            </div>

            {/* Side-by-Side Expected vs Model Output Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: EXPECTED GROUND TRUTH */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    EXPECTED GROUND TRUTH
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Target Binding</span>
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                  {result.expected_answer}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Queried Key: {result.input_sequence[result.input_sequence.length - 1]}
                </div>
              </div>

              {/* Card 2: MODEL OUTPUT */}
              <div
                className={`rounded-xl border p-4 space-y-2 transition-all ${
                  isMatch
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-950/20"
                    : "border-rose-500/40 bg-rose-500/5 shadow-lg shadow-rose-950/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    MODEL OUTPUT
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isMatch ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isMatch ? "De-noised" : "Corrupted / Attenuated"}
                  </span>
                </div>
                <div
                  className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${
                    isMatch ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {result.model_output}
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Accuracy: {(result.metrics.accuracy * 100).toFixed(0)}%</span>
                  <span>Latency: {result.latency_ms.toFixed(2)} ms</span>
                </div>
              </div>

            </div>

            {/* Scientific Explanation Summary */}
            <div className="rounded-lg bg-white/5 border border-white/5 p-3.5 text-xs text-slate-300 space-y-1">
              <span className="font-mono font-semibold text-blue-300 text-[11px]">Empirical Diagnostics: </span>
              {isMatch ? (
                <span>
                  The evolving state preserved the target association across {seqLength} tokens. Inference effort (K={inferenceEffort}) successfully projected the query into the global attractor well.
                </span>
              ) : (
                <span>
                  Retrieval failed due to {interferenceStrength > 0.4 ? "destructive interference overwrites" : memoryCapacity > 16 ? "subspace capacity saturation (M > d/2)" : "attenuation over long horizon"}.
                  {inferenceEffort < 8 && " Increasing inference effort (K) may aid recovery if SNR &gt; -6 dB."}
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
      )}

    </div>
  );
}
