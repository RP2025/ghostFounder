"""Product Agent (§2.2) — stage 2. First build consumes the Market Agent's MVP
layout; loop passes apply approved change requests to the current MVP."""
from __future__ import annotations

import json

from llm import call_json
from schemas import ChangeRequest, Intake, MvpLayout, ProductOutput

from .prompts import PRODUCT_LOOP_INSTRUCTION, PRODUCT_SYSTEM


async def run_product_initial(intake: Intake, mvp_layout: MvpLayout) -> ProductOutput:
    user = (
        "Build the first version of this MVP from the market brief below.\n\n"
        f"Founder intake:\n{json.dumps(intake.model_dump(), indent=2)}\n\n"
        f"MVP layout (from Market Agent):\n{json.dumps(mvp_layout.model_dump(), indent=2)}"
    )
    return await call_json(PRODUCT_SYSTEM, user, ProductOutput)


async def run_product_refine(
    intake: Intake,
    current: ProductOutput,
    approved: list[ChangeRequest],
) -> ProductOutput:
    user = (
        f"{PRODUCT_LOOP_INSTRUCTION}\n\n"
        f"Founder intake:\n{json.dumps(intake.model_dump(), indent=2)}\n\n"
        f"CURRENT MVP:\n{json.dumps(current.model_dump(), indent=2)}\n\n"
        f"APPROVED change requests to apply:\n"
        f"{json.dumps([c.model_dump() for c in approved], indent=2)}"
    )
    return await call_json(PRODUCT_SYSTEM, user, ProductOutput)
