import os
import numpy as np
from rl_agent import LinearUCB
from feature_utils import FEATURE_ORDER

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)
STATE_PATH = os.path.join(MODEL_DIR, "bandit_state.npz")

bandit = LinearUCB(num_features=len(FEATURE_ORDER), alpha=1.0, storage_path=STATE_PATH)

# Maps listing_id -> the exact feature vector shown to the user for that listing.
# Needed so /reward can call update_batch with the SAME vector that was scored,
# not a freshly recomputed one (price/discount could have changed since).
#
# NOTE: this is in-memory only. It resets on server restart and won't work if you
# run multiple uvicorn workers (each worker gets its own dict). Fine for a single
# dev server; swap for Redis (or a small DB table) before running >1 worker.
DISPLAYED_FEATURES: dict[str, np.ndarray] = {}
