import { NextRequest, NextResponse } from "next/server";
import { WizardAnswers } from "@/types";
import { answersToIntake } from "@/lib/answersToIntake";

/**
 * POST /api/generate
 *
 * Proxies the wizard answers to the FastAPI orchestrator's /generate, which
 * runs Market -> Product -> Business(review #1) and returns a session Snapshot.
 * The wizard's multi-select arrays are mapped to the backend's single-string
 * Intake here (server-side) so the frontend contract is untouched.
 */
export const maxDuration = 300; // Product + Business calls are slow (~2.5 min)

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const answers = (await req.json()) as WizardAnswers;
  const intake = answersToIntake(answers);

  try {
    const res = await fetch(`${BACKEND}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: { error: `Orchestrator unreachable at ${BACKEND}. Is the backend running?` } },
      { status: 502 }
    );
  }
}
