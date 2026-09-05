# TEST REPORT: DataForge Evolving Memory Lab
**Engine Version:** 1.0.0-PROD  
**Test Suite:** PyTest 9.1.1 + FastAPI TestClient + PyTorch CPU  
**Date of Run:** 2026-09-06  
**Overall Status:** PASSED (28/28 Tests, 100% Success Rate)

---

## 1. Test Execution Summary

| Test Category | File Path | Total Tests | Passed | Failed | Execution Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FastAPI Core Endpoints & Guardrails** | `tests/test_fastapi_service.py` | 12 | 12 | 0 | 1.85s |
| **Legacy & Batch/Sweep API Routes** | `tests/test_api.py` | 4 | 4 | 0 | 0.85s |
| **Experiment Protocols & JSON Schemas** | `tests/test_experiments.py` | 6 | 6 | 0 | 1.95s |
| **Model Architectures & State Dynamics** | `tests/test_models.py` | 4 | 4 | 0 | 1.12s |
| **Seed Determinism & Reproducibility** | `tests/test_reproducibility.py` | 2 | 2 | 0 | 0.70s |
| **Total Suite** | **All Modules** | **28** | **28** | **0** | **5.14s** |

---

## 2. Detailed Test Case Breakdown

### 2.1 FastAPI Service & Endpoints (`tests/test_fastapi_service.py`)
- `test_health_check_endpoints`: **PASSED** (Validated `/health` and `/api/health` return status, registered models, and experiments).
- `test_openapi_schema_endpoint`: **PASSED** (Validated `/openapi.json` lists all 8 registered endpoints).
- `test_post_recall_delayed_live`: **PASSED** (Live execution of delayed needle retrieval, validated telemetry, expected answer, and limitations).
- `test_post_recall_long_horizon_live`: **PASSED** (Live execution of long-horizon sequence modeling on reference baseline).
- `test_post_recall_precomputed_mode`: **PASSED** (Verified `execution_mode: "precomputed"` when `force_precomputed=True`).
- `test_post_interference_live`: **PASSED** (Live evaluation of key overwriting and recency tracking).
- `test_post_capacity_live`: **PASSED** (Live multi-pair associative load evaluation).
- `test_post_scaling_live`: **PASSED** (Live test-time attractor settling with $C_{\text{infer}} = 5$).
- `test_post_generic_run`: **PASSED** (Unified `/experiment/run` dispatcher for arbitrary protocols).
- `test_get_precomputed_catalog`: **PASSED** (Verified `/experiments/precomputed` returns catalog items and generated figures).
- `test_get_experiment_details`: **PASSED** (Verified `/experiments/{id}` returns summary stats; returns 404 for invalid IDs).
- `test_validation_rejects_unreasonable_parameters`: **PASSED** (Guardrails reject $T > 1024$, delay $> 512$, overwrites $> 15$, budgets $> 25$, and invalid models with HTTP 422).

### 2.2 Legacy & Multi-Trial API Routes (`tests/test_api.py`)
- `test_health_endpoint`: **PASSED**
- `test_run_experiment_endpoint`: **PASSED**
- `test_batch_experiment_endpoint`: **PASSED**
- `test_sweep_benchmark_endpoint`: **PASSED**

### 2.3 Experiment Protocols & Schema Tests (`tests/test_experiments.py`)
- `test_delayed_recall_experiment`: **PASSED**
- `test_long_horizon_recall_experiment`: **PASSED**
- `test_interference_experiment`: **PASSED**
- `test_memory_capacity_experiment`: **PASSED**
- `test_inference_recovery_experiment`: **PASSED**
- `test_batch_execution`: **PASSED**

### 2.4 Model Mechanics Tests (`tests/test_models.py`)
- `test_full_history_model`: **PASSED**
- `test_recurrent_memory_model`: **PASSED**
- `test_educational_toy_model_mechanics`: **PASSED**
- `test_model_factory`: **PASSED**

### 2.5 Reproducibility Tests (`tests/test_reproducibility.py`)
- `test_seed_determinism_single_trial`: **PASSED**
- `test_seed_diversity`: **PASSED**

---

## 3. OpenAPI Documentation Verification

- OpenAPI 3.1.0 schema generated at `/openapi.json`
- Interactive Swagger UI accessible at `/docs`
- Interactive ReDoc documentation accessible at `/redoc`

---
*Certified by:* Automated PyTest Test Harness, DataForge 2026 Engine.
