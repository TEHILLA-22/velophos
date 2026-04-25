from app.db.database import SessionLocal
from app.db.models import Chat

def create_chat(user_id: int):
    db = SessionLocal()
    try:
        new_chat = Chat(user_id=user_id, title="New Chat")
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        return new_chat.id
    finally:
        db.close()