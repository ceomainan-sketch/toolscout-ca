import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlternative, getTool, getAllAlternatives, getAllComparisons } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { currentMonth, safeJsonLd, cleanDisplayTitle } from "@/lib/utils";

export function generateStaticParams() {
  return getAllAlternatives().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) return {};
  return {
    title: alt.title + " | ToolScout",
    description: alt.metaDescription,
    alternates: { canonical: `/alternatives/${slug}` },
    openGraph: { title: alt.title, description: alt.metaDescription, images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }] },
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) notFound();

  const mainTool = getTool(alt.toolSlug);
  const alternativeTools = alt.alternativeSlugs
    .map((s) => getTool(s))
    .filter((t) => t !== undefined);

  const mainToolName = mainTool?.name ?? alt.toolSlug;

  // Schema.org ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: alt.title,
    description: alt.metaDescription,
    itemListElement: alternativeTools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://toolscout.ca/tool/${tool.slug}`,
    })),
  };

  // FAQ Schema
  const faqItems = [
    {
      question: `What is the best alternative to ${mainToolName}?`,
      answer: alternativeTools.length > 0
        ? `${alternativeTools[0].name} is our top-rated alternative to ${mainToolName}. It scores ${alternativeTools[0].rating}/5 in our testing and is best for ${(alternativeTools[0].bestFor ?? "a wide range of use cases").toLowerCase()}.`
        : `Check out our ranked list above for the best alternatives.`,
    },
    {
      question: `Is there a free alternative to ${mainToolName}?`,
      answer: (() => {
        const freeTool = alternativeTools.find(
          (t) => t.pricing.toLowerCase().includes("free") || t.freeTrialDays > 0
        );
        if (freeTool) {
          return freeTool.pricing.toLowerCase().includes("free")
            ? `Yes, ${freeTool.name} offers a free plan. Its paid plans start ${freeTool.pricing.replace(/Free\s*\/?\s*/i, "")}.`
            : `${freeTool.name} offers a ${freeTool.freeTrialDays}-day free trial so you can test it before committing.`;
        }
        return `Most alternatives offer free trials so you can test them risk-free before committing to a paid plan.`;
      })(),
    },
    {
      question: `Why should I switch from ${mainToolName}?`,
      answer: alt.intro,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Alternatives", href: "/#alternatives" },
          { name: alt.title, href: `/alternatives/${slug}` },
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
        <Link href="/#alternatives" className="hover:text-gray-900">Alternatives</Link>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {alt.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated: {currentMonth()}
      </p>

      {/* Why look for alternatives */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Why Look for {mainToolName} Alternatives?
        </h2>
        <p className="text-lg text-gray-600">{alt.intro}</p>
      </section>

      {/* Quick comparison table - Desktop */}
      <div className="hidden md:block overflow-x-auto mb-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200">Rank</th>
              <th className="text-left p-3 border border-gray-200">
                Alternative
              </th>
              <th className="text-left p-3 border border-gray-200">Best For</th>
              <th className="text-left p-3 border border-gray-200">Pricing</th>
              <th className="text-left p-3 border border-gray-200">Rating</th>
            </tr>
          </thead>
          <tbody>
            {alternativeTools.map((tool, i) => (
              <tr key={tool.slug} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-bold text-blue-600">
                  #{i + 1}
                </td>
                <td className="p-3 border border-gray-200 font-medium">
                  <Link
                    href={`/tool/${tool.slug}`}
                    className="hover:text-blue-600"
                  >
                    {tool.logo} {tool.name}
                  </Link>
                </td>
                <td className="p-3 border border-gray-200 text-gray-600">
                  {tool.bestFor}
                </td>
                <td className="p-3 border border-gray-200">{tool.pricing}</td>
                <td className="p-3 border border-gray-200 text-yellow-600">
                  {tool.rating}/5
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick comparison - Mobile stacked cards */}
      <div className="md:hidden space-y-3 mb-10">
        {alternativeTools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tool/${tool.slug}`}
            className="block border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-600">#{i + 1}</span>
              <span className="text-sm text-yellow-600 font-medium">{tool.rating}/5</span>
            </div>
            <div className="font-semibold text-gray-900 mb-1">
              {tool.logo} {tool.name}
            </div>
            <p className="text-sm text-gray-600 mb-1">{tool.bestFor}</p>
            <p className="text-sm text-gray-500">{tool.pricing}</p>
          </Link>
        ))}
      </div>

      {/* Detailed alternative cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Best {mainToolName} Alternatives Ranked
        </h2>
        <div className="space-y-6">
          {alternativeTools.map((tool, i) => (
            <div key={tool.slug}>
              <ToolCard tool={tool} rank={i + 1} />
              <div className="mt-3 ml-12 flex flex-wrap gap-2">
                {tool.cons.slice(0, 2).map((con) => (
                  <span
                    key={con}
                    className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded"
                  >
                    &times; {con}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Comparisons */}
      {(() => {
        const allToolSlugs = new Set([alt.toolSlug, ...alt.alternativeSlugs]);
        const relatedComps = getAllComparisons()
          .filter((c) => allToolSlugs.has(c.tool1Slug) || allToolSlugs.has(c.tool2Slug))
          .slice(0, 6);
        if (relatedComps.length === 0) return null;
        return (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Head-to-Head Comparisons
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
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
