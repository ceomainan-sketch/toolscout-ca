import Link from "next/link";
import { getAllComparisons, getAllBestLists, getAllCategories, getAllGuides } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";

export default function Home() {
  const categories = getAllCategories();
  const comparisons = getAllComparisons();
  const bestLists = getAllBestLists();
  const guides = getAllGuides();
  const featuredTools = tools.filter((t) => t.rating >= 4.5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find the Best Tools for Your Business
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Honest, side-by-side comparisons of the top AI tools, web hosting,
            VPNs, SEO software, and more. Updated for 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const list = bestLists.find((b) => b.category === cat.slug);
              if (!list) return null;
              return (
                <Link
                  key={cat.slug}
                  href={`/best/${list.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  {cat.icon} {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Popular Comparisons
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

      {/* Best Lists */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Best Tool Rankings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestLists.map((list) => (
              <Link
                key={list.slug}
                href={`/best/${list.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {list.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {list.metaDescription}
                </p>
                <span className="text-sm text-blue-600 mt-3 inline-block">
                  See rankings →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guides */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Buying Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Top Rated Tools */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Top Rated Tools
          </h2>
          <div className="space-y-4">
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How We Review Tools
        </h2>
        <div className="text-gray-600 space-y-4">
          <p>
            At ToolScout, we test every tool ourselves before recommending it.
            Our comparison methodology evaluates pricing, features, ease of use,
            output quality, and value for money. We update our reviews regularly
            to reflect the latest changes in pricing and features.
          </p>
          <p>
            Our goal is to help you make informed decisions without spending
            hours researching. Whether you need web hosting, a VPN, AI writing
            tools, SEO software, or email marketing platforms, our side-by-side
            comparisons cut through the marketing hype to show you what actually
            matters.
          </p>
        </div>
      </section>
    </div>
  );
}
