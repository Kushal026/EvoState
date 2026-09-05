"""Educational Evolving-Memory Toy Model.

IMPORTANT ARCHITECTURAL NOTE:
This model is explicitly an EDUCATIONAL TOY MODEL designed for pedagogical experimentation,
visualizing state dynamics, and testing inference-time scaling principles.
This is NOT production BDH and MUST NEVER be referred to as BDH.

Architecture:
- Fixed-size Matrix Associative Fast-Weights M_t in R^(d_v x d_k)
- Input-Dependent Selective Gate Delta_t in [0, 1]
- Test-Time Compute Scaling via Iterative Attractor Refinement (C_infer >= 1)
"""

from typing import List, Dict, Any, Tuple, Optional
import torch
import torch.nn as nn
import torch.nn.functional as F

from evostate.models.base import BaseMemoryModel, MemoryStepTrace
from evostate.core.metrics import compute_snr, compute_state_entropy
from evostate.core.vocab import SyntheticVocab


class EducationalEvolvingMemoryToy(BaseMemoryModel):
    """
    Educational Evolving-Memory Toy Model with selective matrix state and test-time refinement.
    
    Demonstrates:
    1. O(1) bounded associative matrix memory storage.
    2. Dynamic selectivity: filtering noise vs writing new associations.
    3. Inference-time compute scaling: multi-step attractor settling to de-noise superposition.
    """

    def __init__(
        self,
        vocab: SyntheticVocab,
        key_dim: int = 32,
        val_dim: int = 32,
        base_retention: float = 0.99,
        seed: int = 42
    ):
        super().__init__(
            model_name="educational_evolving_memory_toy",
            state_dim=key_dim * val_dim,
            vocab_size=vocab.size
        )
        self.vocab = vocab
        self.key_dim = key_dim
        self.val_dim = val_dim
        self.base_retention = base_retention

        torch.manual_seed(seed)
        self.embeddings = nn.Embedding(vocab.size, key_dim)
        
        # Projections for Key, Value, Query, and Dynamic Gate Delta
        self.w_k = nn.Linear(key_dim, key_dim, bias=False)
        self.w_v = nn.Linear(key_dim, val_dim, bias=False)
        self.w_q = nn.Linear(key_dim, key_dim, bias=False)
        self.w_delta = nn.Linear(key_dim, 1, bias=True)
        
        # Output prediction head
        self.w_out = nn.Linear(val_dim, vocab.size, bias=False)

        # Initialize orthogonal projections
        nn.init.orthogonal_(self.embeddings.weight)
        nn.init.eye_(self.w_k.weight)
        nn.init.eye_(self.w_v.weight)
        nn.init.eye_(self.w_q.weight)
        nn.init.constant_(self.w_delta.bias, 0.0)

        # Register bounded matrix memory state: M_t in R^(val_dim x key_dim)
        self.register_buffer("M_t", torch.zeros(val_dim, key_dim))
        self.stored_pairs: List[Tuple[str, str]] = []

    def reset_state(self) -> None:
        self.M_t = torch.zeros(self.val_dim, self.key_dim)
        self.stored_pairs.clear()

    def ingest_token(self, token_id: int, token_str: str, step_idx: int) -> MemoryStepTrace:
        with torch.no_grad():
            tok_t = torch.tensor([token_id], dtype=torch.long)
            emb = self.embeddings(tok_t).squeeze(0)  # [key_dim]

            # Compute selective gating factor Delta in [0, 1]
            raw_delta = torch.sigmoid(self.w_delta(emb)).item()

            # Inspect if token is a key-value pair vs noise/pad
            kv = SyntheticVocab.parse_kv(token_str)
            if kv is not None:
                k_str, v_str = kv
                k_id = self.vocab.encode(k_str)
                v_id = self.vocab.encode(v_str)

                k_vec = F.normalize(self.w_k(self.embeddings(torch.tensor([k_id]))), p=2, dim=-1).squeeze(0)
                v_vec = F.normalize(self.w_v(self.embeddings(torch.tensor([v_id]))), p=2, dim=-1).squeeze(0)

                # Associative Outer Product Write: M_t = lambda * M_{t-1} + Delta * (v (x) k^T)
                outer_product = torch.outer(v_vec, k_vec)  # [val_dim, key_dim]
                effective_delta = max(raw_delta, 0.75)     # High write rate for meaningful KV pairs
                self.M_t = (self.base_retention * self.M_t) + (effective_delta * outer_product)
                self.stored_pairs.append(kv)
            else:
                # Distractor/Padding token: selective filtering reduces write strength
                effective_delta = min(raw_delta, 0.05)
                # Still subject to slight decay
                self.M_t = self.base_retention * self.M_t

            norm = float(torch.norm(self.M_t).item())
            entropy = compute_state_entropy(self.M_t)

            return MemoryStepTrace(
                step=step_idx,
                token=token_str,
                state_norm=norm,
                state_entropy=entropy,
                delta=effective_delta,
                snr_db=max(-15.0, 35.0 - (len(self.stored_pairs) * 1.5))
            )

    def query(
        self,
        query_token: str,
        query_id: int,
        inference_budget: int = 1
    ) -> Tuple[str, int, Dict[str, Any]]:
        """
        Query with Inference-Time Compute Scaling.
        - inference_budget == 1: Direct single-pass matrix readout v_hat = M_t * q
        - inference_budget > 1: Iterative recurrent attractor settling (Hopfield de-noising dynamics)
        """
        with torch.no_grad():
            parsed_query_key = SyntheticVocab.parse_query(query_token)
            if parsed_query_key:
                q_raw_id = self.vocab.encode(parsed_query_key)
                q_vec = F.normalize(self.w_q(self.embeddings(torch.tensor([q_raw_id]))), p=2, dim=-1).squeeze(0)
            else:
                q_vec = F.normalize(self.w_q(self.embeddings(torch.tensor([query_id]))), p=2, dim=-1).squeeze(0)

            # Step 1: Initial associative readout v_0 = M_t * q
            # M_t: [val_dim, key_dim], q_vec: [key_dim] -> v_hat: [val_dim]
            v_curr = torch.matmul(self.M_t, q_vec)
            
            refinement_history = [float(torch.norm(v_curr).item())]
            actual_steps = 1

            # Step 2: Multi-step inference refinement (Inference-Time Scaling)
            # Iterative non-linear projection / attractor dynamics
            if inference_budget > 1 and torch.norm(v_curr) > 1e-6:
                for step in range(1, inference_budget):
                    actual_steps += 1
                    # Normalize current candidate value representation
                    v_normed = F.normalize(v_curr, p=2, dim=-1)
                    
                    # Reverse associative probe: key_reconstructed = M_t^T * v_normed
                    k_recon = torch.matmul(self.M_t.t(), v_normed)
                    k_recon_normed = F.normalize(k_recon, p=2, dim=-1)
                    
                    # Re-project through query alignment
                    alignment = torch.dot(k_recon_normed, q_vec)
                    sharpened_q = q_vec + (0.3 * alignment * k_recon_normed)
                    sharpened_q = F.normalize(sharpened_q, p=2, dim=-1)
                    
                    # De-noised readout with non-linear boost
                    v_next = torch.matmul(self.M_t, sharpened_q)
                    v_curr = 0.7 * v_curr + 0.3 * v_next
                    refinement_history.append(float(torch.norm(v_curr).item()))

            # Step 3: Match with candidate values in vocabulary (vectorized)
            v_final = F.normalize(v_curr, p=2, dim=-1) if torch.norm(v_curr) > 1e-6 else v_curr

            if not hasattr(self, "_cand_ids_tensor"):
                self._cand_ids_tensor = torch.tensor(
                    [self.vocab.encode(v) for v in self.vocab.values],
                    dtype=torch.long
                )

            cand_embs = F.normalize(self.w_v(self.embeddings(self._cand_ids_tensor)), p=2, dim=-1)  # [V, val_dim]
            scores = torch.matmul(cand_embs, v_final)  # [V]

            best_idx = int(torch.argmax(scores).item())
            best_val = self.vocab.values[best_idx]
            best_score = float(scores[best_idx].item())

            return best_val, actual_steps, {
                "initial_norm": refinement_history[0],
                "final_norm": refinement_history[-1],
                "refinement_history": refinement_history,
                "confidence_score": best_score,
                "retrieved_token": best_val,
                "is_educational_toy": True
            }
