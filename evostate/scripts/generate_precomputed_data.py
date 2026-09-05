"""Reproducible Precomputed Experiment Pipeline and Publication Visualizer.

Executes controlled scientific sweeps over:
1. Sequence Length (T)
2. Memory Capacity (N_pairs)
3. Interference Strength (N_overwrites)
4. Inference Effort / Test-Time Compute (C_infer)

Generates:
- Complete trial-level datasets (JSON & CSV)
- Comprehensive summary statistics with 95% Confidence Intervals
- Publication-quality scientific figures at 300 DPI
"""

import os
import json
import time
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import seaborn as sns

from evostate.core.vocab import GLOBAL_VOCAB
from evostate.core.rng import seed_everything
from evostate.models import get_model
from evostate.experiments import get_experiment


# Setup publication plot style
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams.update({
    "font.size": 11,
    "axes.labelsize": 13,
    "axes.titlesize": 14,
    "xtick.labelsize": 11,
    "ytick.labelsize": 11,
    "legend.fontsize": 11,
    "figure.titlesize": 16,
    "figure.dpi": 300,
    "lines.linewidth": 2.2,
    "lines.markersize": 6,
    "grid.alpha": 0.4
})

MODEL_PALETTE = {
    "full_history_reference_baseline": "#2563EB",       # Royal Blue
    "fixed_size_recurrent_memory": "#DC2626",           # Crimson Red
    "educational_evolving_memory_toy": "#10B981"        # Emerald Green
}

MODEL_LABELS = {
    "full_history_reference_baseline": "Full-History KV Cache [O(T)]",
    "fixed_size_recurrent_memory": "Fixed-Size Recurrent [O(d)]",
    "educational_evolving_memory_toy": "Educational Evolving Toy [O(1)]"
}

MODEL_MARKERS = {
    "full_history_reference_baseline": "o",
    "fixed_size_recurrent_memory": "s",
    "educational_evolving_memory_toy": "^"
}


def run_pipeline(
    output_dir: str = "data/precomputed",
    n_trials_per_point: int = 30,
    base_seed: int = 42
) -> Dict[str, Any]:
    """Execute the full sweep suite and export all data and plots."""
    os.makedirs(output_dir, exist_ok=True)
    plots_dir = os.path.join(output_dir, "plots")
    os.makedirs(plots_dir, exist_ok=True)

    print("=" * 75)
    print("DATAFORGE 2026: REPRODUCIBLE PRECOMPUTED EXPERIMENT GENERATION PIPELINE")
    print(f"Base Random Seed: {base_seed} | Monte Carlo Trials Per Point: {n_trials_per_point}")
    print(f"Output Directory: {output_dir}")
    print("=" * 75)

    models_list = [
        "full_history_reference_baseline",
        "fixed_size_recurrent_memory",
        "educational_evolving_memory_toy"
    ]

    all_trial_records: List[Dict[str, Any]] = []

    # -------------------------------------------------------------
    # SWEEP 1: Sequence Length Scaling (T in [16, 32, 64, 128, 256, 512, 1024])
    # -------------------------------------------------------------
    print("\n[Sweep 1/4] Running Sequence Length Scaling Sweep (T in [16..1024])...")
    exp_lh = get_experiment("long_horizon_recall", vocab=GLOBAL_VOCAB)
    seq_lengths = [16, 32, 64, 128, 256, 512, 1024]
    sweep1_records: List[Dict[str, Any]] = []

    for m_name in models_list:
        for T in seq_lengths:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=base_seed)
            for trial_idx in range(n_trials_per_point):
                seed = base_seed + (trial_idx * 7919) + T
                config = {"sequence_length": T, "num_items": 4, "state_dim": 32}
                res = exp_lh.run_single(model, config, seed=seed)

                record = {
                    "sweep_type": "sequence_length",
                    "experiment": "long_horizon_recall",
                    "model": m_name,
                    "parameter_name": "sequence_length",
                    "parameter_value": T,
                    "seed": seed,
                    "accuracy": float(res.accuracy),
                    "error_rate": float(1.0 - res.accuracy),
                    "latency": float(res.latency_ms),
                    "inference_steps": int(res.inference_steps),
                    "configuration": res.configuration
                }
                all_trial_records.append(record)
                sweep1_records.append(record)

    # -------------------------------------------------------------
    # SWEEP 2: Memory Capacity Scaling (N_pairs in [1, 2, 4, 8, 12, 16, 24, 32])
    # -------------------------------------------------------------
    print("\n[Sweep 2/4] Running Memory Capacity Scaling Sweep (N_pairs in [1..32])...")
    exp_cap = get_experiment("memory_capacity", vocab=GLOBAL_VOCAB)
    capacity_loads = [1, 2, 4, 8, 12, 16, 24, 32]
    sweep2_records: List[Dict[str, Any]] = []

    for m_name in models_list:
        for n_pairs in capacity_loads:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=base_seed)
            for trial_idx in range(n_trials_per_point):
                seed = base_seed + (trial_idx * 7919) + n_pairs
                config = {"num_pairs": n_pairs, "interleaved_padding": 1, "state_dim": 32}
                res = exp_cap.run_single(model, config, seed=seed)

                record = {
                    "sweep_type": "memory_capacity",
                    "experiment": "memory_capacity",
                    "model": m_name,
                    "parameter_name": "num_pairs",
                    "parameter_value": n_pairs,
                    "seed": seed,
                    "accuracy": float(res.accuracy),
                    "error_rate": float(1.0 - res.accuracy),
                    "latency": float(res.latency_ms),
                    "inference_steps": int(res.inference_steps),
                    "configuration": res.configuration
                }
                all_trial_records.append(record)
                sweep2_records.append(record)

    # -------------------------------------------------------------
    # SWEEP 3: Interference / Overwrite Scaling (N_overwrites in [1, 2, 3, 4, 6, 8, 10])
    # -------------------------------------------------------------
    print("\n[Sweep 3/4] Running Interference Overwrite Sweep (N_overwrites in [1..10])...")
    exp_int = get_experiment("interference", vocab=GLOBAL_VOCAB)
    overwrites = [1, 2, 3, 4, 6, 8, 10]
    sweep3_records: List[Dict[str, Any]] = []

    for m_name in models_list:
        for ow in overwrites:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=base_seed)
            for trial_idx in range(n_trials_per_point):
                seed = base_seed + (trial_idx * 7919) + ow
                config = {"num_overwrites": ow, "spacing": 3, "target_mode": "recency", "state_dim": 32}
                res = exp_int.run_single(model, config, seed=seed)

                record = {
                    "sweep_type": "interference",
                    "experiment": "interference",
                    "model": m_name,
                    "parameter_name": "num_overwrites",
                    "parameter_value": ow,
                    "seed": seed,
                    "accuracy": float(res.accuracy),
                    "error_rate": float(1.0 - res.accuracy),
                    "latency": float(res.latency_ms),
                    "inference_steps": int(res.inference_steps),
                    "configuration": res.configuration
                }
                all_trial_records.append(record)
                sweep3_records.append(record)

    # -------------------------------------------------------------
    # SWEEP 4: Inference Effort / Test-Time Scaling (C_infer in [1, 2, 3, 4, 6, 8, 12, 16])
    # -------------------------------------------------------------
    print("\n[Sweep 4/4] Running Inference Effort Scaling Sweep (C_infer in [1..16])...")
    exp_rec = get_experiment("inference_recovery", vocab=GLOBAL_VOCAB)
    budgets = [1, 2, 3, 4, 6, 8, 12, 16]
    sweep4_records: List[Dict[str, Any]] = []

    for m_name in models_list:
        for c_infer in budgets:
            model = get_model(m_name, vocab=GLOBAL_VOCAB, state_dim=32, decay=0.98, seed=base_seed)
            for trial_idx in range(n_trials_per_point):
                seed = base_seed + (trial_idx * 7919) + c_infer
                config = {"clutter_pairs": 4, "noise_steps": 6, "inference_budget": c_infer, "state_dim": 32}
                res = exp_rec.run_single(model, config, seed=seed)

                record = {
                    "sweep_type": "inference_effort",
                    "experiment": "inference_recovery",
                    "model": m_name,
                    "parameter_name": "inference_budget",
                    "parameter_value": c_infer,
                    "seed": seed,
                    "accuracy": float(res.accuracy),
                    "error_rate": float(1.0 - res.accuracy),
                    "latency": float(res.latency_ms),
                    "inference_steps": int(res.inference_steps),
                    "configuration": res.configuration
                }
                all_trial_records.append(record)
                sweep4_records.append(record)

    # -------------------------------------------------------------
    # DATA EXPORTS: CSV & JSON
    # -------------------------------------------------------------
    print("\nProcessing summary statistics and exporting datasets...")
    df_master = pd.DataFrame(all_trial_records)
    master_csv_path = os.path.join(output_dir, "sweeps_master.csv")
    df_master.to_csv(master_csv_path, index=False)

    # Compute comprehensive summary statistics
    summary_rows = []
    grouped = df_master.groupby(["sweep_type", "experiment", "model", "parameter_name", "parameter_value"])

    for (sw_type, exp_name, m_name, p_name, p_val), group in grouped:
        accs = group["accuracy"].values
        lats = group["latency"].values
        errs = group["error_rate"].values
        steps = group["inference_steps"].values

        n = len(accs)
        mean_acc = float(np.mean(accs))
        std_acc = float(np.std(accs, ddof=1)) if n > 1 else 0.0
        ci95_acc = 1.96 * (std_acc / np.sqrt(n)) if n > 1 else 0.0

        mean_err = float(np.mean(errs))
        std_err = float(np.std(errs, ddof=1)) if n > 1 else 0.0

        mean_lat = float(np.mean(lats))
        std_lat = float(np.std(lats, ddof=1)) if n > 1 else 0.0
        median_lat = float(np.median(lats))
        p95_lat = float(np.percentile(lats, 95))
        # Ensure parameter_value is Python native
        clean_p_val = int(p_val) if isinstance(p_val, (np.integer, int)) else (float(p_val) if isinstance(p_val, (np.floating, float)) else str(p_val))

        summary_rows.append({
            "sweep_type": str(sw_type),
            "experiment": str(exp_name),
            "model": str(m_name),
            "model_label": str(MODEL_LABELS[m_name]),
            "parameter_name": str(p_name),
            "parameter_value": clean_p_val,
            "n_trials": int(n),
            "mean_accuracy": float(round(mean_acc, 4)),
            "std_accuracy": float(round(std_acc, 4)),
            "ci95_accuracy_low": float(round(max(0.0, mean_acc - ci95_acc), 4)),
            "ci95_accuracy_high": float(round(min(1.0, mean_acc + ci95_acc), 4)),
            "mean_error_rate": float(round(mean_err, 4)),
            "std_error_rate": float(round(std_err, 4)),
            "mean_latency_ms": float(round(mean_lat, 3)),
            "std_latency_ms": float(round(std_lat, 3)),
            "median_latency_ms": float(round(median_lat, 3)),
            "p95_latency_ms": float(round(p95_lat, 3)),
            "mean_inference_steps": float(round(float(np.mean(steps)), 2))
        })

    df_summary = pd.DataFrame(summary_rows)
    summary_csv_path = os.path.join(output_dir, "summary_statistics.csv")
    df_summary.to_csv(summary_csv_path, index=False)

    # Export structured JSON files
    sweeps_json_path = os.path.join(output_dir, "sweeps_data.json")
    with open(sweeps_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "base_seed": base_seed,
            "n_trials_per_point": n_trials_per_point,
            "total_records": len(all_trial_records),
            "trials": all_trial_records
        }, f, indent=2)

    summary_json_path = os.path.join(output_dir, "summary_stats.json")
    with open(summary_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "base_seed": base_seed,
            "summary": summary_rows
        }, f, indent=2)

    # Individual sweep JSONs for frontend
    for sw_name, sw_recs in [
        ("sequence_length_sweep.json", sweep1_records),
        ("memory_capacity_sweep.json", sweep2_records),
        ("interference_sweep.json", sweep3_records),
        ("inference_effort_sweep.json", sweep4_records)
    ]:
        with open(os.path.join(output_dir, sw_name), "w", encoding="utf-8") as f:
            json.dump(sw_recs, f, indent=2)

    # -------------------------------------------------------------
    # PUBLICATION-QUALITY PLOTS GENERATION
    # -------------------------------------------------------------
    print("\nGenerating publication-quality scientific plots (300 DPI)...")
    generate_publication_plots(df_summary, df_master, plots_dir)

    print("\n" + "=" * 75)
    print("ALL DATASETS AND FIGURES SUCCESSFULLY GENERATED!")
    print(f"Master CSV:  {master_csv_path}")
    print(f"Summary CSV: {summary_csv_path}")
    print(f"JSON Master: {sweeps_json_path}")
    print(f"Plots Dir:   {plots_dir}")
    print("=" * 75)

    return {
        "master_csv": master_csv_path,
        "summary_csv": summary_csv_path,
        "sweeps_json": sweeps_json_path,
        "summary_json": summary_json_path,
        "plots_dir": plots_dir
    }


def generate_publication_plots(df_summary: pd.DataFrame, df_master: pd.DataFrame, plots_dir: str):
    """Generate the 6 required standalone plots plus the composite figure."""

    # 1. Plot 1: Accuracy vs Sequence Length
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    sub = df_summary[df_summary["sweep_type"] == "sequence_length"]
    for m in sub["model"].unique():
        m_data = sub[sub["model"] == m].sort_values("parameter_value")
        ax.plot(
            m_data["parameter_value"],
            m_data["mean_accuracy"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            linewidth=2.2
        )
        ax.fill_between(
            m_data["parameter_value"],
            m_data["ci95_accuracy_low"],
            m_data["ci95_accuracy_high"],
            color=MODEL_PALETTE[m],
            alpha=0.15
        )
    ax.set_xscale("log", base=2)
    ax.set_xticks([16, 32, 64, 128, 256, 512, 1024])
    ax.get_xaxis().set_major_formatter(ticker.ScalarFormatter())
    ax.set_xlabel("Sequence Horizon Length ($T$ tokens)")
    ax.set_ylabel("Exact Match Retrieval Accuracy")
    ax.set_ylim(-0.05, 1.05)
    ax.set_title("1. Accuracy vs Sequence Length (Horizon Degradation)")
    ax.legend(frameon=True, loc="lower left")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot1_accuracy_vs_sequence_length.png"), dpi=300)
    plt.close()

    # 2. Plot 2: Accuracy vs Memory Capacity
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    sub = df_summary[df_summary["sweep_type"] == "memory_capacity"]
    for m in sub["model"].unique():
        m_data = sub[sub["model"] == m].sort_values("parameter_value")
        ax.plot(
            m_data["parameter_value"],
            m_data["mean_accuracy"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            linewidth=2.2
        )
        ax.fill_between(
            m_data["parameter_value"],
            m_data["ci95_accuracy_low"],
            m_data["ci95_accuracy_high"],
            color=MODEL_PALETTE[m],
            alpha=0.15
        )
    ax.set_xlabel("Number of Stored Key-Value Associations ($N_{\\text{pairs}}$)")
    ax.set_ylabel("Exact Match Retrieval Accuracy")
    ax.set_ylim(-0.05, 1.05)
    ax.set_title("2. Accuracy vs Memory Capacity (Subspace Rank Limits)")
    ax.legend(frameon=True, loc="upper right")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot2_accuracy_vs_memory_capacity.png"), dpi=300)
    plt.close()

    # 3. Plot 3: Error Rate vs Interference
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    sub = df_summary[df_summary["sweep_type"] == "interference"]
    for m in sub["model"].unique():
        m_data = sub[sub["model"] == m].sort_values("parameter_value")
        ax.plot(
            m_data["parameter_value"],
            m_data["mean_error_rate"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            linewidth=2.2
        )
    ax.set_xlabel("Conflicting Key Overwrite Count ($N_{\\text{overwrites}}$)")
    ax.set_ylabel("Error Rate ($1 - \\text{Accuracy}$)")
    ax.set_ylim(-0.05, 1.05)
    ax.set_title("3. Error Rate vs Interference Strength (Key Overwrites)")
    ax.legend(frameon=True, loc="upper left")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot3_error_rate_vs_interference.png"), dpi=300)
    plt.close()

    # 4. Plot 4: Accuracy vs Inference Effort
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    sub = df_summary[df_summary["sweep_type"] == "inference_effort"]
    for m in sub["model"].unique():
        m_data = sub[sub["model"] == m].sort_values("parameter_value")
        ax.plot(
            m_data["parameter_value"],
            m_data["mean_accuracy"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            linewidth=2.2
        )
        ax.fill_between(
            m_data["parameter_value"],
            m_data["ci95_accuracy_low"],
            m_data["ci95_accuracy_high"],
            color=MODEL_PALETTE[m],
            alpha=0.15
        )
    ax.set_xlabel("Inference-Time Compute Budget ($C_{\\text{infer}}$ Steps)")
    ax.set_ylabel("Exact Match Retrieval Accuracy")
    ax.set_ylim(-0.05, 1.05)
    ax.set_title("4. Accuracy vs Inference Effort (Test-Time Recovery)")
    ax.legend(frameon=True, loc="center right")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot4_accuracy_vs_inference_effort.png"), dpi=300)
    plt.close()

    # 5. Plot 5: Latency vs Inference Effort
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    sub = df_summary[df_summary["sweep_type"] == "inference_effort"]
    for m in sub["model"].unique():
        m_data = sub[sub["model"] == m].sort_values("parameter_value")
        ax.plot(
            m_data["parameter_value"],
            m_data["mean_latency_ms"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            linewidth=2.2
        )
    ax.set_xlabel("Inference-Time Compute Budget ($C_{\\text{infer}}$ Steps)")
    ax.set_ylabel("Query Latency (milliseconds)")
    ax.set_title("5. Latency vs Inference Effort (Computational Cost)")
    ax.legend(frameon=True, loc="upper left")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot5_latency_vs_inference_effort.png"), dpi=300)
    plt.close()

    # 6. Plot 6: Accuracy/Latency Tradeoff
    fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=300)
    for m in df_summary["model"].unique():
        m_data = df_summary[df_summary["model"] == m]
        ax.scatter(
            m_data["mean_latency_ms"],
            m_data["mean_accuracy"],
            label=MODEL_LABELS[m],
            color=MODEL_PALETTE[m],
            marker=MODEL_MARKERS[m],
            s=80,
            alpha=0.85,
            edgecolors="k",
            linewidth=0.5
        )
    ax.set_xlabel("Mean Evaluation Latency (ms) [Log Scale]")
    ax.set_ylabel("Mean Retrieval Accuracy")
    ax.set_xscale("log")
    ax.set_ylim(-0.05, 1.05)
    ax.set_title("6. Accuracy vs Latency Pareto Frontier")
    ax.legend(frameon=True, loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot6_accuracy_latency_tradeoff.png"), dpi=300)
    plt.close()

    # Composite 2x3 Multi-Panel Figure
    fig, axes = plt.subplots(2, 3, figsize=(18, 10.5), dpi=300)
    axes = axes.flatten()

    # Panel 1
    sub1 = df_summary[df_summary["sweep_type"] == "sequence_length"]
    for m in sub1["model"].unique():
        m_data = sub1[sub1["model"] == m].sort_values("parameter_value")
        axes[0].plot(m_data["parameter_value"], m_data["mean_accuracy"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m], label=MODEL_LABELS[m])
    axes[0].set_xscale("log", base=2)
    axes[0].set_xticks([16, 64, 256, 1024])
    axes[0].get_xaxis().set_major_formatter(ticker.ScalarFormatter())
    axes[0].set_xlabel("Sequence Length ($T$)")
    axes[0].set_ylabel("Accuracy")
    axes[0].set_title("A. Sequence Horizon Scaling")
    axes[0].legend(fontsize=9, loc="lower left")

    # Panel 2
    sub2 = df_summary[df_summary["sweep_type"] == "memory_capacity"]
    for m in sub2["model"].unique():
        m_data = sub2[sub2["model"] == m].sort_values("parameter_value")
        axes[1].plot(m_data["parameter_value"], m_data["mean_accuracy"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m])
    axes[1].set_xlabel("Item Load ($N_{\\text{pairs}}$)")
    axes[1].set_ylabel("Accuracy")
    axes[1].set_title("B. Memory Capacity Bounds")

    # Panel 3
    sub3 = df_summary[df_summary["sweep_type"] == "interference"]
    for m in sub3["model"].unique():
        m_data = sub3[sub3["model"] == m].sort_values("parameter_value")
        axes[2].plot(m_data["parameter_value"], m_data["mean_error_rate"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m])
    axes[2].set_xlabel("Overwrite Count ($N_{\\text{overwrites}}$)")
    axes[2].set_ylabel("Error Rate")
    axes[2].set_title("C. Interference & Overwrite")

    # Panel 4
    sub4 = df_summary[df_summary["sweep_type"] == "inference_effort"]
    for m in sub4["model"].unique():
        m_data = sub4[sub4["model"] == m].sort_values("parameter_value")
        axes[3].plot(m_data["parameter_value"], m_data["mean_accuracy"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m])
    axes[3].set_xlabel("Inference Budget ($C_{\\text{infer}}$)")
    axes[3].set_ylabel("Accuracy")
    axes[3].set_title("D. Test-Time Compute Recovery")

    # Panel 5
    for m in sub4["model"].unique():
        m_data = sub4[sub4["model"] == m].sort_values("parameter_value")
        axes[4].plot(m_data["parameter_value"], m_data["mean_latency_ms"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m])
    axes[4].set_xlabel("Inference Budget ($C_{\\text{infer}}$)")
    axes[4].set_ylabel("Latency (ms)")
    axes[4].set_title("E. Inference Latency Overhead")

    # Panel 6
    for m in df_summary["model"].unique():
        m_data = df_summary[df_summary["model"] == m]
        axes[5].scatter(m_data["mean_latency_ms"], m_data["mean_accuracy"], color=MODEL_PALETTE[m], marker=MODEL_MARKERS[m], s=60, alpha=0.85)
    axes[5].set_xscale("log")
    axes[5].set_xlabel("Latency (ms) [Log]")
    axes[5].set_ylabel("Accuracy")
    axes[5].set_title("F. Pareto Frontier (Accuracy vs Latency)")

    fig.suptitle("DataForge Evolving Memory Lab: Empirical Evaluation Matrix", fontsize=16, y=0.99)
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "plot_all_panels.png"), dpi=300)
    plt.close()


if __name__ == "__main__":
    run_pipeline()
