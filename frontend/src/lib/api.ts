/**
 * DataForge API Client with automatic live FastAPI backend connection
 * and intelligent client-side simulation fallback.
 */

import { ClientSimulator, SimulationResult } from "./simulator";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function checkBackendHealth(): Promise<{
  connected: boolean;
  engine?: string;
  models?: string[];
  experiments?: string[];
}> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        engine: data.engine,
        models: data.supported_models,
        experiments: data.supported_experiments
      };
    }
  } catch (err) {
    // Backend offline
  }
  return { connected: false };
}

export async function runRecallApi(params: {
  model_type: string;
  recall_type: "delayed" | "long_horizon";
  delay?: number;
  sequence_length?: number;
  inference_budget?: number;
  seed?: number;
  force_precomputed?: boolean;
}): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/experiment/recall`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API unavailable, executing live client-side simulation.");
  }
  return ClientSimulator.runDelayedRecall(
    params.model_type,
    params.delay || 16,
    params.inference_budget || 1,
    params.seed || 42
  );
}

export async function runInterferenceApi(params: {
  model_type: string;
  num_overwrites: number;
  target_mode?: "recency" | "primacy";
  seed?: number;
  force_precomputed?: boolean;
}): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/experiment/interference`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API unavailable, executing live client-side simulation.");
  }
  return ClientSimulator.runInterference(
    params.model_type,
    params.num_overwrites,
    params.target_mode || "recency",
    params.seed || 42
  );
}

export async function runScalingApi(params: {
  model_type: string;
  inference_budget: number;
  clutter_pairs?: number;
  seed?: number;
  force_precomputed?: boolean;
}): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/experiment/scaling`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API unavailable, executing live client-side simulation.");
  }
  return ClientSimulator.runInferenceScaling(
    params.model_type,
    params.inference_budget,
    params.clutter_pairs || 4,
    params.seed || 42
  );
}

export async function fetchPrecomputedCatalog(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/experiments/precomputed`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback to static public folder
  }
  const staticRes = await fetch("/data/summary_stats.json");
  if (staticRes.ok) {
    const data = await staticRes.json();
    return {
      status: "available",
      total_precomputed_trials: 2700,
      available_sweeps: [
        { sweep_type: "sequence_length", dataset_file: "sequence_length_sweep.json" },
        { sweep_type: "memory_capacity", dataset_file: "memory_capacity_sweep.json" },
        { sweep_type: "interference", dataset_file: "interference_sweep.json" },
        { sweep_type: "inference_effort", dataset_file: "inference_effort_sweep.json" }
      ],
      plots: [
        "plot1_accuracy_vs_sequence_length.png",
        "plot2_accuracy_vs_memory_capacity.png",
        "plot3_error_rate_vs_interference.png",
        "plot4_accuracy_vs_inference_effort.png",
        "plot5_latency_vs_inference_effort.png",
        "plot6_accuracy_latency_tradeoff.png",
        "plot_all_panels.png"
      ]
    };
  }
  return null;
}
