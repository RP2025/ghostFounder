"""Business Agent learning ledger (§2.6) — never raise the same thing twice.

Hackathon scope: in-memory, per-session dedup across loop iterations. The class
sits behind a small interface so swapping to a persistent, cross-run store later
is a backend change, not a prompt change.

Fingerprinting: for the hackathon we use a normalized-text fingerprint (cheap,
no embedding infra). We also pass the ledger into the Business Agent's prompt so
the model itself is aware of prior items up front — belt and suspenders, per the
doc's "feed the ledger back into the prompt" rule. Semantic-embedding
fingerprints are the hardened version noted in the doc.
"""
from __future__ import annotations

import hashlib
import re

from schemas import ChangeRequest, LedgerEntry

_STOPWORDS = {
    "the", "a", "an", "to", "for", "of", "and", "or", "add", "make", "user",
    "users", "can", "cant", "cannot", "should", "able", "feature", "bug", "on",
    "in", "with", "screen", "page", "so", "that", "we", "need", "needs",
}


def _normalize(text: str) -> str:
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    kept = sorted(t for t in tokens if t not in _STOPWORDS)
    return " ".join(kept)


def fingerprint(cr_type: str, title: str) -> str:
    """Normalized-intent fingerprint. Rephrasings of the same intent collapse
    because word order and stopwords are stripped before hashing."""
    basis = f"{cr_type}:{_normalize(title)}"
    return hashlib.sha1(basis.encode()).hexdigest()[:16]


class Ledger:
    """One ledger per session (in-memory)."""

    def __init__(self) -> None:
        self._entries: dict[str, LedgerEntry] = {}

    # ---- interface the orchestrator/agents use ----
    def entries(self) -> list[LedgerEntry]:
        return list(self._entries.values())

    def get(self, fp: str) -> LedgerEntry | None:
        return self._entries.get(fp)

    def is_suppressed(self, cr: ChangeRequest) -> tuple[bool, LedgerEntry | None]:
        """A change request is suppressed if we've already dealt with it.

        Suppressed states: applied / verified_fixed / rejected / open / approved.
        Only a genuine regression (a verified_fixed item recurring WITH new
        evidence) is allowed through, handled by `reopen`.
        """
        entry = self._entries.get(fingerprint(cr.type, cr.title))
        if entry is None:
            return False, None
        return True, entry

    def register(self, cr: ChangeRequest, iteration: int) -> LedgerEntry:
        """Record a newly-surfaced request (first time we've seen it)."""
        fp = fingerprint(cr.type, cr.title)
        entry = LedgerEntry(
            fingerprint=fp,
            type=cr.type,
            title=cr.title,
            first_seen_iteration=iteration,
            status="open",
            occurrences=1,
        )
        self._entries[fp] = entry
        return entry

    def record_decision(self, fp: str, decision: str) -> None:
        entry = self._entries.get(fp)
        if not entry:
            return
        entry.human_decision = decision
        entry.status = {"approve": "approved", "reject": "rejected"}.get(
            decision, entry.status
        )

    def mark_applied(self, fp: str, resolution: str) -> None:
        entry = self._entries.get(fp)
        if entry:
            entry.status = "applied"
            entry.resolution = resolution

    def mark_verified_fixed(self, fp: str) -> None:
        entry = self._entries.get(fp)
        if entry:
            entry.status = "verified_fixed"

    def reopen(self, fp: str) -> LedgerEntry | None:
        """A verified_fixed item came back → regression. Escalate to must."""
        entry = self._entries.get(fp)
        if entry and entry.status in ("verified_fixed", "applied"):
            entry.status = "reopened"
            entry.occurrences += 1
        return entry

    def prompt_summary(self) -> str:
        """Compact view fed into the Business Agent prompt so it knows what it
        has already raised BEFORE it speaks."""
        if not self._entries:
            return "(empty — this is the first review)"
        lines = [
            f"- [{e.type}] \"{e.title}\" — status={e.status}, seen x{e.occurrences}"
            for e in self._entries.values()
        ]
        return "\n".join(lines)


# session_id -> Ledger. Swap for a persistent store to get cross-run learning.
_ledgers: dict[str, Ledger] = {}


def get_ledger(session_id: str) -> Ledger:
    return _ledgers.setdefault(session_id, Ledger())
