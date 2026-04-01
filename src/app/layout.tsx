import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolScout — Find the Best AI & SaaS Tools in 2026",
  description:
    "Honest, detailed comparisons of the top AI writing tools, image generators, coding assistants, and SaaS products. Updated for 2026.",
  metadataBase: new URL("https://toolscout.ca"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ToolScout — Find the Best AI & SaaS Tools",
    description:
      "Honest comparisons of the top AI and SaaS tools. Updated for 2026.",
    type: "website",
    siteName: "ToolScout",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "ToolScout" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolScout — Find the Best AI & SaaS Tools in 2026",
    description:
      "Honest, detailed comparisons of the top AI writing tools, image generators, coding assistants, and SaaS products.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "impact-site-verification": "f1148179-e40c-45d3-9afe-380b2716b7e3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-gray-900" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
