"""FastAPI route handlers for experiment execution, batch evaluation, and parameter sweeps."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
import pandas as pd
import numpy as np

from evostate.server.schemas import (
    ExperimentRequest,
    BatchExperimentRequest,
    ExperimentResponse,
    SweepRequest
)
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import get_model
from evostate.experiments import get_experiment, EXPERIMENT_REGISTRY

router = APIRouter(prefix="/api", tags=["Experiments"])


@router.get("/health")
def health_check() -> Dict[str, Any]:
    """Health and engine status check."""
    return {
        "status": "healthy",
        "engine": "DataForge: Evolving Memory Lab Core",
        "supported_models": [
            "full_history_reference_baseline",
            "fixed_size_recurrent_memory",
            "educational_evolving_memory_toy"
        ],
        "supported_experiments": list(EXPERIMENT_REGISTRY.keys()),
        "vocab_size": GLOBAL_VOCAB.size
    }


@router.post("/experiment/run", response_model=ExperimentResponse)
def run_single_experiment(req: ExperimentRequest) -> Dict[str, Any]:
    """Execute a single experiment trial with full state trace and metrics."""
    try:
        exp = get_experiment(req.experiment, vocab=GLOBAL_VOCAB)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    state_dim = req.configuration.get("state_dim", 32)
    decay = req.configuration.get("decay", 0.98)

    try:
        model = get_model(
            model_name=req.model_name,
            vocab=GLOBAL_VOCAB,
            state_dim=state_dim,
            decay=decay,
            seed=req.seed
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    result = exp.run_single(model=model, config=req.configuration, seed=req.seed)
    return result.to_dict()


@router.post("/experiment/batch", response_model=ExperimentResponse)
def run_batch_experiment(req: BatchExperimentRequest) -> Dict[str, Any]:
    """Execute multiple Monte Carlo trials and return aggregate accuracy and sample state trace."""
    try:
        exp = get_experiment(req.experiment, vocab=GLOBAL_VOCAB)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    state_dim = req.configuration.get("state_dim", 32)
    decay = req.configuration.get("decay", 0.98)

    try:
        model = get_model(
            model_name=req.model_name,
            vocab=GLOBAL_VOCAB,
            state_dim=state_dim,
            decay=decay,
            seed=req.base_seed
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    batch_res = exp.run_batch(
        model=model,
        config=req.configuration,
        n_trials=req.n_trials,
        base_seed=req.base_seed
    )
    return batch_res


@router.post("/benchmark/sweep")
def run_parameter_sweep(req: SweepRequest) -> Dict[str, Any]:
    """
    Execute a parameter sweep across multiple models and return DataFrame-style structured results.
    """
    try:
        exp = get_experiment(req.experiment, vocab=GLOBAL_VOCAB)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    records: List[Dict[str, Any]] = []

    for model_name in req.models:
        for val in req.param_values:
            config = dict(req.base_config)
            config[req.sweep_param] = val

            state_dim = config.get("state_dim", 32)
            decay = config.get("decay", 0.98)

            model = get_model(
                model_name=model_name,
                vocab=GLOBAL_VOCAB,
                state_dim=state_dim,
                decay=decay,
                seed=req.seed
            )

            batch_res = exp.run_batch(
                model=model,
                config=config,
                n_trials=req.n_trials_per_point,
                base_seed=req.seed
            )

            records.append({
                "model_name": model_name,
                req.sweep_param: val,
                "accuracy": batch_res["accuracy"],
                "avg_latency_ms": batch_res["latency_ms"],
                "inference_steps": batch_res["inference_steps"]
            })

    df = pd.DataFrame(records)
    return {
        "experiment": req.experiment,
        "sweep_param": req.sweep_param,
        "results": records,
        "summary": df.groupby(["model_name", req.sweep_param])["accuracy"].mean().to_dict()
    }
