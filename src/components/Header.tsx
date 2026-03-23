import Link from "next/link";

const navLinks = [
  { label: "AI Tools", href: "/best/best-ai-writing-tools" },
  { label: "Web Hosting", href: "/best/best-web-hosting" },
  { label: "VPNs", href: "/best/best-vpn-services" },
  { label: "SEO Tools", href: "/best/best-seo-tools" },
  { label: "Email Marketing", href: "/best/best-email-marketing-platforms" },
  { label: "Website Builders", href: "/best/best-website-builders" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          🔍 ToolScout
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
