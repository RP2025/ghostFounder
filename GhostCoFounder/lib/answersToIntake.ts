import { WizardAnswers } from "@/types";
import { Intake } from "@/types/snapshot";

/**
 * Maps the wizard's multi-select answers to the backend's single-string Intake.
 * - Field names differ: launchSpeed->timeline, technicalExperience->technical_level,
 *   businessModel->business_model.
 * - The wizard stores arrays (multi-select); the backend wants one string each,
 *   so we join with ", ".
 * - The backend rejects blank fields (422), so every field falls back to a
 *   sensible default the Market Agent can still reason about.
 */
function join(arr: string[] | undefined, fallback: string): string {
  const cleaned = (arr ?? []).filter((v) => v && v !== "Let AI decide");
  return cleaned.length ? cleaned.join(", ") : fallback;
}

export function answersToIntake(a: WizardAnswers): Intake {
  return {
    idea: a.idea?.trim() || "A new startup idea",
    motivation: join(a.motivation, "Solving a problem I care about"),
    goal: join(a.goal, "Build a startup"),
    audience: join(a.audience, "Early adopters"),
    timeline: join(a.launchSpeed, "Within 3 months"),
    technical_level: join(a.technicalExperience, "Intermediate"),
    platform: join(a.platform, "Web App"),
    business_model: join(a.businessModel, "Subscription"),
  };
}
