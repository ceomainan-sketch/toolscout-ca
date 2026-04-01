import Link from "next/link";
import { Tool } from "@/lib/types";
import StarRating from "@/components/StarRating";

export default function ToolCard({ tool, rank }: { tool: Tool; rank?: number }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-4">
        {rank != null && (
          <span className="text-2xl font-bold text-blue-600 mt-1">#{rank}</span>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" role="img" aria-label={`${tool.name} logo`}>{tool.logo}</span>
            <Link
              href={`/tool/${tool.slug}`}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              {tool.name}
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
          <div className="flex items-center gap-4 text-sm mb-3">
            <StarRating rating={tool.rating} />
            <span className="font-medium text-gray-700">{tool.pricing}</span>
          </div>

          {/* Prominent affiliate CTA */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {tool.affiliateUrl ? (
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-7 py-3 rounded-lg hover:bg-green-700 font-semibold text-base transition-colors"
                >
                  {tool.freeTrialDays > 0 || tool.pricing.toLowerCase().includes("free") ? `Try ${tool.name} Free` : `Visit ${tool.name}`}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              ) : (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 bg-gray-500 text-white px-7 py-3 rounded-lg hover:bg-gray-600 font-semibold text-base transition-colors"
                >
                  Visit Website
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
              <Link
                href={`/tool/${tool.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Read full review &rarr;
              </Link>
            </div>
            {tool.affiliateUrl && (tool.freeTrialDays > 0 || tool.pricing.toLowerCase().includes("free")) && (
              <p className="text-xs text-gray-400 mt-1.5">
                {tool.freeTrialDays > 0 ? `${tool.freeTrialDays}-day free trial available.` : "Free plan available."}
              </p>
            )}
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Pros">
            {tool.pros.slice(0, 3).map((pro) => (
              <li
                key={pro}
                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
              >
                <span aria-hidden="true">✓</span> {pro}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
