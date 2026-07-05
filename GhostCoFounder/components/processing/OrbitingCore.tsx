"use client";

import { motion } from "framer-motion";
import { GhostMark } from "@/components/ui/GhostMark";

interface OrbitingCoreProps {
  totalAgents: number;
  activeIndex: number;
  completedIndexes: number[];
}

/** Visualizes the agent team literally orbiting the Ghost Core while they work. */
export function OrbitingCore({ totalAgents, activeIndex, completedIndexes }: OrbitingCoreProps) {
  const radius = 66;
  const center = 70;

  return (
    <div className="relative mb-4 flex h-[140px] w-[140px] items-center justify-center">
      <GhostMark size={84} />
      {Array.from({ length: totalAgents }).map((_, i) => {
        const angle = (i / totalAgents) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - 4.5;
        const y = center + radius * Math.sin(angle) - 4.5;
        const isDone = completedIndexes.includes(i);
        const isActive = activeIndex === i;
        const lit = isDone || isActive;

        return (
          <motion.div
            key={i}
            className="absolute h-[9px] w-[9px] rounded-full"
            style={{
              left: x,
              top: y,
              background: isDone ? "#4ADE80" : "#4CE0F8",
              boxShadow: isDone
                ? "0 0 10px 2px rgba(74,222,128,0.7)"
                : "0 0 10px 2px rgba(76,224,248,0.7)",
            }}
            animate={{ opacity: lit ? 1 : 0.15 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}
