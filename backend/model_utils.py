import torch
import torch.nn as nn
from torchvision import models
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model_triplet_best.pt")

EMBEDDING_DIM = 64
NUM_CLASSES = 25


class ResNetBackbone(nn.Module):
    def __init__(self):
        super().__init__()
        resnet = models.resnet18(weights=None)
        self.conv1 = resnet.conv1
        self.bn1 = resnet.bn1
        self.relu = resnet.relu
        self.maxpool = resnet.maxpool
        self.layer1 = resnet.layer1
        self.layer2 = resnet.layer2
        self.layer3 = resnet.layer3
        self.layer4 = resnet.layer4

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        return x


class TripletNet(nn.Module):
    def __init__(self, embedding_dim=EMBEDDING_DIM, num_classes=NUM_CLASSES):
        super().__init__()
        self.backbone = ResNetBackbone()
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))

        self.projection_head = nn.Sequential(
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, embedding_dim),
        )

        self.classification_head = nn.Sequential(
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        features = self.backbone(x)
        features = self.avgpool(features).flatten(1)
        embedding = self.projection_head(features)
        return embedding


def load_model() -> TripletNet:
    """Load TripletNet with trained weights, ready for inference. No prediction logic lives here."""
    model = TripletNet()
    state_dict = torch.load(MODEL_PATH, map_location=device, weights_only=False)
    model.load_state_dict(state_dict)
    model.eval()
    model.to(device)
    return model


model = load_model()