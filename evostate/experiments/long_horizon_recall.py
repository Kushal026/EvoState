"""Long-Horizon Recall Experiment.

Evaluates memory retention across long sequence lengths T with multiple interspersed items and clutter.
"""

from typing import Dict, Any, List
import random
from evostate.experiments.base import BaseExperiment
from evostate.core.rng import get_rng


class LongHorizonRecallExperiment(BaseExperiment):
    """
    Protocol:
    Sequence: Injects N key-value pairs at random positions across total length T,
    filled with distractor/noise tokens.
    Queries one of the inserted keys at the end of the sequence.
    """

    def __init__(self, vocab=None):
        super().__init__(experiment_name="long_horizon_recall", vocab=vocab)

    def generate_trial(self, config: Dict[str, Any], seed: int) -> Dict[str, Any]:
        rng = get_rng(seed)
        total_length_T = int(config.get("sequence_length", 64))
        num_items = int(config.get("num_items", 4))
        noise_variance = float(config.get("noise_variance", 0.1))

        # Select unique keys and values
        selected_keys = rng.sample(self.vocab.keys[:20], num_items)
        selected_vals = rng.sample(self.vocab.values[:20], num_items)
        pairs = list(zip(selected_keys, selected_vals))

        # Determine positions for pairs
        min_spacing = max(1, total_length_T // (num_items + 2))
        insert_indices = sorted(rng.sample(range(0, total_length_T - 1), num_items))

        sequence: List[str] = []
        pair_idx = 0
        pair_map = dict(pairs)

        for t in range(total_length_T):
            if t in insert_indices and pair_idx < num_items:
                k, v = pairs[pair_idx]
                sequence.append(f"{k}:{v}")
                pair_idx += 1
            else:
                noise_id = rng.randint(0, 30)
                sequence.append(f"NOISE_{noise_id}")

        # Pick one key to query
        target_pair = rng.choice(pairs)
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
