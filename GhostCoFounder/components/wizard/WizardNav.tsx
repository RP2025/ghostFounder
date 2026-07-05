import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WizardNavProps {
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  isLastStep: boolean;
}

export function WizardNav({ onPrev, onNext, canContinue, isLastStep }: WizardNavProps) {
  return (
    <div className="mt-10 flex max-w-xl items-center justify-between">
      <Button variant="ghost" onClick={onPrev} className="px-4 py-2.5">
        <ArrowLeft size={16} /> Back
      </Button>
      <Button onClick={onNext} disabled={!canContinue} className="px-6 py-2.5">
        {isLastStep ? "Generate" : "Continue"} <ArrowRight size={16} />
      </Button>
    </div>
  );
}
