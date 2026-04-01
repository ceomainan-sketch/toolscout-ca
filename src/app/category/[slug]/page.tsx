import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategory,
  getAllCategories,
  getToolsByCategory,
  getComparisonsByCategory,
  getGuidesByCategory,
  getBestListsByCategory,
  getAllAlternatives,
} from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { yearStr, safeJsonLd, cleanDisplayTitle } from "@/lib/utils";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `Best ${category.name} in ${yearStr()} — Reviews & Comparisons | ToolScout`,
    description: `Compare the best ${category.name.toLowerCase()} in ${yearStr()}. Honest reviews, side-by-side comparisons, and buying guides to help you choose.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `Best ${category.name} in ${yearStr()}`,
      description: category.description,
      images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(slug).sort((a, b) => b.rating - a.rating);
  const comparisons = getComparisonsByCategory(slug);
  const guides = getGuidesByCategory(slug);
  const bestLists = getBestListsByCategory(slug);
  const toolSlugsInCategory = new Set(tools.map((t) => t.slug));
  const relatedAlternatives = getAllAlternatives().filter(
    (a) => toolSlugsInCategory.has(a.toolSlug)
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best ${category.name} in ${yearStr()}`,
    description: category.description,
    url: `https://toolscout.ca/category/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 10).map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: `https://toolscout.ca/tool/${tool.slug}`,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: category.name, href: `/category/${slug}` },
        ]}
      />

      {/* Affiliate Disclosure */}
      <p className="text-xs text-gray-500 italic mb-4">
        This page contains affiliate links. We may earn a commission at no extra cost to you.
      </p>

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12">
        <span className="text-4xl mb-4 block" role="img" aria-label={category.name}>{category.icon}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Best {category.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          {category.description}. Compare features, pricing, and find the perfect tool for your needs.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span><span aria-hidden="true">✅</span> {tools.length} tools reviewed</span>
          <span><span aria-hidden="true">📊</span> {comparisons.length} comparisons</span>
          <span><span aria-hidden="true">📖</span> {guides.length} buying guides</span>
        </div>
      </div>

      {/* Best List */}
      {bestLists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <span aria-hidden="true">🏆</span> Top {category.name}
          </h2>
          <div className="space-y-4">
            {tools.slice(0, 3).map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
            ))}
          </div>
          {bestLists[0] && (
            <Link
              href={`/best/${bestLists[0].slug}`}
              className="inline-block mt-4 text-blue-600 hover:underline font-medium"
            >
              See full rankings →
            </Link>
          )}
        </section>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <span aria-hidden="true">📊</span> Head-to-Head Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {cleanDisplayTitle(comp.title)}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {comp.metaDescription}
                </p>
                <span className="text-sm text-blue-600 mt-3 inline-block">
                  Compare now →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Buying Guides */}
      {guides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <span aria-hidden="true">📖</span> Buying Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {guide.metaDescription}
                </p>
                <span className="text-sm text-blue-600 mt-3 inline-block">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Alternatives */}
      {relatedAlternatives.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tool Alternatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedAlternatives.map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {cleanDisplayTitle(alt.title)}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {alt.metaDescription}
                </p>
                <span className="text-sm text-blue-600 mt-3 inline-block">
                  See alternatives &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Tools */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All {category.name}
        </h2>
        <div className="space-y-4">
          {tools.slice(bestLists.length > 0 ? 3 : 0).map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} rank={(bestLists.length > 0 ? 3 : 0) + i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
