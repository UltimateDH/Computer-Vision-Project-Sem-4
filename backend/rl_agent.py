import numpy as np
import os

class LinearUCB:
    def __init__(self,num_features,alpha,storage_path="bandit_state.npz"):
        self.num_of_features=num_features #total number of the features we gonna take
        self.alpha=alpha#for exploration
        self.storage_path=storage_path#to load the values

        self.a =np.eye(self.num_of_features) #covariance matrix
        self.b=np.zeros((self.num_of_features,1)) #reward 

        self.load_memory()#to load the memory

    def load_memory(self):
        if os.path.exists(self.storage_path):
            data=np.load(self.storage_path)
            self.a=data['A']
            self.b=data['b']
            print("[Bandit] Discovered existing state file! Loaded Successfully!")
        else:
            print("Found no existing file, starting fresh!")
    
    def save_state(self):
        np.savez(self.storage_path,A=self.a,b=self.b)
        print(f"[Bandit] State successfully saved to {self.storage_path}!!")

    def select_top_k(self, candiate_features,k=10):
        A_inv=self.linalg.inv(self.a)
        theta=A_inv @ self.b
        ucb_scores=np.zeros(candiate_features.shape[0])

        for i in range(candiate_features.shape[0]):
            x_a=candiate_features[i].reshape(-1,1)
            exploitation=float(theta.T @ x_a) 
            uncertainity=self.alpha*np.sqrt(float(x_a.T @ A_inv @ x_a))
            ucb_scores[i]=exploitation+uncertainity
        
        return list(np.argsort(ucb_scores)[::-1][:k])
    
    def update_batch(self,displayed_features, rewards):
        for i in range(len(rewards)):
            self.a  += np.outer(displayed_features[i],displayed_features[i])
            self.b  += rewards[i]*displayed_features[i].reshape(-1,1) 
        
        self.save_state()


