from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat

from app.db.database import engine
from app.db import models

from app.routes import auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development, can restrict in production
    allow_credentials=False, # Must be False if allow_origins is ["*"]
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc)
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "AI backend running"}