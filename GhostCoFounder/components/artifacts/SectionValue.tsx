import { AnalysisValue } from "@/types";

function isObjectArray(value: unknown): value is { name: string; weakness?: string }[] {
  return Array.isArray(value) && value.length > 0 && typeof value[0] === "object";
}

/**
 * Generic renderer for a single market-analysis section's value.
 * Handles whatever shape the backend sends — string, string[],
 * object[] (e.g. competitors), or a flat key/value object — so new
 * sections the backend adds later render automatically.
 */
export function SectionValue({ value }: { value: AnalysisValue }) {
  if (isObjectArray(value)) {
    return (
      <ul className="mt-1 space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 text-accent">•</span>
            <span>
              <strong className="font-medium">{item.name}</strong>
              {item.weakness ? ` — ${item.weakness}` : ""}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ul className="mt-1 space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 text-accent">•</span>
            <span>{item as string}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="mt-1 space-y-1.5">
        {Object.entries(value).map(([key, val]) => (
          <p key={key}>
            <span className="capitalize text-ink-faint">{key.replace(/_/g, " ")}: </span>
            {val}
          </p>
        ))}
      </div>
    );
  }

  return <p className="mt-1">{value}</p>;
}
