import { NextRequest, NextResponse } from "next/server";
import { WizardAnswers } from "@/types";
import { mockGenerateResponse } from "@/services/mockGenerator";

/**
 * POST /api/generate
 *
 * Hackathon-stage implementation: generates a deterministic, answer-derived
 * mock response so the full product loop works end-to-end without a real
 * AI backend. Swap the body of this handler for a call to the real
 * pitch-deck + market-analysis generation service in Phase 2 — the
 * request/response contract (WizardAnswers -> GenerateResponse) stays the same.
 */
export async function POST(req: NextRequest) {
  try {
    const answers = (await req.json()) as WizardAnswers;

    // Simulate realistic processing latency.
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = mockGenerateResponse(answers);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate startup plan." },
      { status: 500 }
    );
  }
}
