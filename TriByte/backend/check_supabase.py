"""
Run this from inside your backend/app/ folder (same place as main.py):

    python check_supabase.py

It will print exactly what your .env is loading, and try a direct
connection to Supabase so we can see the REAL error, not a wrapped one.
"""

import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
anon_key = os.getenv("SUPABASE_ANON_KEY")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 50)
print("CHECKING .env VALUES")
print("=" * 50)
print(f"SUPABASE_URL      = {repr(url)}")
print(f"SUPABASE_ANON_KEY present?    = {bool(anon_key)}")
print(f"SUPABASE_SERVICE_ROLE_KEY present? = {bool(service_key)}")
print()

if url:
    if url.endswith("/"):
        print("⚠️  WARNING: Your SUPABASE_URL ends with a trailing slash '/' — remove it.")
    if "rest" in url or "auth" in url:
        print("⚠️  WARNING: Your SUPABASE_URL has extra path segments (like /rest/v1) — it should just be https://xxxxx.supabase.co")
    if not url.startswith("https://") or not url.endswith(".co") and not url.endswith(".co/"):
        if not url.rstrip("/").endswith(".co"):
            print("⚠️  WARNING: URL doesn't look like a bare project URL ending in '.co'")

print()
print("=" * 50)
print("TESTING CONNECTION")
print("=" * 50)

try:
    from supabase import create_client
    clean_url = url.rstrip("/") if url else url
    supabase = create_client(clean_url, anon_key)
    res = supabase.table("subjects").select("*").limit(1).execute()
    print("✅ Connection to 'subjects' table WORKED.")
    print("Sample data:", res.data)
except Exception as e:
    print("❌ Connection FAILED. Real error below:")
    print(repr(e))

print()
print("=" * 50)
print("TESTING AUTH SIGNUP DIRECTLY")
print("=" * 50)

try:
    test_email = f"test_{os.urandom(4).hex()}@example.com"
    res = supabase.auth.sign_up({"email": test_email, "password": "TestPass123!"})
    print("✅ auth.sign_up() WORKED. User:", res.user.id if res.user else None)
except Exception as e:
    print("❌ auth.sign_up() FAILED. Real error below:")
    print(repr(e))

try:
    if res.user:
        profile_res = supabase.table("profiles").insert({
            "id": res.user.id,
            "full_name": "Test User",
            "class_level": 10,
            "xp": 0,
            "streak": 0
        }).execute()
        print("✅ profiles insert WORKED.")
        print(profile_res.data)
except Exception as e:
    print("❌ profiles insert FAILED. Real error below:")
    print(repr(e))