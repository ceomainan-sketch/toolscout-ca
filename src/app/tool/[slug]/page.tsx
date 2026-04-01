import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool, getCategory, getAllComparisons, getAlternative, getBestListsByCategory, getGuidesByCategory } from "@/lib/data";
import { tools } from "@/data/tools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import StickyToolCTA from "@/components/StickyToolCTA";
import { currentMonth, yearStr, safeJsonLd } from "@/lib/utils";

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
    title: `${tool.name} Review ${yearStr()}: Pricing, Features, Pros & Cons | ToolScout`,
    description: `Detailed ${tool.name} review for ${yearStr()}. ${tool.description}. See pricing, features, pros & cons.`,
    alternates: { canonical: `/tool/${slug}` },
    openGraph: {
      title: `${tool.name} Review ${yearStr()}`,
      description: tool.description,
      images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }],
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

  const alternativePage = getAlternative(`${tool.slug}-alternatives`);
  const categoryBestLists = getBestListsByCategory(tool.category);
  const categoryGuides = getGuidesByCategory(tool.category).slice(0, 3);

  const categoryToAppType: Record<string, string> = {
    "ai-writing": "BusinessApplication",
    "ai-image": "MultimediaApplication",
    "ai-coding": "DeveloperApplication",
    "ai-video": "MultimediaApplication",
    "ai-chatbots": "BusinessApplication",
    "ai-seo": "BusinessApplication",
    "ai-email": "BusinessApplication",
    "project-management": "BusinessApplication",
    "web-hosting": "WebApplication",
    "vpn": "SecurityApplication",
    "email-marketing": "BusinessApplication",
    "website-builders": "WebApplication",
    "seo-tools": "BusinessApplication",
    "design-tools": "DesignApplication",
    "online-courses": "EducationalApplication",
    "social-media": "SocialNetworkingApplication",
    "crm": "BusinessApplication",
    "password-managers": "SecurityApplication",
    "cloud-storage": "UtilitiesApplication",
    "accounting": "FinanceApplication",
    "antivirus": "SecurityApplication",
    "ai-agents": "BusinessApplication",
    "ai-voice": "MultimediaApplication",
    "ai-presentations": "BusinessApplication",
    "ai-meeting": "BusinessApplication",
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: categoryToAppType[tool.category] ?? "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: tool.pricingAmount,
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    review: {
      "@type": "Review",
      author: { "@type": "Organization", name: "ToolScout" },
      reviewRating: {
        "@type": "Rating",
        ratingValue: tool.rating,
        bestRating: 5,
      },
    },
  };

  const category = getCategory(tool.category);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.longDescription,
        },
      },
      {
        "@type": "Question",
        name: `How much does ${tool.name} cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool.name} is priced at ${tool.pricing}.${tool.freeTrialDays > 0 ? ` A ${tool.freeTrialDays}-day free trial is available.` : ""}`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool.name} best for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool.name} is best for ${(tool.bestFor ?? "").toLowerCase()}.`,
        },
      },
    ],
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${tool.affiliateUrl ? "pb-24 md:pb-12" : ""}`}>
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
          ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
          { name: tool.name, href: `/tool/${slug}` },
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
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-gray-900">
              {category.name}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      <p className="text-gray-600 mb-2">
        Last updated: {currentMonth()}
      </p>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl" role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span>
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
            rel="noopener noreferrer nofollow"
            className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Visit {tool.name} →
          </a>
        )}
      </div>

      {/* Category Best List Link */}
      {categoryBestLists.length > 0 && category && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <span>See how {tool.name} compares:</span>
          <Link
            href={`/best/${categoryBestLists[0].slug}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Best {category.name} &rarr;
          </Link>
        </div>
      )}

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

      {/* FAQ Section */}
      <div className="mb-10 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is {tool.name}?
            </h3>
            <p className="text-gray-600 text-sm">{tool.longDescription}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How much does {tool.name} cost?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool.name} is priced at {tool.pricing}.
              {tool.freeTrialDays > 0 && ` A ${tool.freeTrialDays}-day free trial is available.`}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is {tool.name} best for?
            </h3>
            <p className="text-gray-600 text-sm">
              {tool.name} is best for {(tool.bestFor ?? "").toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* Alternatives CTA */}
      {alternativePage && (
        <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Looking for {tool.name} Alternatives?
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            See our ranked list of the best alternatives to {tool.name}, with pricing and feature comparisons.
          </p>
          <Link
            href={`/alternatives/${alternativePage.slug}`}
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            View {tool.name} Alternatives &rarr;
          </Link>
        </div>
      )}

      {/* Related Guides */}
      {categoryGuides.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Buying Guides
          </h2>
          <div className="space-y-3">
            {categoryGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {guide.metaDescription}
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
                <div className="text-2xl mb-2" role="img" aria-label={`${t.name} logo`}>{t.logo}</div>
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

      {/* Sticky mobile CTA bar */}
      {tool.affiliateUrl && (
        <StickyToolCTA
          toolName={tool.name}
          affiliateUrl={tool.affiliateUrl}
          hasFreeOption={tool.freeTrialDays > 0 || tool.pricing.toLowerCase().includes("free")}
        />
      )}
    </div>
  );
}
