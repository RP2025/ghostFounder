"use client";

import { Card } from "@/components/ui/Card";
import { Mermaid } from "@/components/artifacts/Mermaid";
import { ProductOutput } from "@/types/snapshot";
import { cn } from "@/lib/utils";
import { Boxes, Database, LayoutGrid, ListChecks } from "lucide-react";

const priorityStyle: Record<string, string> = {
  must: "bg-ghost-violet/15 text-ghost-violet border-ghost-violet/30",
  should: "bg-ghost-blue/15 text-ghost-blue border-ghost-blue/30",
  could: "bg-ink-faint/10 text-ink-muted border-ink-faint/30",
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

export function MvpPreview({ product }: { product: ProductOutput }) {
  const { architecture, database, features, layout } = product;

  return (
    <div className="space-y-5">
      {/* Architecture */}
      <Card className="p-6">
        <SectionTitle icon={<Boxes size={17} />}>System Architecture</SectionTitle>
        <Mermaid
          chart={architecture.mermaid_flow}
          fallback={
            <ul className="space-y-1">
              {architecture.components.map((c, i) => (
                <li key={i}>
                  <span className="text-accent">{c.name}</span> — {c.responsibility}
                </li>
              ))}
            </ul>
          }
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {architecture.components.map((c, i) => (
            <div key={i} className="rounded-lg border border-ink-faint/15 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  {c.kind}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">{c.responsibility}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Database */}
      <Card className="p-6">
        <SectionTitle icon={<Database size={17} />}>Database Schema</SectionTitle>
        <Mermaid
          chart={database.mermaid_er}
          fallback={
            <ul className="space-y-1">
              {database.entities.map((e, i) => (
                <li key={i}>
                  <span className="text-accent">{e.name}</span>: {e.fields.map((f) => f.name).join(", ")}
                </li>
              ))}
            </ul>
          }
        />
      </Card>

      {/* Features */}
      <Card className="p-6">
        <SectionTitle icon={<ListChecks size={17} />}>MVP Features</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl border border-ink-faint/15 p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-snug">{f.title}</h4>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                    priorityStyle[f.priority] ?? priorityStyle.could
                  )}
                >
                  {f.priority}
                </span>
              </div>
              <p className="text-xs text-ink-muted">{f.description}</p>
              {f.screen && (
                <p className="mt-2 font-mono text-[10px] text-ink-faint">↳ {f.screen}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Layout / screens — the rendered UI preview */}
      <Card className="p-6">
        <SectionTitle icon={<LayoutGrid size={17} />}>UI Preview</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layout.screens.map((s, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-ink-faint/20 bg-void-light/40"
            >
              {/* fake browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-ink-faint/15 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-ink-faint/40" />
                <span className="h-2 w-2 rounded-full bg-ink-faint/40" />
                <span className="h-2 w-2 rounded-full bg-ink-faint/40" />
                <span className="ml-2 truncate font-mono text-[10px] text-ink-faint">{s.name}</span>
              </div>
              <div className="space-y-2 p-3">
                <p className="text-xs text-ink-muted">{s.purpose}</p>
                {s.sections.map((sec, j) => (
                  <div
                    key={j}
                    className="rounded-md border border-ink-faint/15 bg-ink/[0.03] px-2.5 py-1.5 text-[11px]"
                  >
                    {sec}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
