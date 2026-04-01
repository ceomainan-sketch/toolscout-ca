"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("ToolScout page error:", error);
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again or head back to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
