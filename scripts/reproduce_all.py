"""Standalone master reproducibility script for DataForge: Evolving Memory Lab.

Usage:
    python scripts/reproduce_all.py [--trials 30] [--seed 42] [--output data/precomputed]

Executes all 4 controlled scientific sweeps, validates metric schemas, computes 95% CIs,
and exports publication figures to data/precomputed/plots/.
"""

import sys
import os
import argparse

# Ensure evostate is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from evostate.scripts.generate_precomputed_data import run_pipeline


def main():
    parser = argparse.ArgumentParser(description="Reproduce all EvoState empirical benchmarks and publication plots.")
    parser.add_argument("--trials", type=int, default=30, help="Number of Monte Carlo trials per sweep parameter point (default: 30)")
    parser.add_argument("--seed", type=int, default=42, help="Base random seed for strict determinism (default: 42)")
    parser.add_argument("--output", type=str, default="data/precomputed", help="Output directory for datasets and plots (default: data/precomputed)")

    args = parser.parse_args()

    print("\nStarting full scientific reproduction run...")
    results = run_pipeline(
        output_dir=args.output,
        n_trials_per_point=args.trials,
        base_seed=args.seed
    )

    print("\nReproduction completed successfully. Summary of artifacts generated:")
    for k, v in results.items():
        print(f"  - {k}: {v}")


if __name__ == "__main__":
    main()
