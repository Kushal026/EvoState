"""Model definitions and registry for EvoState."""

from evostate.models.base import BaseMemoryModel, MemoryStepTrace
from evostate.models.full_history import FullHistoryReferenceBaseline
from evostate.models.recurrent_memory import FixedSizeRecurrentMemory
from evostate.models.educational_toy import EducationalEvolvingMemoryToy


def get_model(
    model_name: str,
    vocab,
    state_dim: int = 32,
    decay: float = 0.98,
    seed: int = 42
) -> BaseMemoryModel:
    """Factory helper to instantiate models by canonical identifier."""
    name_lower = model_name.strip().lower()

    if name_lower in ["full_history", "full_history_reference_baseline", "kv_cache"]:
        return FullHistoryReferenceBaseline(vocab=vocab, embed_dim=state_dim, seed=seed)
    elif name_lower in ["recurrent", "fixed_size_recurrent", "fixed_size_recurrent_memory"]:
        return FixedSizeRecurrentMemory(vocab=vocab, state_dim=state_dim, decay=decay, seed=seed)
    elif name_lower in ["educational_toy", "educational_evolving_toy", "educational_evolving_memory_toy"]:
        return EducationalEvolvingMemoryToy(
            vocab=vocab,
            key_dim=state_dim,
            val_dim=state_dim,
            base_retention=decay,
            seed=seed
        )
    else:
        raise ValueError(
            f"Unknown model name: {model_name}. Allowed: 'full_history_reference_baseline', "
            f"'fixed_size_recurrent_memory', 'educational_evolving_memory_toy'."
        )


__all__ = [
    "BaseMemoryModel",
    "MemoryStepTrace",
    "FullHistoryReferenceBaseline",
    "FixedSizeRecurrentMemory",
    "EducationalEvolvingMemoryToy",
    "get_model"
]
