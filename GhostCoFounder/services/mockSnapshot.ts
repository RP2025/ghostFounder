import { WizardAnswers } from "@/types";
import { answersToIntake } from "@/lib/answersToIntake";
import {
  BusinessOutput,
  ChangeRequest,
  HumanDecision,
  LedgerEntry,
  MarketOutput,
  ProductOutput,
  Snapshot,
} from "@/types/snapshot";

/**
 * Client-side mock of the FastAPI orchestrator. Returns a full, coherent
 * Snapshot instantly and keeps stateful sessions in memory so the refinement
 * loop, dedup ledger, and verdict->ship progression all work like the real
 * backend — just without Claude latency. Toggle via lib/config USE_MOCK.
 */

const MAX_ITER = 3;
let counter = 0;
const store = new Map<string, { snapshot: Snapshot; answers: WizardAnswers }>();

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function deriveName(idea: string): string {
  const words = (idea || "Nova").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const camel = words.map((w) => titleCase(w.toLowerCase())).join("");
  return camel.length > 2 ? camel : "NovaLabs";
}

function mockMarket(answers: WizardAnswers, name: string): MarketOutput {
  const audience = answers.audience?.[0] ?? "early adopters";
  const idea = answers.idea?.trim() || "a new product";
  return {
    analysis: {
      competitors: [
        { name: "IncumbentCo", positioning: "Enterprise-first legacy leader", weakness: "Slow, expensive onboarding" },
        { name: "GenericSaaS", positioning: "Horizontal all-in-one tool", weakness: `Not tailored to ${audience}` },
        { name: "OpenSourceAlt", positioning: "Free DIY toolkit", weakness: "No support, steep setup" },
      ],
      market_sizing: {
        tam: { value: "12", unit: "B USD", reasoning: "All software buyers in the broad category, top-down." },
        sam: { value: "1.4", unit: "B USD", reasoning: `Segment reachable via ${answers.platform?.[0] ?? "web"} channels.` },
        som: { value: "18", unit: "M USD", reasoning: "1–3 yr obtainable slice: ~15k users × ~$100/yr." },
      },
      trend: `Rising demand for AI-native, self-serve tools among ${audience} makes now the right time.`,
      swot: {
        strengths: ["Focused wedge", "AI-native from day one"],
        weaknesses: ["Unknown brand", "Small team"],
        opportunities: ["Underserved niche", "Incumbents slow to adapt"],
        threats: ["Crowded category", "Fast-following competitors"],
      },
    },
    pitch_deck: {
      slides: [
        { title: "Problem", bullets: [`${titleCase(audience)} are underserved by generic tools.`, "Existing options are slow and dated."], speaker_note: "Open with the pain." },
        { title: "Solution", bullets: [idea, "AI does the heavy lifting."], speaker_note: "Show the aha moment." },
        { title: "Market", bullets: ["$12B TAM", "$1.4B SAM", "Growing ~18% YoY"], speaker_note: "Big and growing." },
        { title: "Product", bullets: ["Guided onboarding", "AI core workflow", "Shareable output"], speaker_note: "Demo here." },
        { title: "Business Model", bullets: ["Freemium → Pro subscription"], speaker_note: "Land and expand." },
        { title: "Competition", bullets: ["IncumbentCo — slow", "GenericSaaS — not tailored"], speaker_note: "Our wedge." },
        { title: "Traction / Plan", bullets: ["MVP in 1 month", "10 design partners"], speaker_note: "Momentum." },
        { title: "The Ask", bullets: [answers.goal?.includes("Raise funding") ? "Raising a pre-seed round" : "Seeking design partners"], speaker_note: "Clear ask." },
      ],
    },
    mvp_layout: {
      core_value: `Help ${audience} get value from ${idea} in minutes.`,
      primary_flow: `${titleCase(audience)} signs up → completes guided onboarding → gets an AI-generated result → shares it.`,
      must_have_screens: ["Sign up / Login", "Onboarding", "Result", "Dashboard"],
    },
  };
}

function mockProduct(answers: WizardAnswers): ProductOutput {
  return {
    architecture: {
      components: [
        { name: "Web App", kind: "frontend", responsibility: "User-facing UI" },
        { name: "API", kind: "backend", responsibility: "Business logic & orchestration" },
        { name: "Auth", kind: "auth", responsibility: "Login & sessions" },
        { name: "Database", kind: "datastore", responsibility: "Persistent storage" },
        { name: "AI Service", kind: "external", responsibility: "LLM inference" },
      ],
      mermaid_flow:
        "flowchart LR\n  UI[Web App] --> API[API]\n  API --> AUTH[Auth]\n  API --> DB[(Database)]\n  API --> AI[AI Service]",
    },
    database: {
      entities: [
        { name: "USER", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "string" }, { name: "created_at", type: "datetime" }], relationships: [{ to: "PROJECT", kind: "one-to-many" }] },
        { name: "PROJECT", fields: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "title", type: "string" }], relationships: [{ to: "RESULT", kind: "one-to-many" }] },
        { name: "RESULT", fields: [{ name: "id", type: "uuid" }, { name: "project_id", type: "uuid" }, { name: "payload", type: "json" }], relationships: [] },
      ],
      mermaid_er:
        'erDiagram\n  USER {\n    uuid id\n    string email\n    datetime created_at\n  }\n  PROJECT {\n    uuid id\n    uuid user_id\n    string title\n  }\n  RESULT {\n    uuid id\n    uuid project_id\n    json payload\n  }\n  USER ||--o{ PROJECT : "owns"\n  PROJECT ||--o{ RESULT : "produces"',
    },
    features: [
      { title: "Email signup & login", description: "Create an account and sign in.", priority: "must", screen: "Sign up / Login" },
      { title: "Guided onboarding", description: "Capture the user's goal in a few steps.", priority: "must", screen: "Onboarding" },
      { title: "AI-generated result", description: "Produce the core output from the input.", priority: "must", screen: "Result" },
      { title: "Shareable export", description: "Download or share the result.", priority: "should", screen: "Result" },
      { title: "Project dashboard", description: "See past projects and results.", priority: "should", screen: "Dashboard" },
    ],
    layout: {
      screens: [
        { name: "Sign up / Login", purpose: "Account access", sections: ["Logo", "Email field", "Continue button"] },
        { name: "Onboarding", purpose: "Capture intent", sections: ["Step indicator", "Question", "Options", "Next"] },
        { name: "Result", purpose: "Show AI output", sections: ["Generated result", "Export button", "Regenerate"] },
        { name: "Dashboard", purpose: "History", sections: ["Project list", "New project button", "Usage meter"] },
      ],
    },
    changelog: [],
  };
}

function baseBusiness(answers: WizardAnswers, name: string): BusinessOutput {
  const audience = answers.audience?.[0] ?? "early adopters";
  return {
    brand: {
      name,
      tagline: `The AI co-founder for ${audience}.`,
      rationale: "Short, memorable, and speaks to the outcome.",
    },
    pricing_tiers: [
      { name: "Free", price: { amount: "0", cadence: "monthly" }, target_persona: audience, features_included: ["3 projects", "Basic AI"], limits: "3 projects / month" },
      { name: "Pro", price: { amount: "12", cadence: "monthly" }, target_persona: "Power users", features_included: ["Unlimited projects", "Advanced AI", "Export"], limits: "Fair-use" },
      { name: "Team", price: { amount: "39", cadence: "monthly" }, target_persona: "Small teams", features_included: ["Everything in Pro", "Shared workspace", "Priority support"], limits: "Up to 10 seats" },
    ],
    go_to_market: {
      channels: ["Product Hunt launch", "Content / SEO", `Communities where ${audience} gather`],
      positioning: `The fastest way for ${audience} to go from idea to result.`,
      launch_motion: "Product-led growth",
    },
    revenue_model: "freemium",
    key_metrics: [
      { name: "Activation rate", why: "Signals the onboarding actually delivers value." },
      { name: "Free→Pro conversion", why: "Core driver of freemium revenue." },
    ],
    user_review: {
      persona: audience,
      walkthrough: [
        { step: "Sign up", reaction: "Fast and clear." },
        { step: "Onboarding", reaction: "Wanted fewer steps." },
        { step: "See result", reaction: "Impressive, but unsure what to do next." },
      ],
      friction: ["No clear next step after seeing the result", "Onboarding felt slightly long"],
      delight: ["The AI result felt genuinely useful", "Clean, fast UI"],
      sentiment: "like",
    },
    validations: [
      { claim: "Onboarding matches audience expectations", verdict: "risk", evidence: "Slightly long for casual users." },
      { claim: "Core value is clear on first result", verdict: "pass", evidence: "Users understood the output." },
    ],
    change_requests: [
      { id: "cr-1", title: "Add a clear next-step CTA after the result", type: "feature", rationale: "Users don't know what to do after seeing output.", expected_impact: "Higher activation & retention", priority: "must", effort: "s" },
      { id: "cr-2", title: "Shorten onboarding to 2 steps", type: "feature", rationale: "Onboarding felt long.", expected_impact: "Fewer drop-offs", priority: "should", effort: "m" },
      { id: "cr-3", title: "Fix: export button does nothing on empty result", type: "bug", rationale: "Export fails when there is no result yet.", expected_impact: "Avoids confusing error", priority: "should", effort: "s" },
    ],
    verdict: "iterate",
  };
}

function ledgerFrom(crs: ChangeRequest[], iteration: number): LedgerEntry[] {
  return crs.map((c) => ({
    fingerprint: c.id + "-" + c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24),
    type: c.type,
    title: c.title,
    first_seen_iteration: iteration,
    status: "open",
    resolution: "",
    human_decision: "",
    occurrences: 1,
  }));
}

export function mockGenerate(answers: WizardAnswers): Snapshot {
  counter += 1;
  const id = `mock_${counter}`;
  const name = deriveName(answers.idea);
  const business = baseBusiness(answers, name);
  const snapshot: Snapshot = {
    session_id: id,
    iteration: 1,
    max_iterations: MAX_ITER,
    status: "running",
    can_continue: true,
    intake: answersToIntake(answers),
    market: mockMarket(answers, name),
    product: mockProduct(answers),
    business,
    ledger: ledgerFrom(business.change_requests, 1),
  };
  store.set(id, { snapshot, answers });
  return structuredClone(snapshot);
}

// Second-round change requests (genuinely new — never repeats round 1).
const ROUND2_CRS: ChangeRequest[] = [
  { id: "cr-4", title: "Add onboarding progress save", type: "feature", rationale: "Users abandon mid-onboarding and lose progress.", expected_impact: "Recover drop-offs", priority: "should", effort: "m" },
];

export function mockStep(sessionId: string, decisions: HumanDecision[]): Snapshot {
  const entry = store.get(sessionId);
  if (!entry) throw new Error("Unknown session");
  const snap = entry.snapshot;
  const biz = snap.business!;
  const prod = snap.product!;

  const approved = decisions.filter((d) => d.decision === "approve");
  const rejected = decisions.filter((d) => d.decision === "reject");

  // Apply approved CRs to the product + changelog; update ledger statuses.
  approved.forEach((d) => {
    const cr = biz.change_requests.find((c) => c.id === d.request_id);
    if (!cr) return;
    prod.features.push({
      title: cr.title.replace(/^Fix:\s*/i, ""),
      description: cr.rationale,
      priority: cr.priority,
      screen: "Result",
    });
    prod.changelog.push({ request_id: cr.id, change: `Applied: ${cr.title}` });
    const le = snap.ledger.find((l) => l.title === cr.title);
    if (le) le.status = "applied";
  });
  rejected.forEach((d) => {
    const cr = biz.change_requests.find((c) => c.id === d.request_id);
    const le = cr && snap.ledger.find((l) => l.title === cr.title);
    if (le) {
      le.status = "rejected";
      le.human_decision = "reject";
    }
  });

  snap.iteration += 1;

  // Round 2 introduces ONE genuinely-new request (dedup: never repeats round 1).
  // Round 3 (or the cap) => ship.
  if (snap.iteration >= MAX_ITER) {
    biz.change_requests = [];
    biz.verdict = "ship";
    biz.user_review.sentiment = "love";
    biz.user_review.friction = [];
    biz.user_review.delight = ["Clear next steps now", "Onboarding is quick", "Feels polished"];
    snap.status = "shipped";
    snap.can_continue = false;
  } else {
    biz.change_requests = structuredClone(ROUND2_CRS);
    biz.verdict = "iterate";
    biz.user_review.sentiment = "like";
    biz.user_review.friction = ["Some users lose onboarding progress"];
    biz.user_review.delight = ["Next-step CTA helps a lot", "Cleaner flow"];
    snap.ledger.push(...ledgerFrom(ROUND2_CRS, snap.iteration));
    snap.status = "running";
    snap.can_continue = snap.iteration < MAX_ITER;
  }

  return structuredClone(snap);
}

export function mockShip(sessionId: string): Snapshot {
  const entry = store.get(sessionId);
  if (!entry) throw new Error("Unknown session");
  entry.snapshot.status = "shipped";
  entry.snapshot.can_continue = false;
  return structuredClone(entry.snapshot);
}
