import { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "About ToolScout | How We Review and Compare Tools",
  description:
    "Learn about ToolScout's mission, methodology, and commitment to honest, independent tool reviews. Hands-on testing across AI tools, web hosting, VPNs, SEO, and more.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const toolCount = tools.length;
  const comparisonCount = comparisons.length;
  const guideCount = guides.length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Honest Tool Reviews You Can Trust
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ToolScout helps you cut through the noise and find the right tools
            for your business — without the marketing hype.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: `${toolCount}+`, label: "Tools Reviewed" },
            { stat: `${comparisonCount}+`, label: "Comparisons" },
            { stat: `${guideCount}+`, label: "Buying Guides" },
            { stat: "0", label: "Sponsored Rankings" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="text-2xl font-bold text-blue-600">
                {item.stat}
              </div>
              <div className="text-sm text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Choosing the right software should not require hours of research,
              trial-and-error sign-ups, or trusting reviews that are secretly
              pay-to-play. ToolScout exists to solve that problem.
            </p>
            <p>
              We build detailed, side-by-side comparisons of the tools that
              matter most to businesses, freelancers, and creators. Whether
              you are looking for an AI writing assistant, a web host, a VPN,
              or SEO software, our goal is the same: give you the information
              you need to make a confident decision in minutes, not days.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Review Tools
          </h2>
          <div className="text-gray-600 space-y-4 mb-6">
            <p>
              Every review on ToolScout follows a consistent, transparent
              methodology. We do not copy specs from marketing pages — we test
              tools ourselves and evaluate what actually matters to users.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Hands-On Testing",
                desc: "We sign up, use the product, and push its features. Our reviews reflect real experience, not press releases.",
              },
              {
                title: "Real Comparisons",
                desc: "We compare tools head-to-head on pricing, features, ease of use, output quality, and value for money.",
              },
              {
                title: "Regular Updates",
                desc: "Tools change fast. We revisit our reviews and comparisons regularly to ensure pricing and features stay accurate.",
              },
              {
                title: "Clear Ratings",
                desc: "Our rating system is consistent across all tools. Every score is based on the same criteria so you can compare fairly.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-lg p-5 bg-white"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Independence */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Editorial Independence
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Trust is everything in reviews. Here is how we protect ours:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>No sponsored rankings.</strong> Companies cannot pay to
                rank higher on ToolScout. Our rankings are based on merit.
              </li>
              <li>
                <strong>Affiliate links are disclosed.</strong> Some links on
                ToolScout are affiliate links, meaning we may earn a commission
                if you make a purchase. This never affects our ratings or
                recommendations.
              </li>
              <li>
                <strong>We include free alternatives.</strong> If a free tool
                genuinely does the job, we will recommend it — even if it does
                not earn us a commission.
              </li>
              <li>
                <strong>Negative reviews exist.</strong> If a tool has serious
                flaws, we say so. Our credibility depends on honesty, not on
                keeping every vendor happy.
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ready to Find the Right Tool?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Browse our comparisons, read our guides, and make a decision you
            feel good about.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#comparisons"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Comparisons
            </Link>
            <Link
              href="/guide/best-ai-writing-tool-for-bloggers"
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
            >
              Read Our Guides
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
