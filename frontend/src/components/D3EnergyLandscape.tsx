"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Zap } from "lucide-react";

interface Props {
  inferenceSteps?: number;
  confidenceScore?: number;
}

export default function D3EnergyLandscape({ inferenceSteps = 4, confidenceScore = 0.85 }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 540;
    const height = 160;
    const margin = { top: 15, right: 25, bottom: 25, left: 35 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Generate non-convex energy landscape curve (with attractors)
    const points: [number, number][] = [];
    for (let x = -3; x <= 3; x += 0.05) {
      // Non-convex potential: E(x) = x^4 - 3x^2 + 0.5x
      const y = Math.pow(x, 4) - 3 * Math.pow(x, 2) + 0.3 * x;
      points.push([x, y]);
    }

    const xScale = d3.scaleLinear().domain([-3, 3]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([-3, 10]).range([innerHeight, 0]);

    // Energy curve
    const line = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis);

    // Draw energy surface
    g.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Attractor well markers
    const attractors = [
      { x: -1.25, label: "Target Needle Attractor (Global Minimum)", color: "#10b981" },
      { x: 1.2, label: "Interference Crosstalk Well", color: "#ef4444" }
    ];

    attractors.forEach((att) => {
      const yVal = Math.pow(att.x, 4) - 3 * Math.pow(att.x, 2) + 0.3 * att.x;
      g.append("circle")
        .attr("cx", xScale(att.x))
        .attr("cy", yScale(yVal))
        .attr("r", 4)
        .attr("fill", att.color);
    });

    // Compute settling trajectory based on inferenceSteps
    // Step 1 starts in ambiguous plateau; step 5 settles into global minimum
    const startX = 0.8;
    const targetX = -1.25;
    const progress = Math.min(1.0, (inferenceSteps - 1) / 4);
    const currX = startX + progress * (targetX - startX);
    const currY = Math.pow(currX, 4) - 3 * Math.pow(currX, 2) + 0.3 * currX;

    // Settling particle
    g.append("circle")
      .attr("cx", xScale(currX))
      .attr("cy", yScale(currY))
      .attr("r", 7)
      .attr("fill", "#60a5fa")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 0 8px rgba(59,130,246,0.8))");

    // Trajectory dashed path
    const trajectoryPoints: [number, number][] = [];
    for (let p = 0; p <= progress; p += 0.05) {
      const x = startX + p * (targetX - startX);
      const y = Math.pow(x, 4) - 3 * Math.pow(x, 2) + 0.3 * x;
      trajectoryPoints.push([x, y]);
    }

    if (trajectoryPoints.length > 1) {
      const trajLine = d3
        .line<[number, number]>()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]));

      g.append("path")
        .datum(trajectoryPoints)
        .attr("fill", "none")
        .attr("stroke", "#60a5fa")
        .attr("stroke-width", 1.8)
        .attr("stroke-dasharray", "3,3")
        .attr("d", trajLine);
    }

  }, [inferenceSteps]);

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-400" />
          <h4 className="text-xs font-semibold text-white tracking-tight">
            Latent Energy Landscape & Attractor Settling Dynamics
          </h4>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Inference Budget: {inferenceSteps}x Steps
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 540 160" className="w-full h-auto" />
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5 pt-2.5 mt-2">
        <span>State Convergence: <strong className="text-emerald-400">{inferenceSteps >= 3 ? "Settled in Target Attractor" : "Iterating in Basin"}</strong></span>
        <span>Confidence: <strong className="text-blue-300">{(confidenceScore * 100).toFixed(1)}%</strong></span>
      </div>
    </div>
  );
}
