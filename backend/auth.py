from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os
import uuid

from database import get_db
from users import users
from schemas import SignUpUsers, loginrequest, TokenRequest, UserProfile
from auth_utils import SECRET_KEY, Algorithm,create_hash,verify_pwd,create_access_token

router=APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROFILE_PIC_DIR = os.path.join(BASE_DIR, "storage", "profile_pics")
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)

@router.post("/signup",response_model=TokenRequest)
def signup(payload:SignUpUsers, db:Session=Depends(get_db)):
    existing=db.query(users).filter(
        (users.username == payload.username) | (users.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or the email already exists!")
    new_user = users(
    username=payload.username,
    email=payload.email,
    password=create_hash(payload.password),   
    phone_num=payload.phone_num,
    address=payload.address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token=create_access_token({"sub": str(new_user.user_id)})
    return {"access_token":token}


@router.post("/login",response_model=TokenRequest)
def login(payload:loginrequest, db:Session=Depends(get_db)):
    user=db.query(users).filter(users.username==payload.username).first()
    if not user or not (verify_pwd(user.password,payload.password)) or not (user.email==payload.email):
        raise HTTPException(status_code=401, detail="Invalid username or passoword or invalid email address!")
    token=create_access_token({"sub":str(user.user_id)})
    return {"access_token":token}


def get_current_user(authorization: str=Header(...), db:Session=Depends(get_db)):
    token=authorization.replace("Bearer ","")
    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[Algorithm])
        user_id=payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(users).filter(users.user_id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
    

#this for when user asks about themselves
@router.get("/me", response_model=UserProfile)
def read_me(current_user: users = Depends(get_current_user)):
    profile_picture_url = (
        f"/static/profile_pics/{current_user.profile_picture}"
        if current_user.profile_picture else None
    )
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "phone_num": current_user.phone_num,
        "address": current_user.address,
        "profile_picture_url": profile_picture_url,
    }
    

@router.post("/me/profile-picture", response_model=UserProfile)
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{current_user.user_id}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(PROFILE_PIC_DIR, filename)

    # remove the old picture off disk if one exists, so they don't pile up
    if current_user.profile_picture:
        old_path = os.path.join(PROFILE_PIC_DIR, current_user.profile_picture)
        if os.path.exists(old_path):
            os.remove(old_path)

    image_bytes = await file.read()
    with open(file_path, "wb") as f:
        f.write(image_bytes)

    current_user.profile_picture = filename
    db.commit()
    db.refresh(current_user)

    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "phone_num": current_user.phone_num,
        "address": current_user.address,
        "profile_picture_url": f"/static/profile_pics/{filename}",
    }