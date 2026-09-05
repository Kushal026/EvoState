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

export async function runUnifiedLabApi(params: {
  model_type: string;
  sequence_length: number;
  memory_capacity: number;
  interference_strength: number;
  inference_effort: number;
  seed?: number;
  force_precomputed?: boolean;
}): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/experiment/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experiment_type: "inference_recovery",
        model_type: params.model_type,
        sequence_length: params.sequence_length,
        interference_probability: params.interference_strength,
        inference_budget: params.inference_effort,
        seed: params.seed || 42,
        force_precomputed: params.force_precomputed
      }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback to instantaneous client simulation
  }
  return ClientSimulator.runUnifiedLabExperiment(
    params.model_type,
    params.sequence_length,
    params.memory_capacity,
    params.interference_strength,
    params.inference_effort,
    params.seed || 42,
    params.force_precomputed
  );
}

export async function fetchPrecomputedCatalog(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/experiments/precomputed`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback to static data
  }
  try {
    const staticRes = await fetch("/data/summary_stats.json");
    if (staticRes.ok) {
      return await staticRes.json();
    }
  } catch (e) {}
  return null;
}

