"""Integration tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from evostate.server.app import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "educational_evolving_memory_toy" in data["supported_models"]
    assert "delayed_recall" in data["supported_experiments"]


def test_run_experiment_endpoint():
    payload = {
        "experiment": "delayed_recall",
        "model_name": "educational_evolving_memory_toy",
        "configuration": {
            "delay": 8,
            "inference_budget": 2
        },
        "seed": 42
    }
    response = client.post("/api/experiment/run", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["experiment"] == "delayed_recall"
    assert "parameters" in data or "configuration" in data
    assert "input_sequence" in data
    assert "expected_answer" in data or "expected_output" in data
    assert "model_output" in data
    assert "metrics" in data
    assert "state_trace" in data
    assert "latency_ms" in data


def test_batch_experiment_endpoint():
    payload = {
        "experiment": "long_horizon_recall",
        "model_name": "educational_evolving_memory_toy",
        "configuration": {
            "sequence_length": 32,
            "num_items": 3
        },
        "n_trials": 5,
        "base_seed": 42
    }
    response = client.post("/api/experiment/batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["experiment"] == "long_horizon_recall"
    assert "accuracy" in data
    assert "batch_details" in data


def test_sweep_benchmark_endpoint():
    payload = {
        "experiment": "delayed_recall",
        "sweep_param": "delay",
        "param_values": [4, 16],
        "models": ["educational_evolving_memory_toy", "full_history_reference_baseline"],
        "base_config": {"inference_budget": 1},
        "n_trials_per_point": 3,
        "seed": 42
    }
    response = client.post("/api/benchmark/sweep", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) == 4  # 2 models * 2 param values
