import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import ChangelogContent from "@/components/pages/product/ChangelogContent";
import RoadmapContent from "@/components/pages/product/RoadmapContent";
import StatusContent from "@/components/pages/product/StatusContent";

type ProductSlug = "changelog" | "roadmap" | "status";

const PRODUCT_PAGES: Record<ProductSlug, { title: string; description: string }> = {
  changelog: {
    title: "Changelog — Assistly",
    description: "Track every update, improvement, and fix shipped to the Assistly platform.",
  },
  roadmap: {
    title: "Product Roadmap — Assistly",
    description: "See what our engineering team is building next and what has already shipped.",
  },
  status: {
    title: "System Status — Assistly",
    description: "Live service availability and performance indicators for all Assistly systems.",
  },
};

export function generateStaticParams() {
  return (Object.keys(PRODUCT_PAGES) as ProductSlug[]).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: ProductSlug }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = PRODUCT_PAGES[slug];
  if (!meta) return {};
  return { title: meta.title, description: meta.description };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const ContentMap: Record<ProductSlug, React.ReactNode> = {
    changelog: <ChangelogContent />,
    roadmap: <RoadmapContent />,
    status: <StatusContent />,
  };

  const content = ContentMap[slug];
  if (!content) notFound();

  return <SubpageLayout>{content}</SubpageLayout>;
}
