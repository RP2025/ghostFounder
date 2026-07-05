import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/loop/ship
 * Ends the refinement loop ("ship it") regardless of verdict.
 * Body: { session_id }
 */
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${BACKEND}/loop/ship`, {
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
