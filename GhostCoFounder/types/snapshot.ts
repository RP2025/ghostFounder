/**
 * TypeScript mirror of the FastAPI backend's session snapshot
 * (see backend/schemas.py). Every orchestrator endpoint returns a Snapshot,
 * so the whole dashboard renders from this one shape.
 */

// ─────────────── intake (what the wizard maps to) ───────────────
export interface Intake {
  idea: string;
  motivation: string;
  goal: string;
  audience: string;
  timeline: string;
  technical_level: string;
  platform: string;
  business_model: string;
}

// ─────────────── Market agent ───────────────
export interface Competitor {
  name: string;
  positioning: string;
  weakness: string;
}
export interface SizingFigure {
  value: string;
  unit: string;
  reasoning: string;
}
export interface MarketSizing {
  tam: SizingFigure;
  sam: SizingFigure;
  som: SizingFigure;
}
export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}
export interface MarketAnalysisData {
  competitors: Competitor[];
  market_sizing: MarketSizing;
  trend: string;
  swot: SWOT;
}
export interface Slide {
  title: string;
  bullets: string[];
  speaker_note: string;
}
export interface MvpLayout {
  core_value: string;
  primary_flow: string;
  must_have_screens: string[];
}
export interface MarketOutput {
  analysis: MarketAnalysisData;
  pitch_deck: { slides: Slide[] };
  mvp_layout: MvpLayout;
}

// ─────────────── Product agent ───────────────
export interface Component {
  name: string;
  kind: string;
  responsibility: string;
}
export interface EntityField {
  name: string;
  type: string;
  note?: string | null;
}
export interface Relationship {
  to: string;
  kind: string;
}
export interface Entity {
  name: string;
  fields: EntityField[];
  relationships: Relationship[];
}
export interface Feature {
  title: string;
  description: string;
  priority: string; // must | should | could
  screen: string;
}
export interface Screen {
  name: string;
  purpose: string;
  sections: string[];
}
export interface ChangelogEntry {
  request_id: string;
  change: string;
}
export interface ProductOutput {
  architecture: { components: Component[]; mermaid_flow: string };
  database: { entities: Entity[]; mermaid_er: string };
  features: Feature[];
  layout: { screens: Screen[] };
  changelog: ChangelogEntry[];
}

// ─────────────── Business agent ───────────────
export interface Brand {
  name: string;
  tagline: string;
  rationale: string;
}
export interface PricingTier {
  name: string;
  price: { amount: string; cadence: string };
  target_persona: string;
  features_included: string[];
  limits: string;
}
export interface GoToMarket {
  channels: string[];
  positioning: string;
  launch_motion: string;
}
export interface KeyMetric {
  name: string;
  why: string;
}
export interface WalkStep {
  step: string;
  reaction: string;
}
export interface UserReview {
  persona: string;
  walkthrough: WalkStep[];
  friction: string[];
  delight: string[];
  sentiment: string; // love | like | meh | confused | frustrated
}
export interface Validation {
  claim: string;
  verdict: string; // pass | fail | risk
  evidence: string;
}
export interface ChangeRequest {
  id: string;
  title: string;
  type: string; // feature | bug
  rationale: string;
  expected_impact: string;
  priority: string; // must | should | could
  effort: string; // s | m | l
}
export interface BusinessOutput {
  brand: Brand;
  pricing_tiers: PricingTier[];
  go_to_market: GoToMarket;
  revenue_model: string;
  key_metrics: KeyMetric[];
  user_review: UserReview;
  validations: Validation[];
  change_requests: ChangeRequest[];
  verdict: string; // ship | iterate
}

// ─────────────── Ledger ───────────────
export interface LedgerEntry {
  fingerprint: string;
  type: string;
  title: string;
  first_seen_iteration: number;
  status: string;
  resolution: string;
  human_decision: string;
  occurrences: number;
}

// ─────────────── the envelope ───────────────
export type SessionStatus = "running" | "shipped" | "max_reached";

export interface Snapshot {
  session_id: string;
  iteration: number;
  max_iterations: number;
  status: SessionStatus;
  can_continue: boolean;
  intake: Intake;
  market: MarketOutput | null;
  product: ProductOutput | null;
  business: BusinessOutput | null;
  ledger: LedgerEntry[];
}

// ─────────────── human-gate decisions (sent to /loop/step) ───────────────
export type Decision = "approve" | "edit" | "reject";
export interface HumanDecision {
  request_id: string;
  decision: Decision;
  edited_title?: string;
  note?: string;
}
