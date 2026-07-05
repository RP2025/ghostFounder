"use client";

import { motion } from "framer-motion";
import { GhostMark } from "@/components/ui/GhostMark";

interface DashboardHeaderProps {
  startupName: string;
  tagline: string;
}

export function DashboardHeader({ startupName, tagline }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-2 flex items-center gap-3">
        <GhostMark size={30} />
        <span className="font-mono text-xs text-ink-faint">RESULTS DASHBOARD</span>
      </div>
      <h1 className="font-display text-3xl font-semibold">{startupName}</h1>
      <p className="text-ink-muted">{tagline}</p>
    </motion.div>
  );
}
