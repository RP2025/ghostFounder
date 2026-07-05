"""Orchestrator — the pipeline + the Product<->Business refinement loop (§3, §2.5).

Phase 1 (sequential): Market -> Product(initial) -> Business(review #1).
Phase 2 (loop): human approves change requests -> Product applies them ->
Business reviews again. Repeats until verdict=ship, human ships, or the cap.

Sessions are in-memory (hackathon). The human gate is a policy hook: today the
decisions come from the client; swap `apply_decisions` for an auto-policy later
to get the autonomous loop without touching the agents.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from agents.business import run_business
from agents.market import run_market
from agents.product import run_product_initial, run_product_refine
from config import get_settings
from ledger import Ledger, fingerprint, get_ledger
from schemas import (
    BusinessOutput,
    ChangeRequest,
    HumanDecision,
    Intake,
    MarketOutput,
    ProductOutput,
)

_settings = get_settings()


@dataclass
class Session:
    id: str
    intake: Intake
    market: MarketOutput | None = None
    product: ProductOutput | None = None
    business: BusinessOutput | None = None
    iteration: int = 1
    status: str = "running"  # running | shipped | max_reached
    ledger: Ledger = field(default_factory=Ledger)

    def snapshot(self) -> dict:
        return {
            "session_id": self.id,
            "iteration": self.iteration,
            "max_iterations": _settings.max_loop_iterations,
            "status": self.status,
            "intake": self.intake.model_dump(),
            "market": self.market.model_dump() if self.market else None,
            "product": self.product.model_dump() if self.product else None,
            "business": self.business.model_dump() if self.business else None,
            "ledger": [e.model_dump() for e in self.ledger.entries()],
            "can_continue": self.can_continue(),
        }

    def can_continue(self) -> bool:
        if self.status != "running":
            return False
        if self.iteration >= _settings.max_loop_iterations:
            return False
        if self.business and self.business.verdict == "ship":
            return False
        return True


_sessions: dict[str, Session] = {}


def _new_id() -> str:
    # Deterministic, no randomness needed: session count is enough for a demo.
    return f"s_{len(_sessions) + 1:04d}"


def get_session(session_id: str) -> Session | None:
    return _sessions.get(session_id)


async def start_pipeline(intake: Intake) -> Session:
    """Phase 1: Market -> Product(initial) -> Business(review #1)."""
    sid = _new_id()
    session = Session(id=sid, intake=intake, ledger=get_ledger(sid))
    _sessions[sid] = session

    session.market = await run_market(intake)
    session.product = await run_product_initial(intake, session.market.mvp_layout)
    session.business = await run_business(
        intake, session.market, session.product, session.ledger, session.iteration
    )
    _finalize_status(session)
    return session


async def step_loop(session: Session, decisions: list[HumanDecision]) -> Session:
    """Phase 2: apply the human gate's decisions, rebuild, review again."""
    if not session.can_continue():
        return session
    assert session.market and session.product and session.business

    approved = _apply_decisions(session, decisions)
    if approved:
        session.product = await run_product_refine(
            session.intake, session.product, approved
        )
        for cr in approved:
            session.ledger.mark_applied(
                fingerprint(cr.type, cr.title), resolution="applied by Product Agent"
            )

    session.iteration += 1
    session.business = await run_business(
        session.intake, session.market, session.product, session.ledger, session.iteration
    )
    _finalize_status(session)
    return session


def ship(session: Session) -> Session:
    """Human hits 'ship it' — end the loop regardless of verdict."""
    session.status = "shipped"
    return session


# ─────────────────────── human gate (policy hook) ───────────────────────
def _apply_decisions(
    session: Session, decisions: list[HumanDecision]
) -> list[ChangeRequest]:
    """Turn human decisions into the approved change-request list.

    THIS is the swappable policy hook. Replace the body with an auto-policy
    (e.g. auto-approve must/s+m tracing to a failed validation) to run the loop
    without a human — the rest of the orchestrator is unchanged.
    """
    proposed = {cr.id: cr for cr in session.business.change_requests}
    approved: list[ChangeRequest] = []
    for d in decisions:
        cr = proposed.get(d.request_id)
        if not cr:
            continue
        session.ledger.record_decision(fingerprint(cr.type, cr.title), d.decision)
        if d.decision == "reject":
            continue
        if d.decision == "edit" and d.edited_title:
            cr.title = d.edited_title
        approved.append(cr)
    return approved


def _finalize_status(session: Session) -> None:
    if session.business and session.business.verdict == "ship":
        session.status = "shipped"
    elif session.iteration >= _settings.max_loop_iterations:
        session.status = "max_reached"
    else:
        session.status = "running"
