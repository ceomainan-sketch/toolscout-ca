"use client";

import { useState } from "react";

export default function StickyToolCTA({
  toolName,
  affiliateUrl,
  hasFreeOption,
}: {
  toolName: string
  affiliateUrl: string
  hasFreeOption?: boolean
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 py-3 px-4 md:hidden" role="complementary" aria-label={`Try ${toolName}`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <span className="font-semibold text-gray-900 text-sm truncate mr-3">
          {toolName}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-semibold text-sm transition-colors"
          >
            {hasFreeOption ? `Try ${toolName} Free` : `Visit ${toolName}`}
            <span aria-hidden="true">&rarr;</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
