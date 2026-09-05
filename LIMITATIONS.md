# Limitations, Non-Goals & Technical Boundaries

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Status:** Canonical Statement of Scientific & Pedagogical Constraints

---

## 🛑 1. Educational Toy Model vs. Production BDH

| Aspect | `educational_evolving_memory_toy` (Our Engine) | Production BDH (Sun et al., 2025) |
| :--- | :--- | :--- |
| **Model Size / Parameters** | Isolated $d=32$ fast-weight matrix ($~2\text{K}$ parameters). | Billions of parameters ($10\text{B}+$ parameters). |
| **Training Paradigm** | Algorithmic synthetic key-value bindings; zero pre-training corpus. | Massive autoregressive pre-training on natural language and code corpora. |
| **Recurrent Fast-Weight Rank** | Single 2D matrix layer ($32 \times 32$). | Deep stacked multi-layer multi-head associative layers. |
| **Inference Mechanism** | Normalized iterative matrix-vector attractor settling loop. | Deep continuous querying (BDH-CQ) over multi-layer representations. |
| **Scientific Claim** | Pedagogical demonstration of the mathematical properties of associative states. | Full-scale LLM benchmark performance surpassing standard Transformers at scale. |

> **Critical Guideline:** The educational toy model is **never** presented as production BDH. It exists exclusively to illuminate the mathematical mechanics of associative memory in real-time browser interactions.

---

## 🧠 2. Disclaimer Regarding Biological Neural Analogy

- **Synapse / Neuron Duality:** The paper by *Sun et al. (2025)* notes a structural analogy between neuron activations (vectors) and synaptic weights (matrices).
- **Non-Biological Reality:** Our computational models use idealized linear algebra (outer products, Euclidean normalization, cosine similarity). They do **not** simulate biological action potentials, neurotransmitters, spike-timing-dependent plasticity (STDP), or dendritic arborization.
- **Pedagogical Framing:** We explicitly state on all visualizations: *"Educational visualization of the model's computational state. (Illustrative Animation)"*.

---

## 📉 3. Bounded Capacity & Superposition Crosstalk

1. **Finite Associative Rank:**
   - For an associative matrix $M \in \mathbb{R}^{d \times d}$ with $d=32$, the theoretical maximum capacity before destructive superposition interference is bounded by the associative/Hopfield threshold $\alpha_c \approx 0.14 d \approx 4.5$ independent items.
   - Attempting to store $N > 6$ items in $d=32$ without expanding dimensionality causes unavoidable mathematical crosstalk.

2. **Inference-Time Scaling Boundaries:**
   - Test-time refinement ($C_{\text{infer}} \ge 1$) works by resolving ambiguous superpositions when the signal vector remains partially aligned with the true subspace.
   - **What Compute Cannot Do:** If an item has been completely overwritten ($\Delta_t \approx 0$ or decayed to $\|M\| \approx 0$), no amount of test-time compute can reconstruct erased information. Compute resolves ambiguity; it does not perform magic.

---

## 💻 4. Hardware & Client-Side Execution Constraints

1. **Client Simulation vs Server GPU:**
   - When running offline in the browser, `simulator.ts` executes in JavaScript/TypeScript single-threaded CPU loops. While extremely fast for $T \le 256$ and $d=32$, deep sweeps ($T > 1024$) are directed to precomputed benchmarks or the FastAPI backend to prevent client thread locking.
2. **Deterministic Pseudorandom Seeding:**
   - While Python PyTorch on CPU and WebAssembly/JS yield consistent qualitative trends, floating-point rounding differences at $10^{-7}$ precision can occasionally shift borderline cosine rankings across disparate hardware architectures.
