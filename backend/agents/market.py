"""Market Analysis Agent (§2.1) — stage 1. Validates the idea and produces the
pitch deck + the MVP layout that feeds the Product Agent."""
from __future__ import annotations

import json

from llm import call_json
from schemas import Intake, MarketOutput

from .prompts import MARKET_SYSTEM


async def run_market(intake: Intake) -> MarketOutput:
    user = (
        "Analyse this startup idea and produce the market analysis, an investor "
        "pitch deck, and a basic MVP layout.\n\n"
        f"Founder intake:\n{json.dumps(intake.model_dump(), indent=2)}"
    )
    return await call_json(MARKET_SYSTEM, user, MarketOutput)
