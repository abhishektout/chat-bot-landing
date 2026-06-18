import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/data/industries";
import { LEGAL_DOCS } from "@/data/legal";

const BASE_URL = "https://assistly.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE_URL}/book-demo`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/get-started`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/product/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/product/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/product/status`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/developers/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/developers/api-reference`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/developers/sdks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/developers/webhooks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${BASE_URL}/solutions/${ind.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCS.map((doc) => ({
    url: `${BASE_URL}/legal/${doc.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...solutionRoutes, ...legalRoutes];
}
