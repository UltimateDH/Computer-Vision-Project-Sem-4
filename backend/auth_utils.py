import os
from datetime import datetime, timedelta, UTC
from werkzeug.security import check_password_hash, generate_password_hash
from jose import jwt, JWTError

SECRET_KEY=os.environ.get("SECRETE_KEY")
Algorithm="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 #one day


def create_hash(password:str)-> str:
    return generate_password_hash(password=password)

def verify_pwd(hashed_password:str,plain_password:str)->bool:
    return check_password_hash(hashed_password,plain_password)


def create_access_token(data: dict):
    to_encode=data.copy()
    expire=datetime.now(UTC)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=Algorithm)

