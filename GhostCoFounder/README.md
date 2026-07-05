# GhostCoFounder

**The co-founder that never sleeps.**

Turn your idea into an investor-ready startup plan with your AI co-founder — in about 10 minutes.

## Phase 1 (this build)

```
Landing Page → Startup Discovery Wizard → AI Processing Screen → Results Dashboard
```

- **Landing** — hero, tagline, "Start Building" CTA.
- **Wizard** — 8-step Typeform-style onboarding (one question per screen, animated, keyboard accessible, mobile responsive).
- **Processing** — frontend-timed sequence of 5 AI agents "collaborating," orbiting a signature animated core.
- **Dashboard** — investor pitch deck download card + a fully dynamic, section-by-section market analysis (nothing hardcoded — new backend fields render automatically).

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · lucide-react

## Architecture

```
app/                    routes, layout, /api/generate
components/
  ui/                   Button, Card, ProgressBar, GhostMark (logo)
  layout/                AmbientBackground, BrandBadge
  landing/               Hero
  wizard/                WizardContainer, StepIndicator, StepTextarea, StepOptions, WizardNav
  processing/            ProcessingScreen, OrbitingCore, AgentRow
  dashboard/             ResultsDashboard, DashboardHeader
  artifacts/             PitchDeckCard, MarketAnalysisCard, CollapsibleSection, SectionValue, sectionMeta
hooks/                  useWizardState, useProcessingSequence
services/               generateService (calls API, falls back to mock), mockGenerator
lib/                    wizardSteps.ts (question config), utils.ts
types/                  shared TypeScript contracts
```

The `/api/generate` route currently returns a deterministic mock response derived
from the user's answers, so the whole product loop works without a real AI backend.
Swap the body of `app/api/generate/route.ts` for a real call later — the
`WizardAnswers -> GenerateResponse` contract in `types/index.ts` doesn't need to change.

## Getting started locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Render

This repo includes a `render.yaml` (Render "Blueprint") so Render can configure
the service automatically.

1. Push this project to a GitHub repo (see below).
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** →
   **Blueprint**, and point it at your GitHub repo. Render will read `render.yaml`
   and create the web service automatically.
   - Alternatively: **New +** → **Web Service** → connect the repo, and set:
     - Build command: `npm install && npm run build`
     - Start command: `npm run start`
     - Environment: Node
3. Render sets the `PORT` environment variable automatically; `npm run start`
   already reads it (`next start -p $PORT`).
4. Deploy. Every push to your default branch will auto-deploy.

## Creating the GitHub repo

```bash
git init
git add .
git commit -m "GhostCoFounder — initial Phase 1 build"
git branch -M main
git remote add origin https://github.com/<your-username>/GhostCoFounder.git
git push -u origin main
```

(Create the empty `GhostCoFounder` repo on GitHub first — via the GitHub UI or
`gh repo create GhostCoFounder --public --source=. --remote=origin` if you have
the GitHub CLI installed and authenticated.)

## Phase 2 (not implemented — architecture is ready for it)

- AI-generated follow-up questions (append dynamically to `lib/wizardSteps.ts`)
- Theme selector
- AI Website Builder + landing page preview
- Export artifacts (PDF/Notion/etc.)
- Authentication
- Artifact history
- Edit generated content / regenerate individual sections

The dynamic section renderer in `components/artifacts/` and the
`WizardAnswers -> GenerateResponse` contract in `types/index.ts` were built so
these can be layered in without restructuring existing screens.
