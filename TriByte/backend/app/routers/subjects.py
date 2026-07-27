from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
from core.config import settings

router = APIRouter(prefix="/subjects", tags=["Subjects"])

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

@router.get("/")
def get_all_subjects():
    try:
        res = supabase.table("subjects").select("*").execute()
        return {"subjects": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}")
def get_subject(slug: str):
    try:
        res = supabase.table("subjects").select("*").eq("slug", slug).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Subject not found")
        return res.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Subject not found")
