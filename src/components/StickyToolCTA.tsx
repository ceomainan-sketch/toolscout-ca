'use client'

export default function StickyToolCTA({
  toolName,
  affiliateUrl,
}: {
  toolName: string
  affiliateUrl: string
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 py-3 px-4 md:hidden">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <span className="font-semibold text-gray-900 text-sm truncate mr-3">
          {toolName}
        </span>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-semibold text-sm transition-colors shrink-0"
        >
          Try {toolName} Free
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  )
}
