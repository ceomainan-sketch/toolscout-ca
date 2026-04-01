import { Comparison } from "@/lib/types";
import { getTool } from "@/lib/data";

export default function ComparisonTable({
  comparison,
}: {
  comparison: Comparison;
}) {
  const tool1 = getTool(comparison.tool1Slug);
  const tool2 = getTool(comparison.tool2Slug);

  if (!tool1 || !tool2) return null;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 border border-gray-200 font-semibold text-gray-700 w-1/3">
                Feature
              </th>
              <th className="text-left p-4 border border-gray-200 font-semibold text-gray-900 w-1/3">
                <span role="img" aria-label={`${tool1.name} logo`}>{tool1.logo}</span> {tool1.name}
              </th>
              <th className="text-left p-4 border border-gray-200 font-semibold text-gray-900 w-1/3">
                <span role="img" aria-label={`${tool2.name} logo`}>{tool2.logo}</span> {tool2.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.featureComparisons.map((fc) => (
              <tr key={fc.feature} className="hover:bg-gray-50">
                <td className="p-4 border border-gray-200 font-medium text-gray-700">
                  {fc.feature}
                </td>
                <td
                  className={`p-4 border border-gray-200 ${fc.winner === comparison.tool1Slug ? "bg-green-50 font-medium text-green-800" : fc.winner === "tie" ? "bg-yellow-50 text-gray-700" : "text-gray-600"}`}
                >
                  {fc.tool1Value}
                  {fc.winner === comparison.tool1Slug && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                  {fc.winner === "tie" && (
                    <span className="ml-2 text-yellow-600">⚖</span>
                  )}
                </td>
                <td
                  className={`p-4 border border-gray-200 ${fc.winner === comparison.tool2Slug ? "bg-green-50 font-medium text-green-800" : fc.winner === "tie" ? "bg-yellow-50 text-gray-700" : "text-gray-600"}`}
                >
                  {fc.tool2Value}
                  {fc.winner === comparison.tool2Slug && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                  {fc.winner === "tie" && (
                    <span className="ml-2 text-yellow-600">⚖</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {comparison.featureComparisons.map((fc) => {
          const winnerTool =
            fc.winner === comparison.tool1Slug
              ? tool1
              : fc.winner === comparison.tool2Slug
                ? tool2
                : null;

          return (
            <div
              key={fc.feature}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                {fc.feature}
              </h3>
              <div className="space-y-2">
                <div
                  className={`flex items-start justify-between p-2 rounded ${fc.winner === comparison.tool1Slug ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <span className="font-medium text-gray-800 text-sm">
                    <span role="img" aria-label={`${tool1.name} logo`}>{tool1.logo}</span> {tool1.name}
                  </span>
                  <span
                    className={`text-sm text-right ml-2 ${fc.winner === comparison.tool1Slug ? "text-green-800 font-medium" : "text-gray-600"}`}
                  >
                    {fc.tool1Value}
                    {fc.winner === comparison.tool1Slug && (
                      <span className="ml-1 text-green-600">✓</span>
                    )}
                  </span>
                </div>
                <div
                  className={`flex items-start justify-between p-2 rounded ${fc.winner === comparison.tool2Slug ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <span className="font-medium text-gray-800 text-sm">
                    <span role="img" aria-label={`${tool2.name} logo`}>{tool2.logo}</span> {tool2.name}
                  </span>
                  <span
                    className={`text-sm text-right ml-2 ${fc.winner === comparison.tool2Slug ? "text-green-800 font-medium" : "text-gray-600"}`}
                  >
                    {fc.tool2Value}
                    {fc.winner === comparison.tool2Slug && (
                      <span className="ml-1 text-green-600">✓</span>
                    )}
                  </span>
                </div>
              </div>
              {winnerTool ? (
                <p className="mt-2 text-xs text-green-700 font-medium">
                  Winner: {winnerTool.name}
                </p>
              ) : fc.winner === "tie" ? (
                <p className="mt-2 text-xs text-yellow-700 font-medium">
                  Tie
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
