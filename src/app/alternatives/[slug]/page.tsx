import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlternative, getTool, getAllAlternatives } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

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
    openGraph: { title: alt.title, description: alt.metaDescription },
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
        ? `${alternativeTools[0].name} is our top-rated alternative to ${mainToolName}. It scores ${alternativeTools[0].rating}/5 in our testing and is best for ${alternativeTools[0].bestFor.toLowerCase()}.`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Alternatives", href: "/" },
          { name: alt.title, href: `/alternatives/${slug}` },
        ]}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-gray-900">Alternatives</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {alt.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Why look for alternatives */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Why Look for {mainToolName} Alternatives?
        </h2>
        <p className="text-lg text-gray-600">{alt.intro}</p>
      </section>

      {/* Quick comparison table */}
      <div className="overflow-x-auto mb-10">
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
