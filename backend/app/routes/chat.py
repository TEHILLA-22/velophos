from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import generate_response
from app.services.memory import store_message
from app.services.short_memory import add_message
from app.core.deps import get_current_user
from app.services.chat_service import create_chat
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db import models

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[int] = None

@router.post("/chat")
def chat(req: ChatRequest, user_id: int = Depends(get_current_user)):

    # 🔹 create or reuse chat
    if not req.chat_id:
        chat_id = create_chat(user_id)
    else:
        chat_id = req.chat_id

    # 🔹 store user message
    store_message(str(chat_id), "user", req.message)

    # 🔹 generate response
    reply = generate_response(str(chat_id), req.message)

    # 🔹 store AI reply
    store_message(str(chat_id), "ai", reply)

    return {
        "response": reply,
        "chat_id": chat_id
    }

@router.get("/chats")
def get_chats(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    chats = db.query(models.Chat).filter(models.Chat.user_id == user_id).all()
    return [{"id": str(c.id), "title": c.title} for c in chats]

@router.get("/chat/{chat_id}")
def get_chat_history(chat_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = db.query(models.Message).filter(models.Message.chat_id == chat_id).order_by(models.Message.timestamp.asc()).all()
    return [{"role": m.role, "content": m.content} for m in messages]