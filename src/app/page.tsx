import Link from "next/link";
import { getAllComparisons, getAllBestLists, getAllCategories, getAllGuides, getAllAlternatives, getTool } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import StarRating from "@/components/StarRating";
import FeaturedDeals from "@/components/FeaturedDeals";
import { tools } from "@/data/tools";
import { safeJsonLd, cleanDisplayTitle } from "@/lib/utils";

export default function Home() {
  const categories = getAllCategories();
  const comparisons = getAllComparisons();
  const bestLists = getAllBestLists();
  const guides = getAllGuides();
  const alternatives = getAllAlternatives();
  const featuredTools = tools.filter((t) => t.rating >= 4.5);

  // Top picks by category: get the #1 ranked tool from each major category via best lists
  const topPickCategories = [
    { categorySlug: "web-hosting", bestListSlug: "best-web-hosting", label: "Web Hosting" },
    { categorySlug: "vpn", bestListSlug: "best-vpn-services", label: "VPN" },
    { categorySlug: "seo-tools", bestListSlug: "best-seo-tools", label: "SEO" },
    { categorySlug: "email-marketing", bestListSlug: "best-email-marketing-platforms", label: "Email Marketing" },
    { categorySlug: "ai-writing", bestListSlug: "best-ai-writing-tools", label: "AI Writing" },
  ];

  const topPicks = topPickCategories.map((cat) => {
    const list = bestLists.find((b) => b.slug === cat.bestListSlug);
    const topToolSlug = list?.toolSlugs[0];
    const tool = topToolSlug ? getTool(topToolSlug) : undefined;
    return { ...cat, tool, bestList: list };
  }).filter((p) => p.tool);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToolScout",
    url: "https://toolscout.ca",
    description: "Honest, side-by-side comparisons of the top AI tools, web hosting, VPNs, SEO software, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://toolscout.ca/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolScout",
    url: "https://toolscout.ca",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find the Best Tools for Your Business
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Honest, side-by-side comparisons of the top AI tools, web hosting,
            VPNs, SEO software, and more. Updated for {new Date().getFullYear()}.
          </p>

          {/* Hero CTA */}
          <Link
            href="/compare/chatgpt-vs-claude"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl mb-10"
          >
            Find Your Perfect Tool &rarr;
          </Link>

          {/* Trust Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 py-4 px-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{tools.length}+</div>
              <div className="text-sm text-gray-500">Tools Reviewed</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 py-4 px-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{comparisons.length}+</div>
              <div className="text-sm text-gray-500">Comparisons</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 py-4 px-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 py-4 px-3 text-center">
              <div className="text-2xl font-bold text-blue-600">Weekly</div>
              <div className="text-sm text-gray-500">Updated</div>
            </div>
          </div>

          {/* Additional trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">&#10003;</span> Independent Reviews
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">&#10003;</span> No Sponsored Rankings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">&#10003;</span> Hands-On Testing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">&#10003;</span> Transparent Methodology
            </span>
          </div>
        </div>
      </section>

      {/* Featured Deals - Highest revenue affiliate links */}
      <FeaturedDeals />

      {/* Browse by Category - Full Visual Grid */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-600 mb-8">
          Explore {categories.length} categories covering everything from AI tools to web hosting and design software.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all bg-white group text-center"
            >
              <div className="text-3xl mb-3" role="img" aria-label={cat.name}>{cat.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Picks by Category */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Top Picks by Category
          </h2>
          <p className="text-gray-600 mb-8">
            Our #1 ranked tool in each major category, based on hands-on testing and analysis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPicks.map((pick) => {
              const tool = pick.tool!;
              return (
                <div
                  key={pick.categorySlug}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Best {pick.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 mb-2">
                    <span className="text-3xl" role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span>
                    <div>
                      <Link
                        href={`/tool/${tool.slug}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>
                      <div className="text-sm text-gray-500">{tool.pricing}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <StarRating rating={tool.rating} />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.pros.slice(0, 2).map((pro) => (
                      <span
                        key={pro}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                      >
                        &#10003; {pro}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/tool/${tool.slug}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Full review &rarr;
                    </Link>
                    {tool.affiliateUrl && (
                      <a
                        href={tool.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors"
                      >
                        Try {tool.name} &rarr;
                      </a>
                    )}
                    {pick.bestList && (
                      <Link
                        href={`/best/${pick.bestList.slug}`}
                        className="text-sm text-gray-500 hover:text-blue-600"
                      >
                        See all &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section id="comparisons" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Popular Comparisons
        </h2>
        <p className="text-gray-600 mb-8">
          Side-by-side breakdowns of {comparisons.length}+ tool matchups, covering features, pricing, and our honest verdict.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.slice(0, 12).map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                {cleanDisplayTitle(comp.title)}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {comp.metaDescription}
              </p>
              <span className="text-sm text-blue-600 mt-3 inline-block">
                Compare now &rarr;
              </span>
            </Link>
          ))}
        </div>
        {comparisons.length > 12 && (
          <div className="text-center mt-8">
            <Link
              href="/search?type=comparison"
              className="inline-block px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
            >
              View all {comparisons.length} comparisons &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Best Lists */}
      <section id="best-lists" className="bg-gray-50 py-16 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Best Tool Rankings
          </h2>
          <p className="text-gray-600 mb-8">
            Curated, ranked lists of the top tools in {bestLists.length} categories to help you find the right fit fast.
          </p>
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
                  See rankings &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guides */}
      <section id="guides" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Buying Guides
        </h2>
        <p className="text-gray-600 mb-8">
          In-depth guides to help you understand what matters before you buy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.slice(0, 12).map((guide) => (
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
                Read guide &rarr;
              </span>
            </Link>
          ))}
        </div>
        {guides.length > 12 && (
          <div className="text-center mt-8">
            <Link
              href="/search?type=guide"
              className="inline-block px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
            >
              View all {guides.length} buying guides &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Alternatives */}
      <section id="alternatives" className="bg-gray-50 py-16 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tool Alternatives
          </h2>
          <p className="text-gray-600 mb-8">
            Looking to switch? Explore the best alternatives to {alternatives.length}+ popular tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.slice(0, 12).map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {cleanDisplayTitle(alt.title)}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {alt.metaDescription}
                </p>
                <span className="text-sm text-blue-600 mt-3 inline-block">
                  See alternatives &rarr;
                </span>
              </Link>
            ))}
          </div>
          {alternatives.length > 12 && (
            <div className="text-center mt-8">
              <Link
                href="/search?type=alternative"
                className="inline-block px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
              >
                View all {alternatives.length} alternative pages &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Top Rated Tools
          </h2>
          <p className="text-gray-600 mb-8">
            Every tool that earned a 4.5/5 or higher in our hands-on testing.
          </p>
          <div className="space-y-4">
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links: All Internal Links */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Explore ToolScout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* All Best-Of Lists */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Best-Of Rankings</h3>
            <ul className="space-y-2">
              {bestLists.map((list) => (
                <li key={list.slug}>
                  <Link
                    href={`/best/${list.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {list.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Comparisons */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Top Comparisons</h3>
            <ul className="space-y-2">
              {comparisons.slice(0, 20).map((comp) => (
                <li key={comp.slug}>
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {cleanDisplayTitle(comp.title)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/search?type=comparison"
              className="text-sm text-blue-600 hover:underline font-medium mt-3 inline-block"
            >
              View all {comparisons.length} comparisons &rarr;
            </Link>
          </div>

          {/* All Categories */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">All Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEO Content Block - How We Review Tools (300+ words) */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How We Review Tools
          </h2>
          <div className="text-gray-600 space-y-4 leading-relaxed">
            <p>
              At ToolScout, every recommendation starts with hands-on testing. Our team signs up for each tool, runs it through real-world workflows, and documents results before writing a single word. We do not accept payment for placement in our rankings, and no vendor can pay to influence their score. Our revenue comes from affiliate commissions when you click through and purchase, but the rankings themselves are determined solely by our evaluation criteria.
            </p>
            <p>
              Our comparison methodology evaluates five core dimensions: pricing and value, feature depth, ease of use, output quality, and customer support. For pricing, we look beyond the starting price to examine what you actually get at each tier, renewal costs, hidden fees, and cancellation policies. For features, we test every major capability against competitors in the same category, noting which tools deliver on their promises and which fall short.
            </p>
            <p>
              Ease of use is evaluated by onboarding a new user and measuring how long it takes to complete common tasks. We pay special attention to the first-run experience because that is where most tools either win or lose customers. Output quality is assessed differently for each category. For AI writing tools, we compare generated content for accuracy, readability, and originality. For web hosting, we run uptime monitors and page speed tests over weeks, not minutes. For VPNs, we test connection speeds across multiple server locations and verify streaming access.
            </p>
            <p>
              We update our reviews regularly to reflect changes in pricing, features, and performance. When a tool launches a major update, we re-test and revise our scores. Our goal is to ensure that every comparison and ranking on ToolScout reflects the current state of the market, not a snapshot from months ago. If a tool improves significantly, its ranking goes up. If a tool raises prices or degrades service, we adjust accordingly.
            </p>
            <p>
              We also factor in the broader ecosystem around each tool: the quality of documentation, the responsiveness of customer support, the size and helpfulness of the user community, and the track record of the company behind the product. A tool with great features but poor support or a history of abrupt pricing changes will score lower than a competitor that treats customers fairly over time.
            </p>
            <p>
              Whether you are looking for the <Link href="/best/best-ai-writing-tools" className="text-blue-600 hover:underline">best AI writing tool</Link>, the <Link href="/best/best-web-hosting" className="text-blue-600 hover:underline">most reliable web host</Link>, or the <Link href="/best/best-vpn-services" className="text-blue-600 hover:underline">fastest VPN service</Link>, our side-by-side comparisons cut through the marketing hype to show you what actually matters. Browse our <Link href="/best/best-seo-tools" className="text-blue-600 hover:underline">SEO tool rankings</Link>, <Link href="/best/best-email-marketing-platforms" className="text-blue-600 hover:underline">email marketing platform reviews</Link>, and <Link href="/best/best-website-builders" className="text-blue-600 hover:underline">website builder comparisons</Link> to make an informed decision without spending hours researching.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
