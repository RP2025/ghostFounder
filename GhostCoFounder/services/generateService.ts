import { GenerateResponse, WizardAnswers } from "@/types";
import { mockGenerateResponse } from "@/services/mockGenerator";

/**
 * Calls POST /api/generate with the wizard answers.
 * If the request fails (network error, non-2xx, backend not deployed yet),
 * we transparently fall back to a local mock so the product still feels
 * complete during the hackathon / before a real AI backend exists.
 *
 * Phase 2: swap the mock fallback for real error UI / retry logic once
 * the backend is guaranteed to be live.
 */
export async function generateStartupPlan(
  answers: WizardAnswers
): Promise<GenerateResponse> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    if (!res.ok) throw new Error(`Generate API responded with ${res.status}`);

    const data = (await res.json()) as GenerateResponse;
    return data;
  } catch (err) {
    console.warn("[generateService] Falling back to mock response:", err);
    return mockGenerateResponse(answers);
  }
}
