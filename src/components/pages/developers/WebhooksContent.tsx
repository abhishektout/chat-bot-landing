import Link from "next/link";

const PAYLOAD = `{
  "event": "handoff.requested",
  "timestamp": 1718712395,
  "data": {
    "sessionId": "session_9827",
    "customerName": "Abhishek",
    "sentimentScore": -0.84,
    "lastMessage": "Let me speak to a human agent please."
  }
}`;

const EVENTS = [
  { name: "chat.created", desc: "Fired when a new conversational session initialises." },
  { name: "chat.completed", desc: "Fired when a customer or agent closes the chat session." },
  { name: "message.received", desc: "Fired on every inbound customer message." },
  { name: "handoff.requested", desc: "Fired immediately when the AI detects customer frustration and requests human intervention." },
];

export default function WebhooksContent() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/developers/webhooks" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>Webhooks</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Assistly <span className="gradient-text">Webhooks</span>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--muted-fg)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
          Receive real-time HTTP POST notifications for every platform event into your own backend.
        </p>
      </div>

      {/* Event list */}
      <div className="card-gradient-border" style={{ padding: "8px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, padding: "16px 20px", borderBottom: "1px solid var(--card-border)", marginBottom: "0" }}>
          Supported Event Types
        </h2>
        {EVENTS.map((ev, idx) => (
          <div
            key={ev.name}
            style={{
              display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px 20px",
              borderBottom: idx !== EVENTS.length - 1 ? "1px solid var(--card-border)" : "none",
            }}
          >
            <code style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent)", background: "rgba(79,124,255,0.08)", padding: "4px 8px", borderRadius: "6px", flexShrink: 0, whiteSpace: "nowrap" }}>
              {ev.name}
            </code>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6 }}>{ev.desc}</p>
          </div>
        ))}
      </div>

      {/* Payload sample */}
      <div className="card-gradient-border" style={{ padding: "28px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
          Sample Payload — <code style={{ fontSize: "14px" }}>handoff.requested</code>
        </h2>
        <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "10px", fontSize: "12.5px", overflowX: "auto", lineHeight: 1.7 }}>
          <code>{PAYLOAD}</code>
        </pre>
      </div>
    </div>
  );
}
