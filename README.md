# EvoState: DataForge Evolving Memory Lab
**DataForge 2026 Pathway Track — Research & Educational Computation Engine**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/tests-28%20passed-brightgreen.svg)]()

A high-performance computational experiment engine designed to dissect, benchmark, and visualize the inner dynamics of **Long-Horizon Evolving States** and **Inference-Time Scaling**.

---

## 🔬 Central Falsifiable Claim

> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

---

## 🚀 Scientific Models Implemented

1. **`full_history_reference_baseline`:** Lossless $\mathcal{O}(T \cdot d)$ Key-Value cache / Transformer attention upper bound.
2. **`fixed_size_recurrent_memory`:** $\mathcal{O}(d)$ fixed-size vector state linear/gated recurrence.
3. **`educational_evolving_memory_toy`:** Explicitly an **educational toy model** featuring $\mathcal{O}(d_v \times d_k)$ matrix associative fast weights, dynamic selective gating ($\Delta_t$), and test-time attractor de-noising ($C_{\text{infer}} \ge 1$). *(Never presented as official BDH)*.

---

## 🌐 FastAPI Service & API Reference

Start the service locally:
```powershell
python -m uvicorn evostate.server.app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs: `http://127.0.0.1:8000/docs` | ReDoc: `http://127.0.0.1:8000/redoc`.

### Endpoints Overview

| Method | Endpoint | Description | Execution Policy |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health status and supported model/experiment registry | Live |
| `POST` | `/experiment/recall` | Delayed recall ($k$-lag) & Long-horizon recall ($T$) | Live / Precomputed |
| `POST` | `/experiment/interference` | Key overwriting and destructive crosstalk | Live / Precomputed |
| `POST` | `/experiment/capacity` | Subspace capacity stress test ($N_{\text{pairs}}$ vs $d$) | Live / Precomputed |
| `POST` | `/experiment/scaling` | Inference-time compute scaling ($C_{\text{infer}} \ge 1$) | Live / Precomputed |
| `POST` | `/experiment/run` | Unified dispatcher for all 5 synthetic experiments | Live / Precomputed |
| `GET` | `/experiments/precomputed` | Catalog of precomputed sweeps & 300 DPI figures | Precomputed |
| `GET` | `/experiments/{experiment_id}` | Summary statistics & metadata for an experiment | Precomputed |

---

## 🛡️ Input Validation & Safety Guardrails

The FastAPI service validates all inputs via Pydantic:
- `delay`: $1 \le k \le 512$
- `sequence_length`: $16 \le T \le 1024$
- `num_overwrites`: $1 \le N \le 15$
- `num_pairs`: $1 \le N \le 36$
- `inference_budget`: $1 \le C_{\text{infer}} \le 25$
- `model_type`: Must be one of `full_history_reference_baseline`, `fixed_size_recurrent_memory`, `educational_evolving_memory_toy`.

### Execution Mode Classification
- Small/reasonable experiment parameters execute **live** with `execution_mode: "live"`.
- Requests with `force_precomputed: true` or exceeding live execution limits return verified precomputed benchmarks with `execution_mode: "precomputed"`.
- **Precomputed results are never silently substituted.**

---

## 📊 Standardized Response Payload Schema

```json
{
  "experiment": "delayed_recall",
  "execution_mode": "live",
  "model_type": "educational_evolving_memory_toy",
  "seed": 42,
  "latency_ms": 1.25,
  "parameters": {
    "delay": 16,
    "inference_budget": 2,
    "state_dim": 32
  },
  "input_sequence": [
    "KEY_B:VAL_ALPHA",
    "<PAD>",
    "<PAD>",
    "QUERY:KEY_B"
  ],
  "expected_answer": "VAL_ALPHA",
  "model_output": "VAL_ALPHA",
  "metrics": {
    "accuracy": 1.0,
    "error_rate": 0.0,
    "is_correct": true,
    "snr_db": 33.5,
    "final_state_norm": 0.75,
    "final_state_entropy": 3.209e-6,
    "inference_steps": 2
  },
  "state_trace": [
    {
      "step": 0,
      "token": "KEY_B:VAL_ALPHA",
      "state_norm": 0.75,
      "state_entropy": 3.209e-6,
      "delta": 0.75,
      "snr_db": 33.5
    }
  ],
  "limitations": [
    "Educational Toy Model: Isolated educational surrogate designed for pedagogical experimentation. Not official production BDH.",
    "Finite Associative Rank Limit: State matrix has capacity alpha_c approx 0.14*d; packing N > alpha_c*d causes superposition crosstalk."
  ],
  "attribution": "DataForge 2026 Pathway Track (Live Client-Side Computational Execution)"
}
```

---

## 🔗 CORS Configuration for Next.js

Cross-Origin Resource Sharing (CORS) is enabled for frontend integration:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3001`

---

### Run Next.js Research Web Application
```powershell
cd frontend
npm run dev
```
Navigate to `http://localhost:3000` to launch the research laboratory.

---

## 🎨 Next.js Research Application Architecture

Built with Next.js 15+, TypeScript, Tailwind CSS, D3.js, and Framer Motion:
- `/`: Interactive Home Laboratory & Immediate State Compression Proof
- `/lab`: Full EvoLab Workbench with live simulation, D3 telemetry, and parameter sweepers
- `/concept`: Theoretical Foundations of Long-Horizon Evolving States
- `/bdh`: BDH Architectural Standard & Boundaries (Official vs Educational)
- `/bdh-cq`: BDH Continuous Querying & Interactive Energy Landscape Settling
- `/research`: 2,700-trial Empirical Sweeps, 300 DPI Publication Plots, and Literature Synthesis
- `/about`: Project Specification, Technical Defense FAQ, and Judge Defense Sheet
