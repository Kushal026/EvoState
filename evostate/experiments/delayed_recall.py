"""Delayed Recall Experiment.

Evaluates memory retention across varying temporal lags k between needle insertion and query.
"""

from typing import Dict, Any, List
import random
from evostate.experiments.base import BaseExperiment
from evostate.core.rng import get_rng


class DelayedRecallExperiment(BaseExperiment):
    """
    Protocol:
    Sequence: [KEY_X:VAL_Y, <PAD>, <PAD>, ... (k times) ..., QUERY:KEY_X]
    Expected Output: VAL_Y
    """

    def __init__(self, vocab=None):
        super().__init__(experiment_name="delayed_recall", vocab=vocab)

    def generate_trial(self, config: Dict[str, Any], seed: int) -> Dict[str, Any]:
        rng = get_rng(seed)
        delay_k = int(config.get("delay", 16))
        use_distractors = bool(config.get("use_distractors", False))

        target_key = rng.choice(self.vocab.keys[:10])
        target_val = rng.choice(self.vocab.values[:10])

        sequence: List[str] = [f"{target_key}:{target_val}"]

        for step in range(delay_k):
            if use_distractors:
                noise_tok = f"NOISE_{rng.randint(0, 20)}"
                sequence.append(noise_tok)
            else:
                sequence.append("<PAD>")

        query_token = f"QUERY:{target_key}"
        sequence.append(query_token)

        return {
            "sequence": sequence,
            "query_token": query_token,
            "expected_output": target_val
        }
