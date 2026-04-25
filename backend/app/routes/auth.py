from pydantic import BaseModel, EmailStr, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models
from app.core.security import hash_password, verify_password, create_access_token
from app.core.otp import generate_otp
from app.services.email_service import send_otp_email

router = APIRouter(prefix="/auth")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
        otp_code=hash_password(otp)  # store hashed OTP
    )

    db.add(user)
    db.commit()

    send_otp_email(req.email, otp)

    return {"message": "OTP sent to email"}


@router.post("/verify")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.otp_code or not verify_password(req.otp, user.otp_code):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    user.otp_code = None

    db.commit()

    return {"message": "Email verified successfully"}


# @router.post("/login")
# def login(req: LoginRequest, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == req.email).first()

#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Email not verified")

#     if not user or not verify_password(req.password, user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_access_token({"user_id": user.id})

#     return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()

    # 1. Check if the user exists at all first
    if not user:
        # It's best practice to return a generic error message for security
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 2. Check the password
    if not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3. Finally, check if they are verified
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    first_name: str = Field(min_length=2, max_length=50)
    last_name: str = Field(min_length=2, max_length=50)


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str