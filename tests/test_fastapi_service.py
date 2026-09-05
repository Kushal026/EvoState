"""Comprehensive API test suite for DataForge FastAPI service."""

import pytest
from fastapi.testclient import TestClient
from evostate.server.app import app

client = TestClient(app)


# -------------------------------------------------------------
# 1. HEALTH & OPENAPI TESTS
# -------------------------------------------------------------

def test_health_check_endpoints():
    for url in ["/health", "/api/health"]:
        resp = client.get(url)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "educational_evolving_memory_toy" in data["supported_models"]
        assert "inference_recovery" in data["supported_experiments"]


def test_openapi_schema_endpoint():
    resp = client.get("/openapi.json")
    assert resp.status_code == 200
    schema = resp.json()
    assert "paths" in schema
    assert "/health" in schema["paths"]
    assert "/experiment/recall" in schema["paths"]
    assert "/experiment/interference" in schema["paths"]
    assert "/experiment/capacity" in schema["paths"]
    assert "/experiment/scaling" in schema["paths"]
    assert "/experiment/run" in schema["paths"]
    assert "/experiments/precomputed" in schema["paths"]
    assert "/experiments/{experiment_id}" in schema["paths"]


# -------------------------------------------------------------
# 2. RECALL EXPERIMENT TESTS
# -------------------------------------------------------------

def test_post_recall_delayed_live():
    payload = {
        "model_type": "educational_evolving_memory_toy",
        "recall_type": "delayed",
        "delay": 16,
        "inference_budget": 2,
        "seed": 42
    }
    resp = client.post("/experiment/recall", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "delayed_recall"
    assert data["execution_mode"] == "live"
    assert data["model_type"] == "educational_evolving_memory_toy"
    assert "metrics" in data
    assert data["metrics"]["accuracy"] in [0.0, 1.0]
    assert len(data["state_trace"]) > 0
    assert len(data["limitations"]) > 0
    assert data["expected_answer"] != ""
    assert data["model_output"] != ""


def test_post_recall_long_horizon_live():
    payload = {
        "model_type": "full_history_reference_baseline",
        "recall_type": "long_horizon",
        "sequence_length": 64,
        "num_items": 4,
        "seed": 42
    }
    resp = client.post("/experiment/recall", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "long_horizon_recall"
    assert data["execution_mode"] == "live"
    assert data["metrics"]["accuracy"] == 1.0


def test_post_recall_precomputed_mode():
    payload = {
        "model_type": "educational_evolving_memory_toy",
        "recall_type": "delayed",
        "delay": 16,
        "force_precomputed": True,
        "seed": 42
    }
    resp = client.post("/experiment/recall", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["execution_mode"] == "precomputed"


# -------------------------------------------------------------
# 3. INTERFERENCE EXPERIMENT TESTS
# -------------------------------------------------------------

def test_post_interference_live():
    payload = {
        "model_type": "educational_evolving_memory_toy",
        "num_overwrites": 2,
        "spacing": 2,
        "target_mode": "recency",
        "seed": 42
    }
    resp = client.post("/experiment/interference", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "interference"
    assert data["execution_mode"] == "live"
    assert "metrics" in data


# -------------------------------------------------------------
# 4. CAPACITY EXPERIMENT TESTS
# -------------------------------------------------------------

def test_post_capacity_live():
    payload = {
        "model_type": "educational_evolving_memory_toy",
        "num_pairs": 4,
        "interleaved_padding": 1,
        "seed": 42
    }
    resp = client.post("/experiment/capacity", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "memory_capacity"
    assert data["execution_mode"] == "live"


# -------------------------------------------------------------
# 5. SCALING EXPERIMENT TESTS
# -------------------------------------------------------------

def test_post_scaling_live():
    payload = {
        "model_type": "educational_evolving_memory_toy",
        "inference_budget": 5,
        "clutter_pairs": 3,
        "noise_steps": 4,
        "seed": 42
    }
    resp = client.post("/experiment/scaling", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "inference_recovery"
    assert data["execution_mode"] == "live"
    assert data["metrics"]["inference_steps"] == 5


# -------------------------------------------------------------
# 6. GENERIC RUN EXPERIMENT TESTS
# -------------------------------------------------------------

def test_post_generic_run():
    payload = {
        "experiment_type": "delayed_recall",
        "model_type": "fixed_size_recurrent_memory",
        "parameters": {"delay": 8},
        "seed": 42
    }
    resp = client.post("/experiment/run", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment"] == "delayed_recall"
    assert data["model_type"] == "fixed_size_recurrent_memory"


# -------------------------------------------------------------
# 7. PRECOMPUTED CATALOG & DETAIL TESTS
# -------------------------------------------------------------

def test_get_precomputed_catalog():
    resp = client.get("/experiments/precomputed")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "available"
    assert len(data["available_sweeps"]) == 4
    assert len(data["plots"]) >= 6


def test_get_experiment_details():
    resp = client.get("/experiments/delayed_recall")
    assert resp.status_code == 200
    data = resp.json()
    assert data["experiment_id"] == "delayed_recall"
    assert "summary_statistics" in data

    # Test 404 on invalid experiment id
    resp_404 = client.get("/experiments/non_existent_experiment")
    assert resp_404.status_code == 404


# -------------------------------------------------------------
# 8. INPUT VALIDATION & GUARDRAIL TESTS
# -------------------------------------------------------------

def test_validation_rejects_unreasonable_parameters():
    # Delay too large (> 512)
    resp = client.post("/experiment/recall", json={"delay": 9999})
    assert resp.status_code == 422

    # Negative sequence length
    resp = client.post("/experiment/recall", json={"recall_type": "long_horizon", "sequence_length": -5})
    assert resp.status_code == 422

    # Overwrites too large (> 15)
    resp = client.post("/experiment/interference", json={"num_overwrites": 100})
    assert resp.status_code == 422

    # Invalid model type
    resp = client.post("/experiment/recall", json={"model_type": "non_existent_model"})
    assert resp.status_code == 422

    # Inference budget too large (> 25)
    resp = client.post("/experiment/scaling", json={"inference_budget": 100})
    assert resp.status_code == 422
