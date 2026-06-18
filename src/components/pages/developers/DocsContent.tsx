"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

type DocSection = "getting-started" | "adding-widget" | "kb-sync";

const SECTIONS: { id: DocSection; label: string }[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "adding-widget", label: "Adding the Widget" },
  { id: "kb-sync", label: "Knowledge Sync" },
];

function CodeBlock({ id, code, copiedId, onCopy }: { id: string; code: string; copiedId: string | null; onCopy: (text: string, id: string) => void }) {
  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <button
        aria-label="Copy code"
        onClick={() => onCopy(code, id)}
        style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: "4px" }}
      >
        {copiedId === id
          ? <Check style={{ width: "15px", height: "15px", color: "#22c55e" }} />
          : <Copy style={{ width: "15px", height: "15px" }} />}
      </button>
      <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "10px", overflowX: "auto", fontSize: "13px", lineHeight: 1.7 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsContent() {
  const [activeSection, setActiveSection] = useState<DocSection>("getting-started");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const SCRIPT_CODE = `<script src="https://cdn.assistly.io/widget.js" data-id="YOUR_WIDGET_ID" defer></script>`;
  const CONFIG_CODE = `window.AssistlyOptions = {\n  theme: "dark",\n  accentColor: "#4f7cff",\n  welcomeMessage: "Hello! How can I help you?",\n  userId: "user_12345"\n};`;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/developers/docs" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>Documentation</Link>
      </nav>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside style={{ width: "200px", flexShrink: 0 }}>
          <div className="card-gradient-border" style={{ padding: "8px" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted-fg)", padding: "8px 12px", marginBottom: "4px" }}>
              Guides
            </p>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 12px",
                  fontSize: "13px", borderRadius: "8px", border: "none", cursor: "pointer",
                  background: activeSection === s.id ? "var(--muted-bg)" : "none",
                  color: activeSection === s.id ? "var(--fg)" : "var(--muted-fg)",
                  fontWeight: activeSection === s.id ? 600 : 400,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }} className="card-gradient-border p-[32px]">
          {activeSection === "getting-started" && (
            <>
              <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Getting Started with Assistly</h1>
              <p style={{ color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "24px" }}>
                Embed Assistly on any webpage in under 5 minutes. Paste the snippet below at the bottom of your <code>&lt;body&gt;</code> tag.
              </p>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Step 1 — Install the Script</h3>
              <CodeBlock id="script" code={SCRIPT_CODE} copiedId={copiedId} onCopy={copyToClipboard} />
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Step 2 — Sync Your Knowledge Base</h3>
              <p style={{ color: "var(--muted-fg)", fontSize: "14px", lineHeight: 1.7 }}>
                Upload PDFs, FAQs, or web pages in the Assistly Dashboard under <strong>Knowledge Base</strong>. The AI agent immediately parses and embeds your data.
              </p>
            </>
          )}

          {activeSection === "adding-widget" && (
            <>
              <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Customising the Widget</h1>
              <p style={{ color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "24px" }}>
                Configure the widget using the global <code>window.AssistlyOptions</code> object before the script loads.
              </p>
              <CodeBlock id="config" code={CONFIG_CODE} copiedId={copiedId} onCopy={copyToClipboard} />
            </>
          )}

          {activeSection === "kb-sync" && (
            <>
              <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Knowledge Base Synchronisation</h1>
              <p style={{ color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "20px" }}>
                Keep your chatbot synced with backend data in real-time. Assistly automatically re-embeds articles to prevent hallucination.
              </p>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>Supported Sources</h3>
              <ul style={{ paddingLeft: "20px", color: "var(--muted-fg)", fontSize: "14px", lineHeight: 1.9 }}>
                <li><strong>Dynamic HTML Scrapers:</strong> Auto-scrapes URL changes every 24 hours.</li>
                <li><strong>Document Upload:</strong> PDF, DOCX, TXT, and Markdown.</li>
                <li><strong>Integrations:</strong> Live connections to Notion databases and Zendesk Help Centers.</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
