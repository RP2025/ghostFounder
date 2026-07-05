"""Thin Claude wrapper: call the model, force JSON out, validate against a
Pydantic model, and retry once with the parse error fed back in."""
from __future__ import annotations

import json
import re
from typing import Type, TypeVar

from anthropic import AsyncAnthropic
from pydantic import BaseModel, ValidationError

from config import get_settings

T = TypeVar("T", bound=BaseModel)

_settings = get_settings()
_client = AsyncAnthropic(api_key=_settings.anthropic_api_key)


def _extract_json(text: str) -> str:
    """Pull the first JSON object out of a model response.

    Handles the common failure modes: ```json fences, or prose wrapped around
    the object. Falls back to the substring between the first { and last }.
    """
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        return fenced.group(1)
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start : end + 1]
    return text.strip()


async def _raw_call(system: str, user: str) -> str:
    resp = await _client.messages.create(
        model=_settings.claude_model,
        max_tokens=_settings.max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(block.text for block in resp.content if block.type == "text")


async def call_json(system: str, user: str, model: Type[T]) -> T:
    """Call Claude and return a validated instance of `model`.

    One retry: if the first response fails to parse or validate, we send the
    error back and ask for a corrected JSON-only response.
    """
    raw = await _raw_call(system, user)
    try:
        return model.model_validate_json(_extract_json(raw))
    except (json.JSONDecodeError, ValidationError) as first_err:
        repair = (
            f"{user}\n\n"
            f"Your previous response could not be parsed into the required schema.\n"
            f"Error: {first_err}\n"
            f"Previous response:\n{raw}\n\n"
            f"Return ONLY corrected, valid JSON matching the schema. No prose, no fences."
        )
        raw2 = await _raw_call(system, repair)
        # Let a second failure raise — the route turns it into a clean 502.
        return model.model_validate_json(_extract_json(raw2))
