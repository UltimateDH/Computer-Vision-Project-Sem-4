#this for data validation
from pydantic import BaseModel, EmailStr
from typing import Optional

class SignUpUsers(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone_num: Optional[str] = None
    address: Optional[str] = None


class loginrequest(BaseModel):
    username: str
    email:EmailStr
    password:str


class TokenRequest(BaseModel):
    access_token: str
    token_type: str="bearer"

class UserProfile(BaseModel):
    user_id: int
    username: str
    email: str
    phone_num: Optional[str] = None
    address: Optional[str] = None
    profile_picture_url: Optional[str] = None