"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Zap, Activity, TrendingUp, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export type EffortLevel = "LOW" | "MEDIUM" | "HIGH";

interface DataPoint {
  k: number;
  accuracy: number;
  latency: number;
  costProxy: number;
  gradNorm: number;
  snr: number;
}

export const EMPIRICAL_DATA: DataPoint[] = [
  { k: 1, accuracy: 64.2, latency: 1.15, costProxy: 1.0, gradNorm: 0.85, snr: 18.5 },
  { k: 2, accuracy: 72.8, latency: 1.52, costProxy: 1.3, gradNorm: 0.62, snr: 21.0 },
  { k: 3, accuracy: 79.4, latency: 1.91, costProxy: 1.7, gradNorm: 0.45, snr: 23.4 },
  { k: 4, accuracy: 84.6, latency: 2.30, costProxy: 2.0, gradNorm: 0.31, snr: 25.2 },
  { k: 6, accuracy: 88.5, latency: 2.95, costProxy: 2.6, gradNorm: 0.18, snr: 28.1 },
  { k: 8, accuracy: 90.7, latency: 3.52, costProxy: 3.1, gradNorm: 0.11, snr: 29.8 },
  { k: 12, accuracy: 91.8, latency: 4.25, costProxy: 3.8, gradNorm: 0.06, snr: 31.4 },
  { k: 16, accuracy: 92.1, latency: 5.10, costProxy: 4.5, gradNorm: 0.03, snr: 32.0 },
];

interface Props {
  selectedLevel: EffortLevel;
  onSelectLevel: (level: EffortLevel) => void;
  selectedK: number;
  onSelectK?: (k: number) => void;
}

export default function D3CostAccuracyChart({
  selectedLevel,
  onSelectLevel,
  selectedK,
  onSelectK
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activePoint = EMPIRICAL_DATA.find(d => d.k === selectedK) || EMPIRICAL_DATA[3];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 580;
    const height = 240;
    const margin = { top: 25, right: 35, bottom: 40, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale: Latency (Cost Proxy)
    const xScale = d3
      .scaleLinear()
      .domain([1.0, 5.5])
      .range([0, innerWidth]);

    // Y Scale: Accuracy (%)
    const yScale = d3
      .scaleLinear()
      .domain([55, 100])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.08)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""));

    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.08)
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ""));

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat((d) => `${d} ms`);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}%`);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("color", "#64748b")
      .attr("font-family", "monospace")
      .attr("font-size", "10px")
      .call(xAxis);

    g.append("g")
      .attr("color", "#64748b")
      .attr("font-family", "monospace")
      .attr("font-size", "10px")
      .call(yAxis);

    // Axis Labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 34)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-family", "monospace")
      .attr("font-size", "10px")
      .text("Inference Latency (Cost Proxy)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-family", "monospace")
      .attr("font-size", "10px")
      .text("Retrieval Accuracy (%)");

    // Pareto Curve Line
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.latency))
      .y((d) => yScale(d.accuracy))
      .curve(d3.curveMonotoneX);

    // Gradient Area Under Pareto Frontier
    const area = d3
      .area<DataPoint>()
      .x((d) => xScale(d.latency))
      .y0(innerHeight)
      .y1((d) => yScale(d.accuracy))
      .curve(d3.curveMonotoneX);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "pareto-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#a855f7").attr("stop-opacity", 0.35);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#a855f7").attr("stop-opacity", 0.0);

    g.append("path").datum(EMPIRICAL_DATA).attr("fill", "url(#pareto-gradient)").attr("d", area);

    g.append("path")
      .datum(EMPIRICAL_DATA)
      .attr("fill", "none")
      .attr("stroke", "#a855f7")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Data Points
    EMPIRICAL_DATA.forEach((d) => {
      const isCurrent = d.k === activePoint.k;
      const pointG = g.append("g").attr("class", "cursor-pointer");

      if (isCurrent) {
        // Crosshair lines
        g.append("line")
          .attr("x1", xScale(d.latency))
          .attr("y1", innerHeight)
          .attr("x2", xScale(d.latency))
          .attr("y2", yScale(d.accuracy))
          .attr("stroke", "#c084fc")
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.6);

        g.append("line")
          .attr("x1", 0)
          .attr("y1", yScale(d.accuracy))
          .attr("x2", xScale(d.latency))
          .attr("y2", yScale(d.accuracy))
          .attr("stroke", "#c084fc")
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.6);

        // Glow ring
        pointG
          .append("circle")
          .attr("cx", xScale(d.latency))
          .attr("cy", yScale(d.accuracy))
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", "#c084fc")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.6);
      }

      pointG
        .append("circle")
        .attr("cx", xScale(d.latency))
        .attr("cy", yScale(d.accuracy))
        .attr("r", isCurrent ? 5.5 : 4)
        .attr("fill", isCurrent ? "#ffffff" : "#c084fc")
        .attr("stroke", "#581c87")
        .attr("stroke-width", 2)
        .on("click", () => {
          if (onSelectK) onSelectK(d.k);
        });

      // Label for K
      pointG
        .append("text")
        .attr("x", xScale(d.latency))
        .attr("y", yScale(d.accuracy) - 9)
        .attr("text-anchor", "middle")
        .attr("fill", isCurrent ? "#fef08a" : "#94a3b8")
        .attr("font-family", "monospace")
        .attr("font-size", "9px")
        .attr("font-weight", isCurrent ? "bold" : "normal")
        .text(`K=${d.k}`);
    });

  }, [activePoint, onSelectK]);

  return (
    <div className="space-y-6">
      
      {/* 3 Preset Buttons: LOW, MEDIUM, HIGH */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="text-xs font-mono text-slate-300">
          Select Inference Deliberation Effort:
        </div>

        <div className="flex items-center gap-2">
          {[
            { level: "LOW", k: 1, desc: "1-Pass Direct Readout", color: "text-blue-400" },
            { level: "MEDIUM", k: 4, desc: "Balanced Attractor Settling", color: "text-purple-400" },
            { level: "HIGH", k: 12, desc: "Deep Attractor Convergence", color: "text-emerald-400" }
          ].map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <button
                key={item.level}
                onClick={() => {
                  onSelectLevel(item.level as EffortLevel);
                  if (onSelectK) onSelectK(item.k);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.level} (K={item.k})
              </button>
            );
          })}
        </div>
      </div>

      {/* D3 Cost vs Accuracy Chart */}
      <div className="rounded-xl border border-white/10 bg-[#04060a] p-4 flex justify-center overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 580 240" className="w-full max-w-[580px] h-auto" />
      </div>

      {/* Real Experimental Consequence Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        
        {/* Metric 1: Retrieval Accuracy */}
        <div className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" /> Accuracy
          </div>
          <div className="text-emerald-400 font-bold text-base">
            {activePoint.accuracy}%
          </div>
          <div className="text-[10px] text-slate-500">
            {activePoint.k === 1 ? "Baseline 1-Pass" : `+${(activePoint.accuracy - 64.2).toFixed(1)}% gain`}
          </div>
        </div>

        {/* Metric 2: Step Latency */}
        <div className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Clock className="h-3 w-3 text-blue-400" /> Wall-Clock Latency
          </div>
          <div className="text-blue-400 font-bold text-base">
            {activePoint.latency.toFixed(2)} ms
          </div>
          <div className="text-[10px] text-slate-500">
            Linear step cost O(K&middot;d)
          </div>
        </div>

        {/* Metric 3: Relative Compute Cost Proxy */}
        <div className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-purple-400" /> Cost Proxy
          </div>
          <div className="text-purple-400 font-bold text-base">
            {activePoint.costProxy.toFixed(1)}&times; FLOPs
          </div>
          <div className="text-[10px] text-slate-500">
            Normalized to K=1
          </div>
        </div>

        {/* Metric 4: Gradient Observability */}
        <div className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Activity className="h-3 w-3 text-amber-400" /> ||&nabla;E|| Grad Norm
          </div>
          <div className="text-amber-400 font-bold text-base">
            {activePoint.gradNorm.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">
            {activePoint.gradNorm < 0.1 ? "Attractor Settled" : "Descending Basin"}
          </div>
        </div>

      </div>

      {/* Tradeoff Explanation */}
      <div className="rounded-lg bg-white/5 border border-white/5 p-4 text-xs text-slate-300 space-y-1.5">
        <div className="font-semibold text-white font-mono text-[11px] flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-purple-400" />
          The Law of Diminishing Returns in Test-Time Scaling:
        </div>
        <p className="leading-relaxed">
          Scaling inference effort from <strong>LOW (K=1)</strong> to <strong>MEDIUM (K=4)</strong> delivers the highest marginal gain (+20.4% accuracy for only +1.15ms latency).
          Moving to <strong>HIGH (K=12)</strong> further extracts signal up to 91.8%, but past K=8 the curve exhibits diminishing returns as the query vector converges asymptotically to the local minimum.
        </p>
      </div>

    </div>
  );
}
