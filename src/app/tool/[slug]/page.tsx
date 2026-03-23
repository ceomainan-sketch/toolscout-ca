import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, getAllComparisons } from "@/lib/data";
import { tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Review 2026: Pricing, Features, Pros & Cons | ToolScout`,
    description: `Detailed ${tool.name} review for 2026. ${tool.description}. See pricing, features, pros & cons.`,
    openGraph: {
      title: `${tool.name} Review 2026`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const comparisons = getAllComparisons().filter(
    (c) => c.tool1Slug === tool.slug || c.tool2Slug === tool.slug
  );

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: tool.pricingAmount,
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      ratingCount: Math.floor(tool.rating * 100),
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{tool.logo}</span>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {tool.name}
          </h1>
          <p className="text-gray-600">{tool.description}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500">Rating</div>
          <div className="text-xl font-bold text-yellow-600">
            {tool.rating}/5
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500">Pricing</div>
          <div className="text-xl font-bold text-gray-900">{tool.pricing}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500">Free Trial</div>
          <div className="text-xl font-bold text-gray-900">
            {tool.freeTrialDays > 0 ? `${tool.freeTrialDays} days` : "No"}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500">Best For</div>
          <div className="text-sm font-medium text-gray-900">
            {tool.bestFor}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Try {tool.name}</h2>
          <p className="text-sm text-gray-600">{tool.pricing}</p>
        </div>
        {tool.affiliateUrl ? (
          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Visit {tool.name} →
          </a>
        ) : (
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Visit {tool.name} →
          </a>
        )}
      </div>

      {/* Description */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What is {tool.name}?
        </h2>
        <p className="text-gray-600 leading-relaxed">{tool.longDescription}</p>
      </div>

      {/* Features */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {tool.name} Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(tool.features).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <span className="font-medium text-gray-700">{key}</span>
              <span className="text-gray-600">
                {typeof value === "boolean"
                  ? value
                    ? "✅"
                    : "❌"
                  : value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-xl font-bold text-green-700 mb-3">Pros</h2>
          <ul className="space-y-2">
            {tool.pros.map((pro) => (
              <li key={pro} className="text-gray-600 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-3">Cons</h2>
          <ul className="space-y-2">
            {tool.cons.map((con) => (
              <li key={con} className="text-gray-600 flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✗</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related Comparisons */}
      {comparisons.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {tool.name} Comparisons
          </h2>
          <div className="space-y-3">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                  {comp.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {comp.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Similar Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tool/${t.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{t.logo}</div>
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{t.pricing}</p>
                <p className="text-sm text-yellow-500 mt-1">
                  {t.rating}/5
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
