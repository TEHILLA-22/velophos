from pydantic import BaseModel, EmailStr, Field
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.db.models import User
from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password, create_access_token
from app.core.otp import generate_otp
from app.services.email_service import send_otp_email
from app.core.config import GOOGLE_CLIENT_ID
from google.oauth2 import id_token
from google.auth.transport import requests
import logging

router = APIRouter(prefix="/auth", tags=["authentication"])

# --- Pydantic Models ---

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

# --- Endpoints ---

@router.post("/google")
def google_auth(req: GoogleAuthRequest, response: Response, db: Session = Depends(get_db)):
    try:
        # 🔹 Verify the Google ID Token
        # Use httpx for verification as it proved more stable in tests
        from google.auth.transport import Response
        
        class HttpxResponse(Response):
            def __init__(self, status, headers, data):
                self._status = status
                self._headers = headers
                self._data = data
            @property
            def status(self): return self._status
            @property
            def headers(self): return self._headers
            @property
            def data(self): return self._data

        class HttpxRequest:
            def __call__(self, url, method="GET", body=None, headers=None, timeout=None, **kwargs):
                import httpx
                with httpx.Client(verify=True) as client:
                    resp = client.request(method, url, content=body, headers=headers, timeout=timeout)
                    return HttpxResponse(status=resp.status_code, headers=resp.headers, data=resp.content)
        
        idinfo = id_token.verify_oauth2_token(
            req.token,
            HttpxRequest(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google token: email missing")
        
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        email_verified = idinfo.get("email_verified", False)

        if not email_verified:
            raise HTTPException(status_code=400, detail="Email not verified by Google")

    except ValueError as e:
        # Invalid token
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        logging.error(f"Google auth connection/SSL error: {str(e)}", exc_info=True)
        # If it's a connection/SSL error, it's usually a network issue on the server side
        if "SSL" in str(e) or "Connection" in str(e):
             raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
                detail="Unable to reach Google servers. Please check your network connection or try again later."
            )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google authentication failed")

    # 🔹 Check if user exists (by email)
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # 🔹 Create new user if they don't exist
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            provider="google",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # 🔹 Link account if it was an email-only account before
        if user.provider == "email":
            user.provider = "google" # Optionally track multiple providers if needed
            user.is_verified = True
            db.commit()

    # 🔐 Generate access token
    access_token = create_access_token({"user_id": user.id})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # ⚠️ set True in production (HTTPS)
        samesite="lax",
        max_age=60 * 60 * 24 * 30  # 30 days
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }


@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == req.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = generate_otp()

    user = models.User(
        email=req.email,
        password=hash_password(req.password),
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        otp_code=hash_password(otp), # store hashed OTP for security
        provider="email",
        is_verified=False
    )

    db.add(user)
    db.commit()

    try:
        send_otp_email(req.email, otp)
    except Exception as e:
        logging.error(f"Failed to send OTP email: {e}")
        # Note: In production, you might want to handle this differently
        # For now, we still return success but log the error

    return {"message": "Verification code sent to email"}


@router.post("/verify")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.otp_code or not verify_password(req.otp, user.otp_code):
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user.is_verified = True
    user.otp_code = None
    db.commit()

    return {"message": "Email verified successfully"}


@router.get("/me")
def get_me(user_id: int = Depends(get_current_user), db=Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "plan": user.plan
    }


@router.post("/login")
def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if user.provider == "google" and not user.password:
         raise HTTPException(
            status_code=400,
            detail="This account uses Google login. Please sign in with Google."
        )

    if not verify_password(req.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token = create_access_token({"user_id": user.id})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # ⚠️ set True in production (HTTPS)
        samesite="lax",
        max_age=60 * 60 * 24 * 30  # 30 days
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }