import Link from "next/link";
import { getAllCategories } from "@/lib/data";

export default function Header() {
  const categories = getAllCategories();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          🔍 ToolScout
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/best/${cat.slug === "ai-writing" ? "best-ai-writing-tools" : cat.slug === "ai-image" ? "best-ai-image-generators" : cat.slug === "ai-coding" ? "best-ai-coding-assistants" : cat.slug === "ai-chatbots" ? "best-ai-chatbots" : "best-project-management-tools"}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
