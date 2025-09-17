from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router

app = FastAPI(title="Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #  для продакшна ставь конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# подключаем роутер из auth.py
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def root():
    return {"status": "ok"}
