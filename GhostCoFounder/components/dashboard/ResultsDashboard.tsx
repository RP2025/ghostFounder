"use client";

import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PitchDeckCard } from "@/components/artifacts/PitchDeckCard";
import { MarketAnalysisCard } from "@/components/artifacts/MarketAnalysisCard";
import { Card } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";
import { GenerateResponse } from "@/types";

interface ResultsDashboardProps {
  result: GenerateResponse;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { pitchDeck, marketAnalysis } = result;

  return (
    <section className="mx-auto min-h-screen w-full max-w-4xl px-6 py-14 md:px-10">
      <DashboardHeader startupName={marketAnalysis.startup_name} tagline={marketAnalysis.tagline} />

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <PitchDeckCard artifact={pitchDeck} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex h-full flex-col justify-center p-6">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ghost-violet/[0.14]">
                <Sparkles size={18} className="text-ghost-violet" />
              </span>
              <h3 className="font-semibold">Quick Market Analysis</h3>
            </div>
            <p className="text-sm text-ink-muted">
              A section-by-section breakdown of your opportunity, generated from your answers — see below.
            </p>
          </Card>
        </motion.div>
      </div>

      <MarketAnalysisCard analysis={marketAnalysis} />
    </section>
  );
}
