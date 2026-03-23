import Link from "next/link";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { bestLists } from "@/data/best-lists";

export const metadata = {
  title: "Admin Dashboard | ToolScout",
  robots: "noindex, nofollow",
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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
          <div className="text-3xl font-bold text-blue-600">
            {tools.length + comparisons.length + bestLists.length + 1}
          </div>
          <div className="text-sm text-gray-500">Total Pages</div>
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
