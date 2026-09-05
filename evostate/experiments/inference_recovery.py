"""Inference-Time Recovery Experiment.

Evaluates how additional test-time compute (inference_budget >= 1) improves signal recovery
under high interference, superposition clutter, and memory degradation.
"""

from typing import Dict, Any, List
import random
from evostate.experiments.base import BaseExperiment
from evostate.core.rng import get_rng


class InferenceRecoveryExperiment(BaseExperiment):
    """
    Protocol:
    Sequence: Packs multiple items into memory under moderate interference / noise,
    then executes query under variable test-time compute budgets C_infer.
    """

    def __init__(self, vocab=None):
        super().__init__(experiment_name="inference_recovery", vocab=vocab)

    def generate_trial(self, config: Dict[str, Any], seed: int) -> Dict[str, Any]:
        rng = get_rng(seed)
        num_clutter_pairs = int(config.get("clutter_pairs", 6))
        noise_steps = int(config.get("noise_steps", 8))

        # Select unique keys and values
        avail_keys = self.vocab.keys[:min(len(self.vocab.keys), num_clutter_pairs + 5)]
        avail_vals = self.vocab.values[:min(len(self.vocab.values), num_clutter_pairs + 5)]

        selected_keys = rng.sample(avail_keys, num_clutter_pairs)
        selected_vals = rng.sample(avail_vals, num_clutter_pairs)
        pairs = list(zip(selected_keys, selected_vals))

        sequence: List[str] = []
        
        # Inject pairs with noise in between
        for k, v in pairs:
            sequence.append(f"{k}:{v}")
            for _ in range(rng.randint(1, 3)):
                sequence.append(f"NOISE_{rng.randint(0, 15)}")

        # Add trailing noise
        for _ in range(noise_steps):
            sequence.append(f"NOISE_{rng.randint(0, 15)}")

        # Pick one key inserted earlier (susceptible to attenuation/interference)
        target_pair = pairs[0]  # Oldest pair has highest attenuation
        target_key, target_val = target_pair
        query_token = f"QUERY:{target_key}"
        sequence.append(query_token)

        return {
            "sequence": sequence,
            "query_token": query_token,
            "expected_output": target_val,
            "target_key": target_key,
            "all_pairs": pairs
        }
