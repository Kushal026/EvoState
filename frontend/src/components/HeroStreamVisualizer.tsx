"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, Terminal, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import EvidenceBadge from "./EvidenceBadge";

interface StreamToken {
  id: number;
  label: string;
  type: "key_val" | "pad" | "noise" | "overwrite" | "query";
  kv?: { key: string; val: string };
  energy: number;
}

const STREAM_SEQUENCE: StreamToken[] = [
  { id: 0, label: "K1:V1 (alpha)", type: "key_val", kv: { key: "K1", val: "alpha" }, energy: 0.95 },
  { id: 1, label: "<PAD>", type: "pad", energy: 0.05 },
  { id: 2, label: "K2:V2 (beta)", type: "key_val", kv: { key: "K2", val: "beta" }, energy: 0.90 },
  { id: 3, label: "NOISE_1", type: "noise", energy: 0.25 },
  { id: 4, label: "K3:V3 (gamma)", type: "key_val", kv: { key: "K3", val: "gamma" }, energy: 0.88 },
  { id: 5, label: "OVERWRITE K1", type: "overwrite", kv: { key: "K1", val: "delta" }, energy: 0.75 },
  { id: 6, label: "<PAD>", type: "pad", energy: 0.05 },
  { id: 7, label: "QUERY: K1", type: "query", energy: 1.0 }
];

export default function HeroStreamVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inferenceEffort, setInferenceEffort] = useState<number>(4);
  const [matrixState, setMatrixState] = useState<number[][]>(() => 
    Array(6).fill(0).map(() => Array(6).fill(0.05))
  );

  // Update dynamic matrix state based on tokens processed
  useEffect(() => {
    const newMatrix = Array(6).fill(0).map((_, r) => 
      Array(6).fill(0).map((_, c) => {
        let val = 0.05;
        for (let i = 0; i <= currentStep; i++) {
          const t = STREAM_SEQUENCE[i];
          const decay = Math.pow(0.92, currentStep - i);
          if (t.type === "key_val") {
            const hash = (t.id * 3 + r * 2 + c) % 6;
            val += 0.35 * decay * (hash === r || hash === c ? 1.0 : 0.2);
          } else if (t.type === "overwrite") {
            val += 0.45 * decay * (r % 2 === 0 ? 0.8 : -0.3);
          } else if (t.type === "noise") {
            val += 0.1 * (Math.sin(r + c + i) * 0.5);
          }
        }
        // Inference compute relaxation effect
        if (currentStep === 7 && inferenceEffort > 1) {
          const deNoise = Math.min(0.25, (inferenceEffort - 1) * 0.03);
          if (r === 0 || c === 0) val += deNoise;
          else val = Math.max(0.02, val - deNoise * 0.5);
        }
        return Math.max(0.0, Math.min(1.0, val));
      })
    );
    setMatrixState(newMatrix);
  }, [currentStep, inferenceEffort]);

  // Autoplay ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= STREAM_SEQUENCE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 650);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeToken = STREAM_SEQUENCE[currentStep];
  const isQueryStep = currentStep === 7;
  
  // Real-time calculated metrics
  const kvMemoryBytes = (currentStep + 1) * 32 * 4; // O(T)
  const stateMemoryBytes = 6 * 6 * 4; // O(1) = 144 bytes
  const calculatedSnr = Math.max(2.4, (28.5 - currentStep * 2.1 + (isQueryStep ? inferenceEffort * 1.8 : 0))).toFixed(1);
  const recallConfidence = isQueryStep 
    ? Math.min(99.4, 52.0 + inferenceEffort * 4.2).toFixed(1)
    : "—";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#060810]/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Live State Flow Simulator
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE EXPERIMENT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualizing bounded rank compression &amp; inference relaxation in real time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1.5 text-xs font-mono text-blue-300 transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? "Pause Stream" : "Play Stream"}</span>
          </button>
          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
            className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-1.5 text-slate-400 hover:text-white transition-all"
            title="Reset Stream"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Stage Pipeline Visualization: INPUT -> STATE -> OUTPUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Stage 1: Input Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-blue-400 font-bold">01</span> INPUT STREAM
            </span>
            <span>Step {currentStep + 1} of {STREAM_SEQUENCE.length}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {STREAM_SEQUENCE.map((token, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              let badgeColor = "border-white/5 bg-white/[0.02] text-slate-500";
              if (isCurrent) badgeColor = "border-blue-500 bg-blue-500/20 text-white shadow-md shadow-blue-500/20 scale-105";
              else if (isPast) badgeColor = "border-white/10 bg-white/5 text-slate-300";

              return (
                <button
                  key={token.id}
                  onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                  className={`rounded-lg border p-2 text-left transition-all ${badgeColor}`}
                >
                  <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                    <span>t={idx}</span>
                    {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />}
                  </div>
                  <div className="text-[11px] font-mono font-medium truncate mt-0.5">
                    {token.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Token Inspector */}
          <div className="rounded-lg border border-white/5 bg-black/40 p-2.5 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-400">Current Token Ingested:</span>
            <span className="text-blue-300 font-semibold">{activeToken.label}</span>
          </div>
        </div>

        {/* Arrow to State */}
        <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-500">
          <ArrowRight className="h-5 w-5 text-blue-400/60" />
        </div>

        {/* Stage 2: Evolving State Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-purple-400 font-bold">02</span> EVOLVING STATE (M_t)
            </span>
            <span className="text-purple-400 text-[10px]">6x6 Associative Fast-Weights</span>
          </div>

          {/* 6x6 Heatmap */}
          <div className="rounded-xl border border-white/10 bg-black/60 p-3 flex flex-col items-center justify-center">
            <div className="grid grid-cols-6 gap-1 w-full max-w-[200px] aspect-square">
              {matrixState.map((row, rIdx) => 
                row.map((cellVal, cIdx) => {
                  const intensity = Math.round(cellVal * 255);
                  const bgStyle = `rgba(59, 130, 246, ${Math.max(0.08, cellVal * 0.9)})`;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      title={`M[${rIdx},${cIdx}] = ${cellVal.toFixed(2)}`}
                      style={{ backgroundColor: bgStyle }}
                      className="rounded-[3px] border border-white/10 transition-colors duration-300"
                    />
                  );
                })
              )}
            </div>
            <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2 px-1">
              <span>0.0 (Null)</span>
              <span className="text-blue-400 font-bold">Superposition Rank 6</span>
              <span>1.0 (Sat)</span>
            </div>
          </div>
        </div>

        {/* Stage 3: Recall & Telemetry (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            <span className="text-emerald-400 font-bold">03</span> RECALL / METRICS
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
              <div className="text-[9px] text-slate-400 uppercase">KV Footprint</div>
              <div className="text-xs font-semibold text-slate-200">{kvMemoryBytes} B <span className="text-[9px] text-slate-400">(O(T))</span></div>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2">
              <div className="text-[9px] text-blue-400 uppercase">State Footprint</div>
              <div className="text-xs font-semibold text-blue-300">{stateMemoryBytes} B <span className="text-[9px] text-blue-400/80">(O(1))</span></div>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
              <div className="text-[9px] text-emerald-400 uppercase">Signal-to-Noise</div>
              <div className="text-xs font-semibold text-emerald-300">{calculatedSnr} dB</div>
            </div>

            {isQueryStep && (
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 animate-pulse">
                <div className="text-[9px] text-purple-300 uppercase font-semibold">Recall Conf.</div>
                <div className="text-sm font-bold text-purple-200">{recallConfidence}%</div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Inference Scaling Slider if at Query Step */}
      {isQueryStep && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-mono font-semibold text-purple-200">
                Inference-Time Scaling Relaxation (C_infer)
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Apply recurrent latent iterations to denoise conflicting associative weights.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="range"
              min={1}
              max={16}
              value={inferenceEffort}
              onChange={(e) => setInferenceEffort(Number(e.target.value))}
              className="w-full sm:w-36 h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <span className="font-mono text-xs font-bold text-purple-300 min-w-[3rem] text-right">
              {inferenceEffort} steps
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
