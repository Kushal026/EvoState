"use client";

import React from "react";

export type EvidenceTier = 
  | "published"
  | "independent"
  | "experiment"
  | "educational";

interface EvidenceBadgeProps {
  tier: EvidenceTier;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const TIER_CONFIG: Record<EvidenceTier, {
  text: string;
  bg: string;
  border: string;
  color: string;
  dot: string;
  tooltip: string;
}> = {
  published: {
    text: "PUBLISHED RESULT",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    tooltip: "Peer-reviewed or verified primary academic literature."
  },
  independent: {
    text: "INDEPENDENT RESULT",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    color: "text-indigo-400",
    dot: "bg-indigo-400",
    tooltip: "Third-party empirical reproduction or benchmark."
  },
  experiment: {
    text: "OUR EXPERIMENT",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    color: "text-cyan-400",
    dot: "bg-cyan-400",
    tooltip: "Empirical evaluation run in this repository (N=30 Monte Carlo seeds)."
  },
  educational: {
    text: "EDUCATIONAL SIMPLIFICATION",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    color: "text-amber-400",
    dot: "bg-amber-400",
    tooltip: "Isolated educational surrogate model for interactive intuition."
  }
};

export default function EvidenceBadge({
  tier,
  label,
  size = "sm",
  className = ""
}: EvidenceBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.experiment;
  const displayText = label || config.text;

  const sizeClasses = size === "md" 
    ? "px-2.5 py-1 text-[11px]" 
    : "px-2 py-0.5 text-[10px]";

  return (
    <span
      title={config.tooltip}
      className={`inline-flex items-center gap-1.5 rounded font-mono font-semibold uppercase tracking-wider border transition-colors ${config.bg} ${config.border} ${config.color} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
      {displayText}
    </span>
  );
}
