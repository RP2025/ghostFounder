"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PitchDeckPreview } from "@/components/artifacts/PitchDeckPreview";
import { MarketPanel } from "@/components/artifacts/MarketPanel";
import { MvpPreview } from "@/components/artifacts/MvpPreview";
import { BusinessPanel } from "@/components/artifacts/BusinessPanel";
import { LoopPanel } from "@/components/artifacts/LoopPanel";
import { LedgerPanel } from "@/components/artifacts/LedgerPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HumanDecision, Snapshot } from "@/types/snapshot";
import { PitchDeckSlide } from "@/types";
import { Presentation } from "lucide-react";

interface ResultsDashboardProps {
  snapshot: Snapshot;
  busy: boolean;
  onStep: (decisions: HumanDecision[]) => void;
  onShip: () => void;
}

type Tab = "market" | "mvp" | "business" | "loop";

const TABS: { id: Tab; label: string }[] = [
  { id: "market", label: "Market & Pitch" },
  { id: "mvp", label: "MVP" },
  { id: "business", label: "Business" },
  { id: "loop", label: "Refinement Loop" },
];

export function ResultsDashboard({ snapshot, busy, onStep, onShip }: ResultsDashboardProps) {
  const [tab, setTab] = useState<Tab>("market");
  const [deckOpen, setDeckOpen] = useState(false);

  const { market, product, business, ledger } = snapshot;

  const brandName = business?.brand?.name || deriveName(snapshot.intake.idea);
  const tagline =
    business?.brand?.tagline || market?.analysis.trend || "Your AI-generated startup.";

  // Map backend deck slides -> the existing PitchDeckPreview shape.
  const slides: PitchDeckSlide[] = useMemo(() => {
    const s = market?.pitch_deck.slides ?? [];
    return s.map((sl, i) => ({
      label: `${String(i + 1).padStart(2, "0")} · ${sl.title}`,
      title: sl.title,
      subtitle: sl.speaker_note || undefined,
      bullets: sl.bullets,
    }));
  }, [market]);

  return (
    <section className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 md:px-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeader startupName={brandName} tagline={tagline} />
        {slides.length > 0 && (
          <Button variant="outline" onClick={() => setDeckOpen(true)}>
            <Presentation size={15} />
            View Pitch Deck
          </Button>
        )}
      </div>

      {/* tab nav */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm transition-colors",
              tab === t.id
                ? "bg-ghost-gradient-btn font-medium text-[#08080f]"
                : "glass-panel text-ink-muted hover:text-ink"
            )}
          >
            {t.label}
            {t.id === "loop" && (
              <span className="ml-2 font-mono text-[10px] opacity-70">
                {snapshot.iteration}/{snapshot.max_iterations}
              </span>
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "market" && market && <MarketPanel market={market} />}
        {tab === "mvp" && product && <MvpPreview product={product} />}
        {tab === "business" && business && <BusinessPanel business={business} />}
        {tab === "loop" && business && (
          <div className="space-y-5">
            <LoopPanel
              key={snapshot.iteration}
              business={business}
              iteration={snapshot.iteration}
              maxIterations={snapshot.max_iterations}
              status={snapshot.status}
              canContinue={snapshot.can_continue}
              busy={busy}
              onStep={onStep}
              onShip={onShip}
            />
            <LedgerPanel ledger={ledger} />
          </div>
        )}
      </motion.div>

      <PitchDeckPreview
        open={deckOpen}
        onClose={() => setDeckOpen(false)}
        slides={slides}
        fileName={`${brandName.replace(/\s+/g, "_")}_Pitch_Deck.pptx`}
        downloadUrl="/mock-assets/pitch-deck-placeholder.pptx"
      />
    </section>
  );
}

function deriveName(idea: string): string {
  const words = (idea || "Nova Venture").trim().split(/\s+/).slice(0, 2);
  const camel = words.map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1).toLowerCase()).join("");
  return camel.length > 2 ? camel : "Nova";
}
