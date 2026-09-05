"""Tests verifying strict determinism and reproducibility of random seeds."""

import pytest
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import get_model
from evostate.experiments import get_experiment


def test_seed_determinism_single_trial():
    exp = get_experiment("long_horizon_recall", vocab=GLOBAL_VOCAB)
    model1 = get_model("educational_evolving_memory_toy", GLOBAL_VOCAB, state_dim=32, seed=100)
    model2 = get_model("educational_evolving_memory_toy", GLOBAL_VOCAB, state_dim=32, seed=100)

    res1 = exp.run_single(model1, {"sequence_length": 64, "num_items": 4}, seed=100)
    res2 = exp.run_single(model2, {"sequence_length": 64, "num_items": 4}, seed=100)

    # Identical inputs, outputs, and traces
    assert res1.input_sequence == res2.input_sequence
    assert res1.expected_output == res2.expected_output
    assert res1.model_output == res2.model_output
    assert res1.correct == res2.correct
    assert len(res1.state_trace) == len(res2.state_trace)
    assert res1.state_trace[0]["state_norm"] == pytest.approx(res2.state_trace[0]["state_norm"], rel=1e-5)


def test_seed_diversity():
    exp = get_experiment("delayed_recall", vocab=GLOBAL_VOCAB)
    trial_seed_a = exp.generate_trial({"delay": 10}, seed=42)
    trial_seed_b = exp.generate_trial({"delay": 10}, seed=999)

    # Different seeds should sample different tokens/positions
    # (or at least valid distinct trials)
    assert trial_seed_a["query_token"] != trial_seed_b["query_token"] or trial_seed_a["expected_output"] != trial_seed_b["expected_output"]
