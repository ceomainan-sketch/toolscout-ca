import { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { bestLists } from "@/data/best-lists";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";

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

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryPages,
    ...comparisonPages,
    ...bestListPages,
    ...guidePages,
    ...toolPages,
  ];
}
