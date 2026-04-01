import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBestList, getTool, getAllBestLists, getCategory, getComparisonsByCategory, getGuidesByCategory } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { currentMonth, yearStr, safeJsonLd, cleanDisplayTitle } from "@/lib/utils";

export function generateStaticParams() {
  return getAllBestLists().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const list = getBestList(slug);
  if (!list) return {};
  return {
    title: list.title + " | ToolScout",
    description: list.metaDescription,
    alternates: { canonical: `/best/${slug}` },
    openGraph: { title: list.title, description: list.metaDescription, images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }] },
  };
}

export default async function BestListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = getBestList(slug);
  if (!list) notFound();

  const rankedTools = list.toolSlugs
    .map((s) => getTool(s))
    .filter((t) => t !== undefined);

  const category = getCategory(list.category);
  const categoryName = category?.name ?? list.category.replace(/-/g, " ");
  const relatedComparisons = getComparisonsByCategory(list.category).slice(0, 6);
  const relatedGuides = getGuidesByCategory(list.category).slice(0, 3);
  const topToolName = rankedTools[0]?.name ?? "our top pick";
  const freeTools = rankedTools.filter(
    (t) => t.pricing.toLowerCase().includes("free") || t.pricingAmount === 0
  );

  const faqItems = [
    {
      question: `What is the best ${categoryName} tool in ${yearStr()}?`,
      answer: `Based on our testing, ${topToolName} is the best ${categoryName} tool in ${yearStr()}. It earned the top spot for its overall feature set, ease of use, and value for money. See our full ranking above for details on every tool we evaluated.`,
    },
    {
      question: `Are there free ${categoryName} tools available?`,
      answer: freeTools.length > 0
        ? `Yes, ${freeTools.map((t) => t.name).join(", ")} ${freeTools.length === 1 ? "offers" : "offer"} free plans or free tiers. While free plans have limitations, they are a great way to get started before committing to a paid subscription.`
        : `Most ${categoryName} tools offer free trials, but fully free plans with robust features are rare. We recommend taking advantage of trial periods to find the right fit before subscribing.`,
    },
    {
      question: `How did we rank these ${categoryName} tools?`,
      answer: `We evaluated each tool based on features, ease of use, pricing and value, integrations, and overall user experience. Every tool on this list was hands-on tested by our team. Rankings reflect real-world performance rather than marketing claims.`,
    },
    {
      question: `What should I look for in a ${categoryName} tool?`,
      answer: `Key factors include your budget, the specific features you need, ease of use, available integrations with your existing workflow, and the quality of customer support. We recommend starting with a free trial of your top choice to make sure it fits your needs.`,
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    description: list.metaDescription,
    itemListElement: rankedTools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://toolscout.ca/tool/${tool.slug}`,
    })),
  };

  const faqSchemaData = {
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchemaData) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Best Lists", href: "/#best-lists" },
          { name: list.title, href: `/best/${slug}` },
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
        <Link href="/#best-lists" className="hover:text-gray-900">Best Lists</Link>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {list.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated: {currentMonth()}
      </p>
      <p className="text-lg text-gray-600 mb-10">{list.intro}</p>

      {/* Quick summary table - Desktop */}
      <div className="hidden md:block overflow-x-auto mb-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200">Rank</th>
              <th className="text-left p-3 border border-gray-200">Tool</th>
              <th className="text-left p-3 border border-gray-200">Best For</th>
              <th className="text-left p-3 border border-gray-200">Pricing</th>
              <th className="text-left p-3 border border-gray-200">Rating</th>
            </tr>
          </thead>
          <tbody>
            {rankedTools.map((tool, i) => (
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

      {/* Quick summary cards - Mobile */}
      <div className="md:hidden space-y-3 mb-10">
        {rankedTools.map((tool, i) => (
          <div
            key={tool.slug}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-blue-600">#{i + 1}</span>
              <span className="text-xl" role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span>
              <Link
                href={`/tool/${tool.slug}`}
                className="font-semibold text-gray-900 hover:text-blue-600"
              >
                {tool.name}
              </Link>
              <span className="ml-auto text-sm text-yellow-600 font-medium">
                {tool.rating}/5
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{tool.bestFor}</p>
            <p className="text-sm font-medium text-gray-700">{tool.pricing}</p>
          </div>
        ))}
      </div>

      {/* Detailed cards */}
      <div className="space-y-6">
        {rankedTools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* Related Comparisons */}
      {relatedComparisons.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Head-to-Head Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedComparisons.map((comp) => (
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
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Buying Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {guide.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.question} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Deal Banner */}
      <div className="mt-12 border-2 border-green-200 bg-gradient-to-r from-green-50 to-white rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">Limited Deal</span>
          <span className="text-xs text-gray-400 italic">Sponsored</span>
        </div>
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🦈 Surfshark VPN — Unlimited Devices from $2.19/mo</h3>
            <p className="text-sm text-gray-600 mt-1">Protect your entire family with one subscription. Fast speeds, strong privacy, and works with Netflix.</p>
          </div>
          <a
            href="https://get.surfshark.net/aff_c?offer_id=926&aff_id=45706"
            target="_blank"
            rel="nofollow noopener"
            className="inline-block mt-4 md:mt-0 bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
          >
            Get Surfshark Deal &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
