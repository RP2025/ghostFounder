/**
 * USE_MOCK=true  -> the UI returns a rich fake Snapshot instantly (no backend,
 *                   no Claude latency). Great for building/testing the UI.
 * USE_MOCK=false -> calls the real FastAPI orchestrator via /api/* (slow, real).
 *
 * Flip this one line to switch. (In dev mode the change hot-reloads.)
 */
export const USE_MOCK = true;

/** Simulated latency for the mock so the processing animation still feels real. */
export const MOCK_DELAY_MS = 900;
