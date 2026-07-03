from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import get_db
from users import users
from schemas import SignUpUsers, loginrequest, TokenRequest
from auth_utils import SECRET_KEY, Algorithm,create_hash,verify_pwd,create_access_token

router=APIRouter()

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
@router.get("/me")
def read_me(current_user: users = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "phone_num": current_user.phone_num,
        "address": current_user.address
    }
