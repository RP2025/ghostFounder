"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Hero } from "@/components/landing/Hero";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { ProcessingScreen } from "@/components/processing/ProcessingScreen";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { generateStartupPlan } from "@/services/generateService";
import { GenerateResponse, WizardAnswers } from "@/types";

type Screen = "landing" | "wizard" | "processing" | "dashboard";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [answers, setAnswers] = useState<WizardAnswers | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleWizardComplete = (finalAnswers: WizardAnswers) => {
    setAnswers(finalAnswers);
    setScreen("processing");
    // Fire the request now; the processing screen's own timeline is
    // frontend-timed and independent, so this resolves in the background.
    generateStartupPlan(finalAnswers).then(setResult);
  };

  const handleProcessingFinished = () => {
    // In the rare case the request is still in flight, this still works:
    // result will be set moments later and the dashboard renders once ready.
    setScreen("dashboard");
  };

  return (
    <main className="relative min-h-screen">
      <AmbientBackground />
      <ThemeToggle />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Hero onStart={() => setScreen("wizard")} />
            </motion.div>
          )}

          {screen === "wizard" && (
            <motion.div key="wizard" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <WizardContainer
                onComplete={handleWizardComplete}
                onExitToLanding={() => setScreen("landing")}
              />
            </motion.div>
          )}

          {screen === "processing" && (
            <motion.div key="processing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProcessingScreen onFinished={handleProcessingFinished} />
            </motion.div>
          )}

          {screen === "dashboard" && result && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsDashboard result={result} />
            </motion.div>
          )}

          {screen === "dashboard" && !result && (
            <motion.div
              key="dashboard-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen items-center justify-center"
            >
              <p className="font-mono text-sm text-ink-muted">Finalizing your startup plan…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
