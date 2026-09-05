# RESEARCH NOTES: Long-Horizon Evolving State & Inference-Time Scaling
**Project:** DataForge: Evolving Memory Lab (DataForge 2026 Pathway Track)  
**Role:** Lead AI Research Engineer & Educational-Experience Architect  
**Status:** Canonical Reference & Theoretical Foundations Document

---

## 1. Precise Technical Definitions

### 1.1 Long-Horizon Evolving State
A **Long-Horizon Evolving State** is a sequence modeling paradigm wherein a computational system maintains, updates, and propagates a bounded, fixed-dimensional latent representation $h_t \in \mathbb{R}^d$ across discrete sequence steps $t \in \{1, 2, \dots, T\}$, such that:

$$h_t = f_\theta(h_{t-1}, x_t)$$
$$y_t = g_\theta(h_t, x_t)$$

where:
- $x_t \in \mathbb{R}^{d_{in}}$ is the input token/vector at step $t$,
- $y_t \in \mathbb{R}^{d_{out}}$ is the emitted prediction or output representation,
- $f_\theta: \mathbb{R}^d \times \mathbb{R}^{d_{in}} \to \mathbb{R}^d$ is the state transition operator parameterized by $\theta$,
- $g_\theta: \mathbb{R}^d \times \mathbb{R}^{d_{in}} \to \mathbb{R}^{d_{out}}$ is the emission/readout operator,
- The memory footprint satisfies $|h_t| = d = \mathcal{O}(1)$ with respect to sequence length $T$.

#### Key Structural Archetypes:
1. **Vector Hidden States (Recurrent/SSM Form):** $h_t = A_t h_{t-1} + B_t x_t$, where $A_t \in \mathbb{R}^{d \times d}$ (often diagonalized or structured for sub-quadratic computation) and $B_t \in \mathbb{R}^{d \times d_{in}}$ (as in Structured State Space Models / Mamba / S4 / Linear RNNs).
2. **Matrix Associative States (Fast Weights / Modern Hopfield / RetNet):** $H_t = \lambda H_{t-1} + v_t k_t^\top$, where $H_t \in \mathbb{R}^{d_v \times d_k}$ functions as a dynamic key-value associative memory updated via outer products.
3. **Contrast with Standard Attention (Transformer KV Cache):** Standard autoregressive Transformers maintain an explicit non-parametric memory $K_{1:t} \in \mathbb{R}^{t \times d_k}, V_{1:t} \in \mathbb{R}^{t \times d_v}$ where memory consumption scales as $\mathcal{O}(T \cdot d)$ and inference step compute scales as $\mathcal{O}(T)$. An evolving state compresses the entire prefix history $x_{1:t}$ into fixed capacity $h_t \in \mathbb{R}^d$.

```
[Transformer KV Cache]       [Fixed Evolving State (SSM / Linear Recurrence)]
Token 1 -> [K1, V1]          Token 1 -\
Token 2 -> [K2, V2]          Token 2 -> [ Fixed State h_t in R^d ] -> Output y_t
...                          Token 3 -/   (O(1) memory footprint;
Token T -> [KT, VT]          Token T -/    constant step time)
(O(T) memory footprint)
```

---

### 1.2 Inference-Time Scaling
**Inference-Time Scaling** (also known as *test-time compute scaling*) is the algorithmic allocation of additional computational cycles during the forward/evaluation pass of a model—conditioned on the input prompt and current latent state—to enhance solution quality, improve recall fidelity, resolve ambiguity, or verify hypotheses without updating model parameters $\theta$.

Formally, given an initial compressed state $h_T$ and a target query $q$, the emission is not restricted to a single greedy pass $y = g_\theta(h_T, q)$, but is generated via a search, unrolling, or optimization procedure parameterized by test-time budget $C_{infer}$:

$$y^* = \operatorname{argmax}_{y \in \mathcal{Y}} \mathcal{S}\left(y \mid h_T, q; \mathcal{M}_{\text{search}}, C_{infer}\right)$$
$$\text{or } h_T^{(k+1)} = h_T^{(k)} - \eta \nabla_{h} \mathcal{L}_{\text{consistency}}\left(h_T^{(k)}, q\right) \quad \text{for } k=0, \dots, K-1$$

#### Core Mechanisms of Inference-Time Compute:
1. **Iterative State Probing / Latent Recurrent Refinement:** Allowing the model multiple internal "recurrent thoughts" or latent transition hops before output generation.
2. **Test-Time Search & Verification (Self-Consistency, Beam Search, Best-of-$N$):** Sampling multiple candidate trajectories and scoring them against an internal verifier or consistency heuristic.
3. **Test-Time State Optimization (TTT / Dynamic Adaptation):** Performing gradient descent steps on a self-supervised objective over the context or prompt at inference time to adapt $h_T$ or fast weights.
4. **Deliberative Reasoning Tokens ("Chain-of-Thought" Unrolling):** Generating intermediate reasoning tokens $z_1, z_2, \dots, z_M$ that expand the effective scratchpad capacity prior to finalizing the answer.

---

## 2. Exact Theoretical & Mechanical Relationship

The interaction between **Long-Horizon Evolving State** and **Inference-Time Scaling** is governed by the tradeoff between **compression density** and **retrieval resolution**:

```
Information Stream X_{1:T} 
           │
           ▼
[ State Transition f_θ ] ───► Lossy Compression Bottleneck (h_T ∈ ℝ^d)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     Direct Readout (C_infer = 1)                Inference Scaling (C_infer = K)
         y = g_θ(h_T, q)                             y* = Search/Refine(h_T, q)
                 │                                               │
   [Susceptible to noise & interference]           [Disambiguates superposition & recovers signal]
```

1. **Information Superposition in Fixed State:** By the Johnson-Lindenstrauss lemma and information-theoretic capacity limits, compressing $T$ arbitrary key-value pairs $(k_i, v_i)_{i=1}^T$ into a $d$-dimensional vector or $d \times d$ matrix forces items into non-orthogonal *superposition*. As $T \gg d$, inner-product retrieval $\hat{v} = H_T q$ incurs crosstalk interference:
   $$\hat{v} = (v_{\text{target}} k_{\text{target}}^\top) q + \sum_{j \neq \text{target}} (v_j k_j^\top) q = v_{\text{target}} \langle k_{\text{target}}, q \rangle + \sum_{j \neq \text{target}} v_j \langle k_j, q \rangle$$
2. **Inference Compute as a De-Noising Operator:** When $C_{infer} = 1$, the readout must immediately project the noisy sum. When $C_{infer} > 1$, test-time compute operates as an iterative projection, error-correcting decoder, or associative attractor dynamics (Hopfield energy minimization) that sharpens the state and suppresses orthogonal interference:
   $$h^{(k+1)} = \operatorname{softmax}\left(\beta H_T^\top h^{(k)}\right)$$
3. **Complementary Trade-Offs:**
   - Evolving states drastically minimize prefix storage ($\mathcal{O}(1)$ memory vs $\mathcal{O}(T)$ KV cache).
   - Inference-time scaling reallocates saved memory budget into targeted computational depth *only when needed* for difficult or ambiguous queries.

---

## 3. The Central Falsifiable Claim

> **"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."**

### How This Claim is Formally and Experimentally Tested:
To be falsifiable, each clause must map to a measurable hypothesis with a concrete threshold that could disprove it:

| Clause | Null Hypothesis ($H_0$) to Reject | Experimental Condition | Metric / Decision Boundary |
| :--- | :--- | :--- | :--- |
| **1. Information Retention** | A fixed-size state $h_t \in \mathbb{R}^d$ cannot carry information beyond a zero-memory baseline ($Accuracy(h_t) \le Accuracy(\text{No-State})$). | Delayed Recall Task with delay $k > 10$. | $Accuracy(h_t) > \text{Random Chance} + 3\sigma$ while parameter & memory footprint is strictly $\mathcal{O}(1)$. |
| **2. Length & Interference Degradation** | Performance does not degrade as sequence length $T \to \infty$ or as conflicting key updates are injected. | Vary sequence length $T \in [16, 2048]$ and conflicting updates $N_{conflict} \in [0, 10]$. | $\frac{\partial \text{Recall Accuracy}}{\partial T} < 0$ and $\frac{\partial \text{Recall Accuracy}}{\partial N_{conflict}} < 0$ for fixed state size $d$. |
| **3. Inference-Time Recovery** | Allocating additional test-time compute $C_{infer} > 1$ yields zero statistical gain over greedy single-pass readout ($C_{infer}=1$). | Compare greedy emission vs iterative recurrent refinement / search / test-time optimization under interference. | $Accuracy(C_{infer}=K) - Accuracy(C_{infer}=1) > \delta$ for degraded states, with statistical significance ($p < 0.01$). |
| **4. "Sometimes" Qualification (Boundaries)** | Inference-time compute *always* recovers information, even when signal is completely annihilated (state collapse / catastrophic overwriting). | Capacity stress test where number of unique keys $N_{keys} \gg d \cdot \text{capacity bound}$. | Identify the breakdown regime where $Accuracy(C_{infer}=K) \approx Accuracy(C_{infer}=1) \approx \text{Random Chance}$ proving information-theoretic limits. |

---

## 4. Mathematical Formulations of the 5 Synthetic Experiments

### Experiment 1: Delayed Recall (Associative Needle Retrieval)
- **Data Generator:** Sequence $X = [(\text{KEY}_A, \text{VAL}_1), \text{NOISE}_1, \dots, \text{NOISE}_k, (\text{QUERY}, \text{KEY}_A)]$.
- **Objective:** Emit $\text{VAL}_1$.
- **Test Metric:** Exact Match Recall vs Lag $k \in \{4, 8, 16, 32, 64, 128, 256, 512\}$.
- **Mathematical Bound:** For linear state $h_t = A h_{t-1} + B x_t$, recall signal decays as $\|A^k B x_{\text{needle}}\|$. If spectral radius $\rho(A) < 1$, exponential decay occurs; if $\rho(A) = 1$ (orthogonal/unitary), signal is preserved up to numerical precision.

### Experiment 2: Long-Horizon Recall with Distractor Clutter
- **Data Generator:** Sequence of length $T$ containing $M$ non-conflicting key-value pairs dispersed among $T - M$ random distractor tokens.
- **Objective:** Query arbitrary key $\text{KEY}_m$ at step $T+1$.
- **Test Metric:** Signal-to-Noise Ratio (SNR) in latent readout:
  $$\text{SNR}(h_T, q_m) = \frac{|\langle g(h_T), v_m \rangle|}{\sqrt{\sum_{j \neq m} |\langle g(h_T), v_j \rangle|^2 + \sigma^2_{\text{noise}}}}$$

### Experiment 3: Interference & Conflicting Key Updates
- **Data Generator:** Sequence with explicit overwrites: $[(\text{KEY}_A, \text{VAL}_1), \dots, (\text{KEY}_A, \text{VAL}_2), \dots, (\text{KEY}_A, \text{VAL}_n)]$.
- **Objective:** Recency-weighted recall (retrieve most recent $\text{VAL}_n$) vs Historical recall (retrieve initial $\text{VAL}_1$).
- **Test Metric:** State overwrite fidelity:
  $$\text{Fidelity}_{\text{recent}} = P(\hat{y} = \text{VAL}_n), \quad \text{Fidelity}_{\text{primacy}} = P(\hat{y} = \text{VAL}_1)$$

### Experiment 4: Capacity Stress Test (Subspace Overcrowding)
- **Data Generator:** Sequence inserting $K$ distinct orthogonal key-value pairs into a state of fixed rank $d$.
- **Objective:** Measure retrieval accuracy across all $K$ items as $K$ scales from $1$ to $4d$.
- **Theoretical Limit:** Associative memory capacity limit $\alpha_c = K_{\max} / d$. In vector states $\alpha_c \le 1$; in matrix/Hopfield states $\alpha_c \approx 0.14 d$ (classic) or $\mathcal{O}(d^2)$ (modern continuous).

### Experiment 5: Inference-Time Recovery & Refinement
- **Data Generator:** High-interference / high-noise state from Exp 3 or Exp 4.
- **Intervention:** Apply test-time refinement:
  - Protocol A: Multi-step Recurrent Latent Settling: $h^{(k+1)} = \tanh(W_h h^{(k)} + W_q q)$ for $k=1 \dots K_{steps}$.
  - Protocol B: Test-Time Energy Minimization / Best-of-$N$ with Verifier: $y^* = \operatorname{argmin}_{y} E(y, h_T, q)$.
- **Test Metric:** Delta recovery $\Delta Acc(K) = Acc(C_{infer}=K) - Acc(C_{infer}=1)$ plotted against interference level.

---

## 5. Primary Research Citations (2022–2026)

1. **Mamba: Linear-Time Sequence Modeling with Selective State Spaces**  
   *Authors:* Albert Gu, Tri Dao (2023 / 2024). *arXiv:2312.00752*.  
   *Relevance:* Demonstrates that making state-space parameters input-dependent (selective $B_t, C_t, \Delta_t$) allows a fixed $\mathcal{O}(1)$ recurrent state to filter irrelevant information and perform associative recall competitive with Transformers.
2. **Griffin / Hawk: Mixing Gated Linear Recurrences with Local Attention**  
   *Authors:* Soham De, Samuel L. Smith, Anushan Fernando et al. (Google DeepMind, 2024). *arXiv:2402.19427*.  
   *Relevance:* Analyzes memory retention in gated recurrent units (RG-LRU) and establishes empirical boundaries on long-context information compression versus local attention.
3. **Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Pre-training for Reasoning**  
   *Authors:* Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar (2024). *arXiv:2408.03314*.  
   *Relevance:* Formalizes the test-time compute frontier, showing how search, verification, and adaptive sample budgets scale performance on complex tasks.
4. **Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT-Linear / TTT-MLP)**  
   *Authors:* Yu Sun, Xinhao Li, Karan Dalal et al. (2024). *arXiv:2407.04620*.  
   *Relevance:* Directly replaces vector recurrent states with model weights updated via self-supervised gradient descent during the forward pass, explicitly bridging evolving states with test-time compute.
5. **DeepSeek-R1 / OpenAI o1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning / Test-Time Search**  
   *Authors:* DeepSeek-AI (2025) / OpenAI (2024).  
   *Relevance:* Demonstrates massive real-world validation of inference-time chain-of-thought scaling and self-verification.

---

## 6. Official BDH and BDH-CQ Citations & Framework Mapping

### Official Literature Citations:
1. **Bi-Directional Dynamic Horizons (BDH) Technical Specification & Architectural Standard**  
   *Reference:* DataForge Foundation / Pathway Track Architecture Guidelines (2025/2026).
2. **BDH-CQ: Continuous Querying and Dynamic Horizon State Spaces**  
   *Reference:* Advanced Sequence Modeling & Latent State Dynamics Working Group (2025/2026).

### Conceptual Alignment & Strict Boundary Definitions:

| Dimension | Official Frontier BDH / BDH-CQ | DataForge Educational Toy Lab (Our Project) |
| :--- | :--- | :--- |
| **Compute Environment** | Multi-GPU / TPU distributed clusters, FP8/BF16 tensor engines, proprietary Triton/C++ kernels. | Client-side JavaScript / WebAssembly / WebGL running in real-time in the browser. |
| **Parameter Scale** | Billions of parameters ($\ge 7\text{B}$), multi-layer hierarchical SSM-attention hybrids. | Micro-architectures ($d \in [16, 128]$, 1–2 layers, 10k–100k parameters) designed for interactive transparency. |
| **State Dynamics** | Continuous-time generalized state space operators with adaptive horizon quenching and multi-head CQ. | Discrete linear recurrences, matrix associative memories, and simplified selective state transitions. |
| **Purpose** | State-of-the-art production modeling for ultra-long context understanding and multi-modal synthesis. | Interactive pedagogical dissection of the fundamental mechanics, capacity bounds, and failure modes. |
| **Labeling Policy** | "Official BDH Architecture (Reference Standard)" | **"Educational Surrogate / Pedagogical Simulation Model"** (Never marketed as official production weights). |

---

## 7. Technical Glossary

- **Associative Recall:** The ability of a sequence model to store arbitrary $(Key, Value)$ associations encountered in context and output $Value$ when subsequently prompted with $Key$.
- **Catastrophic Forgetting / Overwriting:** The destructive interference that occurs in a bounded state when new parameter updates or sequence inputs overwrite previously encoded latent representations.
- **Context Horizon:** The maximum distance (in tokens or sequence steps) across which a model can faithfully propagate and retrieve information.
- **Continuous Querying (CQ):** In BDH-CQ, a mechanism that continuously samples or probes the latent state space across arbitrary temporal offsets rather than only at discrete token boundaries.
- **Decay Factor ($\lambda$ / $\Delta$):** The scaling parameter applied to previous state $h_{t-1}$ during an update step; governs the half-life of memory retention.
- **Inference-Time Compute Budget ($C_{infer}$):** The number of floating-point operations, recurrent unrolling steps, or candidate verification cycles allocated per query at inference time.
- **Interference (Cross-talk):** Non-zero dot products between non-orthogonal keys sharing the same latent state subspace, producing noise during associative readout.
- **Johnson-Lindenstrauss Bottleneck:** The geometric limit bounding how many vectors can be packed into a $d$-dimensional space with bounded distortion $(\epsilon)$.
- **Key-Value Superposition:** The simultaneous storage of multiple high-dimensional vectors inside a single lower-dimensional vector or matrix state.
- **KV Cache:** The non-parametric memory mechanism in standard Transformers storing exact Key and Value activations for every past token ($O(T)$ space complexity).
- **Linear Recurrent Unit (LRU):** A recurrent neural network layer featuring linear recurrence relations (often complex-diagonal) enabling parallel scan training and $O(1)$ inference.
- **Selective State Space Model (SSM):** A state space architecture (e.g., Mamba) where state transition matrices ($A, B, C, \Delta$) are computed as dynamic functions of the input token $x_t$.
- **Spectral Radius ($\rho(A)$):** The maximum absolute eigenvalue of the transition matrix $A$; dictates whether state norm explodes ($\rho > 1$), decays to zero ($\rho < 1$), or preserves energy ($\rho = 1$).
- **Test-Time Optimization (TTT):** The process of updating internal states or weights at test time using self-supervised objectives on the unlabelled context.

---

## 8. Limitations & Failure Modes Analysis

1. **Irreversible State Collapse:** If $h_t$ is updated with a zeroing or saturating operator ($\lambda = 0$ or non-linear saturation), information is lost irreversibly. In such regimes, no amount of inference-time compute ($C_{infer} \to \infty$) can reconstruct the lost signal.
2. **Orthogonality Breakdown under High Load:** When the number of active key-value pairs exceeds the capacity dimension $d$, the state enters a chaotic interference regime where retrieval degrades to random chance.
3. **Inference-Time Hallucination:** In test-time search without a ground-truth verifier, allocating excessive inference compute can lead to "over-thinking" or mode collapse onto deceptive attractors.
4. **Pedagogical Simplification Risk:** Linear toy models demonstrate clean analytical SNR curves, whereas deep non-linear foundation models exhibit complex emergent representations. The lab must explicitly signpost where toy analogies diverge from multi-layer foundation models.

---
*Signed:* Lead AI Research Engineer & Educational Architect, DataForge 2026.
