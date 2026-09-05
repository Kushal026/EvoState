"""Generates verified, actual real JSON outputs for each experiment and model."""

import os
import json
from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import get_model
from evostate.experiments import get_experiment


def generate_sample_outputs(output_path: str = "results/sample_outputs.json", seed: int = 42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    experiments_plan = [
        {
            "exp_name": "delayed_recall",
            "model_name": "educational_evolving_memory_toy",
            "config": {"delay": 16, "use_distractors": False, "inference_budget": 3}
        },
        {
            "exp_name": "long_horizon_recall",
            "model_name": "educational_evolving_memory_toy",
            "config": {"sequence_length": 64, "num_items": 4, "inference_budget": 4}
        },
        {
            "exp_name": "interference",
            "model_name": "educational_evolving_memory_toy",
            "config": {"num_overwrites": 3, "spacing": 2, "target_mode": "recency", "inference_budget": 2}
        },
        {
            "exp_name": "memory_capacity",
            "model_name": "educational_evolving_memory_toy",
            "config": {"num_pairs": 6, "interleaved_padding": 1, "inference_budget": 4}
        },
        {
            "exp_name": "inference_recovery",
            "model_name": "educational_evolving_memory_toy",
            "config": {"clutter_pairs": 5, "noise_steps": 6, "inference_budget": 5}
        },
        {
            "exp_name": "delayed_recall",
            "model_name": "full_history_reference_baseline",
            "config": {"delay": 32, "use_distractors": True}
        },
        {
            "exp_name": "delayed_recall",
            "model_name": "fixed_size_recurrent_memory",
            "config": {"delay": 32, "use_distractors": True}
        }
    ]

    sample_results = []

    for item in experiments_plan:
        exp = get_experiment(item["exp_name"], vocab=GLOBAL_VOCAB)
        model = get_model(
            item["model_name"],
            vocab=GLOBAL_VOCAB,
            state_dim=32,
            decay=0.98,
            seed=seed
        )
        res = exp.run_single(model, item["config"], seed=seed)
        sample_results.append(res.to_dict())

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(sample_results, f, indent=2)

    print(f"Sample real outputs generated successfully at: {output_path}")
    return sample_results


if __name__ == "__main__":
    generate_sample_outputs()
