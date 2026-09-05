# PROJECT SPECIFICATION: DataForge Evolving Memory Lab
**Track:** DataForge 2026 Pathway Track  
**Primary Concept:** Long-Horizon Evolving State  
**Secondary Concept:** Inference-Time Scaling  
**Document Classification:** Canonical System Architecture & Specification Document  
**Version:** 1.0.0-PROD-SPEC

---

## 1. Executive Summary & Central Falsifiable Claim

### 1.1 Project Vision
**DataForge: Evolving Memory Lab** is an interactive, browser-based computational laboratory designed to dissect, benchmark, and visualize the inner mechanics of **Long-Horizon Evolving States** and **Inference-Time Scaling**. It provides machine learning practitioners, researchers, and students with transparent, verifiable experimentation on state space memory dynamics, information superposition, destructive interference, and the limits of test-time recovery.

### 1.2 Central Falsifiable Claim
> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

---

## 2. Theoretical Foundations & Technical Definitions

### 2.1 Technical Definition: Long-Horizon Evolving State
A **Long-Horizon Evolving State** is an architecture in which sequence history is compressed into a constant-sized latent state $h_t \in \mathbb{R}^d$ ($|h_t| = \mathcal{O}(1)$ independent of sequence length $T$) via a deterministic or input-dependent state transition operator:

$$h_t = f_\theta(h_{t-1}, x_t)$$
$$y_t = g_\theta(h_t, x_t)$$

Unlike standard Transformer Key-Value (KV) caching where space complexity grows as $\mathcal{O}(T \cdot d)$ and per-step computation grows as $\mathcal{O}(T)$, an evolving state processes each token in $\mathcal{O}(1)$ step time and maintains an $\mathcal{O}(1)$ spatial memory footprint.

### 2.2 Technical Definition: Inference-Time Scaling
**Inference-Time Scaling** (Test-Time Compute Allocation) is the deliberate application of additional computational resources at inference time—such as iterative recurrent unrolling, multi-candidate search, energy minimization, or test-time state optimization—to refine, disambiguate, or de-noise the output generated from a compressed state representation $h_T$ without changing fixed model parameters $\theta$:

$$y^* = \operatorname{SearchOpt}\left(g_\theta(h_T, q), C_{infer}\right)$$

where $C_{infer} \in \mathbb{N}_{\ge 1}$ represents the allocated test-time compute budget.

### 2.3 Exact Relationship Between the Concepts
1. **The Superposition Bottleneck:** As sequence length $T$ and the number of stored associations $N$ grow beyond state dimension $d$, information is forced into non-orthogonal geometric superposition in $h_T$, producing cross-talk noise during associative readout.
2. **Complementary Trade-Off:** The evolving state provides high throughput and low memory footprint during the encoding phase. Inference-time compute then selectively spends computational cycles during the decoding phase to de-noise the compressed state, creating a Pareto-optimal compute-memory frontier.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        THE COMPUTE-MEMORY CONTINUUM                       │
├──────────────────────────┬───────────────────────┬────────────────────────┤
│ Standard Transformers    │ Naive Evolving State  │ Evolving State + TTT   │
│ (Full KV Cache)          │ (Greedy Readout)      │ (Inference Scaling)    │
├──────────────────────────┼───────────────────────┼────────────────────────┤
│ Memory: O(T)             │ Memory: O(1)          │ Memory: O(1)           │
│ Inference Compute: O(T)  │ Inference Compute: O(1│ Inference Compute: C   │
│ Perfect Retrieval        │ Degrades with T & N   │ Recovers signal if not │
│ (No Superposition Loss)  │ (Noise Superposition) │ completely collapsed   │
└──────────────────────────┴───────────────────────┴────────────────────────┘
```

---

## 3. Pedagogical Architecture & Learner Profile

### 3.1 Intended Learner
- Applied AI/ML engineers, sequence modeling researchers, and graduate/undergraduate computer science students.
- Practitioners transitioning from quadratic Transformers to linear-time architectures (Mamba, SSMs, RWKV, TTT, BDH-CQ).

### 3.2 Prerequisites
- Foundational linear algebra (eigenvalues, dot products, vector projections, matrix rank).
- Basic sequence modeling knowledge (hidden Markov states, RNNs, Self-Attention mechanisms).
- Basic understanding of computational complexity ($\mathcal{O}(1)$ vs $\mathcal{O}(T)$).

### 3.3 Core Learning Objectives
By completing the laboratory experiments, learners will be able to:
1. **Explain and Prove State Compression:** Demonstrate mathematically and experimentally how linear recurrences and SSMs store associations in $\mathcal{O}(1)$ space.
2. **Diagnose Memory Breakdown:** Quantify the exact failure modes of evolving states under sequence length scaling ($T$), noise insertion, and conflicting key overwrites.
3. **Analyze Inference-Time Recovery Boundaries:** Measure when test-time search and iterative state refinement successfully recover degraded information versus when state collapse is mathematically irreversible.
4. **Distinguish Frontier BDH/BDH-CQ from Educational Surrogates:** Articulate the precise architectural distinctions between simplified client-side educational models and multi-billion-parameter continuous-querying production systems.

### 3.4 Learner Journey (Four-Phase Structured Progression)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     PHASE 1     │     │     PHASE 2     │     │     PHASE 3     │     │     PHASE 4     │
│   DISCOVERY     │────►│  STRESS-TEST    │────►│  INTERVENTION   │────►│  BENCHMARK &    │
│  State Dynamics │     │  Interference   │     │  Test-Time Rec. │     │  BDH Defense    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Phase 1: Discovery & Single-Needle State Tracking**
   - Learner observes step-by-step vector state evolution $h_t$ as tokens arrive.
   - Live visualizer displays state norm, eigenvalue rotation, and associative readout fidelity.
2. **Phase 2: Stress-Testing & Breakdown Exploration**
   - Learner increases sequence length $T$ and injects distractor noise and conflicting key updates.
   - Learner observes the onset of superposition cross-talk and catastrophic forgetting.
3. **Phase 3: Test-Time Compute Interventions**
   - Learner activates inference-time scaling (iterative recurrent unrolling, candidate scoring, attractor refinement).
   - Learner discovers the "Recovery Delta" ($\Delta Acc$) and maps the Pareto frontier.
4. **Phase 4: Frontier Benchmarking & Judge Defense**
   - Learner compares live toy performance against precomputed frontier benchmarks (Mamba-2, TTT-Linear, Full Attention).
   - Learner audits the BDH-CQ connection and reviews the Judge Defense Sheet.

---

## 4. System Variables & Mathematical Interfaces

### 4.1 Controllable Variables (Independent Variables)
| Variable Symbol | Name | Domain / Range | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| $T$ | Sequence Length / Horizon | $[16, 2048]$ tokens | $128$ | Total tokens processed before query |
| $d$ | State Dimensionality | $\{16, 32, 64, 128\}$ | $32$ | Dimension of state vector $h_t$ or matrix $H_t$ |
| $\lambda$ | State Decay / Retention Factor | $[0.0, 1.0]$ | $0.98$ | Multiplicative decay applied per time-step |
| $N_{keys}$ | Key-Value Associative Load | $[1, 64]$ pairs | $4$ | Number of distinct key-value pairs in stream |
| $N_{conflicts}$ | Conflicting Overwrite Rate | $[0, 10]$ updates | $0$ | Number of times a key's value is re-assigned |
| $\sigma_{noise}$ | Distractor Noise Magnitude | $[0.0, 2.0]$ | $0.1$ | Variance of Gaussian noise / distractor embedding |
| $C_{infer}$ | Inference Compute Budget | $[1, 25]$ cycles | $1$ | Number of test-time refinement or search steps |
| $\alpha_{select}$ | State Selectivity Threshold | $[0.0, 1.0]$ | $0.5$ | Gating threshold for selective state updates |

### 4.2 Observable Variables (Dependent Metrics)
| Metric Symbol | Metric Name | Definition / Formulation | Pedagogical Target |
| :--- | :--- | :--- | :--- |
| $\text{Acc}_{\text{recall}}$ | Exact Match Retrieval Accuracy | $\mathbb{I}(\hat{y} = y_{\text{true}})$ across evaluation trials | Baseline vs degraded performance |
| $\text{SNR}$ | Signal-to-Noise Ratio (Readout) | $\frac{|\langle h_T, v_{\text{target}} \rangle|}{\sqrt{\sum_{j \neq \text{target}} \langle h_T, v_j \rangle^2 + \epsilon}}$ | Geometric superposition metric |
| $\|h_t\|_2$ | State Energy / Norm | $\sqrt{\sum_{i=1}^d h_{t, i}^2}$ | Stability and numerical explosion/decay |
| $\Delta \text{Acc}(C)$ | Inference Recovery Delta | $\text{Acc}(C_{infer} = K) - \text{Acc}(C_{infer} = 1)$ | Quantitative gain from test-time compute |
| $\mathcal{H}_{\text{state}}$ | State Entropy / Dispersion | $-\sum_i p_i \log p_i$ on normalized singular values | Measure of subspace collapse vs utilization |

### 4.3 Ground Truth vs Model Outputs
- **Ground Truth ($y_{\text{true}}$):** Deterministically known target token or value vector injected at a specific index $t_{\text{insert}}$ in the synthetic data stream.
- **Model Output ($\hat{y}$):** Predicted token probability distribution over the vocabulary $\mathcal{V}$ and raw continuous projection vector $\hat{v} = W_{\text{out}} h_T$.

---

## 5. The Five Core Synthetic Experiments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXPERIMENT SUITE OVERVIEW                         │
├───────────────────┬───────────────────────────────┬─────────────────────────┤
│ Experiment ID     │ Test Mechanism                │ Falsification Objective │
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ EXP-1: Delayed    │ Needle retrieval over lag k   │ Reject zero-memory H0   │
│ EXP-2: Long-Horiz │ Clutter noise scaling with T  │ Prove SNR decay with T  │
│ EXP-3: Interfere  │ Key overwrite / recency bias  │ Prove destructive loss  │
│ EXP-4: Capacity   │ Load scaling beyond rank d    │ Find rank capacity wall │
│ EXP-5: Test-Time  │ Recurrent probe / search step │ Prove recovery bounds   │
└───────────────────┴───────────────────────────────┴─────────────────────────┘
```

### 5.1 Experiment 1: Delayed Recall (Associative Needle Retrieval)
- **Protocol:** Insert needle `[KEY_A, VAL_X]` at $t=1$, follow with $k$ neutral padding tokens, query `[QUERY, KEY_A]` at $t=k+2$.
- **Sweep:** $k \in \{4, 8, 16, 32, 64, 128, 256, 512\}$.
- **Expected Outcome:** High accuracy for decay $\lambda \approx 1.0$; exponential degradation for $\lambda < 0.95$.
- **Falsification Criterion:** If state model accuracy at $k=64$ does not exceed random baseline ($1/|\mathcal{V}|$), the model fails to demonstrate an evolving state memory.

### 5.2 Experiment 2: Long-Horizon Recall with Distractor Clutter
- **Protocol:** Distribute 5 distinct key-value pairs randomly across a sequence of total length $T \in \{32, 64, 128, 256, 512, 1024, 2048\}$. The remaining $T-5$ tokens are distractor tokens with Gaussian variance $\sigma$.
- **Sweep:** Sequence length $T$ across 3 noise levels ($\sigma \in \{0.0, 0.2, 0.5\}$).
- **Expected Outcome:** Monotonic decline in readout SNR and exact match accuracy as $T$ increases.
- **Falsification Criterion:** If accuracy is invariant to $T$ as $T \to 2048$ with fixed $d=32$, the memory is either uncompressed or immune to superposition limits.

### 5.3 Experiment 3: Interference & Conflicting Key Updates
- **Protocol:** Inject `[KEY_A, VAL_1]`, followed by intermediate tokens, then inject `[KEY_A, VAL_2]`, up to $N_{conflicts}$ overwrites. At the end, prompt model with `[QUERY_RECENT, KEY_A]` and `[QUERY_PRIMACY, KEY_A]`.
- **Sweep:** $N_{conflicts} \in \{1, 2, 3, 5, 8\}$.
- **Expected Outcome:** Recency-weighted models (e.g., standard SSMs with decay) retain $\text{VAL}_{latest}$ while completely erasing $\text{VAL}_1$.
- **Falsification Criterion:** Demonstrates that conflicting updates cause unrecoverable overwrite without dynamic routing/selective gating.

### 5.4 Experiment 4: Capacity Stress Test (Subspace Overcrowding)
- **Protocol:** Pack $N_{keys} \in \{2, 4, 8, 16, 32, 64, 128\}$ unique key-value pairs into a fixed state of dimension $d=32$. Query all $N_{keys}$ at sequence termination.
- **Sweep:** Load ratio $\alpha = N_{keys} / d \in [0.0625, 4.0]$.
- **Expected Outcome:** Sharp phase transition (capacity drop) when $\alpha > \alpha_{\text{critical}} \approx 0.5$ for vector states and $\alpha > 1.0$ for matrix associative states.
- **Falsification Criterion:** Proves the finite capacity bound of $\mathcal{O}(1)$ state structures.

### 5.5 Experiment 5: Inference-Time Recovery & Refinement
- **Protocol:** Take degraded states from Exp 3 & Exp 4 (where single-pass accuracy is $20\%-50\%$). Apply test-time refinement:
  - Mode A: Iterative Recurrent Settling ($K$ attractor steps).
  - Mode B: Best-of-$N$ with Energy Verifier ($N \in [1, 20]$).
  - Mode C: Test-Time Fast-Weight Gradient Step.
- **Sweep:** Compute budget $C_{infer} \in \{1, 2, 4, 8, 16, 25\}$.
- **Expected Outcome:** Significant accuracy recovery ($\Delta Acc \approx +15\% \dots +35\%$) in moderate-interference regimes; $0\%$ recovery in collapsed regimes.
- **Falsification Criterion:** Proves that inference-time compute can *sometimes* recover signal, but cannot reconstruct information that has completely left the subspace.

---

## 6. Baseline Models Suite

To provide rigorous scientific comparison, the lab implements four baseline architectures:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BASELINE MODEL SUITE                             │
├─────────────────────┬───────────────────┬──────────────┬────────────────────┤
│ Model Name          │ Architecture Type │ Memory Scale │ Compute Scale      │
├─────────────────────┼───────────────────┼──────────────┼────────────────────┤
│ 1. Zero-State Feed  │ Non-recurrent MLP │ O(1) [Zero]  │ O(1)               │
│ 2. Vanilla Recurrent│ Elman / GRU vector│ O(d)         │ O(1)               │
│ 3. Selective SSM    │ Mamba-style toy   │ O(d)         │ O(1) [Dynamic Gt]  │
│ 4. Matrix Associative Fast Weight / RetNet│ O(d^2)     │ O(1) [Outer Prod]  │
│ 5. Full KV Attn (Ref│ Standard Xformer  │ O(T * d)     │ O(T) [Upper Bound] │
└─────────────────────┴───────────────────┴──────────────┴────────────────────┘
```

1. **Zero-State Feedforward Baseline:** Serves as the experimental control ($H_0$). Incapable of carrying information across time-steps.
2. **Vanilla Recurrent Vector (GRU/Elman Toy):** $h_t = \tanh(W_h h_{t-1} + W_x x_t)$. Shows non-linear vanishing gradients and uncontrolled overwrite.
3. **Selective State Space (Toy Mamba):** $h_t = \bar{A}_t h_{t-1} + \bar{B}_t x_t$, where $B_t, C_t, \Delta_t = \operatorname{Linear}(x_t)$. Demonstrates input-dependent selective filtering and gating.
4. **Matrix Associative State (Fast Weights / Linear Attention):** $H_t = \lambda H_{t-1} + v_t k_t^\top$. Demonstrates bilinear key-value binding and modern Hopfield retrieval dynamics.
5. **Full Attention with Exact KV Cache (Reference Upper Bound):** Non-parametric storage of all prefix tokens. Shows uncompressed retrieval baseline to quantify the exact compression penalty.

---

## 7. Execution Architecture: Live Browser vs Precomputed Benchmarks

To guarantee high interactive responsiveness (sub-16ms 60fps rendering) while maintaining scientific fidelity, the system divides workloads strictly:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXECUTION ARCHITECTURE                             │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ LIVE IN-BROWSER SIMULATOR (Real-Time)│ PRECOMPUTED BENCHMARKS (Verified)   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • JavaScript / WebGL Tensor Engine   │ • Pre-run PyTorch / JAX evaluations  │
│ • Interactive parameter sweeps       │ • Frontier models: Mamba-2 (2.7B),   │
│ • State vector dimension d in [16,128│   TTT-Linear (1.3B), Llama-3-8B (KV) │
│ • Sequence length T up to 2,048      │ • Sequences T up to 32,768           │
│ • Live step-by-step state inspection │ • 10,000-sample statistical CI tests │
│ • Instant visual feedback on changes │ • Absolute scientific reference line │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Exact Labeling Standard in UI:
- Every visualization rendered live from client-side matrix computations MUST display badge: `[LIVE CLIENT SIMULATION (SURROGATE)]`.
- Every visualization backed by precomputed frontier datasets MUST display badge: `[PRECOMPUTED FRONTIER BENCHMARK (OFFICIAL VERIFIED RUN)]`.

---

## 8. Official BDH & BDH-CQ Alignment & Boundaries

### 8.1 The BDH Connection
- **Bi-Directional Dynamic Horizons (BDH)** represents the architectural frontier in continuous-horizon sequence representation.
- In BDH, temporal horizons are dynamic rather than fixed, allowing the model to adaptively expand or contract its effective memory window based on information density.
- Our laboratory demonstrates this principle at the micro-level through **Selective State Gating ($\Delta_t$)** and **Adaptive State Decay ($\lambda_t$)**.

### 8.2 The BDH-CQ Connection
- **Continuous Querying (CQ)** allows continuous-time interrogation of the state trajectory, decoupling readout frequency from token arrival steps.
- In our laboratory, the inference-time recovery experiments directly mirror CQ principles: rather than treating the final state as a static static vector, test-time refinement treats $h_T$ as an energy landscape to be continuously queried and settled.

### 8.3 Strict Boundary: Official BDH Evidence vs Educational Toy Implementation
- **Official BDH/BDH-CQ:** Refers strictly to the large-scale multi-GPU foundation models, official technical specifications, and production benchmarks published by the Pathway Track / DataForge foundation.
- **Our Toy Implementation:** An educational surrogate designed exclusively for intuitive conceptual understanding, parameter exploration, and pedagogical transparency.
- **Rule:** The user interface, code comments, and documentation must NEVER claim or imply that the in-browser model contains official BDH production weights.

---

## 9. Failure Modes & Limitations

1. **Information Irreversibility Boundary:** When a state experiences irreversible destruction ($\lambda = 0$ or null-space projection), no search method can recover the data. The UI must visualize this failure mode explicitly.
2. **Computational Budget Saturation:** Beyond $C_{infer} \approx 10$, inference scaling exhibits diminishing returns.
3. **Linear vs Deep Non-linear Representation Gap:** The client-side simulator relies on shallow linear/selective recurrences; complex emergent multi-hop reasoning in deep architectures is represented via precomputed benchmark comparisons.

---

## 10. Judge Defense Sheet (FAQ & Technical Cross-Examination)

### Q1: "Why use an evolving state if Transformer KV cache already provides perfect lossless recall?"
**Answer:** Transformer KV caching requires $\mathcal{O}(T)$ memory footprint per sequence. In production deployment at sequence lengths of $128\text{k}–1\text{M}$ tokens and high concurrency, KV cache memory quickly exceeds GPU VRAM limits and becomes memory-bandwidth bound. Evolving states maintain an $\mathcal{O}(1)$ constant memory footprint and $\mathcal{O}(1)$ step inference time, making long-horizon deployment economically viable. Our lab directly explores the compression-accuracy tradeoff inherent to this choice.

### Q2: "Can inference-time scaling recover any lost information from a state?"
**Answer:** No. Inference-time compute cannot violate the Data Processing Inequality or information theory. If the target information has been completely zeroed out or projected into the null space of the state transition matrix, recovery is mathematically impossible ($\Delta Acc = 0$). Test-time compute *only* recovers information when the signal is still present in superposition but obscured by cross-talk interference from other keys, functioning as a non-linear de-noising filter.

### Q3: "Is your in-browser implementation running actual BDH-CQ code?"
**Answer:** No. Our in-browser lab is a mathematically faithful **educational surrogate model** designed to expose the core algebraic and dynamical mechanisms (selective recurrence, associative matrix fast weights, and test-time latent optimization). Official BDH-CQ systems operate at foundation-model scale on distributed accelerator clusters. Our UI explicitly labels all client models as educational surrogates and provides precomputed benchmark datasets for frontier model comparisons.

### Q4: "How does your selective SSM baseline differ from a standard RNN?"
**Answer:** In a standard RNN, state transitions are static non-linear functions ($W_h, W_x$ are fixed parameters). In a Selective SSM (like Mamba), the transition operators ($B, C, \Delta$) are dynamic functions of the current input token $x_t$. This allows the model to selectively ignore noise tokens by setting $\Delta_t \approx 0$ (preserving state unchanged) or reset state for new incoming keys, dramatically reducing associative interference compared to naive RNNs.

### Q5: "How does this experiment setup challenge or falsify the central claim?"
**Answer:** The central claim is constructed of four falsifiable propositions: (1) state carries information ($H_0$: zero-state accuracy is identical), (2) length degrades state ($H_0$: accuracy is constant across $T$), (3) conflicts cause interference ($H_0$: overwrite rate has zero correlation with error), and (4) inference compute improves recovery ($H_0$: $\Delta Acc(C_{infer}) = 0$). If any of these null hypotheses fail to be rejected in our 5 synthetic experiments, the claim is falsified.

---
*Signed:* Lead AI Research Engineer & Educational Architect, DataForge 2026.
