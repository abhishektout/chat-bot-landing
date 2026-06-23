import type { Metadata } from "next";
import Link from "next/link";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import {
  FileText,
  Code2,
  Cpu,
  Activity,
  BarChart3,
  GitPullRequest,
  Compass,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Resources & Developer Center — Assistly",
  description: "Browse documentation, API references, SDK guides, platform status, roadmap, and analytics reports for Assistly.",
  alternates: { canonical: "/resources" },
};

const resourceSections = [
  {
    category: "Developer Center",
    description: "Build deep integrations, configure webhooks, and utilize official SDKs.",
    items: [
      {
        icon: FileText,
        title: "Documentation",
        desc: "Step-by-step guides to embed, configure, and extend the Assistly chat widget on any website.",
        link: "/developers/docs",
        cta: "Read Guides",
        color: "#4f7cff",
      },
      {
        icon: Code2,
        title: "API Reference",
        desc: "Complete REST API reference for programmatically managing agents, training data, and chat sessions.",
        link: "/developers/api-reference",
        cta: "View Reference",
        color: "#00d4ff",
      },
      {
        icon: Cpu,
        title: "Client SDKs",
        desc: "Official packages for Node.js, Python, and Go to accelerate custom application building.",
        link: "/developers/sdks",
        cta: "Explore SDKs",
        color: "#8b5cf6",
      },
      {
        icon: GitPullRequest,
        title: "Webhooks Integration",
        desc: "Configure HTTP POST payloads to receive real-time event notifications on message events.",
        link: "/developers/webhooks",
        cta: "Setup Webhooks",
        color: "#ec4899",
      },
    ],
  },
  {
    category: "Analytics & Product Updates",
    description: "Monitor service operations, track feature releases, and explore business intelligence.",
    items: [
      {
        icon: BarChart3,
        title: "Conversational Analytics",
        desc: "Learn how Assistly's analytics engine processes customer conversations into growth opportunities.",
        link: "/#insights",
        cta: "Explore Analytics",
        color: "#22c55e",
      },
      {
        icon: Activity,
        title: "System Status",
        desc: "View live server response times, Vector DB querying status, and global service availability metrics.",
        link: "/product/status",
        cta: "Check Uptime",
        color: "#f59e0b",
      },
      {
        icon: Compass,
        title: "Product Roadmap",
        desc: "See what features we are currently developing and vote on ideas that should be prioritized next.",
        link: "/product/roadmap",
        cta: "View Roadmap",
        color: "#06b6d4",
      },
      {
        icon: HelpCircle,
        title: "Platform Changelog",
        desc: "Chronological updates detailing every new dashboard feature, widget optimization, and bug fix shipped.",
        link: "/product/changelog",
        cta: "Read Changelog",
        color: "#ef4444",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <SubpageLayout accentColor="#8b5cf6">
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h1
          style={{
            fontSize: "clamp(34px, 5vw, 58px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          Resources & <span className="gradient-text">Developer Center</span>
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "var(--muted-fg)",
            lineHeight: 1.7,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Access developer guides, API specifications, platform metrics, and system status to build high-converting customer experiences.
        </p>
      </div>

      {/* Grid Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
        {resourceSections.map((section, idx) => (
          <div key={idx}>
            <div style={{ marginBottom: "24px", borderBottom: "1px solid var(--card-border)", paddingBottom: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--fg)" }}>{section.category}</h2>
              <p style={{ fontSize: "14px", color: "var(--muted-fg)", marginTop: "4px" }}>{section.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item, itemIdx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={itemIdx}
                    className="card-gradient-border"
                    style={{
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <div>
                      {/* Icon */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: `${item.color}14`,
                          border: `1px solid ${item.color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "18px",
                        }}
                      >
                        <IconComponent style={{ width: "20px", height: "20px", color: item.color }} />
                      </div>

                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.65, marginBottom: "20px" }}>
                        {item.desc}
                      </p>
                    </div>

                    <Link
                      href={item.link}
                      className="btn-secondary"
                      style={{
                        padding: "10px 16px",
                        fontSize: "13px",
                        width: "fit-content",
                        textDecoration: "none",
                      }}
                    >
                      {item.cta}
                      <ArrowRight style={{ width: "14px", height: "14px" }} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Help Banner */}
      <div
        className="card-gradient-border"
        style={{
          marginTop: "64px",
          padding: "40px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, transparent 100%)",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--fg)", marginBottom: "8px" }}>
          Need custom onboarding or enterprise setup?
        </h3>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", marginBottom: "20px", maxWidth: "560px", margin: "0 auto 20px" }}>
          Our engineering team can assist you with complex database mapping, custom SAML flows, or custom model fine-tuning.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/book-demo" className="btn-primary" style={{ padding: "11px 24px", textDecoration: "none", fontSize: "14px" }}>
            Talk to an Engineer
          </Link>
          <a
            href="mailto:support@assistly.io"
            className="btn-secondary"
            style={{ padding: "11px 24px", textDecoration: "none", fontSize: "14px" }}
          >
            Email Support
          </a>
        </div>
      </div>
    </SubpageLayout>
  );
}
