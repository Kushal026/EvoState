"""Experiment-level tests verifying structured JSON schemas, execution, and metric bounds."""

import pytest
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import get_model
from evostate.experiments import (
    DelayedRecallExperiment,
    LongHorizonRecallExperiment,
    InterferenceExperiment,
    MemoryCapacityExperiment,
    InferenceRecoveryExperiment,
    get_experiment
)


REQUIRED_JSON_KEYS = {
    "experiment",
    "configuration",
    "input_sequence",
    "expected_output",
    "model_output",
    "correct",
    "accuracy",
    "state_trace",
    "inference_steps",
    "latency_ms"
}


@pytest.fixture
def educational_toy():
    return get_model("educational_evolving_memory_toy", GLOBAL_VOCAB, state_dim=32, seed=42)


@pytest.fixture
def full_history():
    return get_model("full_history_reference_baseline", GLOBAL_VOCAB, state_dim=32, seed=42)


def validate_result_schema(res_dict: dict, exp_name: str):
    assert set(res_dict.keys()) == REQUIRED_JSON_KEYS
    assert res_dict["experiment"] == exp_name
    assert isinstance(res_dict["configuration"], dict)
    assert isinstance(res_dict["input_sequence"], list)
    assert len(res_dict["input_sequence"]) > 0
    assert isinstance(res_dict["expected_output"], str)
    assert isinstance(res_dict["model_output"], str)
    assert isinstance(res_dict["correct"], bool)
    assert isinstance(res_dict["accuracy"], float)
    assert 0.0 <= res_dict["accuracy"] <= 1.0
    assert isinstance(res_dict["state_trace"], list)
    assert len(res_dict["state_trace"]) == len(res_dict["input_sequence"])
    assert isinstance(res_dict["inference_steps"], int)
    assert res_dict["inference_steps"] >= 1
    assert isinstance(res_dict["latency_ms"], float)
    assert res_dict["latency_ms"] >= 0.0


def test_delayed_recall_experiment(educational_toy):
    exp = DelayedRecallExperiment(vocab=GLOBAL_VOCAB)
    res = exp.run_single(educational_toy, {"delay": 8, "inference_budget": 2}, seed=42)
    res_dict = res.to_dict()
    validate_result_schema(res_dict, "delayed_recall")
    assert res.correct is True


def test_long_horizon_recall_experiment(educational_toy):
    exp = LongHorizonRecallExperiment(vocab=GLOBAL_VOCAB)
    res = exp.run_single(educational_toy, {"sequence_length": 32, "num_items": 3}, seed=42)
    res_dict = res.to_dict()
    validate_result_schema(res_dict, "long_horizon_recall")


def test_interference_experiment(educational_toy):
    exp = InterferenceExperiment(vocab=GLOBAL_VOCAB)
    res = exp.run_single(educational_toy, {"num_overwrites": 2, "spacing": 2, "target_mode": "recency"}, seed=42)
    res_dict = res.to_dict()
    validate_result_schema(res_dict, "interference")


def test_memory_capacity_experiment(educational_toy):
    exp = MemoryCapacityExperiment(vocab=GLOBAL_VOCAB)
    res = exp.run_single(educational_toy, {"num_pairs": 4, "interleaved_padding": 1}, seed=42)
    res_dict = res.to_dict()
    validate_result_schema(res_dict, "memory_capacity")


def test_inference_recovery_experiment(educational_toy):
    exp = InferenceRecoveryExperiment(vocab=GLOBAL_VOCAB)
    res = exp.run_single(educational_toy, {"clutter_pairs": 4, "noise_steps": 4, "inference_budget": 5}, seed=42)
    res_dict = res.to_dict()
    validate_result_schema(res_dict, "inference_recovery")
    assert res.inference_steps == 5


def test_batch_execution(educational_toy):
    exp = get_experiment("delayed_recall", vocab=GLOBAL_VOCAB)
    batch_res = exp.run_batch(educational_toy, {"delay": 4}, n_trials=5, base_seed=42)
    assert batch_res["experiment"] == "delayed_recall"
    assert "batch_details" in batch_res
    assert batch_res["batch_details"]["n_trials"] == 5
