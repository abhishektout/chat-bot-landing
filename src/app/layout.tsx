import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "SupportAI — AI Customer Support Platform | Reduce Costs, Capture Leads & Automate Support",
  description:
    "Transform customer support with AI. Reduce support costs by 60%, capture more leads, and automate customer conversations using AI agents trained on your business knowledge and real-time data.",
  keywords: [
    "AI customer support platform",
    "AI chatbot",
    "multi-tenant chatbot",
    "live chat with AI",
    "human takeover chatbot",
    "AI lead capture",
    "AI sentiment detection",
    "business data integration chatbot",
    "WhatsApp AI chatbot",
    "white label AI platform",
  ],
  authors: [{ name: "SupportAI" }],
  creator: "SupportAI",
  publisher: "SupportAI",
  metadataBase: new URL("https://supportai.io"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "SupportAI — AI Customer Support Platform",
    description:
      "Reduce support costs, capture more leads, and automate customer conversations using AI-powered support agents trained on your business knowledge.",
    url: "https://supportai.io",
    siteName: "SupportAI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SupportAI Platform" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SupportAI — AI Customer Support Platform",
    description: "Transform customer support with AI-powered agents. Reduce costs, capture leads, automate conversations.",
    images: ["/og-image.png"],
    creator: "@supportai",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  verification: { google: "your-google-verification-code" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SupportAI",
              applicationCategory: "BusinessApplication",
              description:
                "AI-powered customer support platform with chatbots, live human support, business data integration, lead generation, analytics, and enterprise automation.",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "49",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "2847",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
