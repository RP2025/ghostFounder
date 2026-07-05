"""Business Agent (§2.3) — stage 3 + loop critic. Produces business strategy and a
product evaluation (user review + validations + change requests). Receives the
learning ledger so it never re-raises what it already raised (§2.6)."""
from __future__ import annotations

import json

from ledger import Ledger, fingerprint
from llm import call_json
from schemas import BusinessOutput, Intake, MarketOutput, ProductOutput

from .prompts import BUSINESS_SYSTEM


async def run_business(
    intake: Intake,
    market: MarketOutput,
    product: ProductOutput,
    ledger: Ledger,
    iteration: int,
) -> BusinessOutput:
    user = (
        "Produce the business strategy AND evaluate the current MVP as its target "
        "user. Propose change requests only where you find real friction or failed "
        "validations.\n\n"
        f"Founder intake:\n{json.dumps(intake.model_dump(), indent=2)}\n\n"
        f"Market context (analysis + mvp_layout):\n"
        f"{json.dumps(market.model_dump(), indent=2)}\n\n"
        f"Current MVP to review:\n{json.dumps(product.model_dump(), indent=2)}\n\n"
        f"LEDGER — you have already raised these; do NOT repeat them "
        f"(only reopen with new evidence):\n{ledger.prompt_summary()}"
    )
    out = await call_json(BUSINESS_SYSTEM, user, BusinessOutput)
    return _dedup_against_ledger(out, ledger, iteration)


def _dedup_against_ledger(
    out: BusinessOutput, ledger: Ledger, iteration: int
) -> BusinessOutput:
    """Belt-and-suspenders: even though the ledger is in the prompt, filter any
    change request that collapses to an already-handled fingerprint. A verified-
    fixed item that recurs is allowed through as a reopened regression (§2.6)."""
    kept = []
    for cr in out.change_requests:
        suppressed, entry = ledger.is_suppressed(cr)
        if not suppressed:
            ledger.register(cr, iteration)
            kept.append(cr)
            continue
        if entry and entry.status in ("verified_fixed", "applied") and cr.type == "bug":
            # Regression: escalate and let it through once.
            ledger.reopen(fingerprint(cr.type, cr.title))
            cr.priority = "must"
            kept.append(cr)
        # otherwise: open/approved/rejected -> drop silently (already tracked)
    out.change_requests = kept
    return out
