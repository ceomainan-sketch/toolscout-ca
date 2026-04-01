import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolScout",
  description:
    "Learn how ToolScout collects, uses, and protects your data. Our privacy policy covers cookies, analytics, advertising, and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: March 24, 2026
      </p>

      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-gray-600">
          ToolScout (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
          the website toolscout.ca. This Privacy Policy explains how we collect,
          use, and protect your information when you visit our site.
        </p>

        {/* Data Collection */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 mb-3">
            We do not require you to create an account or provide personal
            information to use ToolScout. However, we automatically collect
            certain information when you visit our site:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              <strong>Usage data:</strong> Pages visited, time spent on pages,
              referring URLs, and click patterns.
            </li>
            <li>
              <strong>Device information:</strong> Browser type, operating
              system, screen resolution, and device type.
            </li>
            <li>
              <strong>IP address:</strong> Collected in anonymized form for
              analytics and fraud prevention.
            </li>
            <li>
              <strong>Location data:</strong> Approximate geographic location
              based on IP address (country/region level only).
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            2. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-600 mb-3">
            ToolScout uses cookies and similar tracking technologies to improve
            your experience and analyze site traffic. The cookies we use include:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            Google Analytics
          </h3>
          <p className="text-gray-600 mb-3">
            We use Google Analytics to understand how visitors interact with our
            site. Google Analytics collects information such as how often users
            visit, which pages they view, and what other sites they visited
            before coming to ToolScout. We use this data solely to improve our
            content and user experience. Google Analytics uses cookies to collect
            this information. You can opt out by installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            Google AdSense
          </h3>
          <p className="text-gray-600 mb-3">
            We use Google AdSense to display advertisements on our site. Google
            AdSense may use cookies and web beacons to serve ads based on your
            prior visits to ToolScout or other websites. Google&apos;s use of
            advertising cookies enables it and its partners to serve ads based on
            your browsing history. You may opt out of personalized advertising by
            visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            Managing Cookies
          </h3>
          <p className="text-gray-600">
            Most web browsers allow you to control cookies through their settings.
            You can set your browser to refuse all cookies or to indicate when a
            cookie is being sent. However, some features of our site may not
            function properly if you disable cookies.
          </p>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            3. Third-Party Links
          </h2>
          <p className="text-gray-600">
            ToolScout contains links to third-party websites, including the
            tools and services we review. These external sites have their own
            privacy policies, and we are not responsible for their content or
            practices. We encourage you to review the privacy policy of any
            third-party site you visit through links on ToolScout.
          </p>
        </section>

        {/* Affiliate Disclosure */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            4. Affiliate Disclosure
          </h2>
          <p className="text-gray-600 mb-3">
            Some links on ToolScout are affiliate links. This means we may earn
            a commission if you click on a link and make a purchase, at no
            additional cost to you. Affiliate partnerships do not influence our
            reviews, ratings, or rankings. Our editorial content is independent,
            and we recommend tools based on their merit.
          </p>
          <p className="text-gray-600">
            Affiliate programs we participate in may place cookies on your
            device to track referrals. These cookies are governed by the
            respective affiliate program&apos;s privacy policy.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            5. Data Retention
          </h2>
          <p className="text-gray-600">
            Analytics data collected through Google Analytics is retained in
            accordance with Google&apos;s data retention policies. We do not
            store personal information on our own servers. Aggregated,
            non-identifiable data may be retained indefinitely to analyze
            long-term trends in site usage and improve our content.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            6. Your Rights
          </h2>
          <p className="text-gray-600 mb-3">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request deletion of your personal data.</li>
            <li>Opt out of personalized advertising and tracking.</li>
            <li>Withdraw consent for data processing.</li>
          </ul>
          <p className="text-gray-600 mt-3">
            To exercise any of these rights, please contact us at
            privacy@toolscout.ca.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-gray-600">
            ToolScout is not directed at individuals under the age of 13. We do
            not knowingly collect personal information from children. If you
            believe we have inadvertently collected information from a child,
            please contact us and we will promptly delete it.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with a revised &quot;Last updated&quot;
            date. Your continued use of ToolScout after any changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            9. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have questions about this Privacy Policy, please contact us
            at privacy@toolscout.ca.
          </p>
        </section>
      </div>
    </div>
  );
}
