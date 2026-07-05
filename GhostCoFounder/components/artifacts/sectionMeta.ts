import {
  TrendingUp,
  ShieldAlert,
  Users,
  DollarSign,
  Layers,
  Lightbulb,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface SectionMeta {
  icon: LucideIcon;
  title: string;
}

/**
 * Known section keys get a curated icon + friendly title. Any key the
 * backend adds in the future that isn't listed here still renders —
 * it just falls back to a generic icon and a title-cased label.
 */
export const SECTION_META: Record<string, SectionMeta> = {
  market_opportunity: { icon: TrendingUp, title: "Market Opportunity" },
  competitors: { icon: ShieldAlert, title: "Competitor Analysis" },
  target_customers: { icon: Users, title: "Target Customers" },
  revenue_model: { icon: DollarSign, title: "Revenue Model" },
  mvp_features: { icon: Layers, title: "MVP Features" },
  risks: { icon: ShieldAlert, title: "Risks" },
  recommendations: { icon: Lightbulb, title: "Recommendations" },
};

export function getSectionMeta(key: string): SectionMeta {
  return (
    SECTION_META[key] ?? {
      icon: Sparkles,
      title: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }
  );
}
