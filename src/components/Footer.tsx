import Link from "next/link";
import { getAllCategories, getAllComparisons } from "@/lib/data";

export default function Footer() {
  const categories = getAllCategories();
  const comparisons = getAllComparisons();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">ToolScout</h3>
            <p className="text-sm text-gray-600">
              Honest, detailed comparisons of the best AI and SaaS tools.
              Updated for 2026.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/best/best-${cat.slug.replace("ai-", "ai-").replace("project-management", "project-management-tools")}-tools`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">
              Popular Comparisons
            </h3>
            <ul className="space-y-2">
              {comparisons.slice(0, 5).map((comp) => (
                <li key={comp.slug}>
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {comp.slug
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} ToolScout. Some links on this site are
            affiliate links — we may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
