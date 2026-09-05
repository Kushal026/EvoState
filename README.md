# EvoState: DataForge Evolving Memory Lab
**DataForge 2026 Pathway Track — Computational Experiment Engine**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen.svg)]()

A high-performance computational experiment engine designed to dissect, benchmark, and visualize the inner dynamics of **Long-Horizon Evolving States** and **Inference-Time Scaling**.

---

## 🔬 Central Falsifiable Claim

> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

---

## 🚀 Key Features & Architectural Scope

1. **Three Scientific Baseline Models:**
   - `full_history_reference_baseline`: Lossless $\mathcal{O}(T \cdot d)$ Key-Value cache / Transformer attention upper bound.
   - `fixed_size_recurrent_memory`: $\mathcal{O}(d)$ fixed-size vector state linear/gated recurrence.
   - `educational_evolving_memory_toy`: Explicitly an **educational toy model** featuring $\mathcal{O}(d_v \times d_k)$ matrix associative fast weights, dynamic selective gating ($\Delta_t$), and test-time attractor de-noising ($C_{infer} \ge 1$). *(Never presented as official BDH)*.
2. **Five Synthetic Memory Experiments:**
   - 🎯 **Delayed Recall:** Needle retention across temporal lag $k \in [4, 128]$.
   - 🌐 **Long-Horizon Recall:** Information retention across sequence length $T \in [32, 512]$ with distractor clutter.
   - ⚡ **Interference & Overwrites:** Destruction vs recency retention under repeated key overwrites.
   - 📦 **Memory Capacity:** Phase transition collapse as item count exceeds state rank $d$.
   - 🔄 **Inference-Time Recovery:** Test-time compute scaling ($C_{infer} \in [1, 16]$) to recover degraded memory in superposition.
3. **Canonical Structured JSON Output:** Every experiment returns standardized telemetry including state norms, SNRs, entropy, inference steps, and latency.
4. **Deterministic Seeding Standard:** Every trial is strictly reproducible across hardware platforms.
5. **FastAPI Web Service:** Endpoints for live experiment execution, Monte Carlo batches, and parameter sweeps.

---

## 📁 Repository Structure

```
EvoState/
├── evostate/
│   ├── core/
│   │   ├── metrics.py              # SNR, state entropy, and latency timers
│   │   ├── rng.py                  # Global and isolated deterministic seeding
│   │   └── vocab.py                # Synthetic token representations and parsing
│   ├── models/
│   │   ├── base.py                 # Abstract base model & telemetry dataclass
│   │   ├── full_history.py         # FullHistoryReferenceBaseline (KV Cache)
│   │   ├── recurrent_memory.py     # FixedSizeRecurrentMemory (Vector Recurrence)
│   │   └── educational_toy.py      # EducationalEvolvingMemoryToy (Matrix Associative)
│   ├── experiments/
│   │   ├── base.py                 # BaseExperiment execution harness
│   │   ├── delayed_recall.py       # Delayed Recall experiment
│   │   ├── long_horizon_recall.py  # Long-Horizon Recall with clutter
│   │   ├── interference.py         # Conflicting key updates experiment
│   │   ├── memory_capacity.py      # Subspace capacity stress test
│   │   └── inference_recovery.py   # Test-time compute recovery experiment
│   ├── server/
│   │   ├── app.py                  # FastAPI application setup
│   │   ├── routes.py               # REST API endpoints
│   │   └── schemas.py              # Pydantic request & response schemas
│   └── scripts/
│       ├── run_benchmarks.py       # Full benchmark execution suite
│       └── generate_sample_outputs.py # Script generating sample JSON outputs
├── results/
│   ├── benchmark_results.csv       # Actual empirical benchmark data
│   ├── benchmark_results.json      # Structured benchmark data
│   └── sample_outputs.json         # Real verified JSON experiment outputs
├── tests/
│   ├── test_api.py                 # FastAPI endpoint test suite
│   ├── test_experiments.py         # Experiment schema and execution tests
│   ├── test_models.py              # Model architecture unit tests
│   └── test_reproducibility.py     # Deterministic seeding tests
├── PROJECT_SPEC.md                 # System Architecture & Pedagogical Spec
├── RESEARCH_NOTES.md               # Mathematical Formalisms & Literature Review
├── METHODOLOGY.md                  # Experimental Methodology & Protocols
├── TEST_REPORT.md                  # Pytest Execution Report
└── README.md                       # Engine Documentation
```

---

## ⚡ Quickstart & Installation

### 1. Requirements
- Python 3.10+
- PyTorch, FastAPI, NumPy, Pandas, Uvicorn, Pytest

### 2. Run All Tests
```powershell
python -m pytest -v
```

### 3. Run the Full Empirical Benchmark Suite
```powershell
python -m evostate.scripts.run_benchmarks
```
Results are saved to `results/benchmark_results.json` and `results/benchmark_results.csv`.

### 4. Start the FastAPI Service
```powershell
python -m uvicorn evostate.server.app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs are accessible at: `http://127.0.0.1:8000/docs`.

---

## 📊 Canonical Experiment JSON Response

Every single-trial or batch execution returns the exact structured JSON schema required:

```json
{
  "experiment": "delayed_recall",
  "configuration": {
    "model_name": "educational_evolving_memory_toy",
    "state_dim": 1024,
    "seed": 42,
    "delay": 16,
    "use_distractors": false,
    "inference_budget": 3
  },
  "input_sequence": [
    "KEY_B:VAL_ALPHA",
    "<PAD>",
    "<PAD>",
    "QUERY:KEY_B"
  ],
  "expected_output": "VAL_ALPHA",
  "model_output": "VAL_ALPHA",
  "correct": true,
  "accuracy": 1.0,
  "state_trace": [
    {
      "step": 0,
      "token": "KEY_B:VAL_ALPHA",
      "state_norm": 0.75,
      "state_entropy": 3.209e-06,
      "delta": 0.75,
      "snr_db": 33.5
    },
    {
      "step": 1,
      "token": "<PAD>",
      "state_norm": 0.735,
      "state_entropy": 3.930e-06,
      "delta": 0.05,
      "snr_db": 33.5
    }
  ],
  "inference_steps": 3,
  "latency_ms": 1.25
}
```

---

## 🛡️ Scientific Integrity & BDH Boundary

> **Critical Notice:**
> The `EducationalEvolvingMemoryToy` model is an isolated educational simulator designed for transparent inspection of matrix associative fast weights and test-time settling. It is **NOT** production BDH/BDH-CQ software. All empirical results in this repository are generated via live execution of deterministic scripts and are fully reproducible.
