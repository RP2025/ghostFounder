"use client";

import { useState } from "react";
import { Download, Eye, Rocket } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PitchDeckPreview } from "@/components/artifacts/PitchDeckPreview";
import { PitchDeckArtifact } from "@/types";

interface PitchDeckCardProps {
  artifact: PitchDeckArtifact;
}

export function PitchDeckCard({ artifact }: PitchDeckCardProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const slides = artifact.slides ?? [];
  const canPreview = slides.length > 0;

  return (
    <>
      <Card className="glow-ring flex flex-col justify-between p-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ghost-blue/[0.14]">
              <Rocket size={18} className="text-ghost-blue" />
            </span>
            <h3 className="font-semibold">Investor Pitch Deck</h3>
          </div>
          <p className="mb-5 text-sm text-ink-muted">
            Your investor-ready presentation has been generated successfully.
            {canPreview ? " Preview the slides live before you download." : ""}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {canPreview && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="glass-panel inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ghost-violet/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Eye size={16} /> Preview
            </button>
          )}

          <a
            href={artifact.downloadUrl}
            download={artifact.fileName}
            onClick={() => setDownloaded(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ghost-gradient-btn px-5 py-3 text-sm font-medium text-[#08080f] shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-lg active:translate-y-0 active:scale-[0.98]"
          >
            <Download size={16} /> {downloaded ? "Downloaded ✓" : "Download"}
          </a>
        </div>
      </Card>

      <PitchDeckPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        slides={slides}
        fileName={artifact.fileName}
        downloadUrl={artifact.downloadUrl}
      />
    </>
  );
}
