"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Terminal,
  Code,
  Shield,
  Activity,
  User,
  Clock,
  Check,
  Copy,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  FileText,
  UserCheck,
  Send,
  Zap
} from "lucide-react";

interface SubpageClientProps {
  slug: string;
}

export default function SubpageClient({ slug }: SubpageClientProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("js");
  const [activeDocSection, setActiveDocSection] = useState<string>("getting-started");
  const [blogSearch, setBlogSearch] = useState<string>("");

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // 1. ABOUT CONTENT
  const renderAbout = () => (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "20px", textAlign: "center" }}>
        About <span className="gradient-text">Assistly</span>
      </h1>
      <p style={{ fontSize: "18px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "50px", lineHeight: 1.7 }}>
        We are building the future of automated customer operations. Our mission is to empower teams to support, capture, and convert customers using secure AI agents combined with seamless human cooperation.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="card-gradient-border" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Cpu style={{ color: "var(--accent)" }} /> AI-First Philosophy
          </h3>
          <p style={{ color: "var(--muted-fg)", fontSize: "14px", lineHeight: 1.7 }}>
            We believe AI agents should perform complex operations, retrieve system APIs, and understand customer sentiments in real-time, handling up to 94% of repetitive support overhead natively.
          </p>
        </div>
        <div className="card-gradient-border" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCheck style={{ color: "var(--accent2)" }} /> Human in the Loop
          </h3>
          <p style={{ color: "var(--muted-fg)", fontSize: "14px", lineHeight: 1.7 }}>
            AI is powerful, but complex escalations require human empathy. Our routing logic detects frustration and guarantees a seamless live human agent handoff in less than 5 seconds.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: "28px", fontWeight: 800, textAlign: "center", marginBottom: "32px" }}>Meet the Founders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {[
          { name: "Abhishek", role: "CEO & Co-founder", desc: "Ex-SaaS Operations Leader passionate about customer support automation." },
          { name: "Priya Sharma", role: "CTO & AI Architect", desc: "Specialist in dynamic LLM fine-tuning and secure context injection." }
        ].map((member, i) => (
          <div key={i} className="card-gradient-border" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "var(--muted-bg)", border: "1px solid var(--card-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: "28px", fontWeight: 700, color: "var(--accent)"
            }}>
              {member.name[0]}
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)" }}>{member.name}</h3>
            <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, marginBottom: "8px" }}>{member.role}</p>
            <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.5 }}>{member.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. BLOG CONTENT
  const renderBlog = () => {
    const articles = [
      { id: 1, title: "How AI is Revolutionizing E-Commerce Support in 2026", category: "E-Commerce", readTime: "5 min read", date: "June 12, 2026", desc: "Discover how top-tier brands are automating up to 90% of order queries and refund workflows using secure context databases." },
      { id: 2, title: "Best Practices for Handling Seamless Human-Agent Hand-off", category: "Customer Support", readTime: "4 min read", date: "May 28, 2026", desc: "A guide on sentiment metrics, real-time ticket handoffs, and how to preserve conversational history for live agents." },
      { id: 3, title: "Integrating Customer Data: Connecting CRM to AI Chatbots", category: "Integrations", readTime: "7 min read", date: "May 15, 2026", desc: "A technical walkthrough of securely injecting user data, order status, and CRM parameters into chatbot contexts." },
      { id: 4, title: "Top Security Standards for Enterprise AI Platforms", category: "Security", readTime: "6 min read", date: "April 30, 2026", desc: "How Assistly isolates tenant data, validates webhooks, and adheres to GDPR, HIPAA, and SOC2 standards." }
    ];

    const filtered = articles.filter(a =>
      a.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(blogSearch.toLowerCase()) ||
      a.desc.toLowerCase().includes(blogSearch.toLowerCase())
    );

    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", textAlign: "center" }}>
          Assistly <span className="gradient-text">Blog</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "40px" }}>
          Insights, guides, and technical updates from our engineering and product teams.
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "480px", margin: "0 auto 48px" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--muted-fg)" }} />
          <input
            type="text"
            placeholder="Search articles..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 42px", borderRadius: "10px",
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              color: "var(--fg)", fontSize: "14px", outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
          />
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(art => (
            <div key={art.id} className="card-gradient-border" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>{art.category}</span>
                  <span style={{ fontSize: "12px", color: "var(--muted-fg)" }}>{art.date}</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px", lineHeight: 1.4 }}>{art.title}</h3>
                <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "20px" }}>{art.desc}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--card-border)", paddingTop: "14px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock style={{ width: "12px", height: "12px" }} /> {art.readTime}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }} className="hover-accent">
                  Read Article <ChevronRight style={{ width: "14px", height: "14px" }} />
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px", color: "var(--muted-fg)" }}>
              No articles match your query. Try another search.
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. CHANGELOG CONTENT
  const renderChangelog = () => (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", textAlign: "center" }}>
        Product <span className="gradient-text">Changelog</span>
      </h1>
      <p style={{ fontSize: "17px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "50px" }}>
        Follow all latest updates, features, and platform enhancements.
      </p>

      {/* Timeline */}
      <div style={{ position: "relative", borderLeft: "2px solid var(--card-border)", paddingLeft: "32px", marginLeft: "10px" }}>
        {[
          {
            version: "v1.2.0", date: "June 2026", title: "Omnichannel integrations, Custom tooltips, and dynamic handoff metrics",
            changes: [
              "Released official WhatsApp Cloud API and Telegram integration configurations.",
              "Enabled HTML tooltips support on custom AI widget flows.",
              "Added real-time CSAT and customer response latency tables in the analytics dashboard.",
              "Optimized dynamic prompt construction to decrease vector store token queries by 15%."
            ]
          },
          {
            version: "v1.1.0", date: "April 2026", title: "Enterprise White-Label support and dynamic database contexts",
            changes: [
              "Launched White-Label dynamic portals allowing reseller domain routing and logo replacements.",
              "Added support for secure relational DB contexts dynamically synced via webhooks.",
              "Enhanced sentiment analysis module to identify and flag customer frustration thresholds.",
              "Upgraded SDK structures to improve client loading latency."
            ]
          },
          {
            version: "v1.0.0", date: "January 2026", title: "Assistly Official Platform Release",
            changes: [
              "Completed primary dashboard interface with chat playground and widgets.",
              "Fully deployed AI Agent builder with knowledge base ingestion for PDFs, raw text, and web scrapers.",
              "Implemented secure Human-Agent takeover sockets."
            ]
          }
        ].map((item, idx) => (
          <div key={idx} style={{ position: "relative", marginBottom: "48px" }}>
            {/* Timeline Dot */}
            <div style={{
              position: "absolute", left: "-42px", top: "4px",
              width: "18px", height: "18px", borderRadius: "50%",
              background: "var(--bg)", border: "3px solid var(--accent)",
              boxShadow: "0 0 10px var(--accent-glow)"
            }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", background: "rgba(37,99,235,0.1)", padding: "4px 8px", borderRadius: "100px" }}>
              {item.version}
            </span>
            <span style={{ fontSize: "13px", color: "var(--muted-fg)", marginLeft: "12px" }}>{item.date}</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginTop: "12px", marginBottom: "16px" }}>{item.title}</h3>
            <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {item.changes.map((change, cIdx) => (
                <li key={cIdx} style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6 }}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  // 4. ROADMAP CONTENT
  const renderRoadmap = () => {
    const columns = [
      {
        title: "Planned / Considering",
        desc: "Upcoming features we are researching or mapping out.",
        items: [
          { name: "Dynamic Voice Assistant Agents", desc: "Automate voice calls using real-time generative audio contexts." },
          { name: "HubSpot Dynamic Sync", desc: "Automatically push captured customer leads and conversation summaries to HubSpot pipelines." },
          { name: "Custom LLM Fine-Tuning", desc: "Allow enterprise accounts to train and tune private Llama models on their secure databases." }
        ]
      },
      {
        title: "In Development",
        desc: "Currently being built by our engineering team.",
        items: [
          { name: "Multi-Language Real-Time Translation", desc: "AI instantly translates incoming customer messages and handles live agents output in 32+ languages." },
          { name: "Automated KB Suggestions", desc: "AI reviews customer queries to identify missing documentation gaps and draft new articles automatically." },
          { name: "Salesforce Webhook Integration", desc: "Two-way webhook synchronization with Salesforce lead objects and custom fields." }
        ]
      },
      {
        title: "Released",
        desc: "Shipped and active in production.",
        items: [
          { name: "Omnichannel Integrations", desc: "Connect support workflows to WhatsApp, Telegram, Facebook Messenger, and Instagram Direct." },
          { name: "Sentiment Detection Engine", desc: "Real-time AI monitoring of customer text to flag frustration and trigger live human handoff." },
          { name: "White-Label Portals", desc: "Allow agencies and enterprise resellers to apply custom branding and host on branded subdomains." }
        ]
      }
    ];

    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", textAlign: "center" }}>
          Product <span className="gradient-text">Roadmap</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "50px" }}>
          See what we are building next and what has already been delivered.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col, idx) => (
            <div key={idx} className="card-gradient-border" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "16px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: idx === 0 ? "#8b5cf6" : idx === 1 ? "#f59e0b" : "#22c55e" }} />
                  {col.title}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginTop: "4px" }}>{col.desc}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {col.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ padding: "14px", borderRadius: "10px", background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
                    <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>{item.name}</h4>
                    <p style={{ fontSize: "12px", color: "var(--muted-fg)", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 5. STATUS PAGES
  const renderStatus = () => {
    const services = [
      { name: "API & Inference Services", status: "Operational", uptime: "99.98%", color: "#22c55e" },
      { name: "Web App & Dashboard", status: "Operational", uptime: "100%", color: "#22c55e" },
      { name: "Widgets & SDK Delivery", status: "Operational", uptime: "99.99%", color: "#22c55e" },
      { name: "Vector Search & Databases", status: "Operational", uptime: "99.97%", color: "#22c55e" }
    ];

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", textAlign: "center" }}>
          System <span className="gradient-text">Status</span>
        </h1>
        <p style={{ fontSize: "17px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "40px" }}>
          Live service availability and system performance indicators.
        </p>

        {/* Global indicator */}
        <div className="card-gradient-border" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", background: "rgba(34,197,94,0.06)" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite" }} />
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)" }}>All Systems Operational</h3>
            <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>Uptime monitored continuously. No active incidents reported.</p>
          </div>
        </div>

        {/* Services List */}
        <div className="card-gradient-border" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          {services.map((srv, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: idx !== services.length - 1 ? "1px solid var(--card-border)" : "none", paddingBottom: idx !== services.length - 1 ? "14px" : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: srv.color }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>{srv.name}</span>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-fg)" }}>{srv.uptime} Uptime</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: srv.color }}>{srv.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* History */}
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>Incident History</h2>
        <div className="card-gradient-border" style={{ padding: "24px", textAlign: "center", color: "var(--muted-fg)", fontSize: "13.5px" }}>
          No incidents reported in the last 90 days.
        </div>
      </div>
    );
  };

  // 6. DOCS CONTENT
  const renderDocs = () => {
    const docData: Record<string, { title: string; content: React.ReactNode }> = {
      "getting-started": {
        title: "Getting Started with Assistly",
        content: (
          <div>
            <p style={{ color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "16px" }}>
              Welcome to the Assistly Developer Documentation. Follow this guide to initialize our customer support agent on your landing page or dashboard in less than 5 minutes.
            </p>
            <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "24px", marginBottom: "8px" }}>Step 1: Install the Script</h4>
            <p style={{ color: "var(--muted-fg)", fontSize: "13.5px", marginBottom: "12px" }}>Paste the snippet at the bottom of your HTML body to load the chat component widget globally:</p>
            <div style={{ position: "relative", marginBottom: "24px" }}>
              <button
                onClick={() => copyToClipboard(`<script src="https://cdn.assistly.io/widget.js" data-id="YOUR_WIDGET_ID" defer></script>`, "script")}
                style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer" }}
              >
                {copiedText === "script" ? <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} /> : <Copy style={{ width: "16px", height: "16px" }} />}
              </button>
              <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: "12.5px" }}>
                <code>{`<script src="https://cdn.assistly.io/widget.js" data-id="YOUR_WIDGET_ID" defer></script>`}</code>
              </pre>
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "24px", marginBottom: "8px" }}>Step 2: Sync Your Knowledge</h4>
            <p style={{ color: "var(--muted-fg)", fontSize: "13.5px", lineHeight: 1.6 }}>
              Upload your documents (PDFs, FAQs, web pages) in the Assistly Dashboard under **Knowledge Base**. The AI agent will immediately parse and embed your data to start answering customer queries.
            </p>
          </div>
        )
      },
      "adding-widget": {
        title: "Customizing the Widget",
        content: (
          <div>
            <p style={{ color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "16px" }}>
              You can configure the widget options programmatically using the global `window.AssistlyOptions` configuration object:
            </p>
            <div style={{ position: "relative", marginBottom: "24px" }}>
              <button
                onClick={() => copyToClipboard(`window.AssistlyOptions = {\n  theme: "dark",\n  accentColor: "#4f7cff",\n  welcomeMessage: "Hello! How can we help you today?",\n  userId: "user_12345"\n};`, "widget-config")}
                style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer" }}
              >
                {copiedText === "widget-config" ? <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} /> : <Copy style={{ width: "16px", height: "16px" }} />}
              </button>
              <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: "12.5px" }}>
                <code>{`window.AssistlyOptions = {
  theme: "dark",
  accentColor: "#4f7cff",
  welcomeMessage: "Hello! How can we help you today?",
  userId: "user_12345"
};`}</code>
              </pre>
            </div>
          </div>
        )
      },
      "kb-sync": {
        title: "Knowledge Base Synchronization",
        content: (
          <div>
            <p style={{ color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "16px" }}>
              Keep your chatbot synced with your backend CRM data in real-time. Assistly automatically reads updates from your synced database context and re-embeds articles to prevent hallucination.
            </p>
            <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Supported Sources</h4>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--muted-fg)", fontSize: "13.5px" }}>
              <li><strong>Dynamic HTML Scrapers:</strong> Scrapes URL changes every 24 hours automatically.</li>
              <li><strong>Documents Upload:</strong> Direct support for PDF, DOCX, TXT, and Markdown files.</li>
              <li><strong>Integrations:</strong> Live connections to Notion databases and Zendesk Help Centers.</li>
            </ul>
          </div>
        )
      }
    };

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }} className="card-gradient-border p-[8px]">
          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-fg)", padding: "8px 12px", display: "block" }}>Guides</span>
          <button
            onClick={() => setActiveDocSection("getting-started")}
            style={{
              width: "100%", textAlign: "left", padding: "10px 12px", fontSize: "13px", borderRadius: "8px",
              background: activeDocSection === "getting-started" ? "var(--muted-bg)" : "none",
              border: "none", color: activeDocSection === "getting-started" ? "var(--fg)" : "var(--muted-fg)",
              cursor: "pointer", fontWeight: activeDocSection === "getting-started" ? 600 : 500
            }}
          >
            Getting Started
          </button>
          <button
            onClick={() => setActiveDocSection("adding-widget")}
            style={{
              width: "100%", textAlign: "left", padding: "10px 12px", fontSize: "13px", borderRadius: "8px",
              background: activeDocSection === "adding-widget" ? "var(--muted-bg)" : "none",
              border: "none", color: activeDocSection === "adding-widget" ? "var(--fg)" : "var(--muted-fg)",
              cursor: "pointer", fontWeight: activeDocSection === "adding-widget" ? 600 : 500
            }}
          >
            Adding the Widget
          </button>
          <button
            onClick={() => setActiveDocSection("kb-sync")}
            style={{
              width: "100%", textAlign: "left", padding: "10px 12px", fontSize: "13px", borderRadius: "8px",
              background: activeDocSection === "kb-sync" ? "var(--muted-bg)" : "none",
              border: "none", color: activeDocSection === "kb-sync" ? "var(--fg)" : "var(--muted-fg)",
              cursor: "pointer", fontWeight: activeDocSection === "kb-sync" ? 600 : 500
            }}
          >
            Knowledge Sync
          </button>
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1, minWidth: "280px" }} className="card-gradient-border p-[28px]">
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>{docData[activeDocSection]?.title}</h2>
          {docData[activeDocSection]?.content}
        </div>
      </div>
    );
  };

  // 7. API REFERENCE CONTENT
  const renderAPI = () => (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, marginBottom: "16px", textAlign: "center" }}>
        API <span className="gradient-text">Reference</span>
      </h1>
      <p style={{ fontSize: "16px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "40px" }}>
        Integrate Assistly into custom pipelines using our REST HTTP API.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {/* Endpoint Detail */}
        <div style={{ flex: 1, minWidth: "280px" }} className="card-gradient-border p-[24px]">
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: "6px" }}>POST</span>
          <code style={{ fontSize: "14px", fontWeight: 700, marginLeft: "8px", color: "var(--fg)" }}>/v1/chat/message</code>
          <p style={{ color: "var(--muted-fg)", fontSize: "13.5px", marginTop: "14px", lineHeight: 1.6 }}>
            Send a client user message to an active Assistly AI support agent session and retrieve the calculated message payload response.
          </p>

          <h4 style={{ fontSize: "13px", fontWeight: 700, marginTop: "24px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-fg)" }}>Header Parameters</h4>
          <code style={{ fontSize: "12px", background: "var(--muted-bg)", padding: "4px 8px", borderRadius: "6px", display: "inline-block" }}>Authorization: Bearer YOUR_API_KEY</code>

          <h4 style={{ fontSize: "13px", fontWeight: 700, marginTop: "20px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-fg)" }}>Body Schema</h4>
          <pre style={{ fontSize: "12px", background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "12px", borderRadius: "8px" }}>
            <code>{`{\n  "sessionId": "session_9827",\n  "message": "What is my delivery status?"\n}`}</code>
          </pre>
        </div>

        {/* Request/Response Preview */}
        <div style={{ flex: 1, minWidth: "280px" }} className="card-gradient-border p-[24px]">
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--muted-fg)" }}>Response Payload</h3>
          <pre style={{ fontSize: "12.5px", background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "8px", overflowX: "auto" }}>
            <code>{`{\n  "success": true,\n  "reply": "Your package is currently in transit...",\n  "sentiment": "neutral",\n  "handoffTriggered": false\n}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );

  // 8. SDKs CONTENT
  const renderSDKs = () => {
    const sdksList = [
      { name: "Node.js SDK", lang: "js", icon: "fab fa-node-js", install: "npm install @assistly/node", usage: `import { AssistlyClient } from '@assistly/node';\n\nconst client = new AssistlyClient({ apiKey: 'YOUR_KEY' });\nconst reply = await client.sendMessage('session_123', 'Hello!');` },
      { name: "Python SDK", lang: "py", icon: "fab fa-python", install: "pip install assistly-sdk", usage: `from assistly import AssistlyClient\n\nclient = AssistlyClient(api_key='YOUR_KEY')\nreply = client.send_message(session_id='session_123', text='Hello!')` },
      { name: "Go SDK", lang: "go", icon: "fa-solid fa-code", install: "go get github.com/assistly/assistly-go", usage: `import "github.com/assistly/assistly-go"\n\nclient := assistly.NewClient("YOUR_KEY")\nreply, _ := client.SendMessage("session_123", "Hello!")` }
    ];

    const currentSdk = sdksList.find(s => s.lang === activeTab) || sdksList[0];

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, marginBottom: "16px", textAlign: "center" }}>
          Client <span className="gradient-text">SDKs</span>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "40px" }}>
          Interact with the Assistly API using libraries built for your favorite developer runtimes.
        </p>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
          {sdksList.map(sdk => (
            <button
              key={sdk.lang}
              onClick={() => setActiveTab(sdk.lang)}
              style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px",
                border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                background: activeTab === sdk.lang ? "var(--muted-bg)" : "none",
                color: activeTab === sdk.lang ? "var(--fg)" : "var(--muted-fg)"
              }}
            >
              <i className={sdk.icon} />
              {sdk.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Code Output */}
        <div className="card-gradient-border" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Installation</h3>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <button
              onClick={() => copyToClipboard(currentSdk.install, "install")}
              style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer" }}
            >
              {copiedText === "install" ? <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} /> : <Copy style={{ width: "16px", height: "16px" }} />}
            </button>
            <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
              <code>{currentSdk.install}</code>
            </pre>
          </div>

          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Code Example</h3>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => copyToClipboard(currentSdk.usage, "usage")}
              style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer" }}
            >
              {copiedText === "usage" ? <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} /> : <Copy style={{ width: "16px", height: "16px" }} />}
            </button>
            <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "14px", borderRadius: "8px", fontSize: "12.5px", overflowX: "auto" }}>
              <code>{currentSdk.usage}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  };

  // 9. WEBHOOKS CONTENT
  const renderWebhooks = () => (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, marginBottom: "16px", textAlign: "center" }}>
        Assistly <span className="gradient-text">Webhooks</span>
      </h1>
      <p style={{ fontSize: "16px", color: "var(--muted-fg)", textAlign: "center", marginBottom: "40px" }}>
        Configure event hooks to receive HTTP POST JSON notifications in real-time.
      </p>

      <div className="card-gradient-border" style={{ padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Supported Event Hooks</h3>
        <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "var(--muted-fg)" }}>
          <li><strong><code>chat.created</code></strong>: Triggered when a new conversational session initializes.</li>
          <li><strong><code>chat.completed</code></strong>: Triggered when a customer or agent closes the chat.</li>
          <li><strong><code>handoff.requested</code></strong>: Fired immediately when the AI detects frustration thresholds and requests human agent intervention.</li>
        </ul>
      </div>

      <div className="card-gradient-border" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>Payload Sample (<code>handoff.requested</code>)</h3>
        <pre style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "8px", fontSize: "12.5px", overflowX: "auto" }}>
          <code>{`{\n  "event": "handoff.requested",\n  "timestamp": 1718712395,\n  "data": {\n    "sessionId": "session_9827",\n    "customerName": "Abhishek",\n    "sentimentScore": -0.84,\n    "lastMessage": "Your AI agent is not understanding my issue, let me speak to a human."\n  }\n}`}</code>
        </pre>
      </div>
    </div>
  );

  // 10. CAREERS CONTENT
  const renderCareers = () => (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px" }}>
        Join Our <span className="gradient-text">Team</span>
      </h1>
      <p style={{ fontSize: "18px", color: "var(--muted-fg)", marginBottom: "40px", lineHeight: 1.6 }}>
        We are a remote-first team scaling AI support systems globally. Check our active roles below.
      </p>

      <div className="grid grid-cols-1 gap-6 text-left">
        {[
          { title: "Senior AI Research Engineer", dept: "Engineering", type: "Full-Time / Remote", desc: "Build private fine-tuning layers and retrieval augmentation protocols on secure databases." },
          { title: "Senior Backend Engineer (Next.js/Node)", dept: "Engineering", type: "Full-Time / Remote", desc: "Optimize multi-tenant routing, webhooks delivery, and live sockets infrastructure." },
          { title: "Enterprise Account Executive", dept: "Sales", type: "Full-Time / Remote", desc: "Scale Assistly's automated support offerings to Global 2000 organizations." }
        ].map((job, idx) => (
          <div key={idx} className="card-gradient-border" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--fg)" }}>{job.title}</h3>
              <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(37,99,235,0.1)", color: "var(--accent)", padding: "4px 10px", borderRadius: "6px" }}>{job.type}</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 600, marginBottom: "10px" }}>Department: {job.dept}</p>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "16px" }}>{job.desc}</p>
            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );

  // 11. PRESS CONTENT
  const renderPress = () => (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px" }}>
        Press & <span className="gradient-text">Media</span>
      </h1>
      <p style={{ fontSize: "18px", color: "var(--muted-fg)", marginBottom: "50px" }}>
        Official resources and brand assets for publications covering Assistly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
        <div className="card-gradient-border" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Brand Assets</h3>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.5, marginBottom: "16px" }}>Download official logos, product mockups, and headshots of the founders team.</p>
          <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
            Download Kit <ExternalLink style={{ width: "13px", height: "13px" }} />
          </button>
        </div>
        <div className="card-gradient-border" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Press Contacts</h3>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.5, marginBottom: "16px" }}>For press inquiries, statements, or interview requests, reach out directly.</p>
          <a href="mailto:press@assistly.io" style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>press@assistly.io &rarr;</a>
        </div>
      </div>
    </div>
  );

  // 12. LEGAL PAGES (PRIVACY, TERMS, COOKIES, GDPR, SECURITY)
  const renderLegal = (title: string, date: string, paragraphs: string[]) => (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px" }}>{title}</h1>
      <p style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px" }}>Last updated: {date}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {paragraphs.map((p, idx) => (
          <div key={idx}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginBottom: "10px" }}>{idx + 1}. Section {idx + 1}</h3>
            <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.7 }}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // 13. INDUSTRY / SOLUTION PAGES
  const renderIndustry = (industrySlug: string) => {
    const data: Record<string, { title: string; subtitle: string; stat: string; details: string; color: string; badge: string }> = {
      "e-commerce": {
        title: "AI Customer Support for E-Commerce",
        subtitle: "Automate tracking, returns, and order queries without losing the human touch.",
        stat: "45% fewer support tickets",
        details: "Integrate with Shopify, WooCommerce, or Magento in minutes. Let Assistly track deliveries, update order statuses, initiate refund procedures, and upsell products autonomously.",
        color: "#4f7cff",
        badge: "E-Commerce"
      },
      "healthcare": {
        title: "Secure AI Support for Healthcare & MedTech",
        subtitle: "HIPAA-compliant assistant to schedule appointments and answer inquiries.",
        stat: "60% faster response times",
        details: "Answer patient FAQs, coordinate scheduling systems, and pre-screen clinical queries securely. Ensure absolute confidentiality with insulated tenant vector search.",
        color: "#ec4899",
        badge: "Healthcare"
      },
      "saas": {
        title: "Automated Onboarding & Support for SaaS",
        subtitle: "Boost customer retention with setup walkthroughs and technical triage.",
        stat: "70% support cost reduction",
        details: "Help customers navigate user configuration dashboards, debug API keys, find developer documentation, and seamlessly escalate bugs directly into Jira or Linear.",
        color: "#8b5cf6",
        badge: "SaaS"
      },
      "finance": {
        title: "Regulatory-Compliant AI for FinTech",
        subtitle: "Assist customers with transactions, account limits, and policy compliance.",
        stat: "99.9% compliance rate",
        details: "Handle complex queries regarding transaction logs, card activations, and fee disclosures safely. Isolation layers prevent security leaks and protect sensitive client records.",
        color: "#00d4ff",
        badge: "Finance"
      },
      "insurance": {
        title: "Automate Claims & Support for Insurance",
        subtitle: "Resolve claim reports, policy checks, and premium inquiries instantly.",
        stat: "3.2× more claims resolved",
        details: "Walk clients through filing new claims, retrieve policy numbers, and update renewal details automatically. Free up human adjusters to handle complex escalations.",
        color: "#f59e0b",
        badge: "Insurance"
      },
      "education": {
        title: "24/7 AI Assistants for Education & EdTech",
        subtitle: "Support student enrollment, course selection, and virtual campus FAQs.",
        stat: "40% enrollment increase",
        details: "Help prospective students find courses, retrieve fee schedules, guide enrollment forms, and answer daily campus questions instantly.",
        color: "#10b981",
        badge: "Education"
      },
      "travel": {
        title: "Real-time Support for Travel & Hospitality",
        subtitle: "Manage flight details, hotel bookings, and travel changes 24/7.",
        stat: "4.8★ customer rating",
        details: "Automate booking retrieval, reservation alterations, local itineraries, and travel support inquiries. Scale instantly during peak seasonal travel windows.",
        color: "#f97316",
        badge: "Travel"
      },
      "enterprise": {
        title: "Enterprise-Grade AI Support Platform",
        subtitle: "Scale operations with white-labeled portals, custom LLMs, and priority support.",
        stat: "Custom SLA & SOC2 Certified",
        details: "Built for high-volume organizations needing dedicated cloud environments, fine-tuned custom models, reseller white-labeling, and dedicated support engineering.",
        color: "#3b82f6",
        badge: "Enterprise"
      }
    };

    const item = data[industrySlug];
    if (!item) return null;

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
          color: item.color, background: `${item.color}14`, border: `1px solid ${item.color}30`,
          padding: "6px 12px", borderRadius: "100px", display: "inline-block", marginBottom: "20px"
        }}>
          {item.badge} Solution
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.15 }}>
          {item.title}
        </h1>
        <p style={{ fontSize: "18px", color: "var(--muted-fg)", marginBottom: "40px", lineHeight: 1.6 }}>
          {item.subtitle}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
          <div className="card-gradient-border" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>Key Metric Performance</h3>
            <div style={{ fontSize: "28px", fontWeight: 900, color: item.color, margin: "12px 0" }}>{item.stat}</div>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6 }}>
              Our customer success metrics demonstrate typical client gains upon integrating our tailored AI pipeline within 30 days of setup.
            </p>
          </div>
          <div className="card-gradient-border" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>Capabilities Overview</h3>
            <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginTop: "12px" }}>
              {item.details}
            </p>
          </div>
        </div>

        {/* Call To Action */}
        <div className="card-gradient-border" style={{ padding: "40px", background: `linear-gradient(135deg, ${item.color}08, transparent)` }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}>Ready to deploy for your business?</h2>
          <p style={{ fontSize: "14.5px", color: "var(--muted-fg)", marginBottom: "24px", maxWidth: "540px", margin: "0 auto 24px" }}>
            Schedule a 15-minute strategy call with our product engineers to see a custom live demonstration loaded with your site's data.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <a href="/#contact" className="btn-primary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none" }}>Book Demo</a>
            <a href="/#pricing" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none" }}>View Pricing</a>
          </div>
        </div>
      </div>
    );
  };

  // Router for content
  const renderContent = () => {
    switch (slug) {
      case "about": return renderAbout();
      case "blog": return renderBlog();
      case "changelog": return renderChangelog();
      case "roadmap": return renderRoadmap();
      case "status":
      case "status-page": return renderStatus();
      case "docs": return renderDocs();
      case "api-reference": return renderAPI();
      case "sdks": return renderSDKs();
      case "webhooks": return renderWebhooks();
      case "careers": return renderCareers();
      case "press": return renderPress();

      // Legal Pages
      case "privacy":
        return renderLegal("Privacy Policy", "June 18, 2026", [
          "Assistly values your privacy. We collect personal identification context, usage parameters, and conversational inputs strictly to provide automated customer support features to our enterprise tenants.",
          "Conversational history and uploaded text records are securely parsed using isolated vector embeddings. Tenant data is sandboxed, and LLM context queries do not feed back into public baseline models.",
          "We implement industry-standard AES-256 databases and restrict infrastructure database accesses to authorized DevOps personnel under strict security audits."
        ]);
      case "terms":
        return renderLegal("Terms of Service", "June 18, 2026", [
          "By accessing or using the Assistly customer support AI platform, you agree to comply with our usage guidelines and guarantee the authenticity of uploaded context information.",
          "Accounts are billed dynamically based on chat thresholds, API request quotas, and dynamic database integrations specified in your selected pricing plan.",
          "Assistly is provided 'as is' without warranties. Tenants are responsible for configuring fallback human-agent notifications to handle support outages."
        ]);
      case "cookies":
        return renderLegal("Cookie Policy", "June 18, 2026", [
          "We use persistent session cookies to authenticate users, save dashboard themes, and track widget sessions on tenant websites.",
          "Third-party analytical cookie trackers help us monitor system load performance and user flow navigation routes to optimize latency.",
          "Users can opt-out of cookie tracking configurations at any time via browser settings without affecting core platform functionality."
        ]);
      case "gdpr":
        return renderLegal("GDPR Compliance Statement", "June 18, 2026", [
          "We process customer support and user context logs in compliance with GDPR guidelines. European Union users retain the right to erase, restrict, and export personal information.",
          "We execute Data Processing Agreements (DPAs) with enterprise customers and guarantee that all subprocessors comply with EU privacy protection standards.",
          "For data removal requests or GDPR inquiries, contact our Data Protection Officer directly at dpo@assistly.io."
        ]);
      case "security":
        return renderLegal("Security Standards", "June 18, 2026", [
          "All network requests to Assistly and API endpoints are encrypted in transit using TLS 1.3 and at rest using AES-256 databases.",
          "We run daily automated security scans, hold strict SOC2 audits, and require two-factor authentication (2FA) for administrative console operations.",
          "We run active bug bounty programs to securely report system vulnerabilities and patches. Contact security@assistly.io to report issues."
        ]);

      case "e-commerce":
      case "healthcare":
      case "saas":
      case "finance":
      case "insurance":
      case "education":
      case "travel":
      case "enterprise":
        return renderIndustry(slug);

      default:
        return (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h1 style={{ fontSize: "48px", fontWeight: 900 }}>Page Not Found</h1>
            <p style={{ color: "var(--muted-fg)", marginTop: "12px" }}>The page you are looking for does not exist.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero BG effect */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden", paddingTop: "120px", paddingBottom: "80px", flex: 1 }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", background: "rgba(79, 124, 255, 0.05)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Inner container */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
}
