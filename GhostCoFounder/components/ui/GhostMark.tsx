import { cn } from "@/lib/utils";

interface GhostMarkProps {
  size?: number;
  className?: string;
}

/**
 * The "Ghost Core" — GhostCoFounder's signature visual element.
 * A conic-gradient orb that spins slowly and breathes (pulsing glow),
 * meant to feel alive and perpetually working — the co-founder that
 * never sleeps. Reused across the logo, hero, and processing screen
 * (where orbiting dots represent the agent team working around it).
 */
export function GhostMark({ size = 32, className }: GhostMarkProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative shrink-0 rounded-full animate-spin-slow animate-breathe",
        "bg-[conic-gradient(from_180deg,#7C5CFC,#4C7CFC,#4CE0F8,#7C5CFC)]",
        "after:content-[''] after:absolute after:inset-[14%] after:rounded-full after:bg-void",
        className
      )}
    />
  );
}
