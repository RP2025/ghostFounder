"use client";

import { motion } from "framer-motion";
import { CollapsibleSection } from "@/components/artifacts/CollapsibleSection";
import { SectionValue } from "@/components/artifacts/SectionValue";
import { getSectionMeta } from "@/components/artifacts/sectionMeta";
import { MarketAnalysis } from "@/types";

interface MarketAnalysisCardProps {
  analysis: MarketAnalysis;
}

const HIDDEN_KEYS = new Set(["startup_name", "tagline"]);

export function MarketAnalysisCard({ analysis }: MarketAnalysisCardProps) {
  const sectionKeys = Object.keys(analysis).filter((k) => !HIDDEN_KEYS.has(k));

  return (
    <>
      <div className="space-y-3">
        {sectionKeys.map((key, i) => {
          const meta = getSectionMeta(key);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <CollapsibleSection icon={meta.icon} title={meta.title} defaultOpen={i < 2}>
                <SectionValue value={analysis[key]} />
              </CollapsibleSection>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
