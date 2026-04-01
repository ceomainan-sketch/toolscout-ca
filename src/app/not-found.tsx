import Link from "next/link";
import { getAllCategories } from "@/lib/data";

export default function NotFound() {
  const categories = getAllCategories().slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-2">Page not found</p>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        The page you are looking for does not exist or may have been moved.
        Try browsing our categories or head back to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/best/best-ai-writing-tools"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
        >
          Browse AI Tools
        </Link>
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition-all bg-white text-center"
            >
              <div className="text-xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-700">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
