"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Play, Cpu, Zap, Activity, CheckCircle2, XCircle, AlertTriangle, Layers, RotateCcw } from "lucide-react";
import { runRecallApi, runInterferenceApi, runScalingApi } from "@/lib/api";
import { SimulationResult } from "@/lib/simulator";
import StateVectorVisualizer from "@/components/StateVectorVisualizer";
import D3EnergyLandscape from "@/components/D3EnergyLandscape";

type ExperimentType = "delayed_recall" | "long_horizon_recall" | "interference" | "memory_capacity" | "inference_recovery";

export default function LabPage() {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentType>("delayed_recall");
  const [selectedModel, setSelectedModel] = useState<string>("educational_evolving_memory_toy");
  
  // Controllable Variables
  const [delay, setDelay] = useState<number>(16);
  const [seqLength, setSeqLength] = useState<number>(64);
  const [overwrites, setOverwrites] = useState<number>(3);
  const [capacityPairs, setCapacityPairs] = useState<number>(4);
  const [inferenceBudget, setInferenceBudget] = useState<number>(4);
  const [forcePrecomputed, setForcePrecomputed] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(42);

  // Result state
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const executeExperiment = async () => {
    setLoading(true);
    let res: SimulationResult;

    if (selectedExperiment === "delayed_recall") {
      res = await runRecallApi({
        model_type: selectedModel,
        recall_type: "delayed",
        delay,
        inference_budget: inferenceBudget,
        seed,
        force_precomputed: forcePrecomputed
      });
    } else if (selectedExperiment === "long_horizon_recall") {
      res = await runRecallApi({
        model_type: selectedModel,
        recall_type: "long_horizon",
        sequence_length: seqLength,
        inference_budget: inferenceBudget,
        seed,
        force_precomputed: forcePrecomputed
      });
    } else if (selectedExperiment === "interference") {
      res = await runInterferenceApi({
        model_type: selectedModel,
        num_overwrites: overwrites,
        target_mode: "recency",
        seed,
        force_precomputed: forcePrecomputed
      });
    } else if (selectedExperiment === "memory_capacity") {
      res = await runRecallApi({
        model_type: selectedModel,
        recall_type: "long_horizon",
        sequence_length: capacityPairs * 8,
        inference_budget: inferenceBudget,
        seed,
        force_precomputed: forcePrecomputed
      });
    } else {
      res = await runScalingApi({
        model_type: selectedModel,
        inference_budget: inferenceBudget,
        clutter_pairs: 4,
        seed,
        force_precomputed: forcePrecomputed
      });
    }

    setResult(res);
    setLoading(false);
  };

  useEffect(() => {
    executeExperiment();
  }, [selectedExperiment, selectedModel, forcePrecomputed]);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interactive EvoLab</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time scientific workbench for testing state retention, interference breakdown, and test-time recovery.
          </p>
        </div>

        {/* Execution Mode Toggle */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#080c14] p-1 text-xs">
          <button
            onClick={() => setForcePrecomputed(false)}
            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
              !forcePrecomputed ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Live Computation
          </button>
          <button
            onClick={() => setForcePrecomputed(true)}
            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
              forcePrecomputed ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Precomputed Reference
          </button>
        </div>
      </div>

      {/* Main Two-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Experiment Selector */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              1. Select Protocol
            </h3>
            <div className="space-y-1.5">
              {[
                { id: "delayed_recall", label: "Delayed Recall (k-Lag)", desc: "Needle retention over variable lag" },
                { id: "long_horizon_recall", label: "Long-Horizon Recall (T)", desc: "Context scaling with distractor clutter" },
                { id: "interference", label: "Interference & Overwrites", desc: "Conflicting updates to the same key" },
                { id: "memory_capacity", label: "Capacity Stress Test", desc: "Packing N pairs into bounded state rank" },
                { id: "inference_recovery", label: "Inference-Time Scaling", desc: "Test-time compute recovery (C_infer)" }
              ].map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperiment(exp.id as ExperimentType)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedExperiment === exp.id
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-200 shadow-sm"
                      : "border-white/5 bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="font-semibold text-slate-200">{exp.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{exp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Model Architecture Selector */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              2. Target Architecture
            </h3>
            <div className="space-y-2">
              {[
                { id: "educational_evolving_memory_toy", label: "Educational Evolving Toy", tag: "O(1) Matrix Fast Weights", color: "text-emerald-400" },
                { id: "fixed_size_recurrent_memory", label: "Fixed-Size Recurrent", tag: "O(d) Linear Vector", color: "text-red-400" },
                { id: "full_history_reference_baseline", label: "Full-History KV Cache", tag: "O(T) Exact Attention", color: "text-blue-400" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedModel === m.id
                      ? "border-blue-500/50 bg-blue-500/15 text-white"
                      : "border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
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

          {/* 3. Parameter Sliders */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              3. Controllable Variables
            </h3>

            {selectedExperiment === "delayed_recall" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Delay Lag (k):</span>
                  <span className="text-blue-400 font-semibold">{delay} steps</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={256}
                  step={4}
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {selectedExperiment === "long_horizon_recall" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Sequence Length (T):</span>
                  <span className="text-blue-400 font-semibold">{seqLength} tokens</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={512}
                  step={16}
                  value={seqLength}
                  onChange={(e) => setSeqLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {selectedExperiment === "interference" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Conflicting Overwrites:</span>
                  <span className="text-blue-400 font-semibold">{overwrites} writes</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={overwrites}
                  onChange={(e) => setOverwrites(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Inference-Time Compute Slider */}
            <div className="space-y-1.5 border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-purple-300 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> Test-Time Budget (C_infer):
                </span>
                <span className="text-purple-400 font-semibold">{inferenceBudget} cycles</span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                step={1}
                value={inferenceBudget}
                onChange={(e) => setInferenceBudget(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Seed Controller */}
            <div className="space-y-1.5 border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Deterministic Seed:</span>
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
                  title="Randomize"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={executeExperiment}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30 active:scale-98 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {loading ? "Running Tensor Engine..." : "Execute Evaluation"}
            </button>
          </div>

        </div>

        {/* Right Column: Execution Output & State Telemetry (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Primary Result Banner */}
          {result && (
            <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      result.metrics.is_correct ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Evaluation Result:{" "}
                    <span className={result.metrics.is_correct ? "text-emerald-400" : "text-red-400"}>
                      {result.metrics.is_correct ? "SUCCESS (Exact Match)" : "FAILURE (Interference / Attenuated)"}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    Mode: {result.execution_mode.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    {result.latency_ms.toFixed(2)} ms
                  </span>
                </div>
              </div>

              {/* Answer vs Prediction Comparison Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 border border-white/5 p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Expected Ground Truth</div>
                  <div className="text-base font-mono font-bold text-white">{result.expected_answer}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/5 p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Model Readout Output</div>
                  <div
                    className={`text-base font-mono font-bold ${
                      result.metrics.is_correct ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {result.model_output}
                  </div>
                </div>
              </div>

              {/* Ingested Sequence Strip */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5">Ingested Sequence Prefix</div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {result.input_sequence.map((tok, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 border ${
                        tok.startsWith("QUERY:")
                          ? "bg-purple-500/20 border-purple-500/40 text-purple-300 font-semibold"
                          : tok.includes(":")
                          ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                          : "bg-white/5 border-white/5 text-slate-500"
                      }`}
                    >
                      {tok}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* D3 Visualizers */}
          {result && (
            <div className="space-y-6">
              <StateVectorVisualizer traces={result.state_trace} modelType={result.model_type} />
              
              {result.model_type === "educational_evolving_memory_toy" && (
                <D3EnergyLandscape
                  inferenceSteps={result.metrics.inference_steps}
                  confidenceScore={result.metrics.is_correct ? 0.85 : 0.25}
                />
              )}
            </div>
          )}

          {/* Limitations and Attribution Card */}
          {result && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Scientific Limitations & Boundary Constraints:
              </div>
              <ul className="list-disc list-inside text-xs text-amber-200/80 space-y-1">
                {result.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
