import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_DOCS } from "@/data/legal";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import LegalPageContent from "@/components/pages/legal/LegalPageContent";

export function generateStaticParams() {
  return LEGAL_DOCS.map(({ slug }) => ({ doc: slug }));
}

interface PageProps {
  params: Promise<{ doc: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { doc } = await params;
  const data = LEGAL_DOCS.find((d) => d.slug === doc);
  if (!data) return {};
  return {
    title: `${data.title} — Assistly`,
    description: `Read Assistly's official ${data.title}.`,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { doc } = await params;
  const data = LEGAL_DOCS.find((d) => d.slug === doc);
  if (!data) notFound();

  return (
    <SubpageLayout>
      <LegalPageContent doc={doc} />
    </SubpageLayout>
  );
}
