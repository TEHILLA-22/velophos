from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import requests

from app.db.models import Subscription, User
from app.core.deps import get_current_user_obj
from app.core.config import PAYSTACK_SECRET
from app.db.database import get_db

router = APIRouter()


# 🔹 Initialize payment
@router.post("/billing/initialize")
def initialize_payment(user: User = Depends(get_current_user_obj)):

    if not user.email:
        raise HTTPException(status_code=400, detail="User has no email")

    try:
        res = requests.post(
            "https://api.paystack.co/transaction/initialize",
            headers={"Authorization": f"Bearer {PAYSTACK_SECRET}"},
            json={
                "email": user.email,
                "amount": 500000,  # ₦5000 (kobo)
                "callback_url": "http://localhost:3000/pricing/success"
            },
            timeout=10
        )

        data = res.json()

        if not data.get("status"):
            raise HTTPException(status_code=400, detail=data.get("message"))

        return data

    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Payment initialization failed")


# 🔹 Verify payment
@router.get("/billing/verify/{reference}")
def verify_payment(
    reference: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_obj)
):

    res = requests.get(
        f"https://api.paystack.co/transaction/verify/{reference}",
        headers={"Authorization": f"Bearer {PAYSTACK_SECRET}"},
        timeout=10
    )

    data = res.json()

    if not data.get("status") or data["data"]["status"] != "success":
        raise HTTPException(status_code=400, detail="Payment failed")

    # 🔥 prevent duplicate
    existing = db.query(Subscription).filter(
        Subscription.reference == reference
    ).first()

    if existing:
        return {"status": "already_verified"}

    # ✅ upgrade user
    user.plan = "pro"

    sub = Subscription(
        user_id=user.id,
        plan="pro",
        status="active",
        provider="paystack",
        reference=reference
    )

    db.add(sub)
    db.commit()

    return {"status": "success"}


# 🔹 Webhook (IMPORTANT: should verify signature in production)
@router.post("/billing/webhook")
async def paystack_webhook(request: Request, db=Depends(get_db)):

    import hmac
    import hashlib
    from app.core.config import PAYSTACK_WEBHOOK_SECRET

    body_bytes = await request.body()

    signature = request.headers.get("x-paystack-signature")

    computed = hmac.new(
        PAYSTACK_WEBHOOK_SECRET.encode(),
        body_bytes,
        hashlib.sha512
    ).hexdigest()

    if signature != computed:
        raise HTTPException(status_code=401, detail="Invalid signature")

    # ✅ ONLY after verification
    body = await request.json()

    event = body.get("event")

    if event == "charge.success":
        data = body["data"]
        email = data["customer"]["email"]
        reference = data["reference"]

        user = db.query(User).filter(User.email == email).first()

        if not user:
            return {"status": "user_not_found"}

        # 🔥 prevent duplicates
        exists = db.query(Subscription).filter(
            Subscription.reference == reference
        ).first()

        if exists:
            return {"status": "duplicate"}

        user.plan = "pro"

        sub = Subscription(
            user_id=user.id,
            plan="pro",
            status="active",
            provider="paystack",
            reference=reference
        )

        db.add(sub)
        db.commit()

    return {"status": "ok"}