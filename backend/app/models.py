from sqlalchemy import Column, Integer, String, Text, DateTime
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=True)
    login = Column(Text, nullable=True)
    password = Column(Text, nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    email = Column(Text, nullable=True)
    role = Column(Text, nullable=True)
    cal_filter = Column(Text, nullable=True)
    is_online = Column(Text, nullable=True)
    was_online = Column(DateTime, nullable=True)
    on_device = Column(Text, nullable=True)
