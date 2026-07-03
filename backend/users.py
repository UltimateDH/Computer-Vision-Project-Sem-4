from sqlalchemy import Integer, Column, String
from database import Base

class users(Base):
    __tablename__="users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)   # will store the HASH, never plain text
    email = Column(String, unique=True, index=True, nullable=False)
    phone_num = Column(String, nullable=True)
    address = Column(String, nullable=True)