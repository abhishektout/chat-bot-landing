import type { Metadata } from "next";
import SubpageClient from "@/components/SubpageClient";

export async function generateStaticParams() {
  const slugs = [
    "changelog",
    "roadmap",
    "status",
    "docs",
    "api-reference",
    "sdks",
    "webhooks",
    "status-page",
    "about",
    "blog",
    "careers",
    "press",
    "privacy",
    "terms",
    "cookies",
    "gdpr",
    "security",
    "e-commerce",
    "healthcare",
    "saas",
    "finance",
    "insurance",
    "education",
    "travel",
    "enterprise",
  ];
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const capitalized = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${capitalized} — Assistly`,
    description: `Learn more about Assistly's ${capitalized} page, configuration, operations, and policy details.`,
  };
}

export default async function DynamicSubpage({ params }: PageProps) {
  const { slug } = await params;
  return <SubpageClient slug={slug} />;
}
