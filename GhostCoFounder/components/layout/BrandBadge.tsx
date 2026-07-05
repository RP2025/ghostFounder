import { GhostMark } from "@/components/ui/GhostMark";

export function BrandBadge() {
  return (
    <div className="inline-flex items-center gap-3 glass-panel px-4 py-1.5 rounded-full">
      <GhostMark size={18} />
      <span className="font-mono text-xs tracking-wide text-ink-muted">
        GHOSTCOFOUNDER
      </span>
    </div>
  );
}
