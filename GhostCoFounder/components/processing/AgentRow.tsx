"use client";

import { motion } from "framer-motion";
import { Brain, LineChart, Wallet, Target, Palette, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  chart: LineChart,
  wallet: Wallet,
  target: Target,
  palette: Palette,
};

interface AgentRowProps {
  name: string;
  status: string;
  icon: string;
  isActive: boolean;
  isDone: boolean;
  isPending: boolean;
}

export function AgentRow({ name, status, icon, isActive, isDone, isPending }: AgentRowProps) {
  const Icon = ICONS[icon] ?? Brain;

  return (
    <motion.div
      layout
      animate={{ opacity: isPending ? 0.35 : 1, scale: isActive ? 1.02 : 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-panel flex items-center gap-4 px-5 py-4",
        isActive && "shadow-glow"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          isDone ? "bg-emerald-400/10" : "bg-ghost-violet/[0.14]"
        )}
      >
        {isDone ? (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 16 }}
          >
            <CheckCircle2 size={20} className="text-emerald-400" />
          </motion.span>
        ) : (
          <Icon size={18} className={isActive ? "text-accent" : "text-ink-muted"} />
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="font-mono text-xs text-ink-faint">{isDone ? "Complete" : status}</p>
      </div>

      {isActive && (
        <div className="flex gap-1">
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
