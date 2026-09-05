"""Memory Capacity Stress Test Experiment.

Evaluates associative capacity bounds by packing N distinct key-value pairs into a bounded state.
"""

from typing import Dict, Any, List
import random
from evostate.experiments.base import BaseExperiment
from evostate.core.rng import get_rng


class MemoryCapacityExperiment(BaseExperiment):
    """
    Protocol:
    Sequence: [KEY_1:VAL_1, KEY_2:VAL_2, ... KEY_N:VAL_N, QUERY:KEY_target]
    Expected Output: VAL_target
    """

    def __init__(self, vocab=None):
        super().__init__(experiment_name="memory_capacity", vocab=vocab)

    def generate_trial(self, config: Dict[str, Any], seed: int) -> Dict[str, Any]:
        rng = get_rng(seed)
        num_pairs = int(config.get("num_pairs", 8))
        interleaved_padding = int(config.get("interleaved_padding", 1))

        # Select N unique keys and values
        avail_keys = self.vocab.keys[:min(len(self.vocab.keys), max(num_pairs + 5, 20))]
        avail_vals = self.vocab.values[:min(len(self.vocab.values), max(num_pairs + 5, 20))]

        selected_keys = rng.sample(avail_keys, num_pairs)
        selected_vals = rng.sample(avail_vals, num_pairs)
        pairs = list(zip(selected_keys, selected_vals))

        sequence: List[str] = []
        for k, v in pairs:
            sequence.append(f"{k}:{v}")
            for _ in range(interleaved_padding):
                sequence.append("<PAD>")

        # Pick one random key from the inserted pairs to query
        target_pair = rng.choice(pairs)
        target_key, target_val = target_pair
        query_token = f"QUERY:{target_key}"
        sequence.append(query_token)

        return {
            "sequence": sequence,
            "query_token": query_token,
            "expected_output": target_val,
            "num_stored_pairs": num_pairs
        }
