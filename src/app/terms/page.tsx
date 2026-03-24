import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ToolScout",
  description:
    "Read the Terms of Service for ToolScout. Understand the conditions for using our site, affiliate disclosures, and limitations of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: March 24, 2026
      </p>

      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-gray-600">
          By accessing and using toolscout.ca (&quot;ToolScout,&quot;
          &quot;the Site&quot;), you agree to be bound by these Terms of
          Service. If you do not agree with any part of these terms, please do
          not use the Site.
        </p>

        {/* Use of Site */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            1. Use of the Site
          </h2>
          <p className="text-gray-600 mb-3">
            ToolScout provides informational content, including tool reviews,
            comparisons, buying guides, and rankings. This content is intended
            for general informational purposes only and should not be construed
            as professional advice.
          </p>
          <p className="text-gray-600">
            You agree to use the Site only for lawful purposes and in a manner
            that does not infringe upon the rights of others or restrict their
            use of the Site. You may not use the Site to distribute malware,
            scrape content without permission, or engage in any activity that
            disrupts the Site&apos;s operation.
          </p>
        </section>

        {/* Affiliate Links */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            2. Affiliate Links and Compensation
          </h2>
          <p className="text-gray-600 mb-3">
            ToolScout contains affiliate links to third-party products and
            services. When you click on an affiliate link and make a purchase,
            we may earn a commission at no additional cost to you.
          </p>
          <p className="text-gray-600 mb-3">
            While affiliate relationships help fund the operation of this site,
            they do not influence our editorial content. Our reviews, ratings,
            and recommendations are based on independent evaluation. We strive
            to provide honest, unbiased information regardless of affiliate
            partnerships.
          </p>
          <p className="text-gray-600">
            We are not responsible for the products, services, or practices of
            any third-party company linked from our Site. Any transactions you
            enter into with third parties are solely between you and that
            third party.
          </p>
        </section>

        {/* No Warranty */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            3. No Warranty
          </h2>
          <p className="text-gray-600 mb-3">
            The content on ToolScout is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied. We make no representations or warranties regarding the
            accuracy, completeness, reliability, or timeliness of the content
            on the Site.
          </p>
          <p className="text-gray-600">
            Tool features, pricing, and availability are subject to change by
            their respective providers. While we make every effort to keep our
            content up to date, we cannot guarantee that all information
            reflects the most current state of any product or service reviewed.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-3">
            To the fullest extent permitted by applicable law, ToolScout, its
            owners, contributors, and affiliates shall not be liable for any
            direct, indirect, incidental, consequential, or punitive damages
            arising from:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Your use of or inability to use the Site.</li>
            <li>
              Any decisions made or actions taken based on content found on the
              Site.
            </li>
            <li>
              Any products or services purchased through affiliate links on
              the Site.
            </li>
            <li>
              Unauthorized access to or alteration of your transmissions or
              data.
            </li>
            <li>
              Any errors, inaccuracies, or omissions in the Site&apos;s
              content.
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            5. Intellectual Property
          </h2>
          <p className="text-gray-600 mb-3">
            All original content on ToolScout, including text, graphics,
            logos, and the overall design of the Site, is the property of
            ToolScout and is protected by copyright and intellectual property
            laws.
          </p>
          <p className="text-gray-600 mb-3">
            You may not reproduce, distribute, modify, or create derivative
            works from any content on this Site without our prior written
            consent. Brief quotations for the purpose of reviews or commentary
            are permitted with proper attribution and a link back to the
            original content.
          </p>
          <p className="text-gray-600">
            All third-party trademarks, logos, and product names referenced on
            ToolScout are the property of their respective owners. Their use on
            this Site is for identification and informational purposes only and
            does not imply endorsement.
          </p>
        </section>

        {/* External Links */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            6. External Links
          </h2>
          <p className="text-gray-600">
            ToolScout contains links to external websites not operated by us.
            We have no control over the content, privacy policies, or practices
            of these third-party sites and accept no responsibility for them.
            We recommend reviewing the terms and policies of any external site
            you visit.
          </p>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            7. Modifications to These Terms
          </h2>
          <p className="text-gray-600">
            We reserve the right to update or modify these Terms of Service at
            any time without prior notice. Changes take effect immediately upon
            being posted to the Site. Your continued use of ToolScout after any
            modifications constitutes acceptance of the revised terms. We
            encourage you to review this page periodically.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            8. Governing Law
          </h2>
          <p className="text-gray-600">
            These Terms of Service are governed by and construed in accordance
            with the laws of Canada. Any disputes arising from the use of this
            Site shall be subject to the exclusive jurisdiction of the courts
            of Canada.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            9. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have questions about these Terms of Service, please contact
            us at legal@toolscout.ca.
          </p>
        </section>
      </div>
    </div>
  );
}
