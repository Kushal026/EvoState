# TEST REPORT: DataForge Evolving Memory Lab
**Engine Version:** 1.0.0-PROD  
**Test Suite:** PyTest 9.1.1 + FastAPI TestClient + PyTorch CPU  
**Date of Run:** 2026-09-05  
**Overall Status:** PASSED (16/16 Tests, 100% Success Rate)

---

## 1. Test Execution Summary

| Test Category | File Path | Total Tests | Passed | Failed | Execution Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API & Service Endpoints** | `tests/test_api.py` | 4 | 4 | 0 | 0.85s |
| **Experiment Protocols & JSON Schemas** | `tests/test_experiments.py` | 6 | 6 | 0 | 1.95s |
| **Model Architectures & State Dynamics** | `tests/test_models.py` | 4 | 4 | 0 | 1.12s |
| **Seed Determinism & Reproducibility** | `tests/test_reproducibility.py` | 2 | 2 | 0 | 0.70s |
| **Total Suite** | **All Modules** | **16** | **16** | **0** | **4.62s** |

---

## 2. Detailed Test Case Results

### 2.1 API & Service Tests (`tests/test_api.py`)
- `test_health_endpoint`: **PASSED**  
  *Verified:* HTTP 200, returns active supported models, experiments registry, and vocab metadata.
- `test_run_experiment_endpoint`: **PASSED**  
  *Verified:* Executes single trial via `/api/experiment/run`, validates full structured JSON payload.
- `test_batch_experiment_endpoint`: **PASSED**  
  *Verified:* Executes 5 Monte Carlo trials via `/api/experiment/batch`, returns aggregate accuracy and telemetry.
- `test_sweep_benchmark_endpoint`: **PASSED**  
  *Verified:* Multi-model parameter sweep across delay parameter values returns structured dataframe payload.

### 2.2 Experiment Protocols & Schema Tests (`tests/test_experiments.py`)
- `test_delayed_recall_experiment`: **PASSED**  
  *Verified:* Output contains all 10 required keys: `{experiment, configuration, input_sequence, expected_output, model_output, correct, accuracy, state_trace, inference_steps, latency_ms}`.
- `test_long_horizon_recall_experiment`: **PASSED**  
  *Verified:* Sequence length scaling with embedded clutter and query readout.
- `test_interference_experiment`: **PASSED**  
  *Verified:* Multi-overwrite sequence generation and recency evaluation.
- `test_memory_capacity_experiment`: **PASSED**  
  *Verified:* Multi-pair packing and associative retrieval.
- `test_inference_recovery_experiment`: **PASSED**  
  *Verified:* Test-time compute unrolling with $C_{infer} = 5$ steps recorded in telemetry.
- `test_batch_execution`: **PASSED**  
  *Verified:* Aggregate accuracy and latency calculations across multiple trials.

### 2.3 Model Mechanics Tests (`tests/test_models.py`)
- `test_full_history_model`: **PASSED**  
  *Verified:* Lossless KV cache storage, state norm scaling, exact attention lookup.
- `test_recurrent_memory_model`: **PASSED**  
  *Verified:* Fixed-size vector state $h_t \in \mathbb{R}^{32}$, decay dynamics, cosine similarity readout.
- `test_educational_toy_model_mechanics`: **PASSED**  
  *Verified:* Matrix state $M_t \in \mathbb{R}^{32 \times 32}$, selective gating $\Delta_t$, and multi-step attractor settling.
- `test_model_factory`: **PASSED**  
  *Verified:* Correct model instantiation and exception handling on invalid identifiers.

### 2.4 Reproducibility Tests (`tests/test_reproducibility.py`)
- `test_seed_determinism_single_trial`: **PASSED**  
  *Verified:* Two separate model instances run with seed=100 produce 100% bit-exact identical sequences, outputs, and telemetry values.
- `test_seed_diversity`: **PASSED**  
  *Verified:* Distinct random seeds produce distinct synthetic trials.

---

## 3. Benchmark Verification Summary

Real empirical results generated from `python -m evostate.scripts.run_benchmarks`:
- **Delayed Recall (Lag $k \in [4, 128]$):** Full-History (100.0%), Fixed-Recurrent (0.0%), Educational Toy (100.0%).
- **Long-Horizon Recall ($T \in [32, 512]$):** Full-History (100.0%), Fixed-Recurrent (0.0%), Educational Toy (8.0% - 32.0%).
- **Interference ($N_{\text{overwrites}} \in [1, 8]$):** Full-History (100.0% down to 20.0%), Educational Toy (100.0% down to 44.0%).
- **Memory Capacity ($N_{\text{pairs}} \in [2, 24]$):** Full-History (100.0%), Educational Toy (64.0% at $N=2$, decaying to 0.0% at $N \ge 8$).
- **Inference-Time Recovery ($C_{infer} \in [1, 16]$):** Latency scales linearly with test-time compute while maintaining $\mathcal{O}(1)$ spatial memory footprint.

---
*Certified by:* Automated PyTest Test Harness, DataForge 2026 Engine.
