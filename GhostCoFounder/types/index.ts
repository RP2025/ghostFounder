/**
 * Core domain types for GhostCoFounder.
 * Keep this file as the single source of truth for shapes shared
 * between the wizard, the mock/real API, and the results dashboard.
 */

/**
 * The single free-text field is a string; every option-based question
 * accepts multiple selections, so those answers are string arrays.
 */
export interface WizardAnswers {
  idea: string;
  motivation: string[];
  goal: string[];
  audience: string[];
  launchSpeed: string[];
  technicalExperience: string[];
  platform: string[];
  businessModel: string[];
}

/** Keys whose answer is a multi-select array (everything except `idea`). */
export type MultiAnswerKey = Exclude<keyof WizardAnswers, "idea">;

export const EMPTY_ANSWERS: WizardAnswers = {
  idea: "",
  motivation: [],
  goal: [],
  audience: [],
  launchSpeed: [],
  technicalExperience: [],
  platform: [],
  businessModel: [],
};

export type WizardStepType = "textarea" | "options";

export interface WizardStepConfig {
  key: keyof WizardAnswers;
  title: string;
  type: WizardStepType;
  placeholder?: string;
  options?: string[];
  /** Hint shown under multi-select questions. */
  hint?: string;
}

/** A single value in the market analysis can be a string, a list, or a
 * structured object — the dashboard renders whichever shape it finds. */
export type AnalysisValue =
  | string
  | string[]
  | Record<string, string>
  | { name: string; weakness?: string }[];

export interface MarketAnalysis {
  startup_name: string;
  tagline: string;
  market_opportunity: Record<string, string>;
  competitors: { name: string; weakness?: string }[];
  target_customers: string[];
  revenue_model: string;
  mvp_features: string[];
  risks: string[];
  recommendations: string[];
  // Allow the backend to add future sections without breaking rendering.
  [key: string]: AnalysisValue;
}

/** One rendered slide used by the in-app live preview (before download). */
export interface PitchDeckSlide {
  label: string; // e.g. "01 · Title"
  title: string;
  subtitle?: string;
  bullets?: string[];
}

export interface PitchDeckArtifact {
  fileName: string;
  downloadUrl: string;
  /**
   * Optional slide data for the live preview. When present, the frontend
   * renders a navigable slide viewer; the actual .pptx is still what's
   * downloaded. A real backend can populate this alongside the file.
   */
  slides?: PitchDeckSlide[];
}

export interface GenerateResponse {
  pitchDeck: PitchDeckArtifact;
  marketAnalysis: MarketAnalysis;
}

/** One step in the AI Processing screen. */
export interface ProcessingAgent {
  id: string;
  name: string;
  status: string;
  icon: "brain" | "chart" | "wallet" | "target" | "palette";
}
