"""Base classes and interfaces for memory sequence models."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Tuple, Optional
import torch
import torch.nn as nn


@dataclass
class MemoryStepTrace:
    """Detailed telemetry captured at each sequence step."""
    step: int
    token: str
    state_norm: float
    state_entropy: float
    delta: float
    snr_db: Optional[float] = None
    extra: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        if self.extra is None:
            d.pop("extra", None)
        return d


class BaseMemoryModel(nn.Module, ABC):
    """Abstract base class for memory-augmented sequence models."""

    def __init__(self, model_name: str, state_dim: int, vocab_size: int):
        super().__init__()
        self.model_name = model_name
        self.state_dim = state_dim
        self.vocab_size = vocab_size

    @abstractmethod
    def reset_state(self) -> None:
        """Reset internal memory state to zero/initial condition."""
        pass

    @abstractmethod
    def ingest_token(self, token_id: int, token_str: str, step_idx: int) -> MemoryStepTrace:
        """Process a single token into the memory and return step telemetry."""
        pass

    @abstractmethod
    def query(self, query_token: str, query_id: int, inference_budget: int = 1) -> Tuple[str, int, Dict[str, Any]]:
        """
        Query the accumulated memory state.
        Returns:
            (predicted_token_str, actual_inference_steps, metadata)
        """
        pass

    def run_sequence(
        self,
        sequence: List[str],
        query_token: str,
        vocab,
        inference_budget: int = 1
    ) -> Tuple[str, List[MemoryStepTrace], int, Dict[str, Any]]:
        """
        Ingest an entire sequence token-by-token and execute query readout.
        """
        self.reset_state()
        traces: List[MemoryStepTrace] = []

        for step_idx, tok in enumerate(sequence):
            tok_id = vocab.encode(tok)
            trace = self.ingest_token(tok_id, tok, step_idx)
            traces.append(trace)

        query_id = vocab.encode(query_token)
        pred_tok, actual_steps, meta = self.query(query_token, query_id, inference_budget=inference_budget)

        return pred_tok, traces, actual_steps, meta
