"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  // The before-pseudo is an animated light sweep that crosses on hover.
  primary:
    "bg-ghost-gradient-btn text-[#08080f] font-medium shadow-glow hover:shadow-glow-lg " +
    "before:absolute before:inset-0 before:-translate-x-[150%] before:bg-gradient-to-r " +
    "before:from-transparent before:via-white/50 before:to-transparent before:transition-transform " +
    "before:duration-700 before:ease-out hover:before:translate-x-[150%] before:content-['']",
  ghost: "text-ink-muted hover:text-ink bg-transparent",
  outline: "glass-panel text-ink hover:border-ghost-violet/60",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm transition-all duration-200",
          "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
          "disabled:opacity-30 disabled:pointer-events-none",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
