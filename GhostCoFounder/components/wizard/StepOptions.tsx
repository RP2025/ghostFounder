"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepOptionsProps {
  options: string[];
  /** Currently selected values (multi-select). */
  selected: string[];
  onToggle: (value: string) => void;
}

export function StepOptions({ options, selected, onToggle }: StepOptionsProps) {
  return (
    <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={isSelected}
            className={cn(
              "group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left transition-all duration-200",
              "glass-panel hover:-translate-y-0.5 hover:border-ghost-violet/60 hover:bg-ghost-violet/[0.08]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
              isSelected && "border-ghost-violet bg-ghost-violet/[0.14]"
            )}
          >
            <span>{option}</span>
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                isSelected
                  ? "border-transparent bg-ghost-gradient-btn text-[#08080f]"
                  : "border-ink-faint/50 text-transparent group-hover:border-ghost-violet/60"
              )}
            >
              <Check size={13} strokeWidth={3} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
