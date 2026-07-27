from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="EduSphere API",
    description="Backend for NCERT Class 9-12 personalized learning platform",
    version="0.1.0"
)

# Allow frontend (and teammates) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later we will restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
