"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CollapsibleSectionProps {
  icon: LucideIcon;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  icon: Icon,
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="flex items-center gap-3 font-medium">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ghost-violet/[0.14]">
            <Icon size={16} className="text-accent" />
          </span>
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-ink-faint" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 0.9, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-ink/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
