# Code, Data & Asset Disclosure

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Status:** Canonical Ledger of Artifacts, Data Sources, and Synthetic Assets

---

## 📊 1. Data Provenance & Synthetic Benchmarks

All datasets utilized in this project are 100% synthetically generated via explicit algorithmic protocols in `evostate/experiments/`. No private, proprietary, or web-scraped corpora are included.

### Synthetic Benchmark Task Ledger

| Benchmark Suite | Protocol Generator | Data Structure | Purpose | Size / Trials |
| :--- | :--- | :--- | :--- | :--- |
| **Delayed Recall** | `evostate.experiments.delayed_recall` | Key-Value token needles separated by $k \in [4, 128]$ padding tokens. | Test retention over silent horizons. | 750 trials (50 seeds $\times$ 5 configs $\times$ 3 models) |
| **Long-Horizon Recall** | `evostate.experiments.long_horizon` | $N=4$ needles distributed across length $T \in [32, 512]$ with distractor clutter. | Test retention under increasing noise accumulation. | 750 trials (50 seeds $\times$ 5 configs $\times$ 3 models) |
| **Interference Overwrite** | `evostate.experiments.interference` | Target key repeatedly overwritten $N \in [1, 8]$ times with distractor values. | Measure destructive interference and recency bias. | 750 trials (50 seeds $\times$ 5 configs $\times$ 3 models) |
| **Memory Capacity** | `evostate.experiments.memory_capacity` | $N_{\text{pairs}} \in [2, 24]$ distinct pairs packed into dimension $d=32$. | Measure associative matrix rank saturation threshold. | 250 trials (50 seeds $\times$ 5 configs) |
| **Inference Scaling** | `evostate.experiments.inference_recovery` | Distractor-cluttered memory state evaluated under budgets $C_{\text{infer}} \in [1, 16]$. | Measure test-time error recovery & SNR dynamics. | 250 trials (50 seeds $\times$ 5 configs) |

**Total Empirical Database:** 2,700 individual seeded trials logged in `data/precomputed/sweeps_master.csv`.

---

## 🖼️ 2. Publication-Quality Plots & Assets

All visual charts and plots in `data/precomputed/plots/` and `frontend/public/data/plots/` were generated directly from `data/precomputed/sweeps_master.csv` using `matplotlib` at 300 DPI:

1. `fig1_accuracy_vs_length.png`: Accuracy vs Sequence Length $T \in [32, 512]$ (Mean $\pm$ Std Error).
2. `fig2_accuracy_vs_capacity.png`: Retrieval Accuracy vs Number of Packed Pairs $N_{\text{pairs}}$ (Theoretical $\alpha_c$ threshold).
3. `fig3_error_vs_interference.png`: Error Rate vs Number of Destructive Overwrites.
4. `fig4_accuracy_vs_inference.png`: Accuracy vs Test-Time Inference Budget $C_{\text{infer}}$.
5. `fig5_latency_vs_inference.png`: Latency (ms) vs Inference Budget $C_{\text{infer}}$.
6. `fig6_accuracy_latency_tradeoff.png`: Pareto Frontier of Accuracy vs Wall-Clock Latency.
7. `fig7_composite_publication_panel.png`: 6-Panel Composite Figure for publication & defense review.

---

## 🛡️ 3. Client & Frontend Assets

- **Icons:** Modern SVG geometric iconography provided via `@lucide/react` (MIT/ISC).
- **Animations:** Dynamic spring micro-animations computed client-side via `framer-motion` and interactive canvas/SVG updates via `d3`.
- **Fonts:** System UI sans-serif stack + JetBrains Mono monospace font via Google Fonts (`next/font/google`).
- **No Heavy External CDNs:** All visual assets, scripts, and precomputed JSON manifests are bundled locally in `frontend/public/` for offline reliability.
