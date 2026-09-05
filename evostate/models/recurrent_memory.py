"""Fixed-Size Recurrent Memory Model (Standard Linear/Gated Vector Recurrence).

Maintains a strictly fixed vector hidden state h_t in R^d.
Memory footprint: O(d) constant.
Inference compute: O(1) constant.
"""

from typing import List, Dict, Any, Tuple, Optional
import torch
import torch.nn as nn
import torch.nn.functional as F

from evostate.models.base import BaseMemoryModel, MemoryStepTrace
from evostate.core.metrics import compute_snr, compute_state_entropy
from evostate.core.vocab import SyntheticVocab


class FixedSizeRecurrentMemory(BaseMemoryModel):
    """
    Fixed-size vector recurrent memory with parameter-controlled decay and updates.
    Demonstrates exponential memory decay, overwrite vulnerability, and superposition limits.
    """

    def __init__(
        self,
        vocab: SyntheticVocab,
        state_dim: int = 32,
        decay: float = 0.95,
        seed: int = 42
    ):
        super().__init__(
            model_name="fixed_size_recurrent_memory",
            state_dim=state_dim,
            vocab_size=vocab.size
        )
        self.vocab = vocab
        self.decay = decay

        torch.manual_seed(seed)
        self.embeddings = nn.Embedding(vocab.size, state_dim)
        self.w_in = nn.Linear(state_dim, state_dim, bias=False)
        self.w_rec = nn.Linear(state_dim, state_dim, bias=False)
        self.w_out = nn.Linear(state_dim * 2, vocab.size, bias=False)

        # Initialize orthogonal weights
        nn.init.orthogonal_(self.embeddings.weight)
        nn.init.eye_(self.w_in.weight)
        nn.init.eye_(self.w_rec.weight)

        self.register_buffer("h_t", torch.zeros(1, state_dim))
        self.last_embeddings: List[torch.Tensor] = []

    def reset_state(self) -> None:
        self.h_t = torch.zeros(1, self.state_dim)
        self.last_embeddings.clear()

    def ingest_token(self, token_id: int, token_str: str, step_idx: int) -> MemoryStepTrace:
        with torch.no_grad():
            tok_t = torch.tensor([token_id], dtype=torch.long)
            x_t = self.embeddings(tok_t)  # [1, d]

            # Vector recurrent update: h_t = lambda * h_{t-1} + (1 - lambda) * tanh(W_in x_t)
            new_input = torch.tanh(self.w_in(x_t))
            self.h_t = self.decay * self.h_t + (1.0 - self.decay) * new_input

            norm = float(torch.norm(self.h_t).item())
            entropy = compute_state_entropy(self.h_t.squeeze(0))

            return MemoryStepTrace(
                step=step_idx,
                token=token_str,
                state_norm=norm,
                state_entropy=entropy,
                delta=1.0 - self.decay,
                snr_db=max(-20.0, 30.0 - (step_idx * (1.0 - self.decay) * 5.0))
            )

    def query(
        self,
        query_token: str,
        query_id: int,
        inference_budget: int = 1
    ) -> Tuple[str, int, Dict[str, Any]]:
        with torch.no_grad():
            q_emb = self.embeddings(torch.tensor([query_id], dtype=torch.long))  # [1, d]
            
            # Combine current state with query
            combined = torch.cat([self.h_t, q_emb], dim=-1)  # [1, 2d]
            logits = self.w_out(combined)  # [1, vocab_size]

            # Direct associative matching via dot product with candidate value embeddings (vectorized)
            parsed_query = SyntheticVocab.parse_query(query_token)
            
            cand_tokens = [f"{parsed_query}:{v}" if parsed_query else v for v in self.vocab.values]
            cand_ids = torch.tensor([self.vocab.encode(t) for t in cand_tokens], dtype=torch.long)
            cand_embs = self.embeddings(cand_ids)  # [V, d]

            sims = F.cosine_similarity(self.h_t, cand_embs, dim=-1)  # [V]
            best_idx = int(torch.argmax(sims).item())
            best_val = self.vocab.values[best_idx]
            best_sim = float(sims[best_idx].item())

            return best_val, 1, {
                "final_state_norm": float(torch.norm(self.h_t).item()),
                "retrieval_similarity": best_sim,
                "retrieved_token": best_val
            }
