import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getComparison, getTool, getAllComparisons, getComparisonsByCategory, getAlternative } from "@/lib/data";
import ComparisonTable from "@/components/ComparisonTable";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { currentMonth, safeJsonLd, cleanDisplayTitle, schemaDate } from "@/lib/utils";

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
      images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }],
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

  const isTie = comparison.verdictWinner !== tool1.slug && comparison.verdictWinner !== tool2.slug;
  const winner = comparison.verdictWinner === tool1.slug ? tool1 : comparison.verdictWinner === tool2.slug ? tool2 : null;

  // Find pricing comparison
  const pricingRow = comparison.featureComparisons.find(
    (f) => f.feature.toLowerCase().includes("price") || f.feature.toLowerCase().includes("pricing")
  );

  // Schema.org Article
  const dates = schemaDate(slug);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.metaDescription,
    datePublished: dates.published,
    dateModified: dates.modified,
    author: { "@type": "Organization", name: "ToolScout" },
    publisher: { "@type": "Organization", name: "ToolScout", url: "https://toolscout.ca" },
    url: `https://toolscout.ca/compare/${slug}`,
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
          text: `${tool1.name} is best for ${(tool1.bestFor ?? "").toLowerCase()}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool2.name} best for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool2.name} is best for ${(tool2.bestFor ?? "").toLowerCase()}.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Comparisons", href: "/#comparisons" },
          { name: `${tool1.name} vs ${tool2.name}`, href: `/compare/${slug}` },
        ]}
      />

      {/* Affiliate Disclosure */}
      <p className="text-xs text-gray-500 italic mb-4">
        This page contains affiliate links. We may earn a commission at no extra cost to you.
      </p>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link href="/#comparisons" className="hover:text-gray-900">Comparisons</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">
          {tool1.name} vs {tool2.name}
        </span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {comparison.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated: {currentMonth()}
      </p>
      <p className="text-lg text-gray-600 mb-8">{comparison.metaDescription}</p>

      {/* Quick Verdict */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Quick Verdict: {isTie || !winner ? "It's a close call" : `${winner.name} wins overall`}
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

      {/* Prominent Affiliate CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[tool1, tool2].map((tool) => (
          <div
            key={tool.slug}
            className="flex flex-col items-center text-center border border-gray-200 rounded-lg p-6 bg-white"
          >
            <span className="text-3xl mb-2" role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{tool.pricing}</p>
            {tool.affiliateUrl ? (
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-base transition-colors"
              >
                {tool.freeTrialDays > 0 || tool.pricing.toLowerCase().includes("free") ? `Try ${tool.name} Free` : `Visit ${tool.name}`}
              </a>
            ) : (
              <Link
                href={`/tool/${tool.slug}`}
                className="w-full inline-block text-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold text-base"
              >
                Learn More
              </Link>
            )}
          </div>
        ))}
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
              <span role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span> {tool.name}
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
                  className="inline-block bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
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
              {tool1.name} is best for {(tool1.bestFor ?? "").toLowerCase()}.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is {tool2.name} best for?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool2.name} is best for {(tool2.bestFor ?? "").toLowerCase()}.
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

      {/* Related Comparisons */}
      {(() => {
        const relatedComps = getComparisonsByCategory(tool1.category)
          .filter((c) => c.slug !== comparison.slug)
          .slice(0, 6);
        if (relatedComps.length === 0) return null;
        return (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Related Comparisons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedComps.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                    {cleanDisplayTitle(comp.title)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {comp.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Alternatives Links */}
      {(() => {
        const alt1 = getAlternative(`${tool1.slug}-alternatives`);
        const alt2 = getAlternative(`${tool2.slug}-alternatives`);
        if (!alt1 && !alt2) return null;
        return (
          <div className="mt-10 flex flex-wrap gap-3">
            {alt1 && (
              <Link
                href={`/alternatives/${alt1.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {tool1.name} Alternatives &rarr;
              </Link>
            )}
            {alt2 && (
              <Link
                href={`/alternatives/${alt2.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {tool2.name} Alternatives &rarr;
              </Link>
            )}
          </div>
        );
      })()}

      {/* Featured Deal Banner */}
      <div className="mt-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">Top Pick</span>
          <span className="text-xs text-gray-400 italic">Sponsored</span>
        </div>
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🌐 Looking for web hosting? Bluehost from $2.95/mo</h3>
            <p className="text-sm text-gray-600 mt-1">Free domain, free SSL, recommended by WordPress.org. Trusted by millions of websites worldwide.</p>
          </div>
          <a
            href="https://bluehost.sjv.io/c/7111837/1376228/11352"
            target="_blank"
            rel="nofollow noopener"
            className="inline-block mt-4 md:mt-0 bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
          >
            Get Bluehost Deal &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
