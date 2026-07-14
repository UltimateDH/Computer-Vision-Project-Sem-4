import io
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
from sqlalchemy import text
from sqlalchemy.orm import Session

from model_utils import model, device
from feature_utils import build_feature_vector
from bandit_singleton import bandit, DISPLAYED_FEATURES
from storage_utils import public_image_url

TOP_PRODUCTS = 10   # how many visually-similar products to pull from pgvector
RESULTS_K = 15     # how many listings to finally show the user

_preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def get_image_embedding(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model(tensor)
        embedding = torch.nn.functional.normalize(embedding, p=2, dim=1)
    return embedding.squeeze(0).cpu().numpy()


def find_similar_products(db: Session, query_embedding: np.ndarray, top_n: int = TOP_PRODUCTS):
    # pgvector cosine distance operator `<=>` — requires the pgvector extension
    # enabled on your Supabase Postgres instance (it usually is by default).
    vector_literal = "[" + ",".join(str(float(v)) for v in query_embedding) + "]"
    rows = db.execute(
        text("""
            SELECT product_index, filepath, title,
                   embedding <=> :query_vector AS distance
            FROM products
            ORDER BY embedding <=> :query_vector
            LIMIT :top_n
        """),
        {"query_vector": vector_literal, "top_n": top_n},
    ).mappings().all()
    return list(rows)


def get_listings_for_products(db: Session, product_indexes: list):
    if not product_indexes:
        return []
    rows = db.execute(
        text("""
            SELECT l.listing_id, l.product_index, l.price, l.shipping_cost,
                   l.discount, l.visits,
                   s.seller_id, s.shopname, s.rating, s.location
            FROM listings l
            JOIN sellers s ON s.seller_id = l.seller_id
            WHERE l.product_index = ANY(:product_indexes)
        """),
        {"product_indexes": product_indexes},
    ).mappings().all()
    return list(rows)


def run_recommendation_pipeline(db: Session, image_bytes: bytes) -> dict:
    query_embedding = get_image_embedding(image_bytes)

    similar_products = find_similar_products(db, query_embedding, TOP_PRODUCTS)
    if not similar_products:
        return {"results": []}

    product_lookup = {p["product_index"]: p for p in similar_products}
    product_indexes = list(product_lookup.keys())

    listings = get_listings_for_products(db, product_indexes)
    if not listings:
        return {"results": []}

    # Build candidates in one fixed, serial pass so the bandit's returned
    # indices map back cleanly onto this same list — no separate index table needed.
    candidates = []
    feature_matrix = []
    for listing in listings:
        product = product_lookup[listing["product_index"]]
        feature_vector = build_feature_vector(listing)
        candidates.append({
            "listing_id": listing["listing_id"],
            "product_index": listing["product_index"],
            "title": product["title"],
            "filepath": product["filepath"],
            "similarity_score": round(1 - float(product["distance"]), 4),
            "price": listing["price"],
            "shopname": listing["shopname"],
            "rating": listing["rating"],
            "location": listing["location"],
            "feature_vector": feature_vector,
        })
        feature_matrix.append(feature_vector)

    feature_matrix = np.array(feature_matrix)
    k = min(RESULTS_K, len(candidates))
    top_indices = bandit.select_top_k(feature_matrix, k=k)

    results = []
    for idx in top_indices:
        c = candidates[idx]
        # cache this exact vector so /reward can update the bandit with the
        # same features that were actually scored and shown
        DISPLAYED_FEATURES[c["listing_id"]] = c["feature_vector"]
        results.append({
            "id": c["listing_id"],
            "name": c["title"],
            "description": f"Sold by {c['shopname']} \u00b7 {c['location']}",
            "price": c["price"],
            "rating": c["rating"],
            "reviews": 0,  # no review-count column in your schema yet
            "similarity_score": c["similarity_score"],
            "image_url": public_image_url(c["filepath"]),
        })

    return {"results": results}
