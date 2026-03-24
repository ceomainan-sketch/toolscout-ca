export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  pricing: string;
  pricingAmount: number; // lowest paid plan in $/mo
  rating: number; // out of 5
  pros: string[];
  cons: string[];
  features: Record<string, string | boolean>;
  affiliateUrl: string;
  website: string;
  logo: string; // emoji or path
  bestFor: string;
  freeTrialDays: number;
}

export interface Comparison {
  slug: string;
  tool1Slug: string;
  tool2Slug: string;
  title: string;
  metaDescription: string;
  verdict: string;
  verdictWinner: string;
  featureComparisons: {
    feature: string;
    tool1Value: string;
    tool2Value: string;
    winner: string;
  }[];
}

export interface BestList {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  category: string;
  toolSlugs: string[]; // ordered by rank
}

export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: {
    heading: string;
    content: string;
    toolSlug?: string; // optional recommended tool
  }[];
  recommendedToolSlugs: string[];
  relatedComparisons?: string[]; // comparison slugs
}

export interface AlternativePage {
  slug: string;
  toolSlug: string; // the tool people are looking for alternatives to
  title: string;
  metaDescription: string;
  intro: string; // why people look for alternatives
  alternativeSlugs: string[]; // tool slugs from tools data, ordered by rank
}

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};
