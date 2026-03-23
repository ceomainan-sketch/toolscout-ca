import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getComparison, getTool, getAllComparisons } from "@/lib/data";
import ComparisonTable from "@/components/ComparisonTable";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};
  return {
    title: comparison.title + " | ToolScout",
    description: comparison.metaDescription,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title: comparison.title,
      description: comparison.metaDescription,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const tool1 = getTool(comparison.tool1Slug);
  const tool2 = getTool(comparison.tool2Slug);
  if (!tool1 || !tool2) notFound();

  const winner = comparison.verdictWinner === tool1.slug ? tool1 : tool2;

  // Find pricing comparison
  const pricingRow = comparison.featureComparisons.find(
    (f) => f.feature.toLowerCase().includes("price") || f.feature.toLowerCase().includes("pricing")
  );

  // Schema.org Article
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.metaDescription,
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "ToolScout" },
  };

  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which is better, ${tool1.name} or ${tool2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: comparison.verdict,
        },
      },
      {
        "@type": "Question",
        name: `How much does ${tool1.name} cost vs ${tool2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pricingRow
            ? `${tool1.name} starts at ${pricingRow.tool1Value}, while ${tool2.name} starts at ${pricingRow.tool2Value}.`
            : `${tool1.name} is priced at ${tool1.pricing}. ${tool2.name} is priced at ${tool2.pricing}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool1.name} best for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool1.name} is best for ${tool1.bestFor.toLowerCase()}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool2.name} best for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool2.name} is best for ${tool2.bestFor.toLowerCase()}.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Comparisons", href: "/" },
          { name: `${tool1.name} vs ${tool2.name}`, href: `/compare/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Comparisons</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">
          {tool1.name} vs {tool2.name}
        </span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {comparison.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <p className="text-lg text-gray-600 mb-8">{comparison.metaDescription}</p>

      {/* Quick Verdict */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Quick Verdict: {winner.name} wins overall
        </h2>
        <p className="text-gray-700">{comparison.verdict}</p>
        <div className="flex gap-4 mt-4">
          <Link
            href={`/tool/${tool1.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {tool1.name} details →
          </Link>
          <Link
            href={`/tool/${tool2.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {tool2.name} details →
          </Link>
        </div>
      </div>

      {/* Comparison Table */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {tool1.name} vs {tool2.name}: Feature Comparison
      </h2>
      <ComparisonTable comparison={comparison} />

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {[tool1, tool2].map((tool) => (
          <div key={tool.slug}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {tool.logo} {tool.name}
            </h3>
            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
              <ul className="space-y-1">
                {tool.pros.map((pro) => (
                  <li key={pro} className="text-sm text-gray-600">
                    ✅ {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
              <ul className="space-y-1">
                {tool.cons.map((con) => (
                  <li key={con} className="text-sm text-gray-600">
                    ❌ {con}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              {tool.affiliateUrl ? (
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm transition-all"
                >
                  Try {tool.name} →
                </a>
              ) : (
                <Link
                  href={`/tool/${tool.slug}`}
                  className="inline-block bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Learn more →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Which is better, {tool1.name} or {tool2.name}?
            </h3>
            <p className="text-gray-600 text-sm">{comparison.verdict}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How much does {tool1.name} cost vs {tool2.name}?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool1.name} is priced at {tool1.pricing}. {tool2.name} is priced at {tool2.pricing}.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is {tool1.name} best for?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool1.name} is best for {tool1.bestFor.toLowerCase()}.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is {tool2.name} best for?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool2.name} is best for {tool2.bestFor.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Verdict */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Final Verdict
        </h2>
        <p className="text-gray-700">{comparison.verdict}</p>
      </div>
    </div>
  );
}
