import { INDUSTRY_MAP } from "@/data/industries";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  industry: string;
}

/**
 * Pure server component — renders rich content for a /solutions/[industry] page.
 * No client-side state needed; all data comes from the static industries data file.
 */
export default function IndustryPageContent({ industry }: Props) {
  const data = INDUSTRY_MAP.get(industry);
  if (!data) notFound();

  const { color, badge, title, subtitle, stat, statLabel, description, capabilities, useCases } =
    data;

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px", alignItems: "center" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/solutions" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>
          Solutions
        </Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>{badge}</span>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        {/* <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color,
            background: `${color}14`,
            border: `1px solid ${color}30`,
            padding: "6px 14px",
            borderRadius: "100px",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          {badge} Solution
        </span> */}

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          {title}
        </h1>

        <p style={{ fontSize: "18px", color: "var(--muted-fg)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 32px" }}>
          {subtitle}
        </p>

        {/* CTA row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/book-demo" className="btn-primary" style={{ padding: "12px 28px", textDecoration: "none", fontSize: "14px" }}>
            Book a Demo
          </Link>
          <Link href="/pricing" className="btn-secondary" style={{ padding: "12px 28px", textDecoration: "none", fontSize: "14px" }}>
            View Pricing
          </Link>
        </div>
      </div>

      {/* Stat + Description grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: "48px" }}>
        {/* Key metric */}
        <div
          className="card-gradient-border"
          style={{ padding: "32px", background: `linear-gradient(135deg, ${color}08, transparent)` }}
        >
          <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-fg)", marginBottom: "12px" }}>
            Key Performance Metric
          </p>
          <div style={{ fontSize: "48px", fontWeight: 900, color, lineHeight: 1, marginBottom: "8px" }}>{stat}</div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg)" }}>{statLabel}</div>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px", lineHeight: 1.6 }}>
            Typical improvement seen by customers within the first 30 days of deployment.
          </p>
        </div>

        {/* Capabilities list */}
        <div className="card-gradient-border" style={{ padding: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-fg)", marginBottom: "16px" }}>
            Core Capabilities
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {capabilities.map((cap) => (
              <li key={cap} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "var(--fg)" }}>
                <Check style={{ width: "15px", height: "15px", color, flexShrink: 0, marginTop: "2px" }} />
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overview paragraph */}
      <div className="card-gradient-border" style={{ padding: "32px", marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>Platform Overview</h2>
        <p style={{ fontSize: "14.5px", color: "var(--muted-fg)", lineHeight: 1.8 }}>{description}</p>
      </div>

      {/* Use case cards */}
      <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px" }}>Common Use Cases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: "56px" }}>
        {useCases.map((uc) => (
          <div key={uc.heading} className="card-gradient-border" style={{ padding: "28px" }}>
            <div
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: `${color}14`, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "14px",
              }}
            >
              <ArrowRight style={{ width: "16px", height: "16px", color }} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>{uc.heading}</h3>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.7 }}>{uc.body}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA banner */}
      <div
        className="card-gradient-border"
        style={{
          padding: "48px 40px",
          textAlign: "center",
          background: `linear-gradient(135deg, ${color}08, transparent)`,
        }}
      >
        <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "12px" }}>
          Ready to deploy for your {badge} business?
        </h2>
        <p style={{ fontSize: "15px", color: "var(--muted-fg)", marginBottom: "28px", maxWidth: "520px", margin: "0 auto 28px" }}>
          Schedule a 15-minute call with our product engineers and see a live demo loaded with your own data.
        </p>
        <Link
          href="/get-started"
          className="btn-primary"
          style={{ padding: "14px 32px", textDecoration: "none", fontSize: "15px" }}
        >
          Get Started Free →
        </Link>
      </div>
    </div>
  );
}
