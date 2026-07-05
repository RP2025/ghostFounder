"use client";

import { motion } from "framer-motion";
import { useProcessingSequence } from "@/hooks/useProcessingSequence";
import { OrbitingCore } from "@/components/processing/OrbitingCore";
import { AgentRow } from "@/components/processing/AgentRow";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProcessingScreenProps {
  onFinished: () => void;
}

export function ProcessingScreen({ onFinished }: ProcessingScreenProps) {
  const { agents, activeIndex, completedIndexes, overallProgress } =
    useProcessingSequence(onFinished);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-6 py-16">
      <OrbitingCore
        totalAgents={agents.length}
        activeIndex={activeIndex}
        completedIndexes={completedIndexes}
      />

      <p className="mb-10 max-w-sm text-center font-mono text-xs text-ink-muted">
        Your AI co-founding team is assembling your startup plan
      </p>

      <div className="glass-panel mb-8 w-full p-2">
        <ProgressBar percent={overallProgress} />
      </div>

      <div className="flex w-full flex-col gap-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <AgentRow
              name={agent.name}
              status={agent.status}
              icon={agent.icon}
              isActive={i === activeIndex}
              isDone={completedIndexes.includes(i)}
              isPending={i > activeIndex}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
