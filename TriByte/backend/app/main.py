from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import auth, subjects

load_dotenv()

app = FastAPI(
    title="EduSphere API",
    description="Backend for NCERT Class 9-12 personalized learning platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(subjects.router)

@app.get("/")
def root():
    return {
        "message": "EduSphere API is running",
        "status": "ok",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
