"""Unit tests for memory models."""

import pytest
import torch
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import (
    FullHistoryReferenceBaseline,
    FixedSizeRecurrentMemory,
    EducationalEvolvingMemoryToy,
    get_model
)


def test_full_history_model():
    model = FullHistoryReferenceBaseline(vocab=GLOBAL_VOCAB, embed_dim=32, seed=42)
    model.reset_state()

    # Ingest KV pair and pad
    t1 = model.ingest_token(GLOBAL_VOCAB.encode("KEY_A:VAL_ALPHA"), "KEY_A:VAL_ALPHA", step_idx=0)
    assert t1.step == 0
    assert t1.state_norm > 0

    t2 = model.ingest_token(GLOBAL_VOCAB.encode("<PAD>"), "<PAD>", step_idx=1)
    assert t2.step == 1

    # Query
    q_tok = "QUERY:KEY_A"
    pred, steps, meta = model.query(q_tok, GLOBAL_VOCAB.encode(q_tok), inference_budget=1)
    assert pred == "VAL_ALPHA"
    assert steps == 1
    assert "memory_slots_used" in meta


def test_recurrent_memory_model():
    model = FixedSizeRecurrentMemory(vocab=GLOBAL_VOCAB, state_dim=32, decay=0.95, seed=42)
    model.reset_state()

    t1 = model.ingest_token(GLOBAL_VOCAB.encode("KEY_B:VAL_BETA"), "KEY_B:VAL_BETA", step_idx=0)
    assert t1.step == 0
    assert model.h_t.shape == (1, 32)

    q_tok = "QUERY:KEY_B"
    pred, steps, meta = model.query(q_tok, GLOBAL_VOCAB.encode(q_tok), inference_budget=1)
    assert isinstance(pred, str)
    assert steps == 1


def test_educational_toy_model_mechanics():
    model = EducationalEvolvingMemoryToy(
        vocab=GLOBAL_VOCAB,
        key_dim=32,
        val_dim=32,
        base_retention=0.99,
        seed=42
    )
    model.reset_state()
    assert model.model_name == "educational_evolving_memory_toy"

    # Ingest needle
    t1 = model.ingest_token(GLOBAL_VOCAB.encode("KEY_C:VAL_GAMMA"), "KEY_C:VAL_GAMMA", step_idx=0)
    assert t1.delta >= 0.7  # High write rate for KV
    assert model.M_t.shape == (32, 32)

    # Ingest noise
    t2 = model.ingest_token(GLOBAL_VOCAB.encode("NOISE_1"), "NOISE_1", step_idx=1)
    assert t2.delta <= 0.1  # Selective suppression of noise

    # Single-pass query
    q_tok = "QUERY:KEY_C"
    pred_single, steps_single, meta_single = model.query(
        q_tok, GLOBAL_VOCAB.encode(q_tok), inference_budget=1
    )
    assert pred_single == "VAL_GAMMA"
    assert steps_single == 1
    assert meta_single["is_educational_toy"] is True

    # Multi-pass query (Inference-Time Scaling)
    pred_multi, steps_multi, meta_multi = model.query(
        q_tok, GLOBAL_VOCAB.encode(q_tok), inference_budget=5
    )
    assert pred_multi == "VAL_GAMMA"
    assert steps_multi == 5
    assert len(meta_multi["refinement_history"]) == 5


def test_model_factory():
    m1 = get_model("full_history_reference_baseline", GLOBAL_VOCAB)
    m2 = get_model("fixed_size_recurrent_memory", GLOBAL_VOCAB)
    m3 = get_model("educational_evolving_memory_toy", GLOBAL_VOCAB)

    assert isinstance(m1, FullHistoryReferenceBaseline)
    assert isinstance(m2, FixedSizeRecurrentMemory)
    assert isinstance(m3, EducationalEvolvingMemoryToy)

    with pytest.raises(ValueError):
        get_model("unknown_architecture", GLOBAL_VOCAB)
