/**
 * USE_MOCK=true  -> the UI returns a rich fake Snapshot instantly (no backend,
 *                   no Claude latency). Great for building/testing the UI.
 * USE_MOCK=false -> calls the real FastAPI orchestrator via /api/* (slow, real).
 *
 * Now env-driven so we don't ship the wrong value: defaults to the REAL backend.
 * Set NEXT_PUBLIC_USE_MOCK=true (locally) to force mock mode.
 * Note: the client also falls back to mock automatically if the backend errors
 * or times out, so the UI never hard-fails.
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Simulated latency for the mock so the processing animation still feels real. */
export const MOCK_DELAY_MS = 900;
