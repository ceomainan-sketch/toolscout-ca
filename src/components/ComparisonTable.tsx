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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-4 border border-gray-200 font-semibold text-gray-700 w-1/3">
              Feature
            </th>
            <th className="text-left p-4 border border-gray-200 font-semibold text-gray-900 w-1/3">
              {tool1.logo} {tool1.name}
            </th>
            <th className="text-left p-4 border border-gray-200 font-semibold text-gray-900 w-1/3">
              {tool2.logo} {tool2.name}
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
                className={`p-4 border border-gray-200 ${fc.winner === comparison.tool1Slug ? "bg-green-50 font-medium text-green-800" : "text-gray-600"}`}
              >
                {fc.tool1Value}
                {fc.winner === comparison.tool1Slug && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </td>
              <td
                className={`p-4 border border-gray-200 ${fc.winner === comparison.tool2Slug ? "bg-green-50 font-medium text-green-800" : "text-gray-600"}`}
              >
                {fc.tool2Value}
                {fc.winner === comparison.tool2Slug && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
