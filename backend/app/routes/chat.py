from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_response
from app.services.memory import store_message
from app.services.short_memory import add_message
from app.core.deps import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(req: ChatRequest, user_id: int = Depends(get_current_user)):

    # 🔹 Add to short-term memory
    add_message(user_id, "user", req.message)

    # 🔹 Store long-term memory
    store_message(user_id, req.message, "user")

    # 🔹 Generate response
    reply = generate_response(user_id, req.message)

    # 🔹 Store AI reply
    add_message(user_id, "ai", reply)
    store_message(user_id, reply, "ai")

    return {"response": reply}