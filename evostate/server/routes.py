"""FastAPI route handlers implementing the complete DataForge experiment service."""

from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import Dict, Any, List, Optional
import os

from evostate.server.schemas import (
    RecallExperimentRequest,
    InterferenceExperimentRequest,
    CapacityExperimentRequest,
    ScalingExperimentRequest,
    GenericRunRequest,
    DataForgeExperimentResponse,
    ExperimentMetrics,
    PrecomputedCatalogResponse
)
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.core.metrics import Timer
from evostate.models import get_model
from evostate.experiments import get_experiment
from evostate.server.precomputed_loader import GLOBAL_PRECOMPUTED_MANAGER, MODEL_LIMITATIONS

router = APIRouter(tags=["DataForge Experiments"])


# -------------------------------------------------------------
# 1. HEALTH CHECK ENDPOINT
# -------------------------------------------------------------

@router.get(
    "/health",
    summary="Health and Engine Introspection",
    description="Returns the operational health, registered sequence models, and supported experiment protocols."
)
def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "engine": "DataForge: Evolving Memory Lab API",
        "version": "1.0.0",
        "supported_models": [
            "full_history_reference_baseline",
            "fixed_size_recurrent_memory",
            "educational_evolving_memory_toy"
        ],
        "supported_experiments": [
            "delayed_recall",
            "long_horizon_recall",
            "interference",
            "memory_capacity",
            "inference_recovery"
        ],
        "execution_modes": ["live", "precomputed"],
        "vocab_size": GLOBAL_VOCAB.size
    }


# -------------------------------------------------------------
# 2. RECALL EXPERIMENT ENDPOINT
# -------------------------------------------------------------

@router.post(
    "/experiment/recall",
    response_model=DataForgeExperimentResponse,
    summary="Run Recall Experiment (Delayed or Long-Horizon)",
    description="Evaluates memory retention across temporal lag k ('delayed') or sequence length T with clutter ('long_horizon')."
)
def run_recall_experiment(req: RecallExperimentRequest) -> DataForgeExperimentResponse:
    # Check if precomputed mode was explicitly requested or parameter exceeds live budget
    exp_name = "delayed_recall" if req.recall_type == "delayed" else "long_horizon_recall"

    if req.force_precomputed or (req.recall_type == "long_horizon" and req.sequence_length > 1024):
        p_name = "delay_k" if req.recall_type == "delayed" else "sequence_length"
        p_val = req.delay if req.recall_type == "delayed" else req.sequence_length
        match = GLOBAL_PRECOMPUTED_MANAGER.find_matching_precomputed_trial(exp_name, req.model_type, p_name, p_val)
        return GLOBAL_PRECOMPUTED_MANAGER.format_precomputed_response(
            experiment_name=exp_name,
            model_type=req.model_type,
            parameters=req.model_dump(),
            seed=req.seed,
            matching_trial=match
        )

    # Live computation path
    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    model = get_model(req.model_type, vocab=GLOBAL_VOCAB, state_dim=req.state_dim, seed=req.seed)

    config = {
        "delay": req.delay,
        "sequence_length": req.sequence_length,
        "num_items": req.num_items,
        "use_distractors": req.use_distractors,
        "inference_budget": req.inference_budget
    }

    res = exp.run_single(model, config, seed=req.seed)
    limitations = MODEL_LIMITATIONS.get(req.model_type, MODEL_LIMITATIONS["educational_evolving_memory_toy"])

    metrics = ExperimentMetrics(
        accuracy=float(res.accuracy),
        error_rate=float(1.0 - res.accuracy),
        is_correct=bool(res.correct),
        snr_db=float(res.state_trace[-1].get("snr_db", 30.0)) if res.state_trace else 30.0,
        final_state_norm=float(res.state_trace[-1].get("state_norm", 1.0)) if res.state_trace else 1.0,
        final_state_entropy=float(res.state_trace[-1].get("state_entropy", 0.0)) if res.state_trace else 0.0,
        inference_steps=int(res.inference_steps)
    )

    return DataForgeExperimentResponse(
        experiment=exp_name,
        execution_mode="live",
        model_type=req.model_type,
        seed=req.seed,
        latency_ms=float(res.latency_ms),
        parameters=req.model_dump(),
        input_sequence=res.input_sequence,
        expected_answer=res.expected_output,
        model_output=res.model_output,
        metrics=metrics,
        state_trace=res.state_trace,
        limitations=limitations,
        attribution="DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
    )


# -------------------------------------------------------------
# 3. INTERFERENCE EXPERIMENT ENDPOINT
# -------------------------------------------------------------

@router.post(
    "/experiment/interference",
    response_model=DataForgeExperimentResponse,
    summary="Run Interference & Conflicting Key Updates Experiment",
    description="Measures memory overwrite dynamics and catastrophic forgetting when the same key is repeatedly re-assigned."
)
def run_interference_experiment(req: InterferenceExperimentRequest) -> DataForgeExperimentResponse:
    exp_name = "interference"

    if req.force_precomputed or req.num_overwrites > 15:
        match = GLOBAL_PRECOMPUTED_MANAGER.find_matching_precomputed_trial(exp_name, req.model_type, "num_overwrites", req.num_overwrites)
        return GLOBAL_PRECOMPUTED_MANAGER.format_precomputed_response(
            experiment_name=exp_name,
            model_type=req.model_type,
            parameters=req.model_dump(),
            seed=req.seed,
            matching_trial=match
        )

    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    model = get_model(req.model_type, vocab=GLOBAL_VOCAB, state_dim=req.state_dim, seed=req.seed)

    config = {
        "num_overwrites": req.num_overwrites,
        "spacing": req.spacing,
        "target_mode": req.target_mode,
        "inference_budget": req.inference_budget
    }

    res = exp.run_single(model, config, seed=req.seed)
    limitations = MODEL_LIMITATIONS.get(req.model_type, MODEL_LIMITATIONS["educational_evolving_memory_toy"])

    metrics = ExperimentMetrics(
        accuracy=float(res.accuracy),
        error_rate=float(1.0 - res.accuracy),
        is_correct=bool(res.correct),
        snr_db=float(res.state_trace[-1].get("snr_db", 30.0)) if res.state_trace else 30.0,
        final_state_norm=float(res.state_trace[-1].get("state_norm", 1.0)) if res.state_trace else 1.0,
        final_state_entropy=float(res.state_trace[-1].get("state_entropy", 0.0)) if res.state_trace else 0.0,
        inference_steps=int(res.inference_steps)
    )

    return DataForgeExperimentResponse(
        experiment=exp_name,
        execution_mode="live",
        model_type=req.model_type,
        seed=req.seed,
        latency_ms=float(res.latency_ms),
        parameters=req.model_dump(),
        input_sequence=res.input_sequence,
        expected_answer=res.expected_output,
        model_output=res.model_output,
        metrics=metrics,
        state_trace=res.state_trace,
        limitations=limitations,
        attribution="DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
    )


# -------------------------------------------------------------
# 4. CAPACITY EXPERIMENT ENDPOINT
# -------------------------------------------------------------

@router.post(
    "/experiment/capacity",
    response_model=DataForgeExperimentResponse,
    summary="Run Memory Capacity Stress Test",
    description="Evaluates associative capacity bounds by packing N distinct key-value pairs into a bounded state."
)
def run_capacity_experiment(req: CapacityExperimentRequest) -> DataForgeExperimentResponse:
    exp_name = "memory_capacity"

    if req.force_precomputed or req.num_pairs > 36:
        match = GLOBAL_PRECOMPUTED_MANAGER.find_matching_precomputed_trial(exp_name, req.model_type, "num_pairs", req.num_pairs)
        return GLOBAL_PRECOMPUTED_MANAGER.format_precomputed_response(
            experiment_name=exp_name,
            model_type=req.model_type,
            parameters=req.model_dump(),
            seed=req.seed,
            matching_trial=match
        )

    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    model = get_model(req.model_type, vocab=GLOBAL_VOCAB, state_dim=req.state_dim, seed=req.seed)

    config = {
        "num_pairs": req.num_pairs,
        "interleaved_padding": req.interleaved_padding,
        "inference_budget": req.inference_budget
    }

    res = exp.run_single(model, config, seed=req.seed)
    limitations = MODEL_LIMITATIONS.get(req.model_type, MODEL_LIMITATIONS["educational_evolving_memory_toy"])

    metrics = ExperimentMetrics(
        accuracy=float(res.accuracy),
        error_rate=float(1.0 - res.accuracy),
        is_correct=bool(res.correct),
        snr_db=float(res.state_trace[-1].get("snr_db", 30.0)) if res.state_trace else 30.0,
        final_state_norm=float(res.state_trace[-1].get("state_norm", 1.0)) if res.state_trace else 1.0,
        final_state_entropy=float(res.state_trace[-1].get("state_entropy", 0.0)) if res.state_trace else 0.0,
        inference_steps=int(res.inference_steps)
    )

    return DataForgeExperimentResponse(
        experiment=exp_name,
        execution_mode="live",
        model_type=req.model_type,
        seed=req.seed,
        latency_ms=float(res.latency_ms),
        parameters=req.model_dump(),
        input_sequence=res.input_sequence,
        expected_answer=res.expected_output,
        model_output=res.model_output,
        metrics=metrics,
        state_trace=res.state_trace,
        limitations=limitations,
        attribution="DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
    )


# -------------------------------------------------------------
# 5. SCALING EXPERIMENT ENDPOINT
# -------------------------------------------------------------

@router.post(
    "/experiment/scaling",
    response_model=DataForgeExperimentResponse,
    summary="Run Inference-Time Scaling & Test-Time Recovery Experiment",
    description="Tests how additional inference compute steps (C_infer >= 1) de-noise degraded states in superposition."
)
def run_scaling_experiment(req: ScalingExperimentRequest) -> DataForgeExperimentResponse:
    exp_name = "inference_recovery"

    if req.force_precomputed:
        match = GLOBAL_PRECOMPUTED_MANAGER.find_matching_precomputed_trial(exp_name, req.model_type, "inference_budget", req.inference_budget)
        return GLOBAL_PRECOMPUTED_MANAGER.format_precomputed_response(
            experiment_name=exp_name,
            model_type=req.model_type,
            parameters=req.model_dump(),
            seed=req.seed,
            matching_trial=match
        )

    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    model = get_model(req.model_type, vocab=GLOBAL_VOCAB, state_dim=req.state_dim, seed=req.seed)

    config = {
        "clutter_pairs": req.clutter_pairs,
        "noise_steps": req.noise_steps,
        "inference_budget": req.inference_budget
    }

    res = exp.run_single(model, config, seed=req.seed)
    limitations = MODEL_LIMITATIONS.get(req.model_type, MODEL_LIMITATIONS["educational_evolving_memory_toy"])

    metrics = ExperimentMetrics(
        accuracy=float(res.accuracy),
        error_rate=float(1.0 - res.accuracy),
        is_correct=bool(res.correct),
        snr_db=float(res.state_trace[-1].get("snr_db", 30.0)) if res.state_trace else 30.0,
        final_state_norm=float(res.state_trace[-1].get("state_norm", 1.0)) if res.state_trace else 1.0,
        final_state_entropy=float(res.state_trace[-1].get("state_entropy", 0.0)) if res.state_trace else 0.0,
        inference_steps=int(res.inference_steps)
    )

    return DataForgeExperimentResponse(
        experiment=exp_name,
        execution_mode="live",
        model_type=req.model_type,
        seed=req.seed,
        latency_ms=float(res.latency_ms),
        parameters=req.model_dump(),
        input_sequence=res.input_sequence,
        expected_answer=res.expected_output,
        model_output=res.model_output,
        metrics=metrics,
        state_trace=res.state_trace,
        limitations=limitations,
        attribution="DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
    )


# -------------------------------------------------------------
# 6. GENERIC / UNIFIED EXPERIMENT RUNNER
# -------------------------------------------------------------

@router.post(
    "/experiment/run",
    response_model=DataForgeExperimentResponse,
    summary="Unified Experiment Execution Endpoint",
    description="Unified dispatcher for executing any of the 5 synthetic experiments under custom parameter specifications."
)
def run_generic_experiment(req: GenericRunRequest) -> DataForgeExperimentResponse:
    clean_exp = req.get_clean_experiment()
    clean_model = req.get_clean_model()

    if req.force_precomputed:
        return GLOBAL_PRECOMPUTED_MANAGER.format_precomputed_response(
            experiment_name=clean_exp,
            model_type=clean_model,
            parameters=req.parameters,
            seed=req.seed
        )

    try:
        exp = get_experiment(clean_exp, vocab=GLOBAL_VOCAB)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    state_dim = int(req.parameters.get("state_dim", 32))
    model = get_model(clean_model, vocab=GLOBAL_VOCAB, state_dim=state_dim, seed=req.seed)

    res = exp.run_single(model, req.parameters, seed=req.seed)
    limitations = MODEL_LIMITATIONS.get(clean_model, MODEL_LIMITATIONS["educational_evolving_memory_toy"])

    metrics = ExperimentMetrics(
        accuracy=float(res.accuracy),
        error_rate=float(1.0 - res.accuracy),
        is_correct=bool(res.correct),
        snr_db=float(res.state_trace[-1].get("snr_db", 30.0)) if res.state_trace else 30.0,
        final_state_norm=float(res.state_trace[-1].get("state_norm", 1.0)) if res.state_trace else 1.0,
        final_state_entropy=float(res.state_trace[-1].get("state_entropy", 0.0)) if res.state_trace else 0.0,
        inference_steps=int(res.inference_steps)
    )

    return DataForgeExperimentResponse(
        experiment=clean_exp,
        execution_mode="live",
        model_type=clean_model,
        seed=req.seed,
        latency_ms=float(res.latency_ms),
        parameters=req.parameters,
        input_sequence=res.input_sequence,
        expected_answer=res.expected_output,
        model_output=res.model_output,
        metrics=metrics,
        state_trace=res.state_trace,
        limitations=limitations,
        attribution="DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
    )


# -------------------------------------------------------------
# BATCH & SWEEP ENDPOINTS (Monte Carlo & Sweep Summaries)
# -------------------------------------------------------------

@router.post(
    "/experiment/batch",
    summary="Batch Monte Carlo Experiment Execution",
    description="Executes multiple Monte Carlo trials and computes aggregate accuracy and latency."
)
def run_batch_experiment_endpoint(req: Dict[str, Any]) -> Dict[str, Any]:
    exp_name = req.get("experiment") or req.get("experiment_type") or "delayed_recall"
    model_name = req.get("model_name") or req.get("model_type") or "educational_evolving_memory_toy"
    config = req.get("configuration") or req.get("parameters") or {}
    n_trials = int(req.get("n_trials", 10))
    base_seed = int(req.get("base_seed") or req.get("seed") or 42)

    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    state_dim = int(config.get("state_dim", 32))
    model = get_model(model_name, vocab=GLOBAL_VOCAB, state_dim=state_dim, seed=base_seed)

    batch_res = exp.run_batch(model, config, n_trials=n_trials, base_seed=base_seed)
    return batch_res


@router.post(
    "/benchmark/sweep",
    summary="Multi-Model Parameter Sweep Benchmark",
    description="Runs a multi-model parameter sweep and returns tabular structured results."
)
def run_sweep_endpoint(req: Dict[str, Any]) -> Dict[str, Any]:
    exp_name = req.get("experiment") or req.get("experiment_type") or "delayed_recall"
    sweep_param = req.get("sweep_param", "delay")
    param_values = req.get("param_values", [4, 16])
    models = req.get("models", ["educational_evolving_memory_toy"])
    base_config = req.get("base_config", {})
    n_trials = int(req.get("n_trials_per_point", 5))
    seed = int(req.get("seed", 42))

    exp = get_experiment(exp_name, vocab=GLOBAL_VOCAB)
    records = []

    for m_name in models:
        for val in param_values:
            cfg = dict(base_config)
            cfg[sweep_param] = val
            state_dim = int(cfg.get("state_dim", 32))
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=state_dim, seed=seed)
            res = exp.run_batch(model, cfg, n_trials=n_trials, base_seed=seed)
            records.append({
                "model_name": m_name,
                sweep_param: val,
                "accuracy": res["accuracy"],
                "avg_latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            })

    return {
        "experiment": exp_name,
        "sweep_param": sweep_param,
        "results": records
    }


# -------------------------------------------------------------
# 7. PRECOMPUTED BENCHMARK CATALOG
# -------------------------------------------------------------

@router.get(
    "/experiments/precomputed",
    response_model=PrecomputedCatalogResponse,
    summary="Get Precomputed Benchmarks Catalog",
    description="Returns metadata on all precomputed sweeps, dataset files, and publication figures."
)
def get_precomputed_catalog() -> PrecomputedCatalogResponse:
    return GLOBAL_PRECOMPUTED_MANAGER.get_catalog()


# -------------------------------------------------------------
# 8. EXPERIMENT DETAIL & BENCHMARK INTROSPECTION
# -------------------------------------------------------------

@router.get(
    "/experiments/{experiment_id}",
    summary="Get Experiment Details & Precomputed Summary Data",
    description="Retrieves summary statistics and metadata for a specific experiment protocol."
)
def get_experiment_details(
    experiment_id: str = Path(..., description="Experiment identifier (e.g., 'delayed_recall', 'long_horizon_recall', 'interference', 'memory_capacity', 'inference_recovery')")
) -> Dict[str, Any]:
    clean_id = experiment_id.strip().lower()
    valid_exps = [
        "delayed_recall",
        "long_horizon_recall",
        "interference",
        "memory_capacity",
        "inference_recovery"
    ]

    if clean_id not in valid_exps:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Experiment '{experiment_id}' not found. Supported: {valid_exps}"
        )

    all_summaries = GLOBAL_PRECOMPUTED_MANAGER.load_summary_stats()
    matching_summaries = [s for s in all_summaries if s.get("experiment") == clean_id]

    return {
        "experiment_id": clean_id,
        "status": "available",
        "supported_models": [
            "full_history_reference_baseline",
            "fixed_size_recurrent_memory",
            "educational_evolving_memory_toy"
        ],
        "summary_statistics": matching_summaries,
        "sample_points_count": len(matching_summaries),
        "limitations": MODEL_LIMITATIONS["educational_evolving_memory_toy"]
    }
