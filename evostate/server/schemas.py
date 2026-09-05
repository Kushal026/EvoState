"""Pydantic schemas for FastAPI endpoints."""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class ExperimentRequest(BaseModel):
    """Request payload for running a single experiment trial."""
    experiment: str = Field(
        ...,
        description="Experiment identifier: 'delayed_recall', 'long_horizon_recall', 'interference', 'memory_capacity', 'inference_recovery'"
    )
    model_name: str = Field(
        "educational_evolving_memory_toy",
        description="Model identifier: 'full_history_reference_baseline', 'fixed_size_recurrent_memory', 'educational_evolving_memory_toy'"
    )
    configuration: Dict[str, Any] = Field(
        default_factory=dict,
        description="Parameters for the experiment and model (e.g., delay, sequence_length, state_dim, inference_budget)"
    )
    seed: int = Field(42, description="Random seed for deterministic reproducibility")


class BatchExperimentRequest(BaseModel):
    """Request payload for batch experiment execution across multiple trials."""
    experiment: str
    model_name: str = "educational_evolving_memory_toy"
    configuration: Dict[str, Any] = Field(default_factory=dict)
    n_trials: int = Field(20, ge=1, le=500, description="Number of Monte Carlo trials")
    base_seed: int = Field(42, description="Base seed for reproducibility")


class StateTraceItem(BaseModel):
    step: int
    token: str
    state_norm: float
    state_entropy: float
    delta: float
    snr_db: Optional[float] = None


class ExperimentResponse(BaseModel):
    """Canonical experiment JSON response format required by DataForge specification."""
    experiment: str
    configuration: Dict[str, Any]
    input_sequence: List[str]
    expected_output: str
    model_output: str
    correct: bool
    accuracy: float
    state_trace: List[Dict[str, Any]]
    inference_steps: int
    latency_ms: float
    batch_details: Optional[Dict[str, Any]] = None


class SweepRequest(BaseModel):
    """Request for running parameter sweeps comparing models."""
    experiment: str
    sweep_param: str
    param_values: List[Any]
    models: List[str] = [
        "full_history_reference_baseline",
        "fixed_size_recurrent_memory",
        "educational_evolving_memory_toy"
    ]
    base_config: Dict[str, Any] = Field(default_factory=dict)
    n_trials_per_point: int = Field(10, ge=1, le=100)
    seed: int = Field(42)
