"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    primaryColor: "#1a1a2e",
    primaryTextColor: "#f5f5f7",
    primaryBorderColor: "#7C5CFC",
    lineColor: "#4C7CFC",
    tertiaryColor: "#0e0e16",
  },
});

/**
 * Renders a Mermaid diagram string (erDiagram / flowchart) from the Product
 * Agent. If the string fails to parse, we surface a graceful fallback instead
 * of a broken render (per docs/000 §5).
 */
export function Mermaid({ chart, fallback }: { chart: string; fallback?: React.ReactNode }) {
  const rawId = useId();
  const id = "m" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!chart?.trim()) {
      setFailed(true);
      return;
    }
    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (failed) {
    return (
      <div className="rounded-xl border border-dashed border-ink-faint/30 p-4 text-sm text-ink-muted">
        {fallback ?? "Diagram could not be rendered."}
      </div>
    );
  }

  return <div ref={ref} className="mermaid-container overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full" />;
}
