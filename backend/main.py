"""FastAPI app — the AI co-founder orchestrator API.

Routes:
  POST /generate      run Phase 1 (Market -> Product -> Business review #1)
  POST /loop/step     advance the refinement loop one iteration with human decisions
  POST /loop/ship     end the loop ("ship it")
  GET  /session/{id}  fetch current session snapshot
  GET  /health        liveness
"""
from __future__ import annotations

from anthropic import APIError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from orchestrator import (
    get_session,
    ship,
    start_pipeline,
    step_loop,
)
from schemas import GenerateRequest, LoopStepRequest

settings = get_settings()

app = FastAPI(title="AI Co-Founder Orchestrator", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "model": settings.claude_model}


@app.post("/generate")
async def generate(req: GenerateRequest) -> dict:
    missing = req.intake.missing_fields()
    if missing:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Intake incomplete. The Market Agent needs these fields.",
                "missing": missing,
            },
        )
    try:
        session = await start_pipeline(req.intake)
    except APIError as e:
        raise HTTPException(status_code=502, detail={"error": f"Claude API error: {e}"})
    except Exception as e:  # noqa: BLE001 - surface any agent/parse failure cleanly
        raise HTTPException(status_code=502, detail={"error": f"Generation failed: {e}"})
    return session.snapshot()


@app.post("/loop/step")
async def loop_step(req: LoopStepRequest) -> dict:
    session = get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail={"error": "Unknown session_id"})
    try:
        session = await step_loop(session, req.decisions)
    except APIError as e:
        raise HTTPException(status_code=502, detail={"error": f"Claude API error: {e}"})
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail={"error": f"Loop step failed: {e}"})
    return session.snapshot()


@app.post("/loop/ship")
async def loop_ship(req: LoopStepRequest) -> dict:
    session = get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail={"error": "Unknown session_id"})
    return ship(session).snapshot()


@app.get("/session/{session_id}")
async def session_snapshot(session_id: str) -> dict:
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail={"error": "Unknown session_id"})
    return session.snapshot()
