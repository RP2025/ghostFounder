import {
  GenerateResponse,
  MarketAnalysis,
  PitchDeckSlide,
  WizardAnswers,
} from "@/types";

function deriveName(idea: string): string {
  const words = (idea || "Nova Venture").trim().split(/\s+/).slice(0, 3);
  const camel = words.map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join("");
  return camel.length > 2 ? camel : "Nova";
}

/** First selected value, or a fallback when nothing was picked. */
function primary(arr: string[], fallback: string): string {
  return arr && arr.length ? arr[0] : fallback;
}

/** Human-readable join of a multi-select answer, or a fallback. */
function listText(arr: string[], fallback: string): string {
  return arr && arr.length ? arr.join(", ") : fallback;
}

/**
 * Builds a fully dynamic MarketAnalysis object + pitch-deck slide data from
 * the wizard answers. Nothing about the *shape* is hardcoded in the dashboard
 * — this function is the only place that decides what sections/keys exist, so
 * a real backend can return more (or fewer) sections and the UI adapts.
 */
export function mockGenerateResponse(answers: WizardAnswers): GenerateResponse {
  const startupName = deriveName(answers.idea);
  const audiences = answers.audience.length ? answers.audience : ["your target users"];
  const audienceText = listText(answers.audience, "your target users");
  const launchText = listText(answers.launchSpeed, "soon").toLowerCase();
  const techText = listText(answers.technicalExperience, "solo").toLowerCase();
  const motivationText = listText(answers.motivation, "a real, felt problem").toLowerCase();

  const chosenModels = answers.businessModel.filter((m) => m !== "Let AI decide");
  const revenueModel = chosenModels.length
    ? chosenModels.join(" + ")
    : "Freemium with a Pro subscription tier";

  const marketAnalysis: MarketAnalysis = {
    startup_name: startupName,
    tagline: `Making it real for ${audienceText.toLowerCase()}.`,
    market_opportunity: {
      summary: `A growing wedge exists among ${audienceText.toLowerCase()} who are underserved by generic tools, especially for teams choosing to launch ${launchText}.`,
      market_size: "$2.4B addressable, growing ~18% YoY",
      trend: "Rising demand for AI-native, self-serve tools",
    },
    competitors: [
      { name: "IncumbentCo", weakness: "Slow, enterprise-only onboarding" },
      { name: "GenericSaaS", weakness: "Generic, not tailored to this audience" },
      { name: "LegacyTool", weakness: "Dated UX, no AI assistance" },
    ],
    target_customers: [
      ...audiences,
      "Indie founders validating fast",
      "Small teams with limited runway",
    ],
    revenue_model: revenueModel,
    mvp_features: [
      "Guided onboarding & idea capture",
      "AI-generated core workflow",
      "Shareable output / export",
      "Usage dashboard",
    ],
    risks: [
      "Crowded category — differentiation must be sharp",
      "Customer acquisition cost may be high pre-launch",
      `Technical scope creep for a ${techText} team`,
    ],
    recommendations: [
      "Ship a narrow MVP focused on one core workflow",
      "Validate with 10 target users before building further",
      `Launch timeline: aim for ${launchText}`,
    ],
  };

  const slides = buildSlides(answers, marketAnalysis, motivationText);

  return {
    pitchDeck: {
      fileName: `${startupName.replace(/\s+/g, "_")}_Pitch_Deck.pptx`,
      // Placeholder download target for the mock flow.
      downloadUrl: "/mock-assets/pitch-deck-placeholder.pptx",
      slides,
    },
    marketAnalysis,
  };
}

/** Composes the investor-deck slides shown in the live preview. */
function buildSlides(
  answers: WizardAnswers,
  a: MarketAnalysis,
  motivationText: string
): PitchDeckSlide[] {
  const idea = answers.idea.trim() || "A new venture in the making.";
  const opp = a.market_opportunity;

  return [
    {
      label: "01 · Cover",
      title: a.startup_name,
      subtitle: a.tagline,
    },
    {
      label: "02 · Problem",
      title: "The Problem",
      subtitle: `Why we're building this: ${motivationText}.`,
      bullets: [
        `${a.target_customers[0]} are underserved by today's generic tools.`,
        "Existing solutions are slow, dated, or not AI-native.",
        "The gap widens as expectations for instant, tailored experiences rise.",
      ],
    },
    {
      label: "03 · Solution",
      title: "Our Solution",
      subtitle: idea.length > 160 ? idea.slice(0, 157) + "…" : idea,
      bullets: a.mvp_features.slice(0, 3),
    },
    {
      label: "04 · Market",
      title: "Market Opportunity",
      bullets: [opp.summary, opp.market_size, opp.trend].filter(Boolean),
    },
    {
      label: "05 · Competition",
      title: "Competitive Landscape",
      bullets: a.competitors.map((c) => `${c.name} — ${c.weakness ?? "limited focus"}`),
    },
    {
      label: "06 · Customers",
      title: "Who We Serve",
      bullets: a.target_customers,
    },
    {
      label: "07 · Business Model",
      title: "How We Make Money",
      subtitle: a.revenue_model,
      bullets: ["Low-friction entry", "Expansion revenue as usage grows"],
    },
    {
      label: "08 · Product",
      title: "MVP & Roadmap",
      bullets: a.mvp_features,
    },
    {
      label: "09 · The Ask",
      title: "Next Steps",
      bullets: a.recommendations,
    },
  ];
}
