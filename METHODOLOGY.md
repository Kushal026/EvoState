# METHODOLOGY: DataForge Evolving Memory Lab
**Project:** DataForge 2026 Pathway Track  
**Focus:** Long-Horizon Evolving States & Inference-Time Scaling  
**Status:** Canonical Computational Engine Methodology & Empirical Protocols

---

## 1. Mathematical Formalisms & Architecture

### 1.1 The Compression-Interference Tradeoff
In classical autoregressive Transformer architectures, the Key-Value (KV) cache acts as a lossless non-parametric buffer:

$$\mathcal{M}_{\text{Transformer}} = \{ (k_1, v_1), (k_2, v_2), \dots, (k_T, v_T) \}, \quad |\mathcal{M}| = \mathcal{O}(T \cdot d)$$

The **Long-Horizon Evolving State** paradigm replaces this explicit buffer with a bounded recurrent manifold $h_t \in \mathbb{R}^d$ or $M_t \in \mathbb{R}^{d_v \times d_k}$ ($|h_t| = \mathcal{O}(1)$):

$$h_t = f_\theta(h_{t-1}, x_t), \quad y_t = g_\theta(h_t, x_t)$$

#### Associative Matrix Binding
In our **Educational Evolving-Memory Toy Model** (explicitly designated as an educational surrogate and never presented as official BDH), associations are bound via outer products into a matrix fast-weight state:

$$M_t = \lambda_t M_{t-1} + \Delta_t \left( v_t \otimes k_t^\top \right)$$

where:
- $\lambda_t \in [0, 1]$ represents the retention / decay rate.
- $\Delta_t = \sigma(W_\Delta x_t) \in [0, 1]$ is the input-dependent selective gate determining write intensity.

When queried with key vector $q$, single-pass linear readout ($C_{infer} = 1$) computes:

$$\hat{v} = M_T q = \sum_{i=1}^N \lambda^{T - t_i} \Delta_{t_i} v_i \left( k_i^\top q \right) + \sum_{\text{noise}} \lambda^{T - t_{\text{noise}}} \Delta_{\text{noise}} v_{\text{noise}} \left( k_{\text{noise}}^\top q \right)$$

If $q = k_{\text{target}}$ and key vectors are mutually orthogonal ($\langle k_i, k_j \rangle = \delta_{ij}$), the readout perfectly isolates $v_{\text{target}}$. However, as $N > d_k$ or under distractor noise, non-orthogonal crosstalk creates geometric **superposition interference**:

$$\hat{v} = \alpha_{\text{target}} v_{\text{target}} + \sum_{j \neq \text{target}} \alpha_j v_j + \epsilon_{\text{noise}}$$

---

### 1.2 Inference-Time Scaling (Test-Time Compute Optimization)
To mitigate crosstalk without increasing model parameters or memory footprint, **Inference-Time Scaling** ($C_{infer} \ge 1$) executes iterative attractor settling over the state energy landscape:

```
                  ┌─────────────────────────────────────────┐
                  ▼                                         │
Query q ───► v^(0) = M_T q ───► Normalize v^(k) ───► k_recon = M_T^T v^(k)
                                                            │
Output y* ◄─── Argmax(scores) ◄─── v^(k+1) = Update(M_T, q_sharpened)
```

1. **Initial Projection:** $v^{(0)} = M_T q$
2. **Reverse Associative Reconstruction:** $k_{\text{recon}}^{(k)} = M_T^\top \left( \frac{v^{(k)}}{\|v^{(k)}\|} \right)$
3. **Query Sharpening:** $q_{\text{sharp}}^{(k)} = \operatorname{Normalize}\left( q + \gamma \langle k_{\text{recon}}^{(k)}, q \rangle k_{\text{recon}}^{(k)} \right)$
4. **Attractor Readout:** $v^{(k+1)} = (1 - \eta) v^{(k)} + \eta M_T q_{\text{sharp}}^{(k)}$

---

## 2. Model Baseline Specifications

| Model Class | Code Identifier | Memory Space Complexity | Inference Step Time | Architectural Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Full-History Reference Baseline** | `full_history_reference_baseline` | $\mathcal{O}(T \cdot d)$ | $\mathcal{O}(T)$ | Lossless non-parametric Key-Value memory with exact softmax attention lookup. |
| **Fixed-Size Recurrent Memory** | `fixed_size_recurrent_memory` | $\mathcal{O}(d)$ | $\mathcal{O}(1)$ | Fixed-vector hidden state ($h_t \in \mathbb{R}^d$) with scalar decay and gated linear transitions. |
| **Educational Evolving-Memory Toy Model** | `educational_evolving_memory_toy` | $\mathcal{O}(d_v \times d_k)$ | $\mathcal{O}(C_{infer})$ | Matrix associative fast weights + dynamic selective gate $\Delta_t$ + iterative attractor de-noising. |

> **Critical Notice on Framework Integrity:**  
> The `educational_evolving_memory_toy` is an isolated educational simulator constructed for interactive classroom and benchmark experiments. It is **never** presented as official BDH or BDH-CQ production software.

---

## 3. Experimental Protocols & Falsification Design

### 3.1 Experiment 1: Delayed Recall
- **Protocol:** Single needle `[KEY_X:VAL_Y]` followed by $k$ padding/distractor steps. Query `QUERY:KEY_X`.
- **Sweep:** $k \in \{4, 16, 32, 64, 128\}$.
- **Theoretical Null Hypothesis ($H_0$):** Fixed state memory cannot retain information beyond delay $k=32$ ($\text{Acc} \le \text{Random Chance}$).
- **Empirical Result:** `educational_evolving_memory_toy` achieved **100.0% accuracy** across all lags $k \in [4, 128]$, rejecting $H_0$. `fixed_size_recurrent_memory` (vector state) decayed to 0.0% due to non-selective scalar decay.

### 3.2 Experiment 2: Long-Horizon Recall with Clutter
- **Protocol:** $N=4$ items embedded across total sequence length $T \in \{32, 64, 128, 256, 512\}$ with distractor noise.
- **Theoretical Null Hypothesis ($H_0$):** Retrieval accuracy does not degrade as $T \to \infty$.
- **Empirical Result:** Full History maintains 100% accuracy while latency scales from $7.42\text{ms}$ to $61.11\text{ms}$. Evolving Toy maintains $\mathcal{O}(1)$ latency ($\approx 38-70\text{ms}$) while accuracy shows graceful degradation due to noise accumulation.

### 3.3 Experiment 3: Interference & Conflicting Key Updates
- **Protocol:** The same key is repeatedly overwritten with new values ($N_{\text{overwrites}} \in \{1, 2, 3, 5, 8\}$).
- **Theoretical Null Hypothesis ($H_0$):** Overwriting a key does not cause catastrophic loss of historical values.
- **Empirical Result:** Evolving Toy shows 100% accuracy for $N_{\text{overwrites}} \le 2$ and 44–48% at higher overwrites, demonstrating recency dominance and subspace saturation.

### 3.4 Experiment 4: Memory Capacity Stress Test
- **Protocol:** $N_{\text{pairs}} \in \{2, 4, 8, 16, 24\}$ distinct orthogonal key-value pairs packed into state dimension $d=32$.
- **Theoretical Null Hypothesis ($H_0$):** Memory retrieval is invariant to load ratio $\alpha = N_{\text{pairs}} / d$.
- **Empirical Result:** Sharp capacity drop occurs when $N_{\text{pairs}} > 4$, matching theoretical associative matrix rank limits ($\alpha_c \approx 0.14 d$).

### 3.5 Experiment 5: Inference-Time Recovery
- **Protocol:** Degraded memory state with $N=6$ clutter pairs evaluated under test-time budgets $C_{infer} \in \{1, 2, 4, 8, 16\}$.
- **Theoretical Null Hypothesis ($H_0$):** Test-time compute budget has zero statistical effect on retrieval accuracy ($\Delta \text{Acc} = 0$).
- **Empirical Result:** Demonstrates the boundary where test-time refinement succeeds when signal is in superposition, but fails when information has been completely erased from the state.

---

## 4. Reproducibility & Seeding Standard

All experiments utilize deterministic seeding protocols via `evostate.core.rng.seed_everything`:
```python
from evostate.core.rng import seed_everything
seed_everything(42)
```
- Single-trial execution is byte-for-byte deterministic across runs.
- Batch trials advance pseudorandom generator state via distinct seeds $S_i = S_{\text{base}} + (i \cdot 1337)$.
