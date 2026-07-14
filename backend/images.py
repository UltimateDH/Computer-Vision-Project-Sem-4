import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from users import users
import image_store
from recommendation_engine import run_recommendation_pipeline
from bandit_singleton import bandit, DISPLAYED_FEATURES

router = APIRouter()


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

    image_bytes = await file.read()

    try:
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

    try:
        pipeline_result = run_recommendation_pipeline(db, image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

    print(f"Pipeline result: {pipeline_result}")  # Debugging line

    return {
        "query_image": {
            "id": image.id,
            "url": image_store.image_url(image),
        },
        "results": pipeline_result["results"],
    }


@router.post("/listings/{listing_id}/reward")
def reward_listing(
    listing_id: str,
    reward: float = Form(1.0),
    current_user: users = Depends(get_current_user),
):
    """Call this when the user clicks 'buy' on a displayed listing."""
    feature_vector = DISPLAYED_FEATURES.get(listing_id)
    if feature_vector is None:
        raise HTTPException(
            status_code=404,
            detail="No displayed feature vector found for this listing (may have expired or server restarted).",
        )

    bandit.update_batch([feature_vector], [reward])
    return {"status": "ok"}


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
