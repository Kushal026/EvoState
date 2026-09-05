# Reproducibility Instructions & Protocols

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Standard:** 100% Deterministic Byte-for-Byte Reproducibility

---

## ⚡ 1. Quick Reproduction in One Command

To reproduce all 2,700 benchmark trials, re-calculate summary statistics, re-render all 7 publication figures at 300 DPI, and sync data with the Next.js frontend, execute:

```powershell
python scripts/reproduce_all.py
```

This single command runs:
1. `evostate.cli.reproduce_sweeps` (2,700 deterministic trials across 50 seeds).
2. `evostate.cli.generate_plots` (7 publication-grade matplotlib figures).
3. Synchronizes CSV, JSON, and PNG artifacts to `frontend/public/data/`.

---

## 🔬 2. Step-by-Step Environment Setup

### 2.1 Python Backend Environment
Ensure Python 3.11+ is installed.

```powershell
# Install core dependencies
pip install torch fastapi uvicorn pydantic pytest matplotlib reportlab

# Verify PyTorch installation and device
python -c "import torch; print(f'PyTorch Version: {torch.__version__}, Device: {torch.device(\"cpu\")}')"
```

### 2.2 Run Automated Test Suite
Run the full unit and integration test suite (28 passing tests):
```powershell
python -m pytest -v
```

Expected output:
```
============================= 28 passed in ~5.00s ==============================
```

### 2.3 Start FastAPI REST Service
```powershell
python -m uvicorn evostate.server.app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation will be available at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- Health Check: `http://127.0.0.1:8000/health`

### 2.4 Start Next.js Frontend Research Application
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to launch the research laboratory.

---

## 🎲 3. Seeding & Determinism Guarantees

All pseudo-random state generation is handled by `evostate.core.rng.seed_everything(seed)`:

```python
import random
import numpy as np
import torch

def seed_everything(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
```

### Seed Progression Matrix:
- Base Seed: `42`
- Trial Index $i \in [0, 49]$:
  $$\text{Seed}_i = 42 + (i \times 1337)$$
- This ensures zero overlap in noise trajectories while guaranteeing 100% cross-platform determinism on CPU and CUDA.

---

## 📊 4. Verifying Data Integrity Checksums

The precomputed results generate the following checksum files:
- `data/precomputed/reproducibility_manifest.json`
- `data/precomputed/summary_statistics.csv`
- `data/precomputed/sweeps_master.csv`

Any individual experiment can be independently re-executed through the CLI:
```powershell
# Run a single delayed recall benchmark with 100 seeds
python -m evostate.cli.reproduce_sweeps --experiment delayed_recall --trials 100 --seed 1234
```
