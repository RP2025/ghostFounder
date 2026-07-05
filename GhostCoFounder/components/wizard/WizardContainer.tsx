"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWizardState } from "@/hooks/useWizardState";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { StepTextarea } from "@/components/wizard/StepTextarea";
import { StepOptions } from "@/components/wizard/StepOptions";
import { WizardNav } from "@/components/wizard/WizardNav";
import { WizardAnswers } from "@/types";

interface WizardContainerProps {
  onComplete: (answers: WizardAnswers) => void;
  onExitToLanding: () => void;
}

const slideVariants = {
  enter: (dir: "forward" | "backward") => ({
    opacity: 0,
    x: dir === "forward" ? 28 : -28,
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: "forward" | "backward") => ({
    opacity: 0,
    x: dir === "forward" ? -28 : 28,
  }),
};

export function WizardContainer({ onComplete, onExitToLanding }: WizardContainerProps) {
  const {
    step,
    stepIndex,
    totalSteps,
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
  } = useWizardState();

  const handleNext = () => {
    const shouldComplete = goNext();
    if (shouldComplete) onComplete(answers);
  };

  const handlePrev = () => {
    if (isFirstStep) {
      onExitToLanding();
      return;
    }
    goPrev();
  };

  // Keyboard accessibility: on multi-select option steps, Enter advances once
  // at least one option is chosen (options are toggled via click/Space).
  // Cmd/Ctrl+Enter continues from the textarea step.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      if (step.type === "options" && canContinue) {
        e.preventDefault();
        handleNext();
      }
      if (step.type === "textarea" && (e.metaKey || e.ctrlKey)) handleNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, canContinue]);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-14 md:px-10">
      <StepIndicator current={stepIndex + 1} total={totalSteps} progress={progress} />

      <div className="mt-10 min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 0.9, 0.3, 1] }}
          >
            <p className="mb-3 font-mono text-xs text-accent">
              STEP {String(stepIndex + 1).padStart(2, "0")}
            </p>
            <h2 className="font-display mb-2 max-w-xl text-2xl font-semibold md:text-3xl">
              {step.title}
            </h2>
            {step.type === "options" && (
              <p className="mb-6 text-sm text-ink-muted">
                {step.hint ?? "Select all that apply"}
              </p>
            )}
            {step.type === "textarea" && <div className="mb-6" />}

            {step.type === "textarea" ? (
              <StepTextarea
                value={answers.idea}
                placeholder={step.placeholder}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <StepOptions
                options={step.options ?? []}
                selected={answers[step.key] as string[]}
                onToggle={toggleOption}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <WizardNav
        onPrev={handlePrev}
        onNext={handleNext}
        canContinue={canContinue}
        isLastStep={isLastStep}
      />
    </section>
  );
}
