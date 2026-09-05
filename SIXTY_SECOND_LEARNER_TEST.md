# 60-Second Learner Experiment Protocol & Test Rubric

**Project:** EvoState (DataForge 2026 Pathway Track)  
**Target Journey Time:** ~60 Seconds  
**Objective:** Deliver an active, falsifiable micro-experiment that demonstrates the fundamental compression-interference tradeoff and test-time compute scaling.

---

## ⏱️ 1. The 5-Step Learner Journey

The dedicated 60-Second Experiment Mode (`SixtySecondExperiment.tsx`, accessible directly on `/` and `/lab?mode=sixty_sec`) guides the learner through 5 progressive steps:

```
[ Step 1: Baseline ] ──► [ Step 2: Sequence Stretch ] ──► [ Step 3: Interference Attack ]
                                                                     │
[ Step 5: Claim Verdict ] ◄── [ Step 4: Test-Time Compute ] ◄────────┘
```

| Step # | Phase Name | Initial State & Preset | Learner Action | Observable Consequence |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Baseline Recall** | Memory experiment running ($L=16, M=32, p=0, K=1$). Expected: `VAL_ALPHA`. | Observe initial state projection. | Model retrieves `VAL_ALPHA` with 100% accuracy and high SNR (+34 dB). |
| **2** | **Sequence Stretch** | Baseline loaded. | Learner clicks **"Increase Sequence Length (L=64)"**. | Sequence length quadruples; state norm and entropy adjust; accuracy remains stable. |
| **3** | **Interference Attack** | Long sequence loaded. | Learner clicks **"Inject Interference (p=0.45)"**. | Distractor tokens create superposition crosstalk; accuracy drops or becomes noisy. |
| **4** | **Inference-Time Boost** | Distorted state loaded. | Learner clicks **"Increase Compute (K=4)"**. | Iterative query sharpening activates; SNR improves and accuracy recovers. |
| **5** | **Claim Evaluation** | Final test telemetry logged. | Learner compares baseline, degraded, and recovered states against the claim. | Dynamic verdict computed based on actual empirical telemetry. |

---

## 🎯 2. Claim Tested & Verification Rubric

### The Tested Claim:
> **"A fixed-size evolving state can carry useful information across sequences, but interference can cause information loss."**

### Dynamic Assessment Question:
> *"Did your experiment support or challenge the claim?"*

### Deterministic Verdict Engine:
The assessment evaluates the learner's actual experimental session:

$$\Delta_{\text{degrade}} = \text{Acc}_{\text{baseline}} - \text{Acc}_{\text{interference}}$$
$$\Delta_{\text{recover}} = \text{Acc}_{\text{compute\_boost}} - \text{Acc}_{\text{interference}}$$

```typescript
if (baselineAcc >= 0.8 && degradeDelta >= 0.2) {
  // If baseline worked, interference caused loss, and compute helped or state retained info:
  return "SUPPORTED";
} else if (baselineAcc < 0.5 && degradeDelta <= 0) {
  // If bounded state failed immediately or interference had zero effect:
  return "CHALLENGED";
} else {
  // Ambiguous border condition:
  return "INCONCLUSIVE";
}
```

### Critical Scientific Rule:
**Never manipulate the result to force the claim to appear true.**  
If the learner resets parameters or configures a pathological condition where the model fails, the system faithfully outputs `CHALLENGED` or `INCONCLUSIVE` alongside a technical explanation of the failure mode.
