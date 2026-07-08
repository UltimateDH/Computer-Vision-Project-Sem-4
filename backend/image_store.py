import os
import uuid
from sqlalchemy.orm import Session
from images_model import Images

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "storage", "images")

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_image(db: Session, image_bytes: bytes, user_id: int, original_name: str,
               content_type: str, source: str = "album") -> Images:
    image_id = str(uuid.uuid4())
    ext = os.path.splitext(original_name)[1] or ".jpg"

    user_dir = os.path.join(UPLOAD_DIR, str(user_id))
    os.makedirs(user_dir, exist_ok=True)

    stored_filename = f"{image_id}{ext}"
    file_path = os.path.join(user_dir, stored_filename)

    with open(file_path, "wb") as f:
        f.write(image_bytes)

    new_image = Images(
        id=image_id,
        user_id=user_id,
        original_name=original_name,
        stored_filename=stored_filename,
        content_type=content_type,
        source=source,
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image


def list_images(db: Session, user_id: int):
    return (
        db.query(Images)
        .filter(Images.user_id == user_id)
        .order_by(Images.uploaded_at.desc())
        .all()
    )


def get_image(db: Session, user_id: int, image_id: str):
    return (
        db.query(Images)
        .filter(Images.id == image_id, Images.user_id == user_id)
        .first()
    )


def image_url(image: Images) -> str:
    return f"/static/images/{image.user_id}/{image.stored_filename}"