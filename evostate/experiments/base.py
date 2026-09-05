"""Base experiment definitions, execution harness, and result containers."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict, field
from typing import List, Dict, Any, Optional
import time

from evostate.models.base import BaseMemoryModel, MemoryStepTrace
from evostate.core.vocab import SyntheticVocab, GLOBAL_VOCAB
from evostate.core.metrics import calculate_exact_match, Timer


@dataclass
class ExperimentResult:
    """Canonical experiment output structure matching strict DataForge specification."""
    experiment: str
    configuration: Dict[str, Any]
    input_sequence: List[str]
    expected_output: str
    model_output: str
    correct: bool
    accuracy: float
    state_trace: List[Dict[str, Any]]
    inference_steps: int
    latency_ms: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class BaseExperiment(ABC):
    """Abstract base class for synthetic memory experiments."""

    def __init__(self, experiment_name: str, vocab: Optional[SyntheticVocab] = None):
        self.experiment_name = experiment_name
        self.vocab = vocab or GLOBAL_VOCAB

    @abstractmethod
    def generate_trial(
        self,
        config: Dict[str, Any],
        seed: int
    ) -> Dict[str, Any]:
        """
        Generates a synthetic sequence and expected output.
        Returns dict with keys: 'sequence', 'query_token', 'expected_output'
        """
        pass

    def run_single(
        self,
        model: BaseMemoryModel,
        config: Dict[str, Any],
        seed: int = 42
    ) -> ExperimentResult:
        """Run a single evaluation trial."""
        trial = self.generate_trial(config, seed=seed)
        sequence: List[str] = trial["sequence"]
        query_token: str = trial["query_token"]
        expected_output: str = trial["expected_output"]
        inference_budget: int = config.get("inference_budget", 1)

        with Timer() as t:
            pred_tok, traces, actual_steps, meta = model.run_sequence(
                sequence=sequence,
                query_token=query_token,
                vocab=self.vocab,
                inference_budget=inference_budget
            )

        correct = calculate_exact_match(pred_tok, expected_output)
        accuracy = 1.0 if correct else 0.0

        full_config = {
            "model_name": model.model_name,
            "state_dim": model.state_dim,
            "seed": seed,
            **config
        }

        return ExperimentResult(
            experiment=self.experiment_name,
            configuration=full_config,
            input_sequence=sequence,
            expected_output=expected_output,
            model_output=pred_tok,
            correct=correct,
            accuracy=accuracy,
            state_trace=[tr.to_dict() for tr in traces],
            inference_steps=actual_steps,
            latency_ms=round(t.elapsed_ms, 3)
        )

    def run_batch(
        self,
        model: BaseMemoryModel,
        config: Dict[str, Any],
        n_trials: int = 20,
        base_seed: int = 42
    ) -> Dict[str, Any]:
        """Run multiple trials and compute aggregate metrics."""
        results: List[ExperimentResult] = []
        total_latency = 0.0
        correct_count = 0

        for i in range(n_trials):
            trial_seed = base_seed + (i * 1337)
            res = self.run_single(model, config, seed=trial_seed)
            results.append(res)
            total_latency += res.latency_ms
            if res.correct:
                correct_count += 1

        overall_accuracy = correct_count / max(1, n_trials)
        avg_latency = total_latency / max(1, n_trials)

        # Pick representative sample for structured response
        sample_res = results[0]

        return {
            "experiment": self.experiment_name,
            "configuration": {
                **sample_res.configuration,
                "n_trials": n_trials,
                "base_seed": base_seed
            },
            "input_sequence": sample_res.input_sequence,
            "expected_output": sample_res.expected_output,
            "model_output": sample_res.model_output,
            "correct": sample_res.correct,
            "accuracy": round(overall_accuracy, 4),
            "state_trace": sample_res.state_trace,
            "inference_steps": sample_res.inference_steps,
            "latency_ms": round(avg_latency, 3),
            "batch_details": {
                "n_trials": n_trials,
                "correct_trials": correct_count,
                "trial_latencies_ms": [r.latency_ms for r in results]
            }
        }
