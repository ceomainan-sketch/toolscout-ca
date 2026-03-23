import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBestList, getTool, getAllBestLists } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

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
    openGraph: { title: list.title, description: list.metaDescription },
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Best Lists", href: "/" },
          { name: list.title, href: `/best/${slug}` },
        ]}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Best Lists</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {list.title}
      </h1>
      <p className="text-gray-600 mb-2">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <p className="text-lg text-gray-600 mb-10">{list.intro}</p>

      {/* Quick summary table */}
      <div className="overflow-x-auto mb-10">
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

      {/* Detailed cards */}
      <div className="space-y-6">
        {rankedTools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
