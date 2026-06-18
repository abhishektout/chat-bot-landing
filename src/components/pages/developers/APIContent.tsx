"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

function CodeBlock({ code, id, copiedId, onCopy }: { code: string; id: string; copiedId: string | null; onCopy: (t: string, id: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <button aria-label="Copy" onClick={() => onCopy(code, id)} style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)" }}>
        {copiedId === id ? <Check style={{ width: "15px", height: "15px", color: "#22c55e" }} /> : <Copy style={{ width: "15px", height: "15px" }} />}
      </button>
      <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "10px", overflowX: "auto", fontSize: "12.5px", lineHeight: 1.7 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

const REQUEST_BODY = `{
  "sessionId": "session_9827",
  "message": "What is my delivery status?"
}`;

const RESPONSE_BODY = `{
  "success": true,
  "reply": "Your package is currently in transit...",
  "sentiment": "neutral",
  "handoffTriggered": false
}`;

const ENDPOINTS = [
  {
    method: "POST",
    methodColor: "#22c55e",
    path: "/v1/chat/message",
    description: "Send a message to an active AI support agent session and receive the response payload.",
    request: REQUEST_BODY,
    response: RESPONSE_BODY,
  },
  {
    method: "GET",
    methodColor: "#4f7cff",
    path: "/v1/sessions/:id",
    description: "Retrieve the full conversation history and metadata for a given session ID.",
    request: "// No request body — pass sessionId as URL param",
    response: `{\n  "sessionId": "session_9827",\n  "messages": [...],\n  "sentiment": "neutral",\n  "createdAt": 1718712300\n}`,
  },
];

export default function APIContent() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/developers/api-reference" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>API Reference</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          API <span className="gradient-text">Reference</span>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--muted-fg)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
          Integrate Assistly into custom pipelines using our REST HTTP API. All requests require a Bearer token.
        </p>
      </div>

      {/* Auth note */}
      <div className="card-gradient-border" style={{ padding: "20px 24px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "4px 8px", borderRadius: "6px", flexShrink: 0 }}>AUTH</span>
        <code style={{ fontSize: "13px", color: "var(--fg)" }}>Authorization: Bearer YOUR_API_KEY</code>
      </div>

      {/* Endpoint cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {ENDPOINTS.map((ep, i) => (
          <div key={ep.path} className="card-gradient-border" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, background: `${ep.methodColor}18`, color: ep.methodColor, padding: "4px 10px", borderRadius: "6px" }}>
                {ep.method}
              </span>
              <code style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)" }}>{ep.path}</code>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "20px" }}>{ep.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-fg)", marginBottom: "8px" }}>Request Body</p>
                <CodeBlock code={ep.request} id={`req-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-fg)", marginBottom: "8px" }}>Response Payload</p>
                <CodeBlock code={ep.response} id={`res-${i}`} copiedId={copiedId} onCopy={copy} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
