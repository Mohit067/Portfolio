"""Mohit AI backend — FastAPI server exposing the Google ADK agent over HTTP.

Run:
    uvicorn server:app --port 8001
Environment:
    GOOGLE_API_KEY   optional — enables the ADK/Gemini reasoning path.
                     Without it, /chat answers deterministically from
                     verified data files (engine="retrieval").
    AGENT_MODEL      default: gemini-2.0-flash
"""
from __future__ import annotations

import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from agent import answer_async, has_llm_key, stream_async  # noqa: E402

PORT = int(os.environ.get("AGENT_PORT", "8001"))
STARTED = time.time()

app = FastAPI(title="Mohit AI Agent", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000",
                   "http://localhost:3006", "http://127.0.0.1:3006"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    mode: str = "mohit"


def _mode(m: str) -> str:
    return "general" if (m or "").strip().lower() == "general" else "mohit"


class ChatOut(BaseModel):
    response: str
    engine: str
    tools_used: list[str] = []


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "engine": "adk-gemini" if has_llm_key() else "retrieval",
        "llm_configured": has_llm_key(),
        "uptime_s": round(time.time() - STARTED, 1),
    }


@app.post("/chat", response_model=ChatOut)
async def chat(body: ChatIn) -> ChatOut:
    try:
        result = await answer_async(body.message, mode=_mode(body.mode))
        return ChatOut(
            response=result["response"],
            engine=result.get("engine", "unknown"),
            tools_used=result.get("tools_used", []),
        )
    except Exception:
        # Never leak stack traces to the client.
        return ChatOut(
            response="Sorry — something went wrong on my side. Try asking again in a moment.",
            engine="error",
            tools_used=[],
        )


@app.post("/chat/stream")
async def chat_stream(body: ChatIn):
    """SSE stream of answer events: data: {"t": "meta"|"tok"|"done", ...}."""
    import json

    mode = _mode(body.mode)

    async def gen():
        try:
            async for ev in stream_async(body.message, mode=mode):
                yield f"data: {json.dumps(ev)}\n\n"
        except Exception:
            yield f"data: {json.dumps({'t': 'tok', 'text': 'Sorry — something went wrong. Try again.'})}\n\n"
            yield f"data: {json.dumps({'t': 'done', 'engine': 'error'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host=os.environ.get("AGENT_HOST", "0.0.0.0"), port=PORT, log_level="info")
