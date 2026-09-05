# Source & License Record

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Primary License:** MIT License (see [LICENSE](LICENSE))

---

## 📄 1. Project Code & Scientific Assets

All original software in this repository—including the Python computational engine (`evostate/`), FastAPI REST service (`evostate/server/`), Next.js research laboratory (`frontend/`), precomputed datasets (`data/precomputed/`), and automated test suites (`tests/`)—is released under the permissive [MIT License](LICENSE).

```
Copyright (c) 2026 DataForge Pathway Track Authors
```

---

## 📦 2. Third-Party Dependencies & Licenses

| Dependency / Package | Ecosystem | Version Target | License | Usage in EvoState |
| :--- | :--- | :--- | :--- | :--- |
| **Python** | Runtime | 3.11+ | PSF License | Core execution runtime |
| **PyTorch** | Backend | 2.0+ | Modified BSD | Matrix operations & tensor experiments |
| **FastAPI** | Backend | 0.115+ | MIT License | High-performance REST service & validation |
| **Pydantic** | Backend | 2.0+ | MIT License | Request/response schema validation |
| **Uvicorn** | Backend | 0.30+ | BSD-3-Clause | ASGI server implementation |
| **Pytest** | Backend | 8.0+ | MIT License | Deterministic unit & integration testing |
| **ReportLab** | PDF Engine | 5.0+ | BSD License | One-page scientific summary PDF compilation |
| **Next.js** | Frontend | 15+ / 16.3+ | MIT License | App Router & React server/static rendering |
| **React** | Frontend | 19+ | MIT License | User interface component architecture |
| **TypeScript** | Frontend | 5.0+ | Apache-2.0 | Static typing and type safety |
| **Tailwind CSS** | Frontend | 4.0+ | MIT License | Scientific dark-theme utility styling |
| **D3.js** | Frontend | 7.0+ | ISC License | High-fidelity interactive state visualizers |
| **Framer Motion** | Frontend | 12.0+ | MIT License | Micro-animations and stage transitions |
| **Lucide React** | Frontend | 1.0+ | ISC License | Scientific UI iconography |

---

## 📊 3. Data & Benchmark Attribution

- **Synthetic Algorithmic Benchmarks:** Created natively by `evostate/experiments/` utilizing deterministic pseudo-random seeds. No copyrighted private or commercial datasets were ingested or redistributed.
- **Precomputed Sweeps:** All 2,700 trials in `data/precomputed/sweeps_master.csv` are reproducible via `python -m evostate.cli.reproduce_sweeps --trials 50`.
- **Primary Scientific Citations:**
  - BDH equations and architectural concepts are attributed to *Sun et al. (2025)*.
  - Selective state space gating concepts are attributed to *Gu & Dao (2023)*.
  - Test-time compute scaling formulation is attributed to *Snell et al. (2024)*.

---

## 🛡️ 4. Warranty Disclaimer

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.
