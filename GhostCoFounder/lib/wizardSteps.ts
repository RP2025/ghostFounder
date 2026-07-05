import { WizardStepConfig } from "@/types";

/**
 * All Discovery Wizard steps live here. Adding a Phase 2 "AI follow-up
 * question" step later just means appending to (or dynamically building)
 * this array — no component changes required.
 */
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    key: "idea",
    title: "What is your startup idea?",
    type: "textarea",
    placeholder: "I want to build...",
  },
  {
    key: "motivation",
    title: "Why are you building this?",
    type: "options",
    hint: "Select all that apply",
    options: [
      "I face this problem",
      "Someone I know faces it",
      "Business opportunity",
      "Just exploring",
    ],
  },
  {
    key: "goal",
    title: "What's your primary goal?",
    type: "options",
    hint: "Select all that apply",
    options: ["Earn money", "Build a startup", "Raise funding", "Learn", "Social impact"],
  },
  {
    key: "audience",
    title: "Who is your target audience?",
    type: "options",
    hint: "Select all that apply",
    options: ["Students", "Developers", "Professionals", "Businesses", "Parents", "Everyone", "Other"],
  },
  {
    key: "launchSpeed",
    title: "When do you want to launch?",
    type: "options",
    hint: "Select all that apply",
    options: ["This weekend", "Within a month", "Within 3 months", "No rush"],
  },
  {
    key: "technicalExperience",
    title: "What's your technical experience?",
    type: "options",
    hint: "Select all that apply",
    options: ["Beginner", "Intermediate", "Experienced Developer", "We have a team"],
  },
  {
    key: "platform",
    title: "Preferred platform?",
    type: "options",
    hint: "Select all that apply",
    options: ["Web App", "Mobile App", "AI Chatbot", "Browser Extension", "Desktop App", "Let AI decide"],
  },
  {
    key: "businessModel",
    title: "Preferred business model?",
    type: "options",
    hint: "Select all that apply",
    options: ["Subscription", "One-time Purchase", "Freemium", "Ads", "Marketplace Commission", "Let AI decide"],
  },
];

export const PROCESSING_AGENTS = [
  { id: "strategist", name: "Startup Strategist", status: "Analyzing startup idea...", icon: "brain" as const },
  { id: "analyst", name: "Market Research Analyst", status: "Researching market opportunities...", icon: "chart" as const },
  { id: "consultant", name: "Business Consultant", status: "Designing revenue model...", icon: "wallet" as const },
  { id: "pm", name: "Product Manager", status: "Planning MVP...", icon: "target" as const },
  { id: "brand", name: "Brand Strategist", status: "Preparing investor-ready assets...", icon: "palette" as const },
];
