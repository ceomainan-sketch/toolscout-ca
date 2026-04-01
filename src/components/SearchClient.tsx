"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/categories";

export type ResultType = "tool" | "comparison" | "guide" | "best-list" | "category" | "alternative";

const validTypes: ResultType[] = ["tool", "comparison", "guide", "best-list", "category", "alternative"];

export interface SearchItem {
  type: ResultType;
  title: string;
  description: string;
  href: string;
  icon: string;
}

const typeLabels: Record<ResultType, string> = {
  tool: "Tool",
  comparison: "Comparison",
  guide: "Guide",
  "best-list": "Best List",
  category: "Category",
  alternative: "Alternative",
};

const typeColors: Record<ResultType, string> = {
  tool: "bg-blue-50 text-blue-700",
  comparison: "bg-purple-50 text-purple-700",
  guide: "bg-green-50 text-green-700",
  "best-list": "bg-yellow-50 text-yellow-700",
  category: "bg-gray-100 text-gray-700",
  alternative: "bg-orange-50 text-orange-700",
};

const emptyData = { searchIndex: [] as SearchItem[], counts: { tools: 0, comparisons: 0, guides: 0 } };

function getSearchData(): typeof emptyData {
  if (typeof document === "undefined") return emptyData;
  const el = document.getElementById("search-data");
  if (!el) return emptyData;
  try {
    const parsed = JSON.parse(el.textContent || "{}");
    return {
      searchIndex: parsed.searchIndex ?? [],
      counts: parsed.counts ?? emptyData.counts,
    };
  } catch {
    return emptyData;
  }
}

export default function SearchClient() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12"><h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Search Tools & Comparisons</h1><p className="text-gray-600 mb-8">Loading search...</p></div>}>
      <SearchClientInner />
    </Suspense>
  );
}

function SearchClientInner() {
  const [data, setData] = useState(emptyData);
  // Reading embedded JSON from the DOM on mount is a valid use of setState in an effect
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setData(getSearchData()); }, []);
  const { searchIndex, counts } = data;
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type");
  const initialType = urlType && validTypes.includes(urlType as ResultType) ? urlType as ResultType : "all";
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<ResultType | "all">(initialType);

  const results = useMemo(() => {
    if (!query.trim() && filterType === "all") return [];

    return searchIndex
      .filter((item) => {
        if (filterType !== "all" && item.type !== filterType) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase().trim();
        const words = q.split(/\s+/);
        const text = `${item.title} ${item.description}`.toLowerCase();
        return words.every((word) => text.includes(word));
      })
      .slice(0, 50);
  }, [query, filterType, searchIndex]);

  const showSuggestions = !query.trim() && filterType === "all";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Search Tools & Comparisons
      </h1>
      <p className="text-gray-600 mb-8">
        Search across {counts.tools} tools, {counts.comparisons} comparisons, {counts.guides} guides, and more.
      </p>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tools, comparisons, guides..."
          aria-label="Search tools and comparisons"
          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(["all", "tool", "comparison", "guide", "best-list", "category", "alternative"] as const).map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "all" ? "All" : typeLabels[type]}
              {type === "all" && query.trim() && ` (${searchIndex.filter((i) => {
                const q = query.toLowerCase().trim();
                const words = q.split(/\s+/);
                const text = `${i.title} ${i.description}`.toLowerCase();
                return words.every((word) => text.includes(word));
              }).length})`}
            </button>
          )
        )}
      </div>

      {/* Results */}
      {(query.trim() || filterType !== "all") && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""}{query.trim() ? <> for &ldquo;{query}&rdquo;</> : filterType !== "all" ? <> in {typeLabels[filterType]}</> : null}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No results found</p>
              <p className="text-gray-400 text-sm">
                Try a different search term or browse our{" "}
                <Link href="/#categories" className="text-blue-600 hover:underline">
                  categories
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <Link
                  key={result.href}
                  href={result.href}
                  className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                          {result.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeColors[result.type]}`}
                        >
                          {typeLabels[result.type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions when no query */}
      {showSuggestions && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Popular Searches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {[
              { label: "ChatGPT vs Claude", href: "/compare/chatgpt-vs-claude" },
              { label: "Best AI Writing Tools", href: "/best/best-ai-writing-tools" },
              { label: "Best Web Hosting", href: "/best/best-web-hosting" },
              { label: "Best VPN Services", href: "/best/best-vpn-services" },
              { label: "Ahrefs vs Semrush", href: "/compare/ahrefs-vs-semrush" },
              { label: "Best CRM Software", href: "/best/best-crm-software" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white group"
              >
                <span className="font-medium text-gray-900 group-hover:text-blue-600">
                  {item.label}
                </span>
                <span className="text-sm text-blue-600 ml-2">&rarr;</span>
              </Link>
            ))}
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition-all bg-white text-center group"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
