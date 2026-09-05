"""Comprehensive Benchmark Suite for DataForge: Evolving Memory Lab.

Executes all 5 experiments across all 3 models using strict reproducible seeds
and logs real, non-invented empirical metrics.
"""

import os
import json
import time
from typing import Dict, Any, List
import pandas as pd
import numpy as np

from evostate.core.vocab import GLOBAL_VOCAB
from evostate.models import get_model
from evostate.experiments import get_experiment


def run_full_benchmark_suite(output_dir: str = "results", seed: int = 42) -> Dict[str, Any]:
    os.makedirs(output_dir, exist_ok=True)
    models_to_test = [
        "full_history_reference_baseline",
        "fixed_size_recurrent_memory",
        "educational_evolving_memory_toy"
    ]

    all_records = []
    detailed_benchmarks = {}

    print("=" * 70)
    print("DATAFORGE: EVOLVING MEMORY LAB - BENCHMARK SUITE")
    print(f"Base Random Seed: {seed}")
    print("=" * 70)

    # 1. Delayed Recall Benchmark (Sweep delay k in [4, 16, 32, 64, 128])
    print("\n[1/5] Running Delayed Recall Benchmark...")
    exp_delayed = get_experiment("delayed_recall", vocab=GLOBAL_VOCAB)
    delays = [4, 16, 32, 64, 128]
    detailed_benchmarks["delayed_recall"] = []

    for m_name in models_to_test:
        for k in delays:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=seed)
            res = exp_delayed.run_batch(model, {"delay": k, "use_distractors": False}, n_trials=25, base_seed=seed)
            row = {
                "experiment": "delayed_recall",
                "model": m_name,
                "parameter": "delay_k",
                "param_value": k,
                "accuracy": res["accuracy"],
                "latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            }
            all_records.append(row)
            detailed_benchmarks["delayed_recall"].append(row)
            print(f"  Model: {m_name:<35} Delay: {k:>3} | Acc: {res['accuracy']:.2%} | Latency: {res['latency_ms']:.2f}ms")

    # 2. Long-Horizon Recall Benchmark (Sweep sequence length T in [32, 64, 128, 256, 512])
    print("\n[2/5] Running Long-Horizon Recall Benchmark...")
    exp_lh = get_experiment("long_horizon_recall", vocab=GLOBAL_VOCAB)
    lengths = [32, 64, 128, 256, 512]
    detailed_benchmarks["long_horizon_recall"] = []

    for m_name in models_to_test:
        for length in lengths:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=seed)
            res = exp_lh.run_batch(model, {"sequence_length": length, "num_items": 4}, n_trials=25, base_seed=seed)
            row = {
                "experiment": "long_horizon_recall",
                "model": m_name,
                "parameter": "sequence_length",
                "param_value": length,
                "accuracy": res["accuracy"],
                "latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            }
            all_records.append(row)
            detailed_benchmarks["long_horizon_recall"].append(row)
            print(f"  Model: {m_name:<35} Length: {length:>3} | Acc: {res['accuracy']:.2%} | Latency: {res['latency_ms']:.2f}ms")

    # 3. Interference Benchmark (Sweep num_overwrites in [1, 2, 3, 5, 8])
    print("\n[3/5] Running Interference Benchmark...")
    exp_int = get_experiment("interference", vocab=GLOBAL_VOCAB)
    overwrites = [1, 2, 3, 5, 8]
    detailed_benchmarks["interference"] = []

    for m_name in models_to_test:
        for num_ow in overwrites:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=seed)
            res = exp_int.run_batch(model, {"num_overwrites": num_ow, "spacing": 3, "target_mode": "recency"}, n_trials=25, base_seed=seed)
            row = {
                "experiment": "interference",
                "model": m_name,
                "parameter": "num_overwrites",
                "param_value": num_ow,
                "accuracy": res["accuracy"],
                "latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            }
            all_records.append(row)
            detailed_benchmarks["interference"].append(row)
            print(f"  Model: {m_name:<35} Overwrites: {num_ow:>2} | Acc: {res['accuracy']:.2%} | Latency: {res['latency_ms']:.2f}ms")

    # 4. Memory Capacity Benchmark (Sweep num_pairs in [2, 4, 8, 16, 24])
    print("\n[4/5] Running Memory Capacity Benchmark...")
    exp_cap = get_experiment("memory_capacity", vocab=GLOBAL_VOCAB)
    pairs = [2, 4, 8, 16, 24]
    detailed_benchmarks["memory_capacity"] = []

    for m_name in models_to_test:
        for num_p in pairs:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=seed)
            res = exp_cap.run_batch(model, {"num_pairs": num_p, "interleaved_padding": 1}, n_trials=25, base_seed=seed)
            row = {
                "experiment": "memory_capacity",
                "model": m_name,
                "parameter": "num_pairs",
                "param_value": num_p,
                "accuracy": res["accuracy"],
                "latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            }
            all_records.append(row)
            detailed_benchmarks["memory_capacity"].append(row)
            print(f"  Model: {m_name:<35} Pairs: {num_p:>2} | Acc: {res['accuracy']:.2%} | Latency: {res['latency_ms']:.2f}ms")

    # 5. Inference-Time Recovery Benchmark (Sweep inference_budget in [1, 2, 4, 8, 16])
    print("\n[5/5] Running Inference-Time Recovery Benchmark...")
    exp_rec = get_experiment("inference_recovery", vocab=GLOBAL_VOCAB)
    budgets = [1, 2, 4, 8, 16]
    detailed_benchmarks["inference_recovery"] = []

    for m_name in models_to_test:
        for bud in budgets:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=seed)
            res = exp_rec.run_batch(model, {"clutter_pairs": 6, "noise_steps": 6, "inference_budget": bud}, n_trials=25, base_seed=seed)
            row = {
                "experiment": "inference_recovery",
                "model": m_name,
                "parameter": "inference_budget",
                "param_value": bud,
                "accuracy": res["accuracy"],
                "latency_ms": res["latency_ms"],
                "inference_steps": res["inference_steps"]
            }
            all_records.append(row)
            detailed_benchmarks["inference_recovery"].append(row)
            print(f"  Model: {m_name:<35} Budget: {bud:>2} | Acc: {res['accuracy']:.2%} | Latency: {res['latency_ms']:.2f}ms")

    # Save to JSON
    out_json = os.path.join(output_dir, "benchmark_results.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "seed": seed,
            "benchmarks": detailed_benchmarks,
            "all_records": all_records
        }, f, indent=2)

    # Save to CSV
    df = pd.DataFrame(all_records)
    out_csv = os.path.join(output_dir, "benchmark_results.csv")
    df.to_csv(out_csv, index=False)

    print("\n" + "=" * 70)
    print(f"Benchmark results successfully saved to:\n  - {out_json}\n  - {out_csv}")
    print("=" * 70)

    return {"records": all_records, "summary": detailed_benchmarks}


if __name__ == "__main__":
    run_full_benchmark_suite()
