"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Activity, Gauge, Cpu } from "lucide-react";
import { SimulationStepTrace } from "@/lib/simulator";

interface Props {
  traces: SimulationStepTrace[];
  modelType: string;
  currentStep?: number;
}

export default function StateVectorVisualizer({ traces, modelType, currentStep }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || traces.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 580;
    const height = 180;
    const margin = { top: 20, right: 30, bottom: 30, left: 45 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale (Steps)
    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(traces.length - 1, 1)])
      .range([0, innerWidth]);

    // Y Scale (SNR dB)
    const yMin = d3.min(traces, (d) => d.snr_db) ?? -10;
    const yMax = d3.max(traces, (d) => d.snr_db) ?? 50;
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(-10, yMin - 5), Math.max(50, yMax + 5)])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(Math.min(traces.length, 8)).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("color", "#64748b")
      .call(xAxis);

    g.append("g")
      .attr("color", "#64748b")
      .call(yAxis);

    // SNR Line
    const line = d3
      .line<SimulationStepTrace>()
      .x((d) => xScale(d.step))
      .y((d) => yScale(d.snr_db))
      .curve(d3.curveMonotoneX);

    // Area fill
    const area = d3
      .area<SimulationStepTrace>()
      .x((d) => xScale(d.step))
      .y0(innerHeight)
      .y1((d) => yScale(d.snr_db))
      .curve(d3.curveMonotoneX);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "snr-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.4);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.0);

    g.append("path")
      .datum(traces)
      .attr("fill", "url(#snr-gradient)")
      .attr("d", area);

    g.append("path")
      .datum(traces)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2.2)
      .attr("d", line);

    // Dots
    g.selectAll(".dot")
      .data(traces)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.step))
      .attr("cy", (d) => yScale(d.snr_db))
      .attr("r", 3.5)
      .attr("fill", "#60a5fa")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5);

  }, [traces]);

  const latestTrace = traces[traces.length - 1] || { state_norm: 1.0, snr_db: 30.0, state_entropy: 0.0001 };

  return (
    <div className="rounded-xl border border-white/10 bg-[#07090e] p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-white tracking-tight">
            Latent State Telemetry & Dynamic SNR Landscape
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          Model: {modelType}
        </span>
      </div>

      {/* D3 Line Graph */}
      <div className="w-full overflow-x-auto mb-4">
        <svg ref={svgRef} viewBox="0 0 580 180" className="w-full h-auto" />
      </div>

      {/* Live Gauges Summary */}
      <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-3">
        <div className="rounded-lg bg-white/5 p-2.5 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">State Norm ||h_t||</div>
          <div className="text-sm font-mono font-semibold text-emerald-400">{latestTrace.state_norm}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">Readout SNR</div>
          <div className="text-sm font-mono font-semibold text-blue-400">{latestTrace.snr_db} dB</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">Spectral Entropy</div>
          <div className="text-sm font-mono font-semibold text-purple-400">{latestTrace.state_entropy}</div>
        </div>
      </div>
    </div>
  );
}
