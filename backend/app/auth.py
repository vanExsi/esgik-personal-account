import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .db import SessionLocal
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

router = APIRouter(tags=["auth"])

SECRET_KEY = "f9d8e7c6b5a4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1a0b9c8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
CODES: dict[str, dict] = {}   # временное хранилище кодов

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 📌 Регистрация (отправка кода)
@router.post("/register")
def register_user(data: schemas.RegisterRequest, db: Session = Depends(get_db)):
    phone_clean = "".join(filter(str.isdigit, data.phone))

    user = db.query(models.User).filter(models.User.phone == phone_clean).first()
    if user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    code = f"{random.randint(1000, 9999)}"
    CODES[phone_clean] = {"code": code, "password": data.password}

    return {"success": True, "message": f"Код отправлен {data.phone} (демо)"}

# 📌 Подтверждение регистрации
@router.post("/confirm")
def confirm_user(data: schemas.ConfirmRequest, db: Session = Depends(get_db)):
    phone_clean = "".join(filter(str.isdigit, data.phone))

    if phone_clean not in CODES or data.code != CODES[phone_clean]["code"]:
        raise HTTPException(status_code=400, detail="Неверный код")

    hashed_pw = pwd_context.hash(CODES[phone_clean]["password"])

    new_user = models.User(
        login=phone_clean,
        phone=phone_clean,
        password=hashed_pw,
        role="user",
        is_online="0",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    del CODES[phone_clean]

    access_token = create_access_token({"sub": str(new_user.id)})

    return {
        "success": True,
        "message": "Регистрация успешна",
        "user_id": new_user.id,
        "access_token": access_token
    }

# 📌 Логин (отправка кода)
@router.post("/login")
def login_user(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    phone_clean = "".join(filter(str.isdigit, data.phone))

    user = db.query(models.User).filter(models.User.phone == phone_clean).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=400, detail="Неверный телефон или пароль")

    code = f"{random.randint(1000, 9999)}"
    CODES[phone_clean] = {"code": code, "user_id": user.id}

    return {"success": True, "message": f"Код отправлен {code} (демо)"}

# 📌 Подтверждение логина
@router.post("/login-confirm")
def login_confirm(data: schemas.ConfirmRequest, db: Session = Depends(get_db)):
    phone_clean = "".join(filter(str.isdigit, data.phone))

    if phone_clean not in CODES or data.code != CODES[phone_clean]["code"]:
        raise HTTPException(status_code=400, detail="Неверный код")

    user = db.query(models.User).filter(models.User.phone == phone_clean).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    del CODES[phone_clean]

    access_token = create_access_token({"sub": str(user.id)})

    return {
        "success": True,
        "message": "Вход выполнен успешно",
        "user_id": user.id,
        "access_token": access_token
    }
