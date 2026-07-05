"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number; // 0 - 100
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-ink/10 overflow-hidden", className)}>
      <motion.div
        className="h-full rounded-full bg-ghost-gradient"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: [0.16, 0.9, 0.3, 1] }}
      />
    </div>
  );
}
