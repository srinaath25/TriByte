import os
import json
import asyncio
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel,ConfigDict
from google import genai
from google.genai import types

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    message: str
    history: Optional[List[Dict[str, Any]]] = []
    currentQuestion: Optional[Dict[str, Any]] = None

async def generate_chat_stream(request_data: ChatRequest):
    # Retrieve key inside request execution
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        yield f"data: {json.dumps({'error': 'GEMINI_API_KEY is missing from environment variables.'})}\n\n"
        yield "data: [DONE]\n\n"
        return
    client = genai.Client(api_key=api_key)

    system_instruction = (
        "You are a friendly, encouraging AI tutor helping students. "
        "Provide clear, concise explanations. Do NOT give direct answers immediately if "
        "the student asks for help on a specific question—instead, offer hints and break down "
        "the problem step-by-step so they learn."
    )

    if request_data.currentQuestion:
        q_text = request_data.currentQuestion.get("question", "")
        options = request_data.currentQuestion.get("options", [])
        system_instruction += f"\nCurrently, the student is looking at this question: '{q_text}'."
        if options:
            system_instruction += f" Options: {', '.join(options)}."

    contents = []
    if request_data.history:
        for item in request_data.history:
            contents.append(
                types.Content(
                    role=item.get("role", "user"),
                    parts=[types.Part.from_text(text=p.get("text", "")) for p in item.get("parts", [])]
                )
            )

    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=request_data.message)]
        )
    )

    try:
        response_stream = client.models.generate_content_stream(
            model="gemini-3.6-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            )
        )

        for chunk in response_stream:
            if chunk.text:
                payload = json.dumps({"text": chunk.text})
                yield f"data: {payload}\n\n"
                await asyncio.sleep(0.01)

        yield "data: [DONE]\n\n"

    except Exception as e:
        error_payload = json.dumps({"error": str(e)})
        yield f"data: {error_payload}\n\n"

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        generate_chat_stream(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )