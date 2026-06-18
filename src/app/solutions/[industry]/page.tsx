import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES } from "@/data/industries";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import IndustryPageContent from "@/components/pages/solutions/IndustryPageContent";

/** Pre-render all industry solution pages at build time */
export function generateStaticParams() {
  return INDUSTRIES.map(({ slug }) => ({ industry: slug }));
}

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  const data = INDUSTRIES.find((i) => i.slug === industry);
  if (!data) return {};

  return {
    title: `${data.name} AI Support — Assistly`,
    description: data.subtitle,
    openGraph: {
      title: `${data.name} AI Support — Assistly`,
      description: data.subtitle,
    },
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { industry } = await params;
  const data = INDUSTRIES.find((i) => i.slug === industry);
  if (!data) notFound();

  return (
    <SubpageLayout accentColor={data.color}>
      <IndustryPageContent industry={industry} />
    </SubpageLayout>
  );
}
