"use client";

import { Card } from "@/components/ui/Card";
import { BusinessOutput } from "@/types/snapshot";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Megaphone, Gauge, UserRound, ThumbsUp, ThumbsDown } from "lucide-react";

const sentimentStyle: Record<string, string> = {
  love: "border-accent/40 bg-accent/[0.12] text-accent",
  like: "border-ghost-blue/40 bg-ghost-blue/[0.12] text-ghost-blue",
  meh: "border-ink-faint/30 text-ink-muted",
  confused: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  frustrated: "border-red-500/40 bg-red-500/10 text-red-400",
};

const verdictDot: Record<string, string> = {
  pass: "bg-accent",
  risk: "bg-yellow-400",
  fail: "bg-red-400",
};

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/[0.12] text-accent">
        {icon}
      </span>
      <h3 className="font-display text-lg font-semibold">{children}</h3>
    </div>
  );
}

export function BusinessPanel({ business }: { business: BusinessOutput }) {
  const { pricing_tiers, go_to_market, revenue_model, key_metrics, user_review, validations } =
    business;

  return (
    <div className="space-y-5">
      {/* Pricing */}
      <Card className="p-6">
        <SectionTitle icon={<CircleDollarSign size={17} />}>Pricing & Revenue</SectionTitle>
        <p className="mb-4 text-sm text-ink-muted">
          Revenue model: <span className="text-ink">{revenue_model}</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {pricing_tiers.map((t, i) => (
            <div key={i} className="rounded-xl border border-ink-faint/20 p-4">
              <div className="flex items-baseline justify-between">
                <h4 className="font-medium">{t.name}</h4>
                <span className="font-display text-lg">
                  {t.price.amount === "0" || /free/i.test(t.price.amount)
                    ? "Free"
                    : `${t.price.amount}`}
                  <span className="text-xs text-ink-faint">
                    {t.price.cadence ? `/${t.price.cadence}` : ""}
                  </span>
                </span>
              </div>
              {t.target_persona && (
                <p className="mt-1 text-xs text-ink-faint">{t.target_persona}</p>
              )}
              <ul className="mt-3 space-y-1">
                {t.features_included.map((f, j) => (
                  <li key={j} className="flex gap-1.5 text-xs text-ink-muted">
                    <span className="text-accent">•</span>
                    {f}
                  </li>
                ))}
              </ul>
              {t.limits && <p className="mt-2 text-[11px] text-ink-faint">{t.limits}</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* GTM + metrics */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <SectionTitle icon={<Megaphone size={17} />}>Go To Market</SectionTitle>
          {go_to_market.positioning && (
            <p className="mb-3 text-sm">{go_to_market.positioning}</p>
          )}
          {go_to_market.launch_motion && (
            <p className="mb-3 text-xs text-ink-faint">Motion: {go_to_market.launch_motion}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {go_to_market.channels.map((c, i) => (
              <span
                key={i}
                className="rounded-full border border-ink-faint/20 px-3 py-1 text-xs text-ink-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle icon={<Gauge size={17} />}>Key Metrics</SectionTitle>
          <ul className="space-y-3">
            {key_metrics.map((m, i) => (
              <li key={i}>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-ink-muted">{m.why}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* User review — the Business Agent role-playing the user */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle icon={<UserRound size={17} />}>User Review</SectionTitle>
          {user_review.sentiment && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                sentimentStyle[user_review.sentiment] ?? sentimentStyle.meh
              )}
            >
              {user_review.sentiment}
            </span>
          )}
        </div>
        {user_review.persona && (
          <p className="mb-3 text-xs text-ink-faint">Reviewed as: {user_review.persona}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {user_review.delight.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                <ThumbsUp size={13} /> Delights
              </p>
              <ul className="space-y-1">
                {user_review.delight.map((d, i) => (
                  <li key={i} className="text-xs text-ink-muted">• {d}</li>
                ))}
              </ul>
            </div>
          )}
          {user_review.friction.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
                <ThumbsDown size={13} /> Friction
              </p>
              <ul className="space-y-1">
                {user_review.friction.map((f, i) => (
                  <li key={i} className="text-xs text-ink-muted">• {f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {validations.length > 0 && (
          <div className="mt-5 border-t border-ink-faint/15 pt-4">
            <p className="mb-2 text-xs font-medium text-ink-muted">Validations</p>
            <ul className="space-y-1.5">
              {validations.map((v, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      verdictDot[v.verdict] ?? "bg-ink-faint"
                    )}
                  />
                  <span className="text-ink-muted">
                    <span className="text-ink">{v.claim}</span>
                    {v.evidence ? ` — ${v.evidence}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
