import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const SITE = "https://mohitsahu-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Mohit Sahu — Software Engineer | AI & Full-Stack Developer",
  description:
    "Mohit Sahu is an Associate Software Engineer at Maventic Innovation. He builds web apps with React and Node.js, and AI tools with Python, LLMs, RAG, and agents. 435+ LeetCode problems solved.",
  keywords: ["Mohit Sahu", "Software Engineer", "AI Engineer", "Full-Stack Developer", "React", "Node.js", "RAG", "Agentic AI", "Google ADK"],
  authors: [{ name: "Mohit Sahu" }],
  openGraph: {
    title: "Mohit Sahu — Software Engineer | AI & Full-Stack Developer",
    description: "Web apps and AI tools. React · Node · MongoDB · Python · LLMs · Agents.",
    type: "profile",
    url: SITE,
    images: [{ url: "/mohit.png", alt: "Mohit Sahu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohit Sahu — Software Engineer | AI & Full-Stack Developer",
    description: "Web apps, backend systems, and AI tools.",
  },
  metadataBase: new URL(SITE),
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohit Sahu",
  jobTitle: "Associate Software Engineer",
  worksFor: { "@type": "Organization", name: "Maventic Innovation Pvt. Ltd." },
  email: "mailto:mohitsahu60067@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Bhopal", addressRegion: "Madhya Pradesh", addressCountry: "IN" },
  alumniOf: "Samrat Ashok Technological Institute",
  sameAs: [
    "https://github.com/Mohit067",
    "https://www.linkedin.com/in/mohit-sahu-262361257/",
    "https://leetcode.com/u/mohit067/",
  ],
};

import { THEME_SCRIPT } from "@/lib/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${grotesk.variable} dark`}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--ink)] focus:text-[var(--bg)] focus:px-3 focus:py-1 focus:rounded">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
