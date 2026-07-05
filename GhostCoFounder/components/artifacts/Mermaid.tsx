"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  suppressErrorRendering: true, // never inject the "bomb" error graphic into the DOM
  themeVariables: {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    primaryColor: "#1a1a2e",
    primaryTextColor: "#f5f5f7",
    primaryBorderColor: "#7C5CFC",
    lineColor: "#4C7CFC",
    tertiaryColor: "#0e0e16",
  },
});

/** Strip common LLM artifacts (code fences, stray leading text) from a diagram. */
function clean(chart: string): string {
  let c = (chart || "").trim();
  c = c.replace(/^```(?:mermaid)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return c;
}

/**
 * Renders a Mermaid diagram (erDiagram / flowchart) from the Product Agent.
 * We validate with mermaid.parse first (suppressErrors) and only render valid
 * input, so a malformed AI diagram shows the fallback instead of a broken
 * "Syntax error" graphic (per docs/000 §5).
 */
export function Mermaid({ chart, fallback }: { chart: string; fallback?: React.ReactNode }) {
  const rawId = useId();
  const id = "m" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const text = clean(chart);
      if (!text) {
        setFailed(true);
        return;
      }
      try {
        const valid = await mermaid.parse(text, { suppressErrors: true });
        if (!valid) {
          if (!cancelled) setFailed(true);
          return;
        }
        const { svg } = await mermaid.render(id, text);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    run();
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

  return (
    <div
      ref={ref}
      className="mermaid-container overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
    />
  );
}
