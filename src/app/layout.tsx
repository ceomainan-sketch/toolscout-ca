import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolScout — Find the Best AI & SaaS Tools in 2026",
  description:
    "Honest, detailed comparisons of the top AI writing tools, image generators, coding assistants, and SaaS products. Updated for 2026.",
  metadataBase: new URL("https://toolscout.ca"),
  openGraph: {
    title: "ToolScout — Find the Best AI & SaaS Tools",
    description:
      "Honest comparisons of the top AI and SaaS tools. Updated for 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <meta name="impact-site-verification" content="f1148179-e40c-45d3-9afe-380b2716b7e3" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YK7C881X9X"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-YK7C881X9X');`,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6233733083149670"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
