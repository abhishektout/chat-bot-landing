import Link from "next/link";

const columns = [
  {
    title: "Planned",
    dot: "#8b5cf6",
    items: [
      { name: "Dynamic Voice Assistant Agents", desc: "Automate voice calls using real-time generative audio contexts." },
      { name: "HubSpot Dynamic Sync", desc: "Push captured leads and conversation summaries to HubSpot pipelines." },
      { name: "Custom LLM Fine-Tuning", desc: "Allow enterprise accounts to train private Llama models on their secure data." },
    ],
  },
  {
    title: "In Development",
    dot: "#f59e0b",
    items: [
      { name: "Multi-Language Real-Time Translation", desc: "Instantly translate messages and handle agents output in 32+ languages." },
      { name: "Automated KB Suggestions", desc: "AI reviews queries to identify documentation gaps and draft new articles." },
      { name: "Salesforce Webhook Integration", desc: "Two-way webhook sync with Salesforce lead objects and custom fields." },
    ],
  },
  {
    title: "Released",
    dot: "#22c55e",
    items: [
      { name: "Omnichannel Integrations", desc: "WhatsApp, Telegram, Facebook Messenger, and Instagram Direct." },
      { name: "Sentiment Detection Engine", desc: "Real-time AI monitoring to detect frustration and trigger human handoff." },
      { name: "White-Label Portals", desc: "Custom branding and hosted on branded subdomains for agencies." },
    ],
  },
];

export default function RoadmapContent() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/product/roadmap" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>Roadmap</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Product <span className="gradient-text">Roadmap</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
          See what we are building next and what has already shipped.
        </p>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.title} className="card-gradient-border" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Column header */}
            <div style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "16px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 800, color: "var(--fg)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: col.dot, flexShrink: 0, display: "inline-block" }} />
                {col.title}
              </h2>
            </div>

            {/* Items */}
            {col.items.map((item) => (
              <div
                key={item.name}
                style={{ padding: "16px", borderRadius: "10px", background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}
              >
                <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--fg)", marginBottom: "6px" }}>{item.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
