"""Synthetic vocabulary and token representation for associative memory experiments."""

from typing import List, Dict, Tuple


# Predefined canonical key and value tokens for synthetic memory experiments
KEY_NAMES = [f"KEY_{chr(65 + i)}" for i in range(26)] + [f"KEY_VAR_{i}" for i in range(100)]
VALUE_NAMES = [
    "VAL_ALPHA", "VAL_BETA", "VAL_GAMMA", "VAL_DELTA", "VAL_EPSILON",
    "VAL_ZETA", "VAL_ETA", "VAL_THETA", "VAL_IOTA", "VAL_KAPPA",
    "VAL_LAMBDA", "VAL_MU", "VAL_NU", "VAL_XI", "VAL_OMICRON",
    "VAL_PI", "VAL_RHO", "VAL_SIGMA", "VAL_TAU", "VAL_UPSILON",
    "VAL_PHI", "VAL_CHI", "VAL_PSI", "VAL_OMEGA"
] + [f"VAL_NUM_{i}" for i in range(100)]

SPECIAL_TOKENS = ["<PAD>", "<UNK>", "<SEP>", "<QUERY>", "<NOISE>"]


class SyntheticVocab:
    """Manages mapping between synthetic tokens and integer token IDs."""

    def __init__(self, custom_keys: List[str] | None = None, custom_values: List[str] | None = None):
        self.special_tokens = list(SPECIAL_TOKENS)
        self.keys = custom_keys if custom_keys is not None else list(KEY_NAMES)
        self.values = custom_values if custom_values is not None else list(VALUE_NAMES)
        
        # Build composite tokens: KEY:VALUE pairs and QUERY:KEY tokens
        self.tokens: List[str] = list(self.special_tokens)
        
        for k in self.keys:
            self.tokens.append(f"QUERY:{k}")
            for v in self.values:
                self.tokens.append(f"{k}:{v}")
                
        # Also include raw values as possible prediction targets
        for v in self.values:
            if v not in self.tokens:
                self.tokens.append(v)
                
        # Also include distractor tokens
        for i in range(50):
            self.tokens.append(f"NOISE_{i}")

        self.token2id: Dict[str, int] = {token: idx for idx, token in enumerate(self.tokens)}
        self.id2token: Dict[int, str] = {idx: token for idx, token in enumerate(self.tokens)}

    @property
    def size(self) -> int:
        return len(self.tokens)

    def encode(self, token: str) -> int:
        return self.token2id.get(token, self.token2id["<UNK>"])

    def decode(self, token_id: int) -> str:
        return self.id2token.get(token_id, "<UNK>")

    def encode_sequence(self, sequence: List[str]) -> List[int]:
        return [self.encode(tok) for tok in sequence]

    def decode_sequence(self, ids: List[int]) -> List[str]:
        return [self.decode(idx) for idx in ids]

    @staticmethod
    def parse_kv(token: str) -> Tuple[str, str] | None:
        """Parse 'KEY_A:VAL_ALPHA' into ('KEY_A', 'VAL_ALPHA')."""
        if ":" in token and not token.startswith("QUERY:"):
            parts = token.split(":", 1)
            return parts[0], parts[1]
        return None

    @staticmethod
    def parse_query(token: str) -> str | None:
        """Parse 'QUERY:KEY_A' into 'KEY_A'."""
        if token.startswith("QUERY:"):
            return token.split(":", 1)[1]
        return None


# Global singleton instance
GLOBAL_VOCAB = SyntheticVocab()
