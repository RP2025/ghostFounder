import { WizardAnswers } from "@/types";
import { HumanDecision, Snapshot } from "@/types/snapshot";
import { MOCK_DELAY_MS, USE_MOCK } from "@/lib/config";
import { mockGenerate, mockShip, mockStep } from "@/services/mockSnapshot";

/** Shape the backend/proxy returns on error. */
interface ApiError {
  detail?: { error?: string; missing?: string[] };
  error?: string;
}

function errorMessage(data: ApiError, status: number): string {
  return data?.detail?.error ?? data?.error ?? `Request failed (${status})`;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errorMessage(data as ApiError, res.status));
  return data as T;
}

/** Phase 1: Market -> Product -> Business review #1. */
export async function generateStartup(answers: WizardAnswers): Promise<Snapshot> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return mockGenerate(answers);
  }
  try {
    return await post<Snapshot>("/api/generate", answers);
  } catch (err) {
    console.warn("[orchestrator] /generate failed, using mock fallback:", err);
    return mockGenerate(answers);
  }
}

/** Phase 2: apply human decisions, rebuild, review again. */
export async function stepLoop(
  sessionId: string,
  decisions: HumanDecision[]
): Promise<Snapshot> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return mockStep(sessionId, decisions);
  }
  try {
    return await post<Snapshot>("/api/loop/step", { session_id: sessionId, decisions });
  } catch (err) {
    console.warn("[orchestrator] /loop/step failed, using mock fallback:", err);
    return mockStep(sessionId, decisions);
  }
}

/** End the loop ("ship it"). */
export async function shipStartup(sessionId: string): Promise<Snapshot> {
  if (USE_MOCK) {
    await delay(300);
    return mockShip(sessionId);
  }
  try {
    return await post<Snapshot>("/api/loop/ship", { session_id: sessionId });
  } catch (err) {
    console.warn("[orchestrator] /loop/ship failed, using mock fallback:", err);
    return mockShip(sessionId);
  }
}
