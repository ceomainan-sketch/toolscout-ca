import { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { bestLists } from "@/data/best-lists";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";
import { alternatives } from "@/data/alternatives";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolscout.ca";

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisonPages = comparisons.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const bestListPages = bestLists.map((list) => ({
    url: `${baseUrl}/best/${list.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const guidePages = guides.map((guide) => ({
    url: `${baseUrl}/guide/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const alternativePages = alternatives.map((alt) => ({
    url: `${baseUrl}/alternatives/${alt.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const staticPages = [
    { path: "/about", priority: 0.5 },
    { path: "/search", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticPages,
    ...categoryPages,
    ...comparisonPages,
    ...bestListPages,
    ...alternativePages,
    ...guidePages,
    ...toolPages,
  ];
}
