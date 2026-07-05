"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  BusinessOutput,
  Decision,
  HumanDecision,
  SessionStatus,
} from "@/types/snapshot";
import { Check, RefreshCw, Rocket, X, Bug, Sparkles } from "lucide-react";

interface LoopPanelProps {
  business: BusinessOutput;
  iteration: number;
  maxIterations: number;
  status: SessionStatus;
  canContinue: boolean;
  busy: boolean;
  onStep: (decisions: HumanDecision[]) => void;
  onShip: () => void;
}

const priorityStyle: Record<string, string> = {
  must: "text-ghost-violet",
  should: "text-ghost-blue",
  could: "text-ink-muted",
};

export function LoopPanel({
  business,
  iteration,
  maxIterations,
  status,
  canContinue,
  busy,
  onStep,
  onShip,
}: LoopPanelProps) {
  const requests = business.change_requests;
  // Default every request to "approve"; the human can flip to reject.
  const [decisions, setDecisions] = useState<Record<string, Decision>>(() =>
    Object.fromEntries(requests.map((r) => [r.id, "approve" as Decision]))
  );

  const set = (id: string, d: Decision) =>
    setDecisions((prev) => ({ ...prev, [id]: d }));

  const approvedCount = Object.values(decisions).filter((d) => d === "approve").length;

  const handleStep = () => {
    const payload: HumanDecision[] = requests.map((r) => ({
      request_id: r.id,
      decision: decisions[r.id] ?? "approve",
    }));
    onStep(payload);
  };

  const shipped = status === "shipped";
  const maxed = status === "max_reached";

  return (
    <Card className="p-6">
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/[0.12] text-accent">
            <RefreshCw size={17} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">Refinement Loop</h3>
            <p className="text-xs text-ink-muted">
              The Business Agent reviewed your product as a user.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-ink-faint/20 px-3 py-1 font-mono text-xs text-ink-muted">
            iteration {iteration}/{maxIterations}
          </span>
          <VerdictBadge verdict={business.verdict} shipped={shipped} maxed={maxed} />
        </div>
      </div>

      {/* terminal states */}
      {(shipped || maxed) && (
        <div
          className={cn(
            "mb-4 rounded-xl border p-4 text-sm",
            shipped
              ? "border-accent/30 bg-accent/[0.08] text-ink"
              : "border-ink-faint/25 bg-ink/[0.03] text-ink-muted"
          )}
        >
          {shipped
            ? "🚀 The Business Agent is satisfied — this MVP is ready to ship."
            : "Reached the iteration cap. You can ship the current MVP as-is."}
        </div>
      )}

      {/* change requests */}
      {requests.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No new change requests this round — the product held up to review.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const d = decisions[r.id] ?? "approve";
            return (
              <div
                key={r.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  d === "reject"
                    ? "border-ink-faint/15 bg-ink/[0.02] opacity-60"
                    : "border-ink-faint/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      {r.type === "bug" ? (
                        <Bug size={13} className="shrink-0 text-orange-400" />
                      ) : (
                        <Sparkles size={13} className="shrink-0 text-ghost-cyan" />
                      )}
                      <h4 className="truncate text-sm font-medium">{r.title}</h4>
                    </div>
                    <p className="text-xs text-ink-muted">{r.rationale}</p>
                    {r.expected_impact && (
                      <p className="mt-1 text-xs text-ink-faint">
                        Impact: {r.expected_impact}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase text-ink-faint">
                      <span className={priorityStyle[r.priority] ?? ""}>{r.priority}</span>
                      <span>effort: {r.effort}</span>
                      <span>{r.type}</span>
                    </div>
                  </div>
                  {/* approve / reject toggle */}
                  {!shipped && !maxed && (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => set(r.id, "approve")}
                        disabled={busy}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                          d === "approve"
                            ? "border-accent/50 bg-accent/15 text-accent"
                            : "border-ink-faint/20 text-ink-faint hover:text-ink"
                        )}
                        aria-label="Approve"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => set(r.id, "reject")}
                        disabled={busy}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                          d === "reject"
                            ? "border-red-500/40 bg-red-500/10 text-red-400"
                            : "border-ink-faint/20 text-ink-faint hover:text-ink"
                        )}
                        aria-label="Reject"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* actions */}
      {!shipped && !maxed && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={handleStep} disabled={busy || !canContinue}>
            <RefreshCw size={15} className={busy ? "animate-spin" : ""} />
            {busy
              ? "Rebuilding…"
              : `Apply ${approvedCount} & re-review`}
          </Button>
          <Button variant="outline" onClick={onShip} disabled={busy}>
            <Rocket size={15} />
            Ship it
          </Button>
          {!canContinue && (
            <span className="text-xs text-ink-faint">Iteration cap reached.</span>
          )}
        </div>
      )}
    </Card>
  );
}

function VerdictBadge({
  verdict,
  shipped,
  maxed,
}: {
  verdict: string;
  shipped: boolean;
  maxed: boolean;
}) {
  const isShip = verdict === "ship" || shipped;
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        isShip
          ? "border-accent/40 bg-accent/[0.12] text-accent"
          : maxed
          ? "border-ink-faint/30 text-ink-muted"
          : "border-ghost-violet/40 bg-ghost-violet/[0.12] text-ghost-violet"
      )}
    >
      {isShip ? "verdict: ship" : "verdict: iterate"}
    </span>
  );
}
