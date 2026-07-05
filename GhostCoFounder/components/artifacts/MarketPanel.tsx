"use client";

import { Card } from "@/components/ui/Card";
import { MarketOutput } from "@/types/snapshot";
import { TrendingUp, Target, Swords, Grid2x2 } from "lucide-react";

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

export function MarketPanel({ market }: { market: MarketOutput }) {
  const { analysis } = market;
  const { market_sizing: ms, swot } = analysis;

  const sizing = [
    { label: "TAM", fig: ms.tam },
    { label: "SAM", fig: ms.sam },
    { label: "SOM", fig: ms.som },
  ];

  const swotGroups = [
    { label: "Strengths", items: swot.strengths, color: "text-accent" },
    { label: "Weaknesses", items: swot.weaknesses, color: "text-red-400" },
    { label: "Opportunities", items: swot.opportunities, color: "text-ghost-blue" },
    { label: "Threats", items: swot.threats, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-5">
      {analysis.trend && (
        <Card className="flex items-start gap-3 p-5">
          <TrendingUp size={18} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-sm text-ink-muted">
            <span className="text-ink">Why now: </span>
            {analysis.trend}
          </p>
        </Card>
      )}

      {/* Market sizing — nested TAM/SAM/SOM */}
      <Card className="p-6">
        <SectionTitle icon={<Target size={17} />}>Market Sizing</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {sizing.map(({ label, fig }) => (
            <div key={label} className="rounded-xl border border-ink-faint/20 p-4">
              <p className="font-mono text-xs text-ink-faint">{label}</p>
              <p className="mt-1 font-display text-2xl">
                {fig.value}
                <span className="ml-1 text-sm text-ink-muted">{fig.unit}</span>
              </p>
              {fig.reasoning && (
                <p className="mt-2 text-xs text-ink-muted">{fig.reasoning}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Competitors */}
      <Card className="p-6">
        <SectionTitle icon={<Swords size={17} />}>Competitive Landscape</SectionTitle>
        <ul className="space-y-3">
          {analysis.competitors.map((c, i) => (
            <li key={i} className="rounded-xl border border-ink-faint/15 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.name}</span>
              </div>
              {c.positioning && <p className="mt-0.5 text-xs text-ink-muted">{c.positioning}</p>}
              {c.weakness && (
                <p className="mt-1 text-xs text-red-400/90">Gap: {c.weakness}</p>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {/* SWOT */}
      <Card className="p-6">
        <SectionTitle icon={<Grid2x2 size={17} />}>SWOT</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {swotGroups.map((g) => (
            <div key={g.label}>
              <p className={`mb-2 text-xs font-medium ${g.color}`}>{g.label}</p>
              <ul className="space-y-1">
                {g.items.map((it, i) => (
                  <li key={i} className="text-xs text-ink-muted">• {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
