"""Scientific metrics and evaluation helpers for evolving state memory analysis."""

import time
import math
import numpy as np
import torch
from typing import List, Dict, Any, Callable


class Timer:
    """Precise execution timer returning milliseconds."""

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.end = time.perf_counter()
        self.elapsed_ms = (self.end - self.start) * 1000.0


def compute_snr(target_projection: float, distractor_projections: List[float], eps: float = 1e-8) -> float:
    """
    Compute Signal-to-Noise Ratio (SNR) in decibels (dB) or linear scale.
    Formula: 10 * log10( |target|^2 / (mean(|distractors|^2) + eps) )
    """
    signal_power = float(target_projection) ** 2
    if not distractor_projections:
        return 50.0  # Perfect isolated signal
    distractor_power = np.mean([float(p) ** 2 for p in distractor_projections]) + eps
    snr_linear = signal_power / distractor_power
    return float(10.0 * math.log10(max(snr_linear, 1e-5)))


def compute_state_entropy(state_tensor: torch.Tensor | np.ndarray) -> float:
    """
    Compute spectral dispersion/entropy of energy distribution in state representation.
    High entropy = high dimensionality utilization; Low entropy = rank collapse.
    """
    if isinstance(state_tensor, torch.Tensor):
        t = state_tensor.detach().float()
        if t.ndim == 1:
            energy = t ** 2
        elif t.ndim == 2:
            # Row energy distribution for matrix states
            energy = torch.sum(t ** 2, dim=-1)
        else:
            energy = t.flatten() ** 2
        
        total_e = torch.sum(energy) + 1e-12
        p = energy / total_e
        p = p[p > 1e-10]
        entropy = -torch.sum(p * torch.log2(p + 1e-12)).item()
        return float(entropy)
    else:
        state_np = np.asarray(state_tensor, dtype=np.float32)
        if state_np.ndim == 1:
            p = (state_np ** 2) / (np.sum(state_np ** 2) + 1e-12)
        else:
            energy = np.sum(state_np ** 2, axis=-1)
            p = energy / (np.sum(energy) + 1e-12)
        p = p[p > 1e-10]
        entropy = -np.sum(p * np.log2(p + 1e-12))
        return float(entropy)


def calculate_exact_match(prediction: str, ground_truth: str) -> bool:
    """Check exact equality after stripping and standardizing."""
    return prediction.strip().upper() == ground_truth.strip().upper()
