from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import generate_response
from app.services.memory import store_message
from app.services.short_memory import add_message
from app.core.deps import get_current_user, get_current_user_obj
from app.services.chat_service import create_chat
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db import models
from app.db.models import Usage, Subscription, User
from datetime import datetime, timedelta
from app.core.plans import PLANS
import requests


router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[int] = None



def check_usage(user, db):
    usage = db.query(Usage).filter(Usage.user_id == user.id).first()

    if not usage:
        usage = Usage(user_id=user.id)
        db.add(usage)
        db.commit()

    # 🔄 reset daily
    if datetime.utcnow() - usage.last_reset > timedelta(days=1):
        usage.messages_used = 0
        usage.last_reset = datetime.utcnow()
        db.commit()

    plan_limits = PLANS[user.plan]

    if usage.messages_used >= plan_limits["messages_per_day"]:
        raise HTTPException(status_code=403, detail="Limit reached")

    # increment usage
    usage.messages_used += 1
    db.commit()


@router.post("/chat")
def chat(req: ChatRequest, user: User = Depends(get_current_user_obj), db: Session = Depends(get_db)):
    check_usage(user, db)

    # 🔹 create or reuse chat
    if not req.chat_id:
        chat_id = create_chat(user.id)
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