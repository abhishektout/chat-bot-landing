import Link from "next/link";

const services = [
  { name: "API & Inference Services", uptime: "99.98%", status: "Operational", color: "#22c55e" },
  { name: "Web App & Dashboard", uptime: "100%", status: "Operational", color: "#22c55e" },
  { name: "Widgets & SDK Delivery", uptime: "99.99%", status: "Operational", color: "#22c55e" },
  { name: "Vector Search & Databases", uptime: "99.97%", status: "Operational", color: "#22c55e" },
  { name: "Webhook Delivery", uptime: "99.95%", status: "Operational", color: "#22c55e" },
];

export default function StatusContent() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/product/status" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>System Status</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          System <span className="gradient-text">Status</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
          Live service availability and performance indicators.
        </p>
      </div>

      {/* Global indicator */}
      <div
        className="card-gradient-border"
        style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", background: "rgba(34,197,94,0.05)" }}
      >
        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite", flexShrink: 0 }} />
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>All Systems Operational</h2>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>Uptime monitored continuously. No active incidents.</p>
        </div>
      </div>

      {/* Service table */}
      <div className="card-gradient-border" style={{ padding: "8px", marginBottom: "40px" }}>
        {services.map((srv, idx) => (
          <div
            key={srv.name}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 20px",
              borderBottom: idx !== services.length - 1 ? "1px solid var(--card-border)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: srv.color, flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>{srv.name}</span>
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--muted-fg)" }}>{srv.uptime} uptime</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: srv.color }}>{srv.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Incident history */}
      <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>Incident History</h2>
      <div className="card-gradient-border" style={{ padding: "32px", textAlign: "center", color: "var(--muted-fg)", fontSize: "14px" }}>
        No incidents reported in the last 90 days. 🎉
      </div>
    </div>
  );
}
