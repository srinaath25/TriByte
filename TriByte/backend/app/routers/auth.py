from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

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
        # Create user in Supabase Auth
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })

        if res.user is None:
            raise HTTPException(status_code=400, detail="Signup failed")

        # Create profile
        supabase.table("profiles").insert({
            "id": res.user.id,
            "full_name": data.full_name,
            "class_level": data.class_level,
            "xp": 0,
            "streak": 0
        }).execute()

        return {
            "message": "Signup successful",
            "user_id": res.user.id,
            "email": res.user.email
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(data: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if res.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "message": "Login successful",
            "access_token": res.session.access_token,
            "user_id": res.user.id,
            "email": res.user.email
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")
