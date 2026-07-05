"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "gcf-theme";

/**
 * Reads/writes the active theme. The initial class is set before paint by an
 * inline script in the root layout (no FOUC); this hook keeps React in sync,
 * persists the choice, and enables a smooth color transition after mount.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial: Theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setThemeState(initial);
    setMounted(true);
    // Enable the palette-swap transition only after the first paint so the
    // initial load doesn't animate from a default palette.
    document.documentElement.classList.add("theme-anim");
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return { theme, setTheme: applyTheme, toggleTheme, mounted };
}
