import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuide, getTool, getComparison, getAllGuides } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import TableOfContents from "@/components/TableOfContents";
import { slugify, estimateReadingTime, currentMonth, safeJsonLd, schemaDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title + " | ToolScout",
    description: guide.metaDescription,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: { title: guide.title, description: guide.metaDescription, images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }] },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const recommendedTools = guide.recommendedToolSlugs
    .map((s) => getTool(s))
    .filter((t) => t !== undefined);

  const relatedComparisons = (guide.relatedComparisons ?? [])
    .map((s) => getComparison(s))
    .filter((c) => c !== undefined);

  const allText = guide.intro + " " + guide.sections.map((s) => s.content).join(" ");
  const readingTime = estimateReadingTime(allText);

  const dates = schemaDate(slug);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: dates.published,
    dateModified: dates.modified,
    author: { "@type": "Organization", name: "ToolScout" },
    publisher: { "@type": "Organization", name: "ToolScout", url: "https://toolscout.ca" },
    url: `https://toolscout.ca/guide/${slug}`,
  };

  const topTool = recommendedTools[0];
  const faqItems = [
    ...(topTool
      ? [
          {
            question: `What is the best tool recommended in this guide?`,
            answer: `Based on our testing, ${topTool.name} is our top pick. It scores ${topTool.rating}/5 and is best for ${(topTool.bestFor ?? "").toLowerCase()}. ${topTool.pricing}.`,
          },
        ]
      : []),
    {
      question: guide.sections[0]?.heading ?? `What does this guide cover?`,
      answer: guide.sections[0]?.content ?? guide.intro,
    },
    ...(recommendedTools.length > 1
      ? [
          {
            question: `What are the top tools compared in this guide?`,
            answer: `We compare ${recommendedTools.map((t) => t.name).join(", ")}. Each tool is ranked based on features, pricing, ease of use, and value for money.`,
          },
        ]
      : []),
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/#guides" },
          { name: guide.title, href: `/guide/${slug}` },
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
        <Link href="/#guides" className="hover:text-gray-900">Guides</Link>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        {guide.title}
      </h1>
      <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
        <span>
          Last updated: {currentMonth()}
        </span>
        <span>·</span>
        <span>{readingTime} min read</span>
      </div>
      <p className="text-lg text-gray-600 mb-8">{guide.intro}</p>

      {/* Table of Contents */}
      <TableOfContents sections={guide.sections} />

      {/* Quick picks table */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <span aria-hidden="true">⚡</span> Quick Answer
        </h2>
        <div className="space-y-3">
          {recommendedTools.slice(0, 3).map((tool, i) => (
            <div key={tool.slug} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600">
                #{i + 1}
              </span>
              <div>
                <Link
                  href={`/tool/${tool.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600"
                >
                  {tool.logo} {tool.name}
                </Link>
                <span className="text-gray-500 text-sm ml-2">
                  — {tool.bestFor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide sections */}
      <div className="space-y-8 mb-12">
        {guide.sections.map((section, i) => {
          const sectionTool = section.toolSlug
            ? getTool(section.toolSlug)
            : undefined;
          return (
            <div key={i}>
              <h2
                id={slugify(section.heading)}
                className="text-2xl font-bold text-gray-900 mb-3 scroll-mt-20"
              >
                {section.heading}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {section.content}
              </p>
              {sectionTool && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <Link
                        href={`/tool/${sectionTool.slug}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {sectionTool.logo} {sectionTool.name}
                      </Link>
                      <span className="text-gray-500 text-sm ml-2">
                        {sectionTool.pricing}
                      </span>
                      <span className="text-yellow-600 text-sm ml-2">
                        ★ {sectionTool.rating}/5
                      </span>
                      {sectionTool.freeTrialDays > 0 && (
                        <span className="text-green-600 text-xs ml-2 bg-green-50 px-2 py-0.5 rounded-full">
                          {sectionTool.freeTrialDays}-day free trial
                        </span>
                      )}
                    </div>
                    {sectionTool.affiliateUrl ? (
                      <a
                        href={sectionTool.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-sm bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                      >
                        Try {sectionTool.name} →
                      </a>
                    ) : (
                      <Link
                        href={`/tool/${sectionTool.slug}`}
                        className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        Learn More →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed tool cards */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Detailed Reviews
      </h2>
      <div className="space-y-6 mb-12">
        {recommendedTools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related comparisons */}
      {relatedComparisons.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Related Comparisons
          </h2>
          <div className="grid gap-3">
            {relatedComparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{comp.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
