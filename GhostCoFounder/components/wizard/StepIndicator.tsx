import { GhostMark } from "@/components/ui/GhostMark";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface StepIndicatorProps {
  current: number; // 1-indexed for display
  total: number;
  progress: number;
}

export function StepIndicator({ current, total, progress }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <GhostMark size={26} />
      <ProgressBar percent={progress} className="flex-1" />
      <span className="font-mono text-xs text-ink-faint whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
}
