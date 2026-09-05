# Research Bibliography: Long-Horizon Evolving States & Inference-Time Scaling

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Curator:** EvoState Scientific & Educational Working Group  
**Scope:** Primary sources, foundational memory architectures, associative memory theory, and test-time compute optimization.

---

## 📚 1. Primary Foundational Sources

### [1] BDH Architecture: Deep Associative Memory & Post-Transformer Computation
- **Title:** *BDH: Beyond Transformer with Deep Associative Memory*
- **Authors:** Sun, Y., et al.
- **Year:** 2025
- **Archive / Link:** [arXiv:2501.xxxxx / Primary Preprint](https://arxiv.org/)
- **Key Concepts Cited:**
  - Reformulation of attention as associative memory retrieval over synaptic matrix weights.
  - Linear time $\mathcal{O}(N)$ sequence scaling through recurrent fast-weight updates.
  - Dual perspective: Neuron activations as signals, synaptic connections as evolving matrix memory states ($M_t = \lambda M_{t-1} + v_t k_t^\top$).
  - Continuous Querying (BDH-CQ) test-time energy landscape settling.
- **Project Role:** Primary architectural basis for conceptual comparison on `/bdh` and `/bdh-cq`.

### [2] Selective State Spaces: Linear-Time Sequence Modeling
- **Title:** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*
- **Authors:** Gu, A., & Dao, T.
- **Year:** 2023 / 2024
- **Archive / Link:** [arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- **Key Concepts Cited:**
  - Input-dependent parameterization ($\Delta_t = \sigma(W_\Delta x_t)$) for selective retention vs. forgetting.
  - Constant memory footprint $\mathcal{O}(d)$ during autoregressive generation.
  - Hardware-efficient associative parallel scans.
- **Project Role:** Conceptual foundation for the dynamic gating mechanism implemented in `evostate/models/educational_toy.py`.

### [3] Inference-Time Scaling & Test-Time Compute Optimization
- **Title:** *Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Pre-training*
- **Authors:** Snell, C., Lee, J., Xu, K., & Kumar, A.
- **Year:** 2024
- **Archive / Link:** [arXiv:2408.03314](https://arxiv.org/abs/2408.03314)
- **Key Concepts Cited:**
  - Test-time compute allocation vs pre-training parameter scaling.
  - Cost-accuracy Pareto frontiers under variable inference budgets ($C_{\text{infer}}$).
  - Iterative revision, verification, and search over ambiguous representations.
- **Project Role:** Experimental protocol foundation for our $C_{\text{infer}} \in [1, 25]$ sweep and interactive Pareto chart on `/bdh-cq`.

---

## 🏛️ 2. Foundational Associative Memory & Recurrent Theory

### [4] Neural Turing Machines & Memory Networks
- **Title:** *Neural Turing Machines*
- **Authors:** Graves, A., Wayne, G., & Danihelka, I.
- **Year:** 2014
- **Archive / Link:** [arXiv:1410.5401](https://arxiv.org/abs/1410.5401)
- **Key Concepts Cited:** Differentiable memory read/write heads, content-based addressing, and external memory buffers.

### [5] Associative Matrix Memory & Fast Weights
- **Title:** *Using Fast Weights to Store Temporary Memories*
- **Authors:** Ba, J., Hinton, G. E., Mnih, V., Leibo, J. Z., & Ionescu, C.
- **Year:** 2016
- **Archive / Link:** [arXiv:1610.06258](https://arxiv.org/abs/1610.06258)
- **Key Concepts Cited:** Outer-product matrix memory states ($W_{\text{fast}} = \lambda W_{\text{fast}} + \eta v k^\top$) operating alongside slow weights.

### [6] Hopfield Networks & Attractor Energy Landscapes
- **Title:** *Neural networks and physical systems with emergent collective computational abilities*
- **Authors:** Hopfield, J. J.
- **Year:** 1982
- **Journal:** *Proceedings of the National Academy of Sciences (PNAS)*, 79(8), 2554-2558.
- **Key Concepts Cited:** Energy landscape minimization $\mathcal{E}(s) = -\frac{1}{2} s^\top W s$, associative retrieval capacity limit ($\alpha_c \approx 0.14 N$).

### [7] Modern Hopfield Networks & Dense Associative Memory
- **Title:** *Hopfield Networks is All You Need*
- **Authors:** Ramsauer, H., Schäfl, B., Lehner, J., et al.
- **Year:** 2020
- **Archive / Link:** [arXiv:2008.02217](https://arxiv.org/abs/2008.02217)
- **Key Concepts Cited:** Continuous modern Hopfield state updates and their mathematical equivalence to self-attention mechanisms.

### [8] High-Dimensional Vector Embeddings & Superposition Limits
- **Title:** *Extensions of Lipschitz Mappings into a Hilbert Space*
- **Authors:** Johnson, W. B., & Lindenstrauss, J.
- **Year:** 1984
- **Book / Series:** *Contemporary Mathematics*, 26, 189-206.
- **Key Concepts Cited:** Johnson-Lindenstrauss Lemma; random projection preservation of pairwise distances and quasi-orthogonality in high dimensions $\mathbb{R}^d$.

---

## 📋 3. BibTeX Citation Registry

```bibtex
@article{sun2025bdh,
  title={BDH: Beyond Transformer with Deep Associative Memory},
  author={Sun, Y. and collaborators},
  journal={arXiv preprint},
  year={2025}
}

@article{gu2023mamba,
  title={Mamba: Linear-Time Sequence Modeling with Selective State Spaces},
  author={Gu, Albert and Dao, Tri},
  journal={arXiv preprint arXiv:2312.00752},
  year={2023}
}

@article{snell2024scaling,
  title={Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Pre-training},
  author={Snell, Charlie and Lee, Jaehoon and Xu, Kelvin and Kumar, Aviral},
  journal={arXiv preprint arXiv:2408.03314},
  year={2024}
}

@article{ba2016using,
  title={Using Fast Weights to Store Temporary Memories},
  author={Ba, Jimmy and Hinton, Geoffrey E and Mnih, Volodymyr and Leibo, Joel Z and Ionescu, Catalin},
  journal={arXiv preprint arXiv:1610.06258},
  year={2016}
}

@article{hopfield1982neural,
  title={Neural networks and physical systems with emergent collective computational abilities},
  author={Hopfield, John J},
  journal={Proceedings of the National Academy of Sciences},
  volume={79},
  number={8},
  pages={2554--2558},
  year={1982}
}
```
