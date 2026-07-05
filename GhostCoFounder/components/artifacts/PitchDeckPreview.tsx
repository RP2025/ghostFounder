"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { GhostMark } from "@/components/ui/GhostMark";
import { PitchDeckSlide } from "@/types";
import { cn } from "@/lib/utils";

interface PitchDeckPreviewProps {
  open: boolean;
  onClose: () => void;
  slides: PitchDeckSlide[];
  fileName: string;
  downloadUrl: string;
}

/**
 * A live, in-app slide viewer for the generated pitch deck — shown before the
 * user downloads the .pptx. Fully keyboard-navigable (←/→ to move, Esc to
 * close) with animated slide transitions. The deck file itself is never
 * rendered; we present its structured slide data as premium slides.
 */
export function PitchDeckPreview({
  open,
  onClose,
  slides,
  fileName,
  downloadUrl,
}: PitchDeckPreviewProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const total = slides.length;

  const go = useCallback(
    (delta: number) => {
      setDir(delta > 0 ? 1 : -1);
      setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1));
    },
    [total]
  );

  // Reset to the first slide each time the viewer opens.
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  // Keyboard navigation + body scroll lock while open.
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  const slide = slides[index];

  return (
    <AnimatePresence>
      {open && slide && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Pitch deck preview"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-4xl flex-col gap-4"
            initial={{ scale: 0.94, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 0.9, 0.3, 1] }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GhostMark size={22} />
                <span className="font-mono text-xs text-ink-muted">
                  PITCH DECK PREVIEW · {String(index + 1).padStart(2, "0")}/
                  {String(total).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X size={16} />
              </button>
            </div>

            {/* Slide stage (16:9) */}
            <div className="glass-panel relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
              <div className="pointer-events-none absolute inset-0 bg-ghost-mesh opacity-40" />
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.35, ease: [0.16, 0.9, 0.3, 1] }}
                  className="relative flex h-full flex-col justify-center px-8 py-8 sm:px-14"
                >
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {slide.label}
                  </p>
                  <h3 className="font-display text-2xl font-semibold leading-tight sm:text-4xl">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p className="mt-3 max-w-2xl text-sm text-ink-muted sm:text-base">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {slide.bullets.map((b, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 + i * 0.06 }}
                          className="flex gap-3 text-sm text-ink/90 sm:text-base"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Edge nav arrows */}
              <NavArrow
                side="left"
                disabled={index === 0}
                onClick={() => go(-1)}
              />
              <NavArrow
                side="right"
                disabled={index === total - 1}
                onClick={() => go(1)}
              />
            </div>

            {/* Bottom bar: progress dots + download */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index
                        ? "w-6 bg-ghost-gradient"
                        : "w-1.5 bg-ink/25 hover:bg-ink/40"
                    )}
                  />
                ))}
              </div>

              <a
                href={downloadUrl}
                download={fileName}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ghost-gradient-btn px-5 py-2.5 text-sm font-medium text-[#08080f] shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                <Download size={15} /> Download .pptx
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={cn(
        "glass-panel absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink transition-all duration-200",
        "hover:border-ghost-violet/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-0",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      <Icon size={18} />
    </button>
  );
}
