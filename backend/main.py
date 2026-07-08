from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from auth import router as auth_router
from images import router as images_router
import os

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(images_router, prefix="/images", tags=["images"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storage", "images")
os.makedirs(STORAGE_DIR, exist_ok=True)
app.mount("/static/images", StaticFiles(directory=STORAGE_DIR), name="images")

PROFILE_PIC_DIR = os.path.join(BASE_DIR, "storage", "profile_pics")
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
app.mount("/static/profile_pics", StaticFiles(directory=PROFILE_PIC_DIR), name="profile_pics")