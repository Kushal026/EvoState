# Code, Data & Asset Disclosure

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Status:** Canonical Ledger of Artifacts, Data Sources, and Synthetic Assets

---

## 📊 1. Data Provenance & Synthetic Benchmarks

All datasets utilized in this project are 100% synthetically generated via explicit algorithmic protocols in `evostate/experiments/`. No private, proprietary, or web-scraped corpora are included.

### Synthetic Benchmark Task Ledger

| Benchmark Suite | Protocol Generator | Data Structure | Purpose | Size / Trials |
| :--- | :--- | :--- | :--- | :--- |
| **Sequence Length Horizon** | `evostate.experiments.long_horizon` | $N=4$ needles distributed across horizon $T \in [16, 1024]$ with distractor clutter. | Test retention across expanding horizons ($T \in [16..1024]$). | 630 trials (30 seeds $\times$ 7 points $\times$ 3 models) |
| **Memory Capacity Load** | `evostate.experiments.memory_capacity` | $N_{\text{pairs}} \in [1, 32]$ distinct associative pairs packed into dimension $d=32$. | Measure associative matrix rank saturation limit. | 720 trials (30 seeds $\times$ 8 points $\times$ 3 models) |
| **Interference Overwrite** | `evostate.experiments.interference` | Target key repeatedly overwritten $N \in [1, 10]$ times with conflicting values. | Measure destructive overwrite interference and recency dominance. | 630 trials (30 seeds $\times$ 7 points $\times$ 3 models) |
| **Inference Effort Scaling** | `evostate.experiments.inference_recovery` | Distractor-cluttered memory state evaluated under budgets $C_{\text{infer}} \in [1, 16]$. | Measure test-time error recovery & latency trade-offs. | 720 trials (30 seeds $\times$ 8 points $\times$ 3 models) |

**Total Empirical Database:** Exactly 2,700 individual seeded trials logged in `data/precomputed/sweeps_master.csv`.

---

## 🖼️ 2. Publication-Quality Plots & Assets

All visual charts and plots in `data/precomputed/plots/` and `frontend/public/plots/` were generated directly from `data/precomputed/sweeps_master.csv` using `matplotlib` at 300 DPI:

1. `plot1_accuracy_vs_sequence_length.png`: Accuracy vs Sequence Length $T \in [16, 1024]$ (Mean $\pm$ 95% Confidence Interval).
2. `plot2_accuracy_vs_memory_capacity.png`: Retrieval Accuracy vs Number of Stored Pairs $N_{\text{pairs}} \in [1, 32]$.
3. `plot3_error_rate_vs_interference.png`: Error Rate vs Number of Destructive Key Overwrites $N_{\text{overwrites}} \in [1, 10]$.
4. `plot4_accuracy_vs_inference_effort.png`: Accuracy vs Test-Time Inference Budget $C_{\text{infer}} \in [1, 16]$.
5. `plot5_latency_vs_inference_effort.png`: Latency (ms) vs Inference Budget $C_{\text{infer}} \in [1, 16]$.
6. `plot6_accuracy_latency_tradeoff.png`: Pareto Frontier of Accuracy vs Wall-Clock Latency.
7. `plot_all_panels.png`: 6-Panel Composite Publication Figure.

---

## 🛡️ 3. Client & Frontend Assets

- **Icons:** Modern SVG geometric iconography provided via `@lucide/react` (MIT/ISC).
- **Animations:** Dynamic spring micro-animations computed client-side via `framer-motion` and interactive canvas/SVG updates via `d3`.
- **Fonts:** System UI sans-serif stack + JetBrains Mono monospace font via Google Fonts (`next/font/google`).
- **No Heavy External CDNs:** All visual assets, scripts, and precomputed JSON manifests are bundled locally in `frontend/public/` for offline reliability.
