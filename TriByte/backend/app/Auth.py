from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from supabase_client import supabase  # shared client, defined once in supabase_client.py

router = APIRouter(prefix="/auth", tags=["Auth"])


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    class_level: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })
    except Exception as e:
        # This means Supabase Auth itself rejected the signup
        raise HTTPException(status_code=400, detail=f"Auth signup failed: {str(e)}")

    if res.user is None:
        raise HTTPException(status_code=400, detail="Signup failed: no user returned")

    try:
        supabase.table("profiles").insert({
            "id": res.user.id,
            "full_name": data.full_name,
            "class_level": data.class_level,
            "xp": 0,
            "streak": 0
        }).execute()
    except Exception as e:
        # User was created in Auth but profile insert failed - surface the REAL error
        raise HTTPException(status_code=400, detail=f"Profile creation failed: {str(e)}")

    return {
        "message": "Signup successful",
        "user_id": res.user.id,
        "email": res.user.email
    }


@router.post("/login")
def login(data: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

    if res.user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "access_token": res.session.access_token,
        "user_id": res.user.id,
        "email": res.user.email
    }