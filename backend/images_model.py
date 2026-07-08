from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base


class Images(Base):
    __tablename__ = "images"

    id = Column(String, primary_key=True, index=True)          # uuid4 string
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    original_name = Column(String)
    stored_filename = Column(String, nullable=False)
    content_type = Column(String)
    source = Column(String)  # "camera" or "album"
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())