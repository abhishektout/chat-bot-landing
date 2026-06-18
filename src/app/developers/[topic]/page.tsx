import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import DocsContent from "@/components/pages/developers/DocsContent";
import APIContent from "@/components/pages/developers/APIContent";
import SDKsContent from "@/components/pages/developers/SDKsContent";
import WebhooksContent from "@/components/pages/developers/WebhooksContent";

type DevTopic = "docs" | "api-reference" | "sdks" | "webhooks";

const DEV_PAGES: Record<DevTopic, { title: string; description: string }> = {
  docs: {
    title: "Documentation — Assistly Developers",
    description: "Step-by-step guides to embed, configure, and extend the Assistly chat widget.",
  },
  "api-reference": {
    title: "API Reference — Assistly Developers",
    description: "Complete REST API reference for integrating Assistly into custom pipelines.",
  },
  sdks: {
    title: "Client SDKs — Assistly Developers",
    description: "Official Assistly SDKs for Node.js, Python, and Go.",
  },
  webhooks: {
    title: "Webhooks — Assistly Developers",
    description: "Receive real-time event notifications from the Assistly platform via HTTP POST.",
  },
};

export function generateStaticParams() {
  return (Object.keys(DEV_PAGES) as DevTopic[]).map((topic) => ({ topic }));
}

interface PageProps {
  params: Promise<{ topic: DevTopic }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const meta = DEV_PAGES[topic];
  if (!meta) return {};
  return { title: meta.title, description: meta.description };
}

export default async function DeveloperPage({ params }: PageProps) {
  const { topic } = await params;

  const ContentMap: Record<DevTopic, React.ReactNode> = {
    docs: <DocsContent />,
    "api-reference": <APIContent />,
    sdks: <SDKsContent />,
    webhooks: <WebhooksContent />,
  };

  const content = ContentMap[topic];
  if (!content) notFound();

  return <SubpageLayout>{content}</SubpageLayout>;
}
