"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Hero } from "@/components/landing/Hero";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { ProcessingScreen } from "@/components/processing/ProcessingScreen";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { Button } from "@/components/ui/Button";
import {
  generateStartup,
  shipStartup,
  stepLoop,
} from "@/services/orchestratorClient";
import { HumanDecision, Snapshot } from "@/types/snapshot";
import { WizardAnswers } from "@/types";

type Screen = "landing" | "wizard" | "processing" | "dashboard";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animDone, setAnimDone] = useState(false); // processing animation finished
  const [busy, setBusy] = useState(false); // a loop step / ship is in flight

  // Advance to the dashboard only once BOTH the intro animation has played
  // and the (slow) backend has returned — so we never flash an empty screen.
  useEffect(() => {
    if (screen === "processing" && animDone && (snapshot || error)) {
      setScreen("dashboard");
    }
  }, [screen, animDone, snapshot, error]);

  const handleWizardComplete = (answers: WizardAnswers) => {
    setSnapshot(null);
    setError(null);
    setAnimDone(false);
    setScreen("processing");
    generateStartup(answers)
      .then(setSnapshot)
      .catch((e: Error) => setError(e.message));
  };

  const handleStep = (decisions: HumanDecision[]) => {
    if (!snapshot) return;
    setBusy(true);
    stepLoop(snapshot.session_id, decisions)
      .then(setSnapshot)
      .catch((e: Error) => setError(e.message))
      .finally(() => setBusy(false));
  };

  const handleShip = () => {
    if (!snapshot) return;
    setBusy(true);
    shipStartup(snapshot.session_id)
      .then(setSnapshot)
      .catch((e: Error) => setError(e.message))
      .finally(() => setBusy(false));
  };

  const reset = () => {
    setSnapshot(null);
    setError(null);
    setScreen("landing");
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
              <ProcessingScreen onFinished={() => setAnimDone(true)} />
            </motion.div>
          )}

          {screen === "dashboard" && error && (
            <motion.div
              key="dashboard-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <p className="font-display text-lg">Something went wrong</p>
              <p className="max-w-md font-mono text-sm text-ink-muted">{error}</p>
              <Button variant="outline" onClick={reset}>
                Start over
              </Button>
            </motion.div>
          )}

          {screen === "dashboard" && !error && snapshot && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsDashboard
                snapshot={snapshot}
                busy={busy}
                onStep={handleStep}
                onShip={handleShip}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
