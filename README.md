# EvoState: Evolving Memory Lab
**DataForge 2026 Pathway Track — Research & Educational Computation Engine**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.2.0-0055FF.svg?logo=framer)](https://www.framer.com/motion/)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg?logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg?logo=pytorch)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/tests-28%20passed-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end interactive research laboratory and computational benchmark engine designed to dissect, measure, and visualize the inner dynamics of **Long-Horizon Evolving States** and **Inference-Time Compute Scaling**.

---

## 🔬 Central Falsifiable Scientific Claim

> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

---

## 📑 Core Documentation Index

| Document | Description |
| :--- | :--- |
| 📄 **[One-Page Concept Summary (PDF)](one_page_concept_summary.pdf)** | Executive scientific summary, architecture matrix, and empirical sweeps on a single page. |
| 📰 **[DataForge Blog Article (PDF)](blog.pdf)** | Comprehensive research publication covering the memory bottleneck, mechanics, empirical sweeps, and judge defense. |
| 🧪 **[Methodology & Protocols](METHODOLOGY.md)** | Mathematical formalisms, state update equations, attractor dynamics, and experimental sweep protocols. |
| 📚 **[Research Bibliography](BIBLIOGRAPHY.md)** | Primary literature citations (Kosowski et al. 2025, Engdahl et al. 2026, Gu & Dao 2023, Snell et al. 2024), DOIs, and BibTeX entries. |
| 🏷️ **[Evidence Classification Standard](EVIDENCE_CLASSIFICATION.md)** | Strict 4-tier taxonomy (`[PUBLISHED RESULT]`, `[INDEPENDENT RESULT]`, `[OUR EXPERIMENT]`, `[EDUCATIONAL SIMPLIFICATION]`). |
| ⚖️ **[Source & License Record](ATTRIBUTION_AND_LICENSES.md)** | Open source MIT license, dependency catalog, and dataset attribution. |
| 🤖 **[AI Assistance Disclosure](AI_DISCLOSURE.md)** | Transparent disclosure of AI pair-programming, test verification, and scientific oversight. |
| 📊 **[Code & Data Disclosure](DATA_AND_ASSET_DISCLOSURE.md)** | Synthetic benchmark ledger, 2,700-trial database, and publication assets. |
| 🔄 **[Reproducibility Guide](REPRODUCIBILITY.md)** | 1-command reproduction for all sweeps, 300 DPI figures, and automated test suites. |
| 🏛️ **[Architecture Diagrams](ARCHITECTURE_DIAGRAMS.md)** | Visual pipelines, KV-cache vs matrix state dataflows, and attractor settling. |
| 🛑 **[Limitations & Non-Goals](LIMITATIONS.md)** | Technical boundaries, educational toy surrogate vs production BDH, non-biological status. |
| ⏱️ **[60-Second Learner Test](SIXTY_SECOND_LEARNER_TEST.md)** | Guided 5-step rapid learning protocol with dynamic ground-truth evaluation. |
| 🛡️ **[Judge Defense Sheet](FINAL_SUBMISSION_AUDIT.md)** | Detailed compliance matrix and 10-point technical judge defense sheet. |

---

## 🛠️ Technology Stack & Dependencies

### Frontend Architecture
- **Framework:** Next.js 16.3.4 (App Router, Turbopack, 100% static prerendering).
- **UI & Runtime:** React 19.2.8, TypeScript 5.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), custom scientific dark palette (`#05070d`).
- **Animations & Visualizations:** Framer Motion 13.2.0, D3.js 7.9.0 (dynamic SVG energy landscapes & line charts).
- **Icons:** Lucide React 1.41.0.
- **Offline Reliability:** Instant client-side TypeScript execution engine (`simulator.ts`) with zero localhost dependencies.

### Backend & Experiment Engine
- **Language & Runtime:** Python 3.11+.
- **Tensor Operations:** PyTorch 2.0+, NumPy 1.24+, Pandas 2.0+.
- **API Framework:** FastAPI 0.115+, Pydantic v2 (strict validation schemas), Uvicorn.
- **Plotting & Reporting:** Matplotlib 3.8+ (300 DPI publication renderings), ReportLab (automated PDF generation).
- **Testing:** Pytest 9.1+ with asyncio plugins (28/28 unit and integration tests passing).

---

## 🚀 Scientific Models Implemented

1. **`full_history_reference_baseline`:** Lossless $\mathcal{O}(T \cdot d)$ Key-Value cache / Transformer attention upper bound.
2. **`fixed_size_recurrent_memory`:** $\mathcal{O}(d)$ fixed-size vector state linear/gated recurrence (RNN / GRU baseline).
3. **`educational_evolving_memory_toy`:** Explicitly an **educational toy surrogate** featuring $\mathcal{O}(d_v \times d_k)$ matrix associative fast weights, dynamic input-dependent gating ($\Delta_t$), and test-time attractor relaxation ($C_{\text{infer}} \ge 1$). *(Never presented as official foundation BDH weights)*.

---

## ⚡ Quick Start & Reproduction

### 1. Reproduce All Empirical Sweeps & 300 DPI Plots
```powershell
python scripts/reproduce_all.py --trials 30 --seed 42 --output data/precomputed
```
*Executes all 2,700 trials across 5 parameter dimensions, computes 95% confidence intervals, and renders 7 publication figures.*

### 2. Run Backend Test Suite (28 Tests)
```powershell
python -m pytest -v
```

### 3. Launch Next.js Research Web Application
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the laboratory.

### 4. (Optional) Launch FastAPI REST Service
```powershell
python -m uvicorn evostate.server.app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive OpenAPI docs: `http://127.0.0.1:8000/docs`.

---

## 🌐 Application Navigation & Interactive Modules

The web application requires no login, no API keys, and functions completely standalone via the client simulator:

- **`/` (Home):** 
  - **Live State Stream Visualizer:** Interactive token stream $\to$ 6x6 associative fast-weight matrix heatmap $\to$ recall readout with live SNR & memory footprint metrics.
  - **4-Stage Claim Pipeline:** Interactive walkthrough of `REMEMBER` $\to$ `STRETCH` $\to$ `ATTACK` $\to$ `RECOVER`.
  - **Break the Memory Testbench:** Real-time controls for Sequence Length ($16 \to 1024$), Interference ($0\% \to 100\%$), Inference Cycles ($1 \to 25$), Ground Truth vs Model Output comparison, and **"WHAT CHANGED?"** parametric delta telemetry.
  - **Challenge the Claim:** Interactive falsification engine evaluating dynamic claim status (`SUPPORTED UNDER THIS EXPERIMENT`, `CLAIM CHALLENGED`, or `INCONCLUSIVE`).
  - **Architectural Foundations & Research Matrix:** Core equations, 2,700-trial summary, and primary literature attribution.
- **`/lab` (Interactive Laboratory):** 
  - `01 — 60-Second Experiment`: Guided rapid judge audit.
  - `02 — Guided Discovery`: 7-stage structured educational pathway with concept checks.
  - `03 — Open Workbench`: Live multi-parameter studio with D3 coordinate heatmaps.
- **`/concept` (Theoretical Foundations):** Outer-product associative binding, Johnson-Lindenstrauss capacity limits, and iterative attractor settling.
- **`/bdh` (BDH: The Dragon Hatchling):** Academic literature breakdown of Kosowski et al. (2025, arXiv:2509.26507) and explicit educational boundary notices.
- **`/bdh-cq` (BDH-CQ: Latent Reasoning):** In-context learning with recurrent latent reasoning (Engdahl et al., 2026, arXiv:2608.09888), interactive D3 energy landscapes, and test-time Pareto cost curves.
- **`/compare` (Architecture Comparison Matrix):** 5 sequence modeling paradigms evaluated across 8 dimensions with strict evidence tier badges.
- **`/research` (Empirical Sweeps & Observatory):** 300 DPI plot viewer, 2,700-trial dataset downloads (`sweeps_master.csv`, `summary_statistics.csv`), and academic literature review.
- **`/about` (Judge Defense Sheet & Technical FAQ):** 10 expandable defense cards addressing claim validity, learner controls, metrics, execution transparency, limitations, and local reproduction commands.

---

## 🛡️ Input Validation & Execution Guardrails

The FastAPI service and client simulator enforce strict validation:
- `sequence_length`: $16 \le T \le 1024$
- `interference_strength`: $0.0 \le I \le 1.0$
- `memory_capacity`: $1 \le N_{\text{pairs}} \le 32$
- `inference_effort`: $1 \le C_{\text{infer}} \le 25$
- `model_type`: Must be one of `full_history_reference_baseline`, `fixed_size_recurrent_memory`, `educational_evolving_memory_toy`.

### Transparent Execution Policy
- Interactive runs execute with `execution_mode: "live"`.
- Large benchmark sweeps return verified data labeled `execution_mode: "precomputed"`.
- **Precomputed results are never disguised as live computation.**

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
    "sequence_length": 64,
    "interference_strength": 0.2,
    "inference_effort": 4,
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
    "inference_steps": 4
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
  "attribution": "EvoState 2026 Pathway Track (Live Client-Side Computational Execution)"
}
```

---

## ⚖️ License & Attribution
Released under the permissive [MIT License](LICENSE).  
*Research citations, licenses, and AI disclosures are cataloged in [`BIBLIOGRAPHY.md`](BIBLIOGRAPHY.md), [`ATTRIBUTION_AND_LICENSES.md`](ATTRIBUTION_AND_LICENSES.md), and [`AI_DISCLOSURE.md`](AI_DISCLOSURE.md).*
