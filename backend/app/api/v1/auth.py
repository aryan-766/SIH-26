import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, EntrepreneurProfile
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

class PhoneOtpRequest(BaseModel):
    phone: str

class PhoneOtpVerify(BaseModel):
    phone: str
    otp: str
    full_name: Optional[str] = "Rural Entrepreneur"
    social_category: Optional[str] = "OBC"
    district_id: Optional[str] = "dist_gorakhpur"
    village: Optional[str] = "Bhiti Rawat"

class OfficerLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/send-otp")
def send_phone_otp(req: PhoneOtpRequest):
    """
    Simulates sending SMS OTP to rural entrepreneur (Supabase / Twilio ready).
    For SIH hackathon demo, OTP is fixed to '123456'.
    """
    return {
        "success": True,
        "phone": req.phone,
        "message": "OTP 123456 sent successfully via SMS gateway.",
        "otp_demo": "123456"
    }

@router.post("/verify-otp")
def verify_phone_otp(req: PhoneOtpVerify, db: Session = Depends(get_db)):
    """
    Verifies phone OTP and returns JWT access token.
    Auto-creates profile if user is logging in for the first time.
    """
    if req.otp not in ["123456", "000000"]:
        raise HTTPException(status_code=400, detail="Invalid OTP entered")

    user = db.query(User).filter(User.phone == req.phone).first()
    if not user:
        user_id = f"user_{req.phone[-6:]}"
        user = User(
            id=user_id,
            phone=req.phone,
            full_name=req.full_name,
            role="entrepreneur",
            district_id=req.district_id,
            village=req.village,
            social_category=req.social_category
        )
        db.add(user)
        profile = EntrepreneurProfile(
            id=f"prof_{user_id}",
            user_id=user_id,
            capital=50000.0,
            skills=["Dairy Farming"],
            experience_years=1,
            land_sqft=500
        )
        db.add(profile)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={
        "sub": user.id,
        "role": user.role,
        "district_id": user.district_id,
        "full_name": user.full_name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role,
            "district_id": user.district_id,
            "village": user.village,
            "social_category": user.social_category
        }
    }

@router.post("/officer-login")
def officer_login(req: OfficerLoginRequest, db: Session = Depends(get_db)):
    """
    Officer email login supporting RBAC roles:
    district_officer, sca_pwd_officer, field_officer, super_admin
    """
    # Demo credentials mapping
    officer = db.query(User).filter(User.email == req.email).first()
    if not officer:
        # Default mock matching for demo convenience
        if "district" in req.email:
            officer = db.query(User).filter(User.id == "officer_district_gkp").first()
        elif "field" in req.email:
            officer = db.query(User).filter(User.id == "officer_field_sahjanwa").first()
        elif "sca" in req.email:
            officer = db.query(User).filter(User.id == "officer_sca_welfare").first()
        else:
            officer = db.query(User).filter(User.id == "admin_super").first()

    if not officer:
        raise HTTPException(status_code=401, detail="Invalid officer credentials")

    token = create_access_token(data={
        "sub": officer.id,
        "role": officer.role,
        "district_id": officer.district_id,
        "full_name": officer.full_name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": officer.id,
            "email": officer.email,
            "full_name": officer.full_name,
            "role": officer.role,
            "district_id": officer.district_id
        }
    }

@router.post("/offline-token")
def issue_field_offline_token(db: Session = Depends(get_db)):
    """
    Issues a 24-hour offline token for Field Officers to collect and store survey data locally.
    """
    token = create_access_token(
        data={"sub": "officer_field_sahjanwa", "role": "field_officer", "offline_mode": True},
        expires_delta=datetime.timedelta(hours=24)
    )
    return {
        "offline_token": token,
        "valid_for_hours": 24,
        "message": "Offline field survey caching authorized."
    }
