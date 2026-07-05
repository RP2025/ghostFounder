"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GhostMark } from "@/components/ui/GhostMark";
import { BrandBadge } from "@/components/layout/BrandBadge";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 0.9, 0.3, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <BrandBadge />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <GhostMark size={88} />
        </motion.div>

        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          Build Your Startup in{" "}
          <span className="bg-ghost-gradient bg-clip-text text-transparent">
            10 Minutes
          </span>
        </h1>

        <p className="max-w-xl text-lg text-ink-muted">
          Turn your idea into an investor-ready startup plan with your AI co-founder.
        </p>

        <Button onClick={onStart} className="mt-2 px-7 py-3.5">
          Start Building <ArrowRight size={18} />
        </Button>

        <p className="mt-6 font-mono text-xs text-ink-faint">
          The co-founder that never sleeps
        </p>
      </motion.div>
    </section>
  );
}
