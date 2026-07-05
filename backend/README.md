# AI Co-Founder Orchestrator — Backend (FastAPI)

Implements the 3-agent pipeline + refinement loop from
[`../docs/000-startup-expert.md`](../docs/000-startup-expert.md).

```
Intake ─► Market Agent ─► Product Agent  ⇄  Business Agent (critic + ledger)
                                          └─ human gate ─┘
```

## Run

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then paste your ANTHROPIC_API_KEY
uvicorn main:app --reload   # http://localhost:8000  (docs at /docs)
```

## API

| Method | Path              | Purpose |
|--------|-------------------|---------|
| POST   | `/generate`       | Phase 1: Market → Product(v1) → Business review #1. Body: `{ "intake": {...8 fields...} }` |
| POST   | `/loop/step`      | Advance the loop one iteration. Body: `{ "session_id": "...", "decisions": [{ "request_id": "cr-1", "decision": "approve" }] }` |
| POST   | `/loop/ship`      | End the loop ("ship it"). Body: `{ "session_id": "..." }` |
| GET    | `/session/{id}`   | Current session snapshot |
| GET    | `/health`         | Liveness + active model |

Every response is a **session snapshot**: `intake`, `market`, `product`,
`business`, `ledger`, `iteration`, `status`, `can_continue`. The frontend renders
directly from this — no other shape to learn.

### Intake fields (all required)
`idea, motivation, goal, audience, timeline, technical_level, platform, business_model`
— `/generate` returns `422 {missing: [...]}` if any are blank.

## Layout

| File | Role |
|------|------|
| `main.py` | FastAPI app + routes |
| `orchestrator.py` | pipeline, loop, session state, **human-gate policy hook** |
| `agents/` | `market.py`, `product.py`, `business.py`, `prompts.py` |
| `schemas.py` | Pydantic models = the JSON contracts |
| `ledger.py` | Business Agent learning ledger (§2.6 dedup) |
| `llm.py` | Claude client: JSON-only call + validate + one repair retry |
| `config.py` | env settings |

## Notes / knobs
- `CLAUDE_MODEL` (default `claude-sonnet-5`), `MAX_LOOP_ITERATIONS` (default `3`) in `.env`.
- **Human gate → autonomous:** `orchestrator._apply_decisions` is the swappable
  policy hook. Replace its body with an auto-approval policy to run the loop with
  no human (§2.5).
- **Ledger dedup:** in-memory per session; lexical fingerprint + the ledger is fed
  into the Business Agent prompt. Swap `ledger.py` for a persistent/embedding-based
  store to get cross-run + semantic dedup.
- Sessions are in-memory — a server restart clears them.
