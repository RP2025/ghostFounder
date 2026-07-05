"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/**
 * Floating light/dark switch. Fixed to the top-right so it's reachable from
 * every screen. Renders a stable frame during SSR/hydration and animates the
 * icon swap once mounted.
 */
export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="glass-panel fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-ink hover:border-ghost-violet/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? theme : "placeholder"}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
