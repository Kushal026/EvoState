"""Experiment registry and factory for EvoState."""

from typing import Dict, Type
from evostate.experiments.base import BaseExperiment, ExperimentResult
from evostate.experiments.delayed_recall import DelayedRecallExperiment
from evostate.experiments.long_horizon_recall import LongHorizonRecallExperiment
from evostate.experiments.interference import InterferenceExperiment
from evostate.experiments.memory_capacity import MemoryCapacityExperiment
from evostate.experiments.inference_recovery import InferenceRecoveryExperiment


EXPERIMENT_REGISTRY: Dict[str, Type[BaseExperiment]] = {
    "delayed_recall": DelayedRecallExperiment,
    "long_horizon_recall": LongHorizonRecallExperiment,
    "interference": InterferenceExperiment,
    "memory_capacity": MemoryCapacityExperiment,
    "inference_recovery": InferenceRecoveryExperiment
}


def get_experiment(experiment_name: str, vocab=None) -> BaseExperiment:
    """Factory helper to instantiate experiments by name."""
    name_clean = experiment_name.strip().lower()
    if name_clean not in EXPERIMENT_REGISTRY:
        raise ValueError(
            f"Unknown experiment: {experiment_name}. Allowed: {list(EXPERIMENT_REGISTRY.keys())}"
        )
    return EXPERIMENT_REGISTRY[name_clean](vocab=vocab)


__all__ = [
    "BaseExperiment",
    "ExperimentResult",
    "DelayedRecallExperiment",
    "LongHorizonRecallExperiment",
    "InterferenceExperiment",
    "MemoryCapacityExperiment",
    "InferenceRecoveryExperiment",
    "get_experiment",
    "EXPERIMENT_REGISTRY"
]
