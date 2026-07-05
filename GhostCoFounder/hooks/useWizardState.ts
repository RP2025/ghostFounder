"use client";

import { useCallback, useMemo, useState } from "react";
import { EMPTY_ANSWERS, MultiAnswerKey, WizardAnswers } from "@/types";
import { WIZARD_STEPS } from "@/lib/wizardSteps";

export type WizardDirection = "forward" | "backward";

export function useWizardState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(EMPTY_ANSWERS);
  const [direction, setDirection] = useState<WizardDirection>("forward");

  const step = WIZARD_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;
  const progress = useMemo(
    () => (stepIndex / (WIZARD_STEPS.length - 1)) * 100,
    [stepIndex]
  );

  const canContinue = useMemo(() => {
    const value = answers[step.key];
    if (step.type === "textarea") return (value as string).trim().length > 3;
    return Array.isArray(value) && value.length > 0;
  }, [answers, step]);

  /** Textarea (single free-text) step. */
  const setText = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, idea: value }));
    },
    []
  );

  /** Options step — toggle a value in/out of the multi-select array. */
  const toggleOption = useCallback(
    (value: string) => {
      const key = step.key as MultiAnswerKey;
      setAnswers((prev) => {
        const current = prev[key];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: next };
      });
    },
    [step.key]
  );

  const goNext = useCallback(() => {
    if (!canContinue) return false;
    if (isLastStep) return true; // signal caller to trigger generation
    setDirection("forward");
    setStepIndex((i) => Math.min(i + 1, WIZARD_STEPS.length - 1));
    return false;
  }, [canContinue, isLastStep]);

  const goPrev = useCallback(() => {
    setDirection("backward");
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  return {
    step,
    stepIndex,
    totalSteps: WIZARD_STEPS.length,
    isFirstStep,
    isLastStep,
    progress,
    answers,
    canContinue,
    direction,
    setText,
    toggleOption,
    goNext,
    goPrev,
  };
}
