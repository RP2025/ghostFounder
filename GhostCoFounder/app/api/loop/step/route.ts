import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/loop/step
 * Forwards the human gate's decisions to the orchestrator, which applies the
 * approved change requests (Product rebuild) and runs the next Business review.
 * Body: { session_id, decisions: [{ request_id, decision, edited_title? }] }
 */
export const maxDuration = 300;

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${BACKEND}/loop/step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: { error: `Orchestrator unreachable at ${BACKEND}.` } },
      { status: 502 }
    );
  }
}
