import { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { guides } from "@/data/guides";
import { bestLists } from "@/data/best-lists";
import { categories } from "@/data/categories";
import { alternatives } from "@/data/alternatives";
import { cleanDisplayTitle, safeJsonLd } from "@/lib/utils";
import type { SearchItem } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search Tools & Comparisons | ToolScout",
  description: `Search across ${tools.length}+ tools, ${comparisons.length}+ comparisons, and ${guides.length}+ buying guides on ToolScout. Find the best AI tools, web hosting, VPNs, SEO software, and more.`,
  alternates: { canonical: "/search" },
};

function buildSearchIndex(): SearchItem[] {
  const results: SearchItem[] = [];

  for (const tool of tools) {
    results.push({
      type: "tool",
      title: tool.name,
      description: tool.description,
      href: `/tool/${tool.slug}`,
      icon: tool.logo,
    });
  }

  for (const comp of comparisons) {
    results.push({
      type: "comparison",
      title: cleanDisplayTitle(comp.title),
      description: comp.metaDescription,
      href: `/compare/${comp.slug}`,
      icon: "\u2694\uFE0F",
    });
  }

  for (const guide of guides) {
    results.push({
      type: "guide",
      title: guide.title,
      description: guide.metaDescription,
      href: `/guide/${guide.slug}`,
      icon: "\uD83D\uDCD6",
    });
  }

  for (const list of bestLists) {
    results.push({
      type: "best-list",
      title: list.title,
      description: list.metaDescription,
      href: `/best/${list.slug}`,
      icon: "\uD83C\uDFC6",
    });
  }

  for (const cat of categories) {
    results.push({
      type: "category",
      title: cat.name,
      description: cat.description,
      href: `/category/${cat.slug}`,
      icon: cat.icon,
    });
  }

  for (const alt of alternatives) {
    results.push({
      type: "alternative",
      title: cleanDisplayTitle(alt.title),
      description: alt.metaDescription,
      href: `/alternatives/${alt.slug}`,
      icon: "\uD83D\uDD04",
    });
  }

  return results;
}

export default function SearchPage() {
  const searchIndex = buildSearchIndex();
  const counts = {
    tools: tools.length,
    comparisons: comparisons.length,
    guides: guides.length,
  };
  return (
    <>
      <script
        id="search-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({ searchIndex, counts }) }}
      />
      <SearchClient />
    </>
  );
}
