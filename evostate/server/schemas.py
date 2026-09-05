"""Pydantic schemas and input validation models for DataForge FastAPI service."""

from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional, Literal


# Supported Model Types
VALID_MODELS = [
    "full_history_reference_baseline",
    "fixed_size_recurrent_memory",
    "educational_evolving_memory_toy"
]

ModelType = Literal[
    "full_history_reference_baseline",
    "fixed_size_recurrent_memory",
    "educational_evolving_memory_toy"
]

ExecutionMode = Literal["live", "precomputed"]


# -------------------------------------------------------------
# REQUEST SCHEMAS
# -------------------------------------------------------------

class RecallExperimentRequest(BaseModel):
    """Parameters for Delayed Recall and Long-Horizon Recall experiments."""
    model_type: ModelType = Field(
        "educational_evolving_memory_toy",
        description="Architecture to evaluate: 'full_history_reference_baseline', 'fixed_size_recurrent_memory', or 'educational_evolving_memory_toy'"
    )
    recall_type: Literal["delayed", "long_horizon"] = Field(
        "delayed",
        description="'delayed' (single needle over lag k) or 'long_horizon' (multiple items in sequence length T)"
    )
    delay: int = Field(
        16,
        ge=1,
        le=512,
        description="Delay lag steps between needle and query (for 'delayed' type)"
    )
    sequence_length: int = Field(
        64,
        ge=16,
        le=1024,
        description="Total sequence horizon length in tokens (for 'long_horizon' type)"
    )
    num_items: int = Field(
        4,
        ge=1,
        le=12,
        description="Number of key-value pairs embedded across sequence (for 'long_horizon' type)"
    )
    use_distractors: bool = Field(
        False,
        description="If true, fills delay steps with random distractor tokens instead of neutral padding"
    )
    inference_budget: int = Field(
        1,
        ge=1,
        le=25,
        description="Test-time compute steps (C_infer >= 1)"
    )
    state_dim: int = Field(
        32,
        ge=8,
        le=128,
        description="State representation dimension"
    )
    seed: int = Field(
        42,
        ge=0,
        le=2_147_483_647,
        description="Deterministic random seed"
    )
    force_precomputed: bool = Field(
        False,
        description="If true, returns precomputed verified benchmark data instead of live computation"
    )


class InterferenceExperimentRequest(BaseModel):
    """Parameters for Interference & Conflicting Key Updates experiment."""
    model_type: ModelType = Field(
        "educational_evolving_memory_toy",
        description="Architecture to evaluate"
    )
    num_overwrites: int = Field(
        3,
        ge=1,
        le=15,
        description="Number of times the target key is re-assigned new values"
    )
    spacing: int = Field(
        3,
        ge=0,
        le=10,
        description="Number of padding/neutral tokens between conflicting updates"
    )
    target_mode: Literal["recency", "primacy"] = Field(
        "recency",
        description="'recency' queries latest value, 'primacy' queries initial value"
    )
    inference_budget: int = Field(
        1,
        ge=1,
        le=25,
        description="Test-time compute steps (C_infer >= 1)"
    )
    state_dim: int = Field(
        32,
        ge=8,
        le=128,
        description="State representation dimension"
    )
    seed: int = Field(
        42,
        ge=0,
        le=2_147_483_647,
        description="Deterministic random seed"
    )
    force_precomputed: bool = Field(
        False,
        description="If true, returns precomputed verified benchmark data"
    )


class CapacityExperimentRequest(BaseModel):
    """Parameters for Memory Capacity Stress Test experiment."""
    model_type: ModelType = Field(
        "educational_evolving_memory_toy",
        description="Architecture to evaluate"
    )
    num_pairs: int = Field(
        4,
        ge=1,
        le=36,
        description="Number of distinct orthogonal key-value pairs packed into memory"
    )
    interleaved_padding: int = Field(
        1,
        ge=0,
        le=5,
        description="Padding steps between successive key-value writes"
    )
    inference_budget: int = Field(
        1,
        ge=1,
        le=25,
        description="Test-time compute steps (C_infer >= 1)"
    )
    state_dim: int = Field(
        32,
        ge=8,
        le=128,
        description="State representation dimension"
    )
    seed: int = Field(
        42,
        ge=0,
        le=2_147_483_647,
        description="Deterministic random seed"
    )
    force_precomputed: bool = Field(
        False,
        description="If true, returns precomputed verified benchmark data"
    )


class ScalingExperimentRequest(BaseModel):
    """Parameters for Inference-Time Scaling & Recovery experiment."""
    model_type: ModelType = Field(
        "educational_evolving_memory_toy",
        description="Architecture to evaluate"
    )
    inference_budget: int = Field(
        5,
        ge=1,
        le=25,
        description="Number of test-time refinement / attractor settling steps (C_infer)"
    )
    clutter_pairs: int = Field(
        4,
        ge=1,
        le=10,
        description="Number of distractor items loaded into memory"
    )
    noise_steps: int = Field(
        6,
        ge=0,
        le=20,
        description="Trailing noise steps before query"
    )
    state_dim: int = Field(
        32,
        ge=8,
        le=128,
        description="State representation dimension"
    )
    seed: int = Field(
        42,
        ge=0,
        le=2_147_483_647,
        description="Deterministic random seed"
    )
    force_precomputed: bool = Field(
        False,
        description="If true, returns precomputed verified benchmark data"
    )


class GenericRunRequest(BaseModel):
    """Unified runner for arbitrary experiment and parameter specifications."""
    experiment_type: Optional[str] = Field(None, alias="experiment", description="Experiment identifier")
    model_type: Optional[str] = Field(None, alias="model_name", description="Model architecture")
    parameters: Dict[str, Any] = Field(default_factory=dict, alias="configuration", description="Parameters")
    seed: int = Field(42, ge=0, le=2_147_483_647, description="Deterministic random seed")
    force_precomputed: bool = Field(False, description="If true, retrieves precomputed verified baseline data")

    model_config = {
        "populate_by_name": True
    }

    def get_clean_experiment(self) -> str:
        return self.experiment_type or "delayed_recall"

    def get_clean_model(self) -> str:
        return self.model_type or "educational_evolving_memory_toy"


class BatchExperimentRequest(BaseModel):
    """Batch experiment execution across multiple trials."""
    experiment_type: Optional[str] = Field("delayed_recall", alias="experiment")
    model_type: Optional[str] = Field("educational_evolving_memory_toy", alias="model_name")
    parameters: Dict[str, Any] = Field(default_factory=dict, alias="configuration")
    n_trials: int = Field(10, ge=1, le=100)
    base_seed: int = Field(42)

    model_config = {
        "populate_by_name": True
    }


class SweepRequest(BaseModel):
    """Request for running parameter sweeps comparing models."""
    experiment_type: Optional[str] = Field("delayed_recall", alias="experiment")
    sweep_param: str
    param_values: List[Any]
    models: List[str] = [
        "full_history_reference_baseline",
        "fixed_size_recurrent_memory",
        "educational_evolving_memory_toy"
    ]
    base_config: Dict[str, Any] = Field(default_factory=dict)
    n_trials_per_point: int = Field(5, ge=1, le=50)
    seed: int = Field(42)

    model_config = {
        "populate_by_name": True
    }


# -------------------------------------------------------------
# RESPONSE SCHEMAS
# -------------------------------------------------------------

class StateTraceItem(BaseModel):
    step: int
    token: str
    state_norm: float
    state_entropy: float
    delta: float
    snr_db: Optional[float] = None


class ExperimentMetrics(BaseModel):
    accuracy: float = Field(..., description="Binary retrieval correctness (1.0 or 0.0)")
    error_rate: float = Field(..., description="Error rate (1.0 - accuracy)")
    is_correct: bool = Field(..., description="True if model output matched ground truth exactly")
    snr_db: Optional[float] = Field(None, description="Signal-to-noise ratio in decibels")
    final_state_norm: Optional[float] = Field(None, description="L2/Frobenius norm of final memory state")
    final_state_entropy: Optional[float] = Field(None, description="Energy dispersion entropy of final state")
    inference_steps: int = Field(..., description="Actual inference cycles executed")


class DataForgeExperimentResponse(BaseModel):
    """Canonical experiment response containing all required scientific metadata."""
    experiment: str = Field(..., description="Experiment identifier")
    execution_mode: ExecutionMode = Field(..., description="'live' (computed on-the-fly) or 'precomputed' (verified offline run)")
    model_type: str = Field(..., description="Model identifier evaluated")
    seed: int = Field(..., description="Random seed used")
    latency_ms: float = Field(..., description="Execution latency in milliseconds")
    parameters: Dict[str, Any] = Field(..., description="Normalized configuration parameters")
    input_sequence: List[str] = Field(..., description="Token sequence ingested by model")
    expected_answer: str = Field(..., description="Ground-truth expected value")
    model_output: str = Field(..., description="Predicted token emitted by model")
    metrics: ExperimentMetrics = Field(..., description="Quantitative accuracy and telemetry metrics")
    state_trace: List[Dict[str, Any]] = Field(..., description="Step-by-step state vector and telemetry trace")
    limitations: List[str] = Field(..., description="Scientific caveats, capacity boundaries, and failure modes")
    attribution: str = Field(
        "DataForge 2026 Pathway Track (Educational Surrogate Implementation)",
        description="Architecture attribution and educational surrogate classification"
    )


class PrecomputedCatalogItem(BaseModel):
    sweep_type: str
    experiment: str
    parameter_name: str
    parameter_range: List[Any]
    models_evaluated: List[str]
    n_trials_per_point: int
    dataset_file: str


class PrecomputedCatalogResponse(BaseModel):
    status: str
    total_precomputed_trials: int
    available_sweeps: List[PrecomputedCatalogItem]
    plots: List[str]
    documentation_url: str
