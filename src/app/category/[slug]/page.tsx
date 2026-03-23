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
} from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

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
    title: `Best ${category.name} in 2026 — Reviews & Comparisons | ToolScout`,
    description: `Compare the best ${category.name.toLowerCase()} in 2026. Honest reviews, side-by-side comparisons, and buying guides to help you choose.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `Best ${category.name} in 2026`,
      description: category.description,
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

  const tools = getToolsByCategory(slug);
  const comparisons = getComparisonsByCategory(slug);
  const guides = getGuidesByCategory(slug);
  const bestLists = getBestListsByCategory(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: category.name, href: `/category/${slug}` },
        ]}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12">
        <span className="text-4xl mb-4 block">{category.icon}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Best {category.name} in 2026
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          {category.description}. Compare features, pricing, and find the perfect tool for your needs.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span>✅ {tools.length} tools reviewed</span>
          <span>📊 {comparisons.length} comparisons</span>
          <span>📖 {guides.length} buying guides</span>
        </div>
      </div>

      {/* Best List */}
      {bestLists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏆 Top {category.name}
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
            📊 Head-to-Head Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {comp.title.replace(" 2026:", ":")}
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
            📖 Buying Guides
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

      {/* All Tools */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All {category.name}
        </h2>
        <div className="space-y-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
