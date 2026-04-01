import { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { bestLists } from "@/data/best-lists";
import { guides } from "@/data/guides";
import { alternatives } from "@/data/alternatives";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Admin Dashboard | ToolScout",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const toolsWithoutAffiliate = tools.filter((t) => !t.affiliateUrl);
  const toolsWithAffiliate = tools.filter((t) => t.affiliateUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Overview of your site content and affiliate link status.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">{tools.length}</div>
          <div className="text-sm text-gray-500">Tools</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">
            {comparisons.length}
          </div>
          <div className="text-sm text-gray-500">Comparisons</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">
            {bestLists.length}
          </div>
          <div className="text-sm text-gray-500">Best Lists</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">
            {guides.length}
          </div>
          <div className="text-sm text-gray-500">Guides</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">
            {alternatives.length}
          </div>
          <div className="text-sm text-gray-500">Alternative Pages</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-gray-900">
            {categories.length}
          </div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">
            {tools.length + comparisons.length + bestLists.length + guides.length + alternatives.length + categories.length + 4}
          </div>
          <div className="text-sm text-gray-500">Total Pages</div>
        </div>
      </div>

      {/* Data Quality Checks */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Data Quality Checks
        </h2>
        <div className="space-y-4">
          {(() => {
            const toolSlugs = new Set(tools.map((t) => t.slug));
            const catSlugs = new Set(categories.map((c) => c.slug));

            const shortDescTools = tools.filter((t) => t.longDescription.length < 100);
            const lowFeatureTools = tools.filter((t) => Object.keys(t.features).length < 3);
            const fewProsTools = tools.filter((t) => t.pros.length < 3 || t.cons.length < 2);
            const noWebsiteTools = tools.filter((t) => !t.website);

            // Non-kebab-case slugs
            const nonKebabSlugs = tools.filter((t) => t.slug !== t.slug.toLowerCase() || /[^a-z0-9-]/.test(t.slug));

            // Unknown categories in tools
            const unknownCats = [...new Set(tools.map((t) => t.category).filter((c) => !catSlugs.has(c)))];

            // Broken tool references in comparisons
            const brokenCompRefs = comparisons.filter((c) => !toolSlugs.has(c.tool1Slug) || !toolSlugs.has(c.tool2Slug));

            // Broken tool references in best lists
            const brokenBestRefs: string[] = [];
            bestLists.forEach((b) => b.toolSlugs.forEach((s) => { if (!toolSlugs.has(s)) brokenBestRefs.push(`${b.slug}: ${s}`); }));

            // Broken tool references in alternatives
            const brokenAltRefs: string[] = [];
            alternatives.forEach((a) => {
              if (!toolSlugs.has(a.toolSlug)) brokenAltRefs.push(`${a.slug}: main=${a.toolSlug}`);
              a.alternativeSlugs.forEach((s) => { if (!toolSlugs.has(s)) brokenAltRefs.push(`${a.slug}: alt=${s}`); });
            });

            // Broken tool references in guides
            const brokenGuideRefs: string[] = [];
            guides.forEach((g) => {
              g.recommendedToolSlugs.forEach((s) => { if (!toolSlugs.has(s)) brokenGuideRefs.push(`${g.slug}: ${s}`); });
              g.sections.forEach((sec) => { if (sec.toolSlug && !toolSlugs.has(sec.toolSlug)) brokenGuideRefs.push(`${g.slug}: section=${sec.toolSlug}`); });
            });

            // Tools missing from any comparison
            const comparedSlugs = new Set(comparisons.flatMap((c) => [c.tool1Slug, c.tool2Slug]));
            const neverCompared = tools.filter((t) => !comparedSlugs.has(t.slug));

            // Tools missing from any best list
            const bestListSlugs = new Set(bestLists.flatMap((b) => b.toolSlugs));
            const neverInBestList = tools.filter((t) => !bestListSlugs.has(t.slug));

            const issues = [
              ...brokenCompRefs.length > 0 ? [{
                severity: "error" as const,
                title: `Broken Comparison References (${brokenCompRefs.length})`,
                detail: `These comparisons reference non-existent tools: ${brokenCompRefs.map((c) => `${c.slug} (${c.tool1Slug}/${c.tool2Slug})`).join(", ")}`,
              }] : [],
              ...brokenBestRefs.length > 0 ? [{
                severity: "error" as const,
                title: `Broken Best List References (${brokenBestRefs.length})`,
                detail: `These best lists reference non-existent tools: ${brokenBestRefs.join(", ")}`,
              }] : [],
              ...brokenAltRefs.length > 0 ? [{
                severity: "error" as const,
                title: `Broken Alternative References (${brokenAltRefs.length})`,
                detail: `These alternative pages reference non-existent tools: ${brokenAltRefs.join(", ")}`,
              }] : [],
              ...brokenGuideRefs.length > 0 ? [{
                severity: "error" as const,
                title: `Broken Guide References (${brokenGuideRefs.length})`,
                detail: `These guides reference non-existent tools: ${brokenGuideRefs.join(", ")}`,
              }] : [],
              ...noWebsiteTools.length > 0 ? [{
                severity: "error" as const,
                title: `Missing Website (${noWebsiteTools.length})`,
                detail: `These tools have no website URL: ${noWebsiteTools.map((t) => t.name).join(", ")}`,
              }] : [],
              ...nonKebabSlugs.length > 0 ? [{
                severity: "warning" as const,
                title: `Non-Kebab-Case Slugs (${nonKebabSlugs.length})`,
                detail: `These tool slugs are not lowercase kebab-case: ${nonKebabSlugs.map((t) => t.slug).join(", ")}`,
              }] : [],
              ...unknownCats.length > 0 ? [{
                severity: "warning" as const,
                title: `Unknown Categories (${unknownCats.length})`,
                detail: `These categories are used in tools but not defined in categories.ts: ${unknownCats.join(", ")}`,
              }] : [],
              ...shortDescTools.length > 0 ? [{
                severity: "warning" as const,
                title: `Short Descriptions (${shortDescTools.length})`,
                detail: `These tools have longDescription under 100 chars: ${shortDescTools.map((t) => t.name).join(", ")}`,
              }] : [],
              ...lowFeatureTools.length > 0 ? [{
                severity: "warning" as const,
                title: `Few Features Listed (${lowFeatureTools.length})`,
                detail: `These tools have fewer than 3 features: ${lowFeatureTools.map((t) => t.name).join(", ")}`,
              }] : [],
              ...fewProsTools.length > 0 ? [{
                severity: "info" as const,
                title: `Thin Pros/Cons (${fewProsTools.length})`,
                detail: `These tools need more pros (min 3) or cons (min 2): ${fewProsTools.map((t) => t.name).join(", ")}`,
              }] : [],
              ...neverCompared.length > 0 ? [{
                severity: "info" as const,
                title: `Never Compared (${neverCompared.length})`,
                detail: `These tools appear in no comparisons: ${neverCompared.map((t) => t.name).join(", ")}`,
              }] : [],
              ...neverInBestList.length > 0 ? [{
                severity: "info" as const,
                title: `Not in Any Best List (${neverInBestList.length})`,
                detail: `These tools don't appear in any best list: ${neverInBestList.map((t) => t.name).join(", ")}`,
              }] : [],
            ];

            if (issues.length === 0) {
              return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">All data quality checks passed.</p>
                </div>
              );
            }

            const severityStyles = {
              error: "bg-red-50 border-red-200 text-red-800",
              warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
              info: "bg-blue-50 border-blue-200 text-blue-800",
            };

            return issues.map((issue) => (
              <div key={issue.title} className={`border rounded-lg p-4 ${severityStyles[issue.severity]}`}>
                <h3 className="font-semibold mb-1">{issue.title}</h3>
                <p className="text-sm">{issue.detail}</p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Affiliate Status */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Affiliate Link Status
        </h2>
        {toolsWithoutAffiliate.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Missing Affiliate Links ({toolsWithoutAffiliate.length})
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              These tools don&apos;t have affiliate links yet. Add them in{" "}
              <code className="bg-yellow-100 px-1 rounded">
                src/data/tools.ts
              </code>{" "}
              to start earning commissions.
            </p>
            <ul className="space-y-1">
              {toolsWithoutAffiliate.map((t) => (
                <li
                  key={t.slug}
                  className="text-sm text-yellow-800 flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span className="font-medium">{t.name}</span>
                  <span className="text-yellow-600">— {t.website}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {toolsWithAffiliate.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              Active Affiliate Links ({toolsWithAffiliate.length})
            </h3>
            <ul className="space-y-1">
              {toolsWithAffiliate.map((t) => (
                <li key={t.slug} className="text-sm text-green-800">
                  ✅ {t.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* All Tools */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border border-gray-200">Tool</th>
                <th className="text-left p-3 border border-gray-200">
                  Category
                </th>
                <th className="text-left p-3 border border-gray-200">
                  Rating
                </th>
                <th className="text-left p-3 border border-gray-200">
                  Pricing
                </th>
                <th className="text-left p-3 border border-gray-200">
                  Affiliate
                </th>
                <th className="text-left p-3 border border-gray-200">Page</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.slug} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">
                    {tool.logo} {tool.name}
                  </td>
                  <td className="p-3 border border-gray-200 text-gray-600">
                    {tool.category}
                  </td>
                  <td className="p-3 border border-gray-200">{tool.rating}</td>
                  <td className="p-3 border border-gray-200">{tool.pricing}</td>
                  <td className="p-3 border border-gray-200">
                    {tool.affiliateUrl ? "✅" : "❌"}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <Link
                      href={`/tool/${tool.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Comparisons */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Comparisons
        </h2>
        <div className="space-y-2">
          {comparisons.map((comp) => (
            <div
              key={comp.slug}
              className="flex items-center justify-between border border-gray-200 rounded p-3"
            >
              <span className="font-medium text-gray-900">{comp.title}</span>
              <Link
                href={`/compare/${comp.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Program Signup Links */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Affiliate Program Signup Links
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Apply to these affiliate programs to get your tracking links, then update <code className="bg-gray-100 px-1 rounded">src/data/tools.ts</code>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: "Hostinger", program: "Impact", url: "https://www.hostinger.com/affiliates", commission: "60% per sale" },
            { name: "SiteGround", program: "Direct", url: "https://www.siteground.com/affiliates", commission: "$50-$100 per sale" },
            { name: "NordVPN", program: "Direct / CJ", url: "https://nordvpn.com/affiliate/", commission: "40-100% per sale" },
            { name: "Surfshark", program: "Direct", url: "https://surfshark.com/affiliate", commission: "40% per sale" },
            { name: "ExpressVPN", program: "Direct / CJ", url: "https://www.expressvpn.com/affiliate", commission: "$13-$36 per sale" },
            { name: "Semrush", program: "Impact", url: "https://www.semrush.com/kb/7-berush-affiliate-program/", commission: "$200 per sale / $10 per trial" },
            { name: "Ahrefs", program: "Direct", url: "https://ahrefs.com/affiliates", commission: "Up to 20% recurring" },
            { name: "ConvertKit", program: "Direct", url: "https://convertkit.com/affiliates", commission: "30% recurring" },
            { name: "Mailchimp", program: "Impact", url: "https://mailchimp.com/referral-program/", commission: "$300 per paid referral" },
            { name: "Wix", program: "Direct", url: "https://www.wix.com/about/affiliates", commission: "$100 per premium sale" },
            { name: "Squarespace", program: "Impact", url: "https://www.squarespace.com/affiliates", commission: "$100-$200 per sale" },
            { name: "Shopify", program: "Impact", url: "https://www.shopify.com/affiliates", commission: "$150 per referral" },
            { name: "Kajabi", program: "Direct", url: "https://kajabi.com/partners", commission: "30% recurring" },
            { name: "Teachable", program: "Direct", url: "https://teachable.com/affiliates", commission: "30% recurring" },
            { name: "Jasper", program: "Direct", url: "https://www.jasper.ai/partners", commission: "30% recurring" },
            { name: "Surfer SEO", program: "Direct", url: "https://surferseo.com/affiliate", commission: "25% recurring" },
            { name: "Cloudways", program: "Direct", url: "https://www.cloudways.com/en/web-hosting-affiliate.php", commission: "$50-$125 per sale" },
            { name: "ActiveCampaign", program: "Direct", url: "https://www.activecampaign.com/partner/affiliate", commission: "20-30% recurring" },
            { name: "Mangools", program: "Direct", url: "https://mangools.com/affiliates", commission: "30% recurring" },
            { name: "Canva", program: "Impact", url: "https://www.canva.com/affiliates/", commission: "Up to $36 per sale" },
            { name: "Hootsuite", program: "Impact", url: "https://www.hootsuite.com/partners", commission: "15% recurring" },
            { name: "Buffer", program: "Direct", url: "https://buffer.com/affiliates", commission: "20% recurring" },
            { name: "Sprout Social", program: "Direct", url: "https://sproutsocial.com/agency-partner-program/", commission: "20% per sale" },
            { name: "Later", program: "Direct", url: "https://later.com/affiliate-program/", commission: "20% recurring" },
            { name: "HubSpot", program: "Direct", url: "https://www.hubspot.com/partners/affiliates", commission: "$250-$1,000 per sale" },
            { name: "Pipedrive", program: "Direct", url: "https://www.pipedrive.com/en/affiliates", commission: "33% recurring" },
            { name: "Zoho CRM", program: "Direct", url: "https://www.zoho.com/affiliate.html", commission: "15% recurring" },
            { name: "Freshsales", program: "Direct", url: "https://www.freshworks.com/partners/", commission: "Up to 20% recurring" },
            { name: "Notion", program: "Direct", url: "https://www.notion.so/affiliates", commission: "50% of first year" },
            { name: "ClickUp", program: "PartnerStack", url: "https://clickup.com/partners/affiliates", commission: "20% recurring" },
            { name: "Asana", program: "Impact", url: "https://asana.com/partners", commission: "$8-$20 per sale" },
            { name: "monday.com", program: "Impact", url: "https://monday.com/p/affiliate", commission: "Up to $100 per sale" },
            { name: "Webflow", program: "Direct", url: "https://webflow.com/affiliate", commission: "50% for 12 months" },
            { name: "Framer", program: "Direct", url: "https://www.framer.com/partners/", commission: "50% for 12 months" },
            { name: "Bluehost", program: "Direct", url: "https://www.bluehost.com/affiliates", commission: "$65+ per sale" },
            { name: "WP Engine", program: "ShareASale", url: "https://wpengine.com/partners/", commission: "$200+ per sale" },
            { name: "DreamHost", program: "Direct", url: "https://www.dreamhost.com/affiliates/", commission: "$15-$200 per sale" },
            { name: "GoDaddy", program: "CJ", url: "https://www.godaddy.com/affiliate-programs", commission: "Up to 15% per sale" },
            { name: "A2 Hosting", program: "Direct", url: "https://www.a2hosting.com/affiliates", commission: "$55-$125 per sale" },
            { name: "NordPass", program: "Direct", url: "https://nordpass.com/affiliate/", commission: "40% per sale" },
            { name: "1Password", program: "CJ / Impact", url: "https://1password.com/affiliates/", commission: "25% per sale" },
            { name: "Dashlane", program: "Impact", url: "https://www.dashlane.com/affiliates", commission: "Up to $8 per sale" },
            { name: "Grammarly", program: "ShareASale", url: "https://www.grammarly.com/affiliates", commission: "$0.20/free + $20/paid" },
            { name: "Copy.ai", program: "PartnerStack", url: "https://www.copy.ai/affiliates", commission: "30% recurring" },
            { name: "Writesonic", program: "Direct", url: "https://writesonic.com/affiliate", commission: "30% recurring" },
            { name: "beehiiv", program: "Direct", url: "https://www.beehiiv.com/refer", commission: "20% recurring" },
            { name: "Brevo", program: "Direct", url: "https://www.brevo.com/affiliates/", commission: "5€ per free account, €100 per paid" },
            { name: "AWeber", program: "Direct", url: "https://www.aweber.com/affiliates.htm", commission: "30% recurring" },
            { name: "Synthesia", program: "Direct", url: "https://www.synthesia.io/affiliate-program", commission: "25% recurring" },
            { name: "Descript", program: "Direct", url: "https://www.descript.com/affiliates", commission: "15-25% recurring" },
            { name: "Clearscope", program: "Direct", url: "https://www.clearscope.io/partners", commission: "20% recurring" },
            { name: "Frase", program: "Direct", url: "https://www.frase.io/affiliate", commission: "30% recurring" },
            { name: "SE Ranking", program: "Direct", url: "https://seranking.com/affiliate.html", commission: "30% recurring" },
            { name: "Moz", program: "Direct", url: "https://moz.com/partners/affiliate", commission: "20% recurring" },
            { name: "Thinkific", program: "PartnerStack", url: "https://www.thinkific.com/partners/", commission: "30% recurring" },
            { name: "Podia", program: "Direct", url: "https://www.podia.com/affiliates", commission: "30% recurring" },
            { name: "Skool", program: "Direct", url: "https://www.skool.com/affiliates", commission: "40% recurring" },
            { name: "pCloud", program: "Direct", url: "https://www.pcloud.com/affiliate-program.html", commission: "Up to 50% per sale" },
            { name: "IDrive", program: "Direct", url: "https://www.idrive.com/partner", commission: "Up to 50% per sale" },
            { name: "QuickBooks", program: "CJ / Impact", url: "https://quickbooks.intuit.com/partners/affiliates/", commission: "Up to 15% per sale" },
            { name: "FreshBooks", program: "ShareASale", url: "https://www.freshbooks.com/affiliate-program", commission: "$10 per trial, $200 per paid" },
            { name: "Xero", program: "Direct", url: "https://www.xero.com/partners/", commission: "Up to $150 per sale" },
            { name: "Bitdefender", program: "Direct / CJ", url: "https://www.bitdefender.com/partners/affiliates/", commission: "Up to 40% per sale" },
            { name: "Norton", program: "CJ", url: "https://www.nortonlifelock.com/affiliates", commission: "Up to $40 per sale" },
            { name: "CyberGhost", program: "Direct", url: "https://www.cyberghostvpn.com/en_US/affiliates", commission: "Up to 100% per sale" },
            { name: "ProtonVPN", program: "Direct", url: "https://proton.me/partners/affiliate", commission: "Up to 30% per sale" },
            { name: "Dropbox", program: "Impact", url: "https://www.dropbox.com/business/partnerships", commission: "Up to $100 per sale" },
            { name: "SocialBee", program: "PartnerStack", url: "https://socialbee.com/affiliate/", commission: "20% recurring" },
            { name: "Apollo.io", program: "PartnerStack", url: "https://www.apollo.io/partners", commission: "20% recurring" },
            { name: "Close CRM", program: "PartnerStack", url: "https://www.close.com/partners", commission: "20% recurring" },
            { name: "Instantly", program: "Direct", url: "https://instantly.ai/affiliate", commission: "30% recurring" },
            { name: "Linear", program: "Direct", url: "https://linear.app/partners", commission: "20% recurring" },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between border border-gray-200 rounded p-3 bg-white">
              <div>
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-xs text-gray-500 ml-2">({p.program})</span>
                <span className="text-xs text-green-600 ml-2">{p.commission}</span>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline shrink-0"
              >
                Apply &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          How to Add Content
        </h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-1">Add a new tool:</h3>
            <p>
              Edit{" "}
              <code className="bg-gray-200 px-1 rounded">
                src/data/tools.ts
              </code>{" "}
              and add a new Tool object to the array. A page will be
              auto-generated at <code>/tool/[slug]</code>.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Add a new comparison:</h3>
            <p>
              Edit{" "}
              <code className="bg-gray-200 px-1 rounded">
                src/data/comparisons.ts
              </code>{" "}
              and add a Comparison object. A page will be auto-generated at{" "}
              <code>/compare/[slug]</code>.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Add a best list:</h3>
            <p>
              Edit{" "}
              <code className="bg-gray-200 px-1 rounded">
                src/data/best-lists.ts
              </code>{" "}
              and add a BestList object. A page will be auto-generated at{" "}
              <code>/best/[slug]</code>.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Add affiliate links:</h3>
            <p>
              Update the <code>affiliateUrl</code> field in each tool&apos;s
              data in{" "}
              <code className="bg-gray-200 px-1 rounded">
                src/data/tools.ts
              </code>
              . Use your affiliate tracking URL from Impact, PartnerStack, or
              the brand&apos;s direct program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
