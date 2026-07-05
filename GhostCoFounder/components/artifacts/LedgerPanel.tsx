"use client";

import { Card } from "@/components/ui/Card";
import { LedgerEntry } from "@/types/snapshot";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

const statusStyle: Record<string, string> = {
  open: "text-ink-muted",
  approved: "text-ghost-blue",
  applied: "text-accent",
  verified_fixed: "text-accent",
  rejected: "text-red-400",
  reopened: "text-orange-400",
};

/**
 * "What the AI remembers" — the Business Agent's dedup ledger (§2.6).
 * Shows that identical requests/bugs aren't raised twice across iterations.
 */
export function LedgerPanel({ ledger }: { ledger: LedgerEntry[] }) {
  return (
    <Card className="p-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/[0.12] text-accent">
          <Brain size={17} />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold">Agent Memory</h3>
          <p className="text-xs text-ink-muted">
            Everything the Business Agent has raised — never repeated twice.
          </p>
        </div>
      </div>

      {ledger.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">Nothing raised yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink-faint/10">
          {ledger.map((e) => (
            <li key={e.fingerprint} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm">
                  <span className="mr-2 font-mono text-[10px] uppercase text-ink-faint">
                    {e.type}
                  </span>
                  {e.title}
                </p>
                <p className="font-mono text-[10px] text-ink-faint">
                  first seen iteration {e.first_seen_iteration}
                  {e.occurrences > 1 ? ` · seen ×${e.occurrences}` : ""}
                  {e.human_decision ? ` · ${e.human_decision}` : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 font-mono text-[11px] font-medium",
                  statusStyle[e.status] ?? "text-ink-muted"
                )}
              >
                {e.status.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
