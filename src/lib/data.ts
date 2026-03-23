import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { bestLists } from "@/data/best-lists";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string) {
  return tools.filter((t) => t.category === category);
}

export function getComparison(slug: string) {
  return comparisons.find((c) => c.slug === slug);
}

export function getBestList(slug: string) {
  return bestLists.find((b) => b.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getAllTools() {
  return tools;
}

export function getAllComparisons() {
  return comparisons;
}

export function getAllBestLists() {
  return bestLists;
}

export function getAllCategories() {
  return categories;
}

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getAllGuides() {
  return guides;
}

export function getComparisonsByCategory(categorySlug: string) {
  return comparisons.filter((c) => {
    const t1 = getTool(c.tool1Slug);
    const t2 = getTool(c.tool2Slug);
    return t1?.category === categorySlug || t2?.category === categorySlug;
  });
}

export function getGuidesByCategory(categorySlug: string) {
  return guides.filter((g) => {
    return g.recommendedToolSlugs.some((slug) => {
      const tool = getTool(slug);
      return tool?.category === categorySlug;
    });
  });
}

export function getBestListsByCategory(categorySlug: string) {
  return bestLists.filter((b) => b.category === categorySlug);
}
