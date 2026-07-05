"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GhostMark } from "@/components/ui/GhostMark";
import { BrandBadge } from "@/components/layout/BrandBadge";

interface HeroProps {
  onStart: () => void;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 0.9, 0.3, 1] },
  },
};

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Floating accent orbs */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[14%] top-[26%] h-2.5 w-2.5 rounded-full bg-ghost-cyan/70 blur-[1px] animate-float" />
        <span className="absolute right-[16%] top-[32%] h-2 w-2 rounded-full bg-ghost-violet/70 blur-[1px] animate-float-x" />
        <span className="absolute bottom-[24%] left-[24%] h-1.5 w-1.5 rounded-full bg-ghost-blue/70 animate-float" style={{ animationDelay: "1.2s" }} />
        <span className="absolute bottom-[30%] right-[22%] h-2 w-2 rounded-full bg-ghost-cyan/60 blur-[1px] animate-float-x" style={{ animationDelay: "0.6s" }} />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center gap-6"
      >
        <motion.div variants={item}>
          <BrandBadge />
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ scale: 1.06, rotate: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="animate-float"
        >
          <GhostMark size={92} />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl"
        >
          Build Your Startup in{" "}
          <span className="text-shimmer">10 Minutes</span>
        </motion.h1>

        <motion.p variants={item} className="max-w-xl text-lg text-ink-muted">
          Turn your idea into an investor-ready startup plan with your AI co-founder.
        </motion.p>

        <motion.div variants={item}>
          <Button onClick={onStart} className="group neon-ring mt-2 px-7 py-3.5 text-base">
            <Sparkles size={17} className="transition-transform group-hover:rotate-12" />
            Start Building
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.p variants={item} className="mt-4 font-mono text-xs tracking-wide text-ink-faint">
          The co-founder that never sleeps · <span className="neon-text text-accent">no credit card</span>
        </motion.p>
      </motion.div>

      {/* Soft fade at the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
