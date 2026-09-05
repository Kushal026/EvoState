"""Interference & Conflicting Key Updates Experiment.

Evaluates how memory models handle conflicting updates / overwrites to the same key.
"""

from typing import Dict, Any, List
import random
from evostate.experiments.base import BaseExperiment
from evostate.core.rng import get_rng


class InterferenceExperiment(BaseExperiment):
    """
    Protocol:
    Sequence: [KEY_A:VAL_1, <PAD>...<PAD>, KEY_A:VAL_2, ... KEY_A:VAL_N, QUERY:KEY_A]
    Expected Output: VAL_N (recency mode) or VAL_1 (primacy mode)
    """

    def __init__(self, vocab=None):
        super().__init__(experiment_name="interference", vocab=vocab)

    def generate_trial(self, config: Dict[str, Any], seed: int) -> Dict[str, Any]:
        rng = get_rng(seed)
        num_overwrites = int(config.get("num_overwrites", 3))
        spacing = int(config.get("spacing", 4))
        target_mode = str(config.get("target_mode", "recency")).lower()

        target_key = rng.choice(self.vocab.keys[:10])
        chosen_vals = rng.sample(self.vocab.values[:15], num_overwrites)

        sequence: List[str] = []

        for idx, val in enumerate(chosen_vals):
            sequence.append(f"{target_key}:{val}")
            for _ in range(spacing):
                sequence.append("<PAD>")

        # Query token
        query_token = f"QUERY:{target_key}"
        sequence.append(query_token)

        expected_val = chosen_vals[-1] if target_mode == "recency" else chosen_vals[0]

        return {
            "sequence": sequence,
            "query_token": query_token,
            "expected_output": expected_val,
            "all_assigned_values": chosen_vals
        }
