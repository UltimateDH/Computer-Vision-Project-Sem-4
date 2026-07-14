import numpy as np


FEATURE_STATS = {
    "price":         {"min": 0,   "max": 6000},
    "shipping_cost": {"min": 0,   "max": 250},
    "discount":      {"min": 0,   "max": 60},
    "visits":        {"min": 0,   "max": 2000},
}

FEATURE_ORDER = ["price", "shipping_cost", "discount", "visits"]


def normalize_value(name: str, value: float) -> float:
    stats = FEATURE_STATS[name]
    span = stats["max"] - stats["min"]
    if span <= 0:
        return 0.0
    normalized = (value - stats["min"]) / span
    return float(np.clip(normalized, 0.0, 1.0))


def build_feature_vector(listing: dict) -> np.ndarray:
    """listing must contain raw values for every key in FEATURE_ORDER."""
    return np.array(
        [normalize_value(name, listing[name]) for name in FEATURE_ORDER],
        dtype=np.float64,
    )
