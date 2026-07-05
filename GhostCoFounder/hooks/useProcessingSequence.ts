"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESSING_AGENTS } from "@/lib/wizardSteps";

const STEP_DURATION_MS = 1250;
const FINAL_DELAY_MS = 700;

/**
 * Drives the fully frontend-timed "AI team collaborating" sequence.
 * Every STEP_DURATION_MS, the next agent activates; when the last agent
 * completes, `isDone` flips true after a short beat so the checkmark
 * animation is visible before navigating away.
 */
export function useProcessingSequence(onFinished: () => void) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (activeIndex >= PROCESSING_AGENTS.length) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        const timeout = setTimeout(onFinished, FINAL_DELAY_MS);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const timeout = setTimeout(() => {
      setCompletedIndexes((prev) => [...prev, activeIndex]);
      setActiveIndex((i) => i + 1);
    }, STEP_DURATION_MS);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const overallProgress = (completedIndexes.length / PROCESSING_AGENTS.length) * 100;

  return { agents: PROCESSING_AGENTS, activeIndex, completedIndexes, overallProgress };
}
