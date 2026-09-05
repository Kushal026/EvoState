"""Reproducible Random Number Generator utilities for deterministic experiment runs."""

import random
import numpy as np
import torch


def seed_everything(seed: int = 42) -> None:
    """Set global random seeds for Python, NumPy, and PyTorch for strict determinism."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.use_deterministic_algorithms(False)  # Ensure compatibility across CPU architectures


def get_rng(seed: int | None = None) -> random.Random:
    """Get an isolated Python Random instance."""
    return random.Random(seed if seed is not None else 42)


def get_numpy_rng(seed: int | None = None) -> np.random.Generator:
    """Get an isolated NumPy Generator instance."""
    return np.random.default_rng(seed if seed is not None else 42)
