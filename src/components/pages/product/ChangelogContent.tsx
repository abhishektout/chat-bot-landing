import Link from "next/link";

const releases = [
  {
    version: "v1.2.0",
    date: "June 2026",
    tag: "feature",
    title: "Omnichannel integrations, Custom tooltips & dynamic handoff metrics",
    changes: [
      "Released official WhatsApp Cloud API and Telegram integration configurations.",
      "Enabled HTML tooltips support on custom AI widget flows.",
      "Added real-time CSAT and customer response latency tables in the analytics dashboard.",
      "Optimised dynamic prompt construction to decrease vector store token queries by 15%.",
    ],
  },
  {
    version: "v1.1.0",
    date: "April 2026",
    tag: "feature",
    title: "Enterprise White-Label support and dynamic database contexts",
    changes: [
      "Launched White-Label dynamic portals allowing reseller domain routing and logo replacements.",
      "Added support for secure relational DB contexts dynamically synced via webhooks.",
      "Enhanced sentiment analysis module to identify and flag customer frustration thresholds.",
      "Upgraded SDK structures to improve client loading latency.",
    ],
  },
  {
    version: "v1.0.0",
    date: "January 2026",
    tag: "launch",
    title: "Assistly Official Platform Release",
    changes: [
      "Completed primary dashboard interface with chat playground and widgets.",
      "Fully deployed AI Agent builder with knowledge base ingestion for PDFs, raw text, and web scrapers.",
      "Implemented secure Human-Agent takeover sockets.",
    ],
  },
];

const tagStyles: Record<string, { bg: string; color: string }> = {
  feature: { bg: "rgba(79,124,255,0.1)", color: "#4f7cff" },
  launch: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  fix: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
};

export default function ChangelogContent() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/product/changelog" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>Changelog</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Product <span className="gradient-text">Changelog</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          Every update, improvement, and fix — tracked and transparent.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: "28px", borderLeft: "2px solid var(--card-border)", marginLeft: "8px" }}>
        {releases.map((release, idx) => {
          const style = tagStyles[release.tag] ?? tagStyles.feature;
          return (
            <article key={release.version} style={{ position: "relative", marginBottom: idx !== releases.length - 1 ? "52px" : 0 }}>
              {/* Timeline dot */}
              <div style={{
                position: "absolute", left: "-38px", top: "4px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "var(--bg)", border: "3px solid var(--accent)",
                boxShadow: "0 0 12px var(--accent-glow)",
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, background: style.bg, color: style.color, padding: "3px 10px", borderRadius: "100px" }}>
                  {release.version}
                </span>
                <time style={{ fontSize: "13px", color: "var(--muted-fg)" }}>{release.date}</time>
              </div>

              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginBottom: "16px", lineHeight: 1.4 }}>
                {release.title}
              </h2>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {release.changes.map((change) => (
                  <li key={change} style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>→</span>
                    {change}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
