import Link from "next/link";

const deals = [
  {
    name: "Bluehost",
    logo: "🌐",
    tagline: "WordPress Hosting #1 Pick",
    highlight: "From $2.95/mo",
    description: "Free domain, free SSL, and one-click WordPress install. Recommended by WordPress.org.",
    affiliateUrl: "https://bluehost.sjv.io/c/7111837/1376228/11352",
    badge: "Editor's Choice",
    rating: "4.3/5",
    toolSlug: "bluehost",
  },
  {
    name: "Surfshark",
    logo: "🦈",
    tagline: "Best Value VPN",
    highlight: "From $2.19/mo",
    description: "Unlimited devices, fast speeds, and strong privacy. Perfect for the whole family.",
    affiliateUrl: "https://get.surfshark.net/aff_c?offer_id=926&aff_id=45706",
    badge: "Best Value",
    rating: "4.5/5",
    toolSlug: "surfshark",
  },
];

export default function FeaturedDeals() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Today&apos;s Top Deals
          </h2>
          <span className="text-xs text-gray-400 italic">Sponsored</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.name}
              className="relative border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {deal.badge}
              </span>

              <div className="flex items-start gap-4">
                <span className="text-4xl">{deal.logo}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {deal.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {deal.tagline}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {deal.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {deal.highlight}
                    </span>
                    <span className="text-sm text-gray-500">
                      ★ {deal.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href={deal.affiliateUrl}
                      target="_blank"
                      rel="nofollow noopener"
                      className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Get This Deal &rarr;
                    </a>
                    <Link
                      href={`/tool/${deal.toolSlug}`}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Read review
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
