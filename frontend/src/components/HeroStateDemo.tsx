"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Zap, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface StreamToken {
  id: number;
  text: string;
  type: "needle" | "pad" | "noise" | "query";
}

const DEMO_STREAM: StreamToken[] = [
  { id: 0, text: "KEY_A:VAL_ALPHA", type: "needle" },
  { id: 1, text: "<PAD>", type: "pad" },
  { id: 2, text: "NOISE_1", type: "noise" },
  { id: 3, text: "<PAD>", type: "pad" },
  { id: 4, text: "KEY_B:VAL_BETA", type: "needle" },
  { id: 5, text: "NOISE_2", type: "noise" },
  { id: 6, text: "<PAD>", type: "pad" },
  { id: 7, text: "QUERY:KEY_A", type: "query" }
];

export default function HeroStateDemo() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inferenceSteps, setInferenceSteps] = useState<number>(1);

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEMO_STREAM.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeToken = DEMO_STREAM[currentStep];
  const processedTokens = DEMO_STREAM.slice(0, currentStep + 1);

  // Simulation calculations
  const kvCacheMemoryBytes = (currentStep + 1) * 32 * 4; // 32 dimensions * 4 bytes
  const evolvingStateMemoryBytes = 32 * 32 * 4;         // Fixed O(1) matrix

  // Signal calculations
  const rawSignal = 0.85 * Math.pow(0.98, currentStep);
  const snr = (32 - currentStep * 1.5 + (inferenceSteps > 1 ? Math.min(10, inferenceSteps * 2.5) : 0)).toFixed(1);
  const isRecovered = currentStep >= 7 && (inferenceSteps >= 2 || rawSignal > 0.5);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="relative rounded-2xl border border-blue-500/20 bg-[#090d16]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Interactive State Compression Simulator
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Step through token ingestion to observe how fixed evolving states preserve memory in <span className="text-blue-400 font-mono">O(1)</span> space.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition-all shadow-md shadow-blue-600/30"
          >
            <Play className={`h-3.5 w-3.5 ${isPlaying ? "animate-spin" : ""}`} />
            {isPlaying ? "Pause Stream" : currentStep >= DEMO_STREAM.length - 1 ? "Replay" : "Stream Tokens"}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-white/10 hover:bg-white/5 p-1.5 text-slate-400 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Token Stream Strip */}
      <div className="mb-6">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Input Sequence Stream (Step {currentStep + 1} / {DEMO_STREAM.length})</span>
          <span className="text-blue-400 font-mono">Current Ingestion: {activeToken.text}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DEMO_STREAM.map((tok, idx) => {
            const isCurrent = idx === currentStep;
            const isPast = idx < currentStep;
            return (
              <div
                key={tok.id}
                onClick={() => setCurrentStep(idx)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-mono transition-all shrink-0 border ${
                  isCurrent
                    ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
                    : isPast
                    ? "border-white/10 bg-white/5 text-slate-400"
                    : "border-white/5 bg-transparent text-slate-600 opacity-60"
                }`}
              >
                <div className="text-[9px] opacity-60 mb-0.5">t = {idx}</div>
                <div>{tok.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Architecture Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Column 1: Transformer Full KV Cache */}
        <div className="rounded-xl border border-white/10 bg-[#07090e] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Standard Transformer (KV Cache)
            </span>
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              O(T) Memory Growth
            </span>
          </div>

          {/* Slots stack */}
          <div className="space-y-1.5 h-36 overflow-y-auto pr-1 mb-3">
            {processedTokens.map((tok, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-mono px-2.5 py-1.5 rounded bg-blue-950/30 border border-blue-900/40 text-blue-200"
              >
                <span>Slot [{idx}]: {tok.text}</span>
                <span className="text-[10px] text-slate-400">128 bytes</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono border-t border-white/5 pt-3 text-slate-400">
            <span>Memory Allocated:</span>
            <span className="text-white font-semibold">{kvCacheMemoryBytes} Bytes ({processedTokens.length} slots)</span>
          </div>
        </div>

        {/* Column 2: Fixed Evolving State */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#07090e] p-5 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Educational Evolving State Toy
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              O(1) Constant Bound
            </span>
          </div>

          {/* Compressed State Visual Representation */}
          <div className="h-36 rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3 flex flex-col justify-between mb-3">
            <div className="grid grid-cols-8 gap-1 opacity-80" suppressHydrationWarning>
              {Array.from({ length: 32 }).map((_, i) => {
                const intensity = Number((((Math.sin(i + currentStep * 0.7) + 1) / 2) * 0.8 + 0.2).toFixed(2));
                return (
                  <div
                    key={i}
                    style={{ opacity: intensity }}
                    className="h-2.5 rounded-[2px] bg-emerald-400"
                  />
                );
              })}
            </div>

            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Selective Gate Δ:</span>
                <span className="text-emerald-400">{activeToken.type === "needle" ? "0.85 (Write)" : "0.05 (Filter)"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Latent Readout SNR:</span>
                <span className="text-blue-300">{snr} dB</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono border-t border-white/5 pt-3 text-slate-400">
            <span>Memory Allocated:</span>
            <span className="text-emerald-400 font-semibold">{evolvingStateMemoryBytes} Bytes (Fixed Matrix)</span>
          </div>
        </div>

      </div>

      {/* Inference-Time Scaling Interactive Intervention Bar */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            Inference-Time Scaling (Test-Time Attractor Settling)
          </div>
          <p className="text-[11px] text-slate-400">
            Increase computational budget <span className="font-mono text-purple-300">C_infer</span> to de-noise compressed superposition.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-mono text-purple-300 shrink-0">
            Budget: <strong className="text-white">{inferenceSteps}x</strong>
          </span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={inferenceSteps}
            onChange={(e) => setInferenceSteps(Number(e.target.value))}
            className="w-full sm:w-36"
          />
        </div>
      </div>

      {/* Query Readout Result Banner */}
      {currentStep >= 7 && (
        <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">
              Query <strong>QUERY:KEY_A</strong> Emitted: <span className="font-mono text-emerald-300 font-semibold">VAL_ALPHA</span> (Exact Match)
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-300 hidden sm:inline">
            De-noised via {inferenceSteps} attractor cycle{inferenceSteps > 1 ? "s" : ""}
          </span>
        </div>
      )}

    </div>
  );
}
