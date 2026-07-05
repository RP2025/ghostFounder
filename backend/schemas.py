"""Pydantic models = the JSON contracts from docs/000-startup-expert.md.

These are used three ways:
  1. Validate what each agent returns (retry the LLM on mismatch).
  2. Generate the JSON schema we embed in each agent's prompt.
  3. Type the orchestrator's running context object.
Fields are lenient (defaults everywhere) so a slightly-off LLM response still
parses; the quality bar is enforced by the prompts, not by rejecting output.
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

# Documented value sets, kept as plain str so a slightly-off LLM label (e.g.
# "high" instead of "must", "Ship" instead of "ship") never hard-fails a whole
# generation. The prompts pin the canonical values; the frontend displays as-is.
Priority = str  # "must" | "should" | "could"
Effort = str  # "s" | "m" | "l"


# ─────────────────────────── Intake (§2.0) ───────────────────────────
class Intake(BaseModel):
    idea: str = ""
    motivation: str = ""
    goal: str = ""
    audience: str = ""
    timeline: str = ""
    technical_level: str = ""
    platform: str = ""
    business_model: str = ""

    def missing_fields(self) -> list[str]:
        return [k for k, v in self.model_dump().items() if not str(v).strip()]

    def is_complete(self) -> bool:
        return not self.missing_fields()


# ─────────────────────── Market Agent (§2.1) ─────────────────────────
class Competitor(BaseModel):
    name: str = ""
    positioning: str = ""
    weakness: str = ""


class SizingFigure(BaseModel):
    value: str = ""
    unit: str = ""
    reasoning: str = ""


class MarketSizing(BaseModel):
    tam: SizingFigure = Field(default_factory=SizingFigure)
    sam: SizingFigure = Field(default_factory=SizingFigure)
    som: SizingFigure = Field(default_factory=SizingFigure)


class SWOT(BaseModel):
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    opportunities: list[str] = Field(default_factory=list)
    threats: list[str] = Field(default_factory=list)


class MarketAnalysis(BaseModel):
    competitors: list[Competitor] = Field(default_factory=list)
    market_sizing: MarketSizing = Field(default_factory=MarketSizing)
    trend: str = ""
    swot: SWOT = Field(default_factory=SWOT)


class Slide(BaseModel):
    title: str = ""
    bullets: list[str] = Field(default_factory=list)
    speaker_note: str = ""


class PitchDeck(BaseModel):
    slides: list[Slide] = Field(default_factory=list)


class MvpLayout(BaseModel):
    """The hand-off object the Product Agent consumes."""
    core_value: str = ""
    primary_flow: str = ""
    must_have_screens: list[str] = Field(default_factory=list)


class MarketOutput(BaseModel):
    analysis: MarketAnalysis = Field(default_factory=MarketAnalysis)
    pitch_deck: PitchDeck = Field(default_factory=PitchDeck)
    mvp_layout: MvpLayout = Field(default_factory=MvpLayout)


# ─────────────────────── Product Agent (§2.2) ────────────────────────
class Component(BaseModel):
    name: str = ""
    kind: str = ""  # frontend|backend|datastore|external|auth
    responsibility: str = ""


class Architecture(BaseModel):
    components: list[Component] = Field(default_factory=list)
    mermaid_flow: str = ""


class EntityField(BaseModel):
    name: str = ""
    type: str = ""
    note: Optional[str] = None


class Relationship(BaseModel):
    to: str = ""
    kind: str = ""  # one-to-one|one-to-many|many-to-many


class Entity(BaseModel):
    name: str = ""
    fields: list[EntityField] = Field(default_factory=list)
    relationships: list[Relationship] = Field(default_factory=list)


class Database(BaseModel):
    entities: list[Entity] = Field(default_factory=list)
    mermaid_er: str = ""


class Feature(BaseModel):
    title: str = ""
    description: str = ""
    priority: Priority = "should"
    screen: str = ""


class ScreenSection(BaseModel):
    name: str = ""
    content: str = ""


class Screen(BaseModel):
    name: str = ""
    purpose: str = ""
    sections: list[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def _coerce_sections(cls, data):
        """LLMs sometimes return sections as objects ({name, content}) instead
        of plain strings. Flatten them to strings so the screen still renders."""
        if isinstance(data, dict) and isinstance(data.get("sections"), list):
            out = []
            for s in data["sections"]:
                if isinstance(s, str):
                    out.append(s)
                elif isinstance(s, dict):
                    out.append(s.get("name") or s.get("content") or str(s))
                else:
                    out.append(str(s))
            data["sections"] = out
        return data


class Layout(BaseModel):
    screens: list[Screen] = Field(default_factory=list)


class ChangelogEntry(BaseModel):
    request_id: str = ""
    change: str = ""


class ProductOutput(BaseModel):
    architecture: Architecture = Field(default_factory=Architecture)
    database: Database = Field(default_factory=Database)
    features: list[Feature] = Field(default_factory=list)
    layout: Layout = Field(default_factory=Layout)
    changelog: list[ChangelogEntry] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def _coerce_changelog(cls, data):
        """On the initial build the model tends to return changelog as a list of
        strings (or omit request ids). Wrap bare strings into ChangelogEntry."""
        if isinstance(data, dict) and isinstance(data.get("changelog"), list):
            data["changelog"] = [
                {"request_id": "", "change": c} if isinstance(c, str) else c
                for c in data["changelog"]
            ]
        return data


# ─────────────────────── Business Agent (§2.3) ───────────────────────
class Brand(BaseModel):
    name: str = ""
    tagline: str = ""
    rationale: str = ""


class Price(BaseModel):
    amount: str = ""
    cadence: str = ""  # monthly|yearly|one-time|usage


class PricingTier(BaseModel):
    name: str = ""
    price: Price = Field(default_factory=Price)
    target_persona: str = ""
    features_included: list[str] = Field(default_factory=list)
    limits: str = ""


class GoToMarket(BaseModel):
    channels: list[str] = Field(default_factory=list)
    positioning: str = ""
    launch_motion: str = ""


class KeyMetric(BaseModel):
    name: str = ""
    why: str = ""


# ---- product-evaluation output (the loop payload, §2.3 / §2.5) ----
class WalkStep(BaseModel):
    step: str = ""
    reaction: str = ""


class UserReview(BaseModel):
    persona: str = ""
    walkthrough: list[WalkStep] = Field(default_factory=list)
    friction: list[str] = Field(default_factory=list)
    delight: list[str] = Field(default_factory=list)
    sentiment: str = ""  # love|like|meh|confused|frustrated


class Validation(BaseModel):
    claim: str = ""
    verdict: str = "risk"  # pass | fail | risk
    evidence: str = ""


class ChangeRequest(BaseModel):
    id: str = ""
    title: str = ""
    type: str = "feature"  # feature | bug
    rationale: str = ""
    expected_impact: str = ""
    priority: Priority = "should"
    effort: Effort = "m"

    @field_validator("type", mode="before")
    @classmethod
    def _norm_type(cls, v):
        v = str(v).strip().lower()
        return "bug" if v in ("bug", "defect", "issue") else "feature"


class BusinessOutput(BaseModel):
    # strategy
    brand: Brand = Field(default_factory=Brand)
    pricing_tiers: list[PricingTier] = Field(default_factory=list)
    go_to_market: GoToMarket = Field(default_factory=GoToMarket)
    revenue_model: str = ""
    key_metrics: list[KeyMetric] = Field(default_factory=list)
    # product evaluation / loop
    user_review: UserReview = Field(default_factory=UserReview)
    validations: list[Validation] = Field(default_factory=list)
    change_requests: list[ChangeRequest] = Field(default_factory=list)
    verdict: str = "iterate"  # ship | iterate

    @field_validator("verdict", mode="before")
    @classmethod
    def _norm_verdict(cls, v):
        return "ship" if str(v).strip().lower() == "ship" else "iterate"


# ─────────────────────── Ledger (§2.6) ───────────────────────────────
LedgerStatus = Literal[
    "open", "approved", "rejected", "applied", "verified_fixed", "reopened"
]


class LedgerEntry(BaseModel):
    fingerprint: str = ""
    type: Literal["feature", "bug"] = "feature"
    title: str = ""
    first_seen_iteration: int = 1
    status: LedgerStatus = "open"
    resolution: str = ""
    human_decision: str = ""
    occurrences: int = 1


# ─────────────────────── API request/response ────────────────────────
class GenerateRequest(BaseModel):
    intake: Intake


class HumanDecision(BaseModel):
    """One row of the human gate's verdict on a change request (§2.5)."""
    request_id: str
    decision: Literal["approve", "edit", "reject"]
    edited_title: Optional[str] = None
    note: Optional[str] = None


class LoopStepRequest(BaseModel):
    """Advance the Product<->Business loop by one iteration with human decisions."""
    session_id: str
    decisions: list[HumanDecision] = Field(default_factory=list)
