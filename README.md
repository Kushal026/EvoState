# EvoState: DataForge Evolving Memory Lab
**DataForge 2026 Pathway Track — Research & Educational Computation Engine**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/tests-28%20passed-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A high-performance computational research engine and interactive laboratory designed to dissect, benchmark, and visualize the inner dynamics of **Long-Horizon Evolving States** and **Inference-Time Scaling**.

---

## 🔬 Central Falsifiable Scientific Claim

> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

---

## 📑 Core Documentation Index

| Document | Description |
| :--- | :--- |
| 📄 **[One-Page Concept Summary (PDF)](one_page_concept_summary.pdf)** | Executive scientific summary, architecture matrix, and empirical sweeps on a single page. |
| 🧪 **[Methodology & Protocols](METHODOLOGY.md)** | Mathematical formalisms, state update equations, attractor dynamics, and empirical protocols. |
| 📚 **[Research Bibliography](BIBLIOGRAPHY.md)** | Primary citations (Sun et al. 2025, Gu & Dao 2023, Snell et al. 2024), DOIs, and BibTeX entries. |
| 🏷️ **[Evidence Classification Standard](EVIDENCE_CLASSIFICATION.md)** | Strict 4-tier taxonomy mapping every single claim in the project. |
| ⚖️ **[Source & License Record](ATTRIBUTION_AND_LICENSES.md)** | Open source MIT license, dependency catalog, and data attribution. |
| 🤖 **[AI Assistance Disclosure](AI_DISCLOSURE.md)** | Transparent disclosure of AI pair-programming, test verification, and oversight. |
| 📊 **[Code & Data Disclosure](DATA_AND_ASSET_DISCLOSURE.md)** | Synthetic benchmark ledger, 2,700-trial database, and publication assets. |
| 🔄 **[Reproducibility Guide](REPRODUCIBILITY.md)** | 1-command reproduction for all sweeps, 300 DPI figures, and test suites. |
| 🏛️ **[Architecture Diagrams](ARCHITECTURE_DIAGRAMS.md)** | Visual pipelines, KV-cache vs matrix state dataflows, and attractor settling. |
| 🛑 **[Limitations & Non-Goals](LIMITATIONS.md)** | Technical boundaries, educational toy surrogate vs production BDH, non-biological status. |
| ⏱️ **[60-Second Learner Test](SIXTY_SECOND_LEARNER_TEST.md)** | Guided 5-step rapid learning protocol with dynamic unmanipulated claim grading. |
| 🛡️ **[Judge Defense Sheet](PROJECT_SPEC.md)** | Detailed specification and technical FAQ addressing key evaluation inquiries. |

---

## 🚀 Scientific Models Implemented

1. **`full_history_reference_baseline`:** Lossless $\mathcal{O}(T \cdot d)$ Key-Value cache / Transformer attention upper bound.
2. **`fixed_size_recurrent_memory`:** $\mathcal{O}(d)$ fixed-size vector state linear/gated recurrence.
3. **`educational_evolving_memory_toy`:** Explicitly an **educational toy model** featuring $\mathcal{O}(d_v \times d_k)$ matrix associative fast weights, dynamic selective gating ($\Delta_t$), and test-time attractor de-noising ($C_{\text{infer}} \ge 1$). *(Never presented as official BDH)*.

---

## ⚡ Quick Start & Reproduction

### 1. Reproduce All Empirical Sweeps & Plots
```powershell
python scripts/reproduce_all.py
```
This single script executes all 2,700 trials, re-calculates summary statistics, renders 7 publication figures at 300 DPI, and synchronizes the frontend data directory.

### 2. Run Backend Unit & Integration Tests (28 Tests)
```powershell
python -m pytest -v
```

### 3. Launch FastAPI REST Service
```powershell
python -m uvicorn evostate.server.app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive docs: `http://127.0.0.1:8000/docs` | ReDoc: `http://127.0.0.1:8000/redoc`.

### 4. Launch Next.js Research Web Application
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to launch the research laboratory.

---

## 🌐 Application Navigation Sitemap

The Next.js application requires no login, no authentication, and works completely offline via native client simulation if the FastAPI server is not active:

- **`/` (Home):** Executive Laboratory, immediate state compression proof, and embedded 60-Second Rapid Run.
- **`/lab` (Interactive Laboratory):** 3 integrated modes:
  - `60-Second Experiment`: 5-step guided rapid run with unmanipulated claim verdict.
  - `Guided Discovery`: 7-stage structured pedagogy with concept checks.
  - `Open Workbench`: Live 4-control parameter studio ($L, M, p, K$) with D3 coordinate heatmaps.
- **`/concept` (Theory):** Mathematical formalisms, outer product binding, Johnson-Lindenstrauss limits, and 5-model $\times$ 8-dimension architecture comparison.
- **`/bdh` (BDH Standard):** Primary equations, neuron/synapse mathematical duality, linear-time proofs, and official evidence boundaries.
- **`/bdh-cq` (BDH-CQ Scaling):** 3-tier adaptation taxonomy, interactive D3 non-convex energy landscape attractor settling, and Pareto scaling frontier.
- **`/research` (Empirical Sweeps):** High-resolution 300 DPI plot viewer, CSV/JSON data downloads, and literature review.
- **`/about` (Judge Defense Sheet):** Complete specification, project objectives, and expandable FAQ cards for all critical judge defense questions.

---

## 🛡️ Input Validation & Safety Guardrails

The FastAPI service validates all inputs via Pydantic:
- `delay`: $1 \le k \le 512$
- `sequence_length`: $16 \le T \le 1024$
- `num_overwrites`: $1 \le N \le 15$
- `num_pairs`: $1 \le N \le 36$
- `inference_budget`: $1 \le C_{\text{infer}} \le 25$
- `model_type`: Must be one of `full_history_reference_baseline`, `fixed_size_recurrent_memory`, `educational_evolving_memory_toy`.

### Execution Policy
- Small experiments run live with `execution_mode: "live"`.
- Requests exceeding live computation thresholds or requesting benchmark sweeps return precomputed data with `execution_mode: "precomputed"`.
- **Precomputed results are never silently substituted for live computation.**

---

## 📜 Standardized Response Payload Schema

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

## ⚖️ License
Released under the permissive [MIT License](LICENSE).
