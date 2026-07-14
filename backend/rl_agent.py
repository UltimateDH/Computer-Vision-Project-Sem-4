import numpy as np
import os


class LinearUCB:
    def __init__(self, num_features, alpha=1, storage_path="bandit_state.npz"):
        self.num_of_features = num_features  # total number of features we're taking
        self.alpha = alpha  # for exploration
        self.storage_path = storage_path  # to load/save state

        self.a = np.eye(self.num_of_features)  # covariance matrix
        self.b = np.zeros((self.num_of_features, 1))  # reward

        self.load_memory()  # load existing state if present

    def load_memory(self):
        if os.path.exists(self.storage_path):
            data = np.load(self.storage_path)
            self.a = data['A']
            self.b = data['b']
            print("[Bandit] Discovered existing state file! Loaded Successfully!")
        else:
            print("[Bandit] Found no existing file, starting fresh!")

    def save_state(self):
        np.savez(self.storage_path, A=self.a, b=self.b)
        print(f"[Bandit] State successfully saved to {self.storage_path}!!")

    def select_top_k(self, candidate_features, k=10):
        candidate_features = np.asarray(candidate_features, dtype=np.float64)
        k = min(k, candidate_features.shape[0])

        A_inv = np.linalg.inv(self.a)  # was self.linalg.inv — bug fix
        theta = A_inv @ self.b
        ucb_scores = np.zeros(candidate_features.shape[0])

        for i in range(candidate_features.shape[0]):
            x_a = candidate_features[i].reshape(-1, 1)
            exploitation = (theta.T @ x_a).item()
            uncertainty = self.alpha * np.sqrt((x_a.T @ A_inv @ x_a).item())
            ucb_scores[i] = exploitation + uncertainty

        return list(np.argsort(ucb_scores)[::-1][:k])

    def update_batch(self, displayed_features, rewards):
        for i in range(len(rewards)):
            x_a = np.asarray(displayed_features[i], dtype=np.float64)
            self.a += np.outer(x_a, x_a)
            self.b += rewards[i] * x_a.reshape(-1, 1)

        self.save_state()