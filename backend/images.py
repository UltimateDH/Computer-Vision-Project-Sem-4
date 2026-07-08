import os
import random
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from users import users
import image_store

router = APIRouter()

FAKE_PRODUCTS = [
    {"name": "Minimalist Ceramic Vase", "description": "Matte-finish stoneware vase, handcrafted, 10in tall.", "price": 42, "rating": 4.6, "reviews": 890},
    {"name": "Vintage Leather Messenger Bag", "description": "Full-grain leather, brass buckles, fits 15in laptop.", "price": 189, "rating": 4.8, "reviews": 3200},
    {"name": "Wireless Noise-Cancelling Headphones", "description": "Over-ear, 30hr battery, adaptive ANC.", "price": 249, "rating": 4.7, "reviews": 15400},
    {"name": "Woven Cotton Throw Blanket", "description": "Soft cotton weave, 50x60in, machine washable.", "price": 58, "rating": 4.5, "reviews": 1200},
    {"name": "Stainless Steel Pour-Over Kettle", "description": "Gooseneck spout, 1L capacity, matte black.", "price": 65, "rating": 4.4, "reviews": 780},
    {"name": "Oak Wood Desk Organizer", "description": "Solid oak, 4 compartments, felt-lined base.", "price": 74, "rating": 4.6, "reviews": 540},
    {"name": "Terracotta Plant Pot Set", "description": "Set of 3, drainage holes, unglazed finish.", "price": 34, "rating": 4.3, "reviews": 2100},
    {"name": "Merino Wool Beanie", "description": "100% merino, ribbed knit, one size fits most.", "price": 39, "rating": 4.7, "reviews": 4300},
    {"name": "Brushed Brass Table Lamp", "description": "Adjustable arm, linen shade, warm LED bulb included.", "price": 118, "rating": 4.5, "reviews": 960},
    {"name": "Canvas Weekender Duffel", "description": "Waxed canvas, leather straps, 45L capacity.", "price": 145, "rating": 4.8, "reviews": 2700},
    {"name": "Ceramic Pour-Over Coffee Dripper", "description": "Single-cup, glazed interior, wood collar.", "price": 32, "rating": 4.4, "reviews": 610},
    {"name": "Recycled Glass Tumbler Set", "description": "Set of 4, 12oz, hand-blown texture.", "price": 28, "rating": 4.2, "reviews": 430},
    {"name": "Linen Throw Pillow Cover", "description": "18x18in, hidden zipper, stonewashed linen.", "price": 24, "rating": 4.3, "reviews": 890},
    {"name": "Walnut Wood Watch Stand", "description": "Solid walnut, minimalist single-watch display.", "price": 46, "rating": 4.6, "reviews": 320},
    {"name": "Cast Iron Skillet", "description": "10.25in, pre-seasoned, oven-safe to 500°F.", "price": 45, "rating": 4.9, "reviews": 8900},
]


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    source: str = Form("album"),
    current_user: users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if source not in ("camera", "album"):
        source = "album"

    try:
        image_bytes = await file.read()
        image = image_store.save_image(
            db=db,
            image_bytes=image_bytes,
            user_id=current_user.user_id,
            original_name=file.filename or "upload.jpg",
            content_type=file.content_type,
            source=source,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    return {
        "id": image.id,
        "original_name": image.original_name,
        "content_type": image.content_type,
        "source": image.source,
        "uploaded_at": image.uploaded_at,
        "url": image_store.image_url(image),
    }


@router.post("/search")
async def search_image(
    file: UploadFile = File(...),
    source: str = Form("album"),
    current_user: users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if source not in ("camera", "album"):
        source = "album"

    try:
        image_bytes = await file.read()
        image = image_store.save_image(
            db=db,
            image_bytes=image_bytes,
            user_id=current_user.user_id,
            original_name=file.filename or "upload.jpg",
            content_type=file.content_type,
            source=source,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # TODO: replace this block with real ResNet18 embedding + similarity search
    # once the model is wired up. Keep the response shape the same so the
    # frontend doesn't need to change.
    results = []
    for i in range(15):
        product = FAKE_PRODUCTS[i % len(FAKE_PRODUCTS)]
        results.append({
            "id": f"placeholder-{image.id}-{i}",
            "name": product["name"],
            "description": product["description"],
            "price": product["price"],
            "rating": product["rating"],
            "reviews": product["reviews"],
            "similarity_score": round(random.uniform(0.75, 0.99), 3),
            "image_url": image_store.image_url(image),
        })
    results.sort(key=lambda r: r["similarity_score"], reverse=True)

    return {
        "query_image": {
            "id": image.id,
            "url": image_store.image_url(image),
        },
        "results": results,
    }


@router.get("")
def get_all_images(
    current_user: users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    images = image_store.list_images(db, current_user.user_id)
    return {
        "images": [
            {
                "id": img.id,
                "original_name": img.original_name,
                "content_type": img.content_type,
                "source": img.source,
                "uploaded_at": img.uploaded_at,
                "url": image_store.image_url(img),
            }
            for img in images
        ]
    }


@router.get("/{image_id}/file")
def get_image_file(
    image_id: str,
    current_user: users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image = image_store.get_image(db, current_user.user_id, image_id)
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")

    file_path = os.path.join(image_store.UPLOAD_DIR, str(image.user_id), image.stored_filename)
    return FileResponse(file_path)