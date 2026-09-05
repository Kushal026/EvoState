"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Activity, 
  Layers, 
  Info, 
  Sparkles, 
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { SimulationStepTrace } from "@/lib/simulator";

interface Props {
  traces: SimulationStepTrace[];
  modelType: string;
}

export default function InternalStateStepVisualizer({ traces, modelType }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800); // ms per step

  const svgHeatmapRef = useRef<SVGSVGElement | null>(null);
  const svgDeltaRef = useRef<SVGSVGElement | null>(null);

  // Keep currentStep within bounds if traces change
  useEffect(() => {
    if (currentStep >= traces.length) {
      setCurrentStep(Math.max(0, traces.length - 1));
    }
  }, [traces, currentStep]);

  // Autoplay timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= traces.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, traces.length]);

  const activeTrace = traces[currentStep] || traces[0] || {
    step: 0,
    token: "<INIT>",
    state_norm: 0.5,
    state_entropy: 0.0001,
    delta: 0.0,
    snr_db: 35.0,
    vector_before: new Array(16).fill(0),
    vector_after: new Array(16).fill(0),
    affected_dimensions: [],
    event_type: "decay",
    explanation: "Initial state."
  };

  const vectorBefore = activeTrace.vector_before || new Array(16).fill(0);
  const vectorAfter = activeTrace.vector_after || new Array(16).fill(0);
  const affectedDims = activeTrace.affected_dimensions || [];

  // D3 Dimension Heatmap Render
  useEffect(() => {
    if (!svgHeatmapRef.current) return;

    const svg = d3.select(svgHeatmapRef.current);
    svg.selectAll("*").remove();

    const width = 560;
    const height = 90;
    const margin = { top: 10, right: 15, bottom: 25, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const dimCount = vectorAfter.length;
    const cellWidth = innerWidth / dimCount;

    // Color interpolator for state coordinates: negative (blue) to zero (dark) to positive (emerald/purple)
    const colorScale = d3
      .scaleDiverging<string>()
      .domain([-1.0, 0, 1.0])
      .interpolator(d3.interpolateRdBu);

    // Draw cells for State After Update
    vectorAfter.forEach((val, idx) => {
      const isAffected = affectedDims.includes(idx);
      const cellGroup = g.append("g");

      cellGroup
        .append("rect")
        .attr("x", idx * cellWidth + 1.5)
        .attr("y", 0)
        .attr("width", cellWidth - 3)
        .attr("height", innerHeight)
        .attr("rx", 3)
        .attr("fill", isAffected && activeTrace.event_type === "interference" 
          ? "#f59e0b" 
          : isAffected && activeTrace.event_type === "recovery"
          ? "#a855f7"
          : colorScale(val))
        .attr("stroke", isAffected ? "#fef08a" : "rgba(255,255,255,0.15)")
        .attr("stroke-width", isAffected ? 2 : 1)
        .attr("opacity", isAffected ? 1.0 : 0.85);

      // Dimension Label
      cellGroup
        .append("text")
        .attr("x", idx * cellWidth + cellWidth / 2)
        .attr("y", innerHeight + 14)
        .attr("text-anchor", "middle")
        .attr("fill", isAffected ? "#fef08a" : "#94a3b8")
        .attr("font-size", "9px")
        .attr("font-family", "monospace")
        .text(`d${idx}`);

      // Coordinate Value
      cellGroup
        .append("text")
        .attr("x", idx * cellWidth + cellWidth / 2)
        .attr("y", innerHeight / 2 + 3)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "8.5px")
        .attr("font-family", "monospace")
        .attr("font-weight", "bold")
        .text(val.toFixed(2));
    });

  }, [vectorAfter, affectedDims, activeTrace]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-6">
      
      {/* Header & Mandatory Educational State Label */}
      <div className="space-y-2 border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight font-mono">
              Educational visualization of the model&apos;s computational state.
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
            Step-by-Step State Evolution
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Inspect how latent state vector coordinates <code>S_t &isin; &reals;<sup>16</sup></code> transform on every token update, highlighting associative insertions, distractor gating, interference crosstalk, and test-time recovery.
        </p>
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-4">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset to Step 0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
              title="Step Backward"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                isPlaying
                  ? "border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-sm"
                  : "border-blue-500/50 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30"
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((prev) => Math.min(traces.length - 1, prev + 1));
              }}
              disabled={currentStep >= traces.length - 1}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
              title="Step Forward"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Speed:</span>
            {[
              { label: "0.5x", val: 1200 },
              { label: "1x", val: 800 },
              { label: "2x", val: 400 }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setPlaybackSpeed(s.val)}
                className={`px-2 py-0.5 rounded border text-[10px] transition-all ${
                  playbackSpeed === s.val
                    ? "border-blue-500 bg-blue-500/20 text-blue-300 font-bold"
                    : "border-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Step Indicator */}
          <div className="text-xs font-mono text-slate-300">
            Step <span className="text-blue-400 font-bold">{currentStep}</span> / {traces.length - 1}
          </div>

        </div>

        {/* Timeline Range Scrubber */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={Math.max(0, traces.length - 1)}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
          />

          {/* Timeline Event Type Bar */}
          <div className="flex items-center justify-between gap-0.5 h-2 w-full rounded overflow-hidden bg-white/5">
            {traces.map((t, idx) => {
              const isCurrent = idx === currentStep;
              let bg = "bg-slate-700";
              if (t.event_type === "insertion") bg = "bg-emerald-500";
              else if (t.event_type === "interference") bg = "bg-amber-500";
              else if (t.event_type === "recovery") bg = "bg-purple-500";
              else if (t.event_type === "query") bg = "bg-blue-500";

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(idx);
                  }}
                  className={`flex-1 h-full cursor-pointer transition-all ${bg} ${
                    isCurrent ? "ring-2 ring-white scale-y-125 z-10" : "opacity-60 hover:opacity-100"
                  }`}
                  title={`Step ${idx}: ${t.token} (${t.event_type})`}
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Step Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Token Card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Input Token Event</span>
          <div className="text-base font-mono font-bold text-white truncate">
            {activeTrace.token}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                activeTrace.event_type === "insertion"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : activeTrace.event_type === "interference"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : activeTrace.event_type === "recovery"
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                  : activeTrace.event_type === "query"
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              {activeTrace.event_type || "decay"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Update Gate &Delta;<sub>t</sub> = {activeTrace.delta}
            </span>
          </div>
        </div>

        {/* State Metrics Card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">State Vector Telemetry</span>
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-slate-400">State Norm ||S_t||:</span>
            <span className="text-emerald-400 font-bold">{activeTrace.state_norm}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Readout SNR:</span>
            <span className={`font-bold ${activeTrace.snr_db > 10 ? "text-blue-400" : "text-rose-400"}`}>
              {activeTrace.snr_db} dB
            </span>
          </div>
        </div>

        {/* Affected Dimensions Card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Affected State Dimensions</span>
          {affectedDims.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {affectedDims.map((dim) => (
                <span
                  key={dim}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border font-bold ${
                    activeTrace.event_type === "interference"
                      ? "border-amber-500 bg-amber-500/20 text-amber-300 animate-pulse"
                      : activeTrace.event_type === "recovery"
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  d_{dim}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500 pt-1">None (Gate contracted &Delta;<sub>t</sub> &approx; 0)</div>
          )}
        </div>

      </div>

      {/* D3 Dimensional Coordinates Heatmap */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-200">
            State Coordinate Coordinates S<sub>t</sub> &isin; &reals;<sup>16</sup>:
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Dimensions d_0 to d_15
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 flex justify-center">
          <svg ref={svgHeatmapRef} viewBox="0 0 560 90" className="w-full max-w-[560px] h-auto" />
        </div>
      </div>

      {/* Step Explanation Callout */}
      {activeTrace.explanation && (
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3.5 text-xs text-blue-200 font-mono flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong>Step {currentStep} Mathematical Transition: </strong>
            {activeTrace.explanation}
          </div>
        </div>
      )}

      {/* Technical Explanation & Scientific Integrity Disclaimer */}
      <div className="rounded-lg bg-white/5 border border-white/5 p-4 space-y-2 text-xs text-slate-300">
        <div className="font-semibold text-slate-200 font-mono flex items-center gap-1.5 text-xs">
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          Technical Explanation of Internal State Dynamics:
        </div>
        <p className="leading-relaxed">
          The memory state is parameterized as a bounded tensor <code>S_t &isin; &reals;^(d_v &times; d_k)</code> updated recursively:
          <code>S_t = &lambda; S_&#123;t-1&#125; + &Delta;_t(x_t) &middot; (v_t &otimes; k_t^T)</code>.
          When non-conflicting key-value pairs are bound, outer-product energy fills orthogonal coordinate subspaces.
          When conflicting updates occur (interference), the same coordinate basis is perturbed, reducing signal-to-noise ratio (SNR) until test-time attractor de-noising (K &gt; 1) relaxes the probe into the ground-truth minimum.
        </p>
        <div className="border-t border-white/5 pt-2 text-[11px] text-amber-300/80 font-mono flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> Visual dimensions represent abstract linear algebraic coordinate projections in &reals;<sup>d</sup>, NOT biological neurons.
          </span>
        </div>
      </div>

    </div>
  );
}
