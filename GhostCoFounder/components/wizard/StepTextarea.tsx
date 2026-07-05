"use client";

import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface StepTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function StepTextarea({ className, ...props }: StepTextareaProps) {
  return (
    <textarea
      autoFocus
      rows={5}
      className={cn(
        "glass-panel w-full max-w-xl resize-none p-5 text-ink placeholder-ink-faint outline-none",
        "focus:border-ghost-violet/70 transition-colors",
        className
      )}
      {...props}
    />
  );
}
