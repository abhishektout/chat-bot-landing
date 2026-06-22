"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

type Lang = "js" | "py" | "go";

const SDKS: Record<Lang, { label: string; icon: string; install: string; usage: string }> = {
  js: {
    label: "Node.js",
    icon: "fab fa-node-js",
    install: "npm install @assistly/node",
    usage: `import { AssistlyClient } from '@assistly/node';

const client = new AssistlyClient({ apiKey: 'YOUR_KEY' });
const reply = await client.sendMessage('session_123', 'Hello!');
console.log(reply.text);`,
  },
  py: {
    label: "Python",
    icon: "fab fa-python",
    install: "pip install assistly-sdk",
    usage: `from assistly import AssistlyClient

client = AssistlyClient(api_key='YOUR_KEY')
reply = client.send_message(session_id='session_123', text='Hello!')
print(reply.text)`,
  },
  go: {
    label: "Go",
    icon: "fas fa-code",
    install: "go get github.com/assistly/assistly-go",
    usage: `import "github.com/assistly/assistly-go"

client := assistly.NewClient("YOUR_KEY")
reply, err := client.SendMessage("session_123", "Hello!")
fmt.Println(reply.Text)`,
  },
};

function CopyButton({ text, id }: { text: string; id: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button aria-label="Copy" onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: "4px" }}>
      {copied ? <Check style={{ width: "15px", height: "15px", color: "#22c55e" }} /> : <Copy style={{ width: "15px", height: "15px" }} />}
    </button>
  );
}

export default function SDKsContent() {
  const [activeTab, setActiveTab] = useState<Lang>("js");
  const sdk = SDKS[activeTab];

  return (
    <div>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/developers/sdks" style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>SDKs</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Client <span className="gradient-text">SDKs</span>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--muted-fg)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
          Interact with the Assistly API using libraries built for your preferred runtime.
        </p>
      </div>

      {/* Language tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "0", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
        {(Object.keys(SDKS) as Lang[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 16px", borderRadius: "8px",
              border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              background: activeTab === lang ? "var(--muted-bg)" : "none",
              color: activeTab === lang ? "var(--fg)" : "var(--muted-fg)",
            }}
          >
            <i className={SDKS[lang].icon} style={{ fontSize: "14px" }} />
            {SDKS[lang].label}
          </button>
        ))}
      </div>

      {/* Code card */}
      <div className="card-gradient-border" style={{ padding: "28px", marginTop: "0" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)" }}>Installation</h3>
            <CopyButton text={sdk.install} id={`${activeTab}-install`} />
          </div>
          <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "14px", borderRadius: "10px", fontSize: "13px" }}>
            <code>{sdk.install}</code>
          </pre>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)" }}>Quick Start Example</h3>
            <CopyButton text={sdk.usage} id={`${activeTab}-usage`} />
          </div>
          <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "14px", borderRadius: "10px", fontSize: "12.5px", overflowX: "auto", lineHeight: 1.7 }}>
            <code>{sdk.usage}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
