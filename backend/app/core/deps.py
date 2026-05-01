from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM


from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User


security = HTTPBearer()


from fastapi import Request

def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = None

    # 🔹 1. Try cookie first
    if "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    # 🔹 2. fallback to header (for API tools, testing)
    elif credentials:
        token = credentials.credentials

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user_obj(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user