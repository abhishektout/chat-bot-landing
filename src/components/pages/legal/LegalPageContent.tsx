import { LEGAL_DOC_MAP } from "@/data/legal";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

interface Props {
  doc: string;
}

/**
 * Server component — renders a legal document page for /legal/[doc].
 */
export default function LegalPageContent({ doc }: Props) {
  const data = LEGAL_DOC_MAP.get(doc);
  if (!data) notFound();

  const { title, lastUpdated, sections } = data;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav
        style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px", alignItems: "center" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Legal</span>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>{title}</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
          }}
        >
          <Shield style={{ width: "24px", height: "24px", color: "var(--accent)" }} />
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}>
          {title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>
          Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {sections.map((section, idx) => (
          <div
            key={section.heading}
            className="card-gradient-border"
            style={{ padding: "28px" }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--fg)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "11px", fontWeight: 800, color: "var(--accent)",
                  background: "rgba(37,99,235,0.1)", padding: "3px 8px",
                  borderRadius: "6px", flexShrink: 0,
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.8 }}>
              {section.body}
            </p>
          </div>
        ))}
      </div>

      {/* Contact prompt */}
      <div style={{ marginTop: "48px", padding: "28px", borderRadius: "16px", background: "var(--muted-bg)", border: "1px solid var(--card-border)", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)" }}>
          Questions about our legal policies?{" "}
          <a href="mailto:legal@assistly.io" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            legal@assistly.io
          </a>
        </p>
      </div>
    </div>
  );
}
