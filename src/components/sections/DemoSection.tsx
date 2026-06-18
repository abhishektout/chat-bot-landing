"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Database, BookOpen, User, LayoutDashboard, Zap, TrendingUp, ArrowUp, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "integration", label: "Data Integration", icon: Database },
  { id: "handoff", label: "Human Handoff", icon: User },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const weekData = [
  { name: "Mon", conversations: 420, resolved: 390, leads: 45 },
  { name: "Tue", conversations: 580, resolved: 540, leads: 62 },
  { name: "Wed", conversations: 490, resolved: 460, leads: 51 },
  { name: "Thu", conversations: 720, resolved: 680, leads: 78 },
  { name: "Fri", conversations: 850, resolved: 810, leads: 94 },
  { name: "Sat", conversations: 320, resolved: 300, leads: 35 },
  { name: "Sun", conversations: 280, resolved: 265, leads: 28 },
];

const chartTooltipStyle = {
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "var(--fg)",
};

function DashboardTab() {
  return (
    <div style={{ padding: "20px" }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Conversations", value: "12,847", change: "+18%", color: "#4f7cff" },
          { label: "AI Resolution Rate", value: "94.3%", change: "+2.1%", color: "#22c55e" },
          { label: "Leads Captured", value: "1,204", change: "+34%", color: "#f59e0b" },
          { label: "Avg Response", value: "0.8s", change: "-60%", color: "#00d4ff" },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: "var(--muted-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px", padding: "14px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--muted-fg)", marginBottom: "4px" }}>{m.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: "var(--fg)" }}>{m.value}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e" }}>{m.change} vs last week</div>
          </motion.div>
        ))}
      </div>
      <div style={{ background: "var(--muted-bg)", marginTop: "1rem", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", marginBottom: "12px" }}>Conversation Volume (This Week)</div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f7cff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f7cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: "#8899bb", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="conversations" stroke="#4f7cff" strokeWidth={2} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KnowledgeTab() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", marginBottom: "16px" }}>Knowledge Sources</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { name: "company-docs.pdf", type: "PDF", pages: "142 pages", status: "trained", acc: 97 },
          { name: "https://yoursite.com", type: "URL", pages: "89 pages", status: "trained", acc: 95 },
          { name: "product-faq.pdf", type: "PDF", pages: "28 pages", status: "training", acc: 88 },
          { name: "pricing-guide.pdf", type: "PDF", pages: "12 pages", status: "queued", acc: 0 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", borderRadius: "12px",
              background: "var(--muted-bg)", border: "1px solid var(--card-border)",
            }}
          >
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(79,124,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BookOpen style={{ width: "15px", height: "15px", color: "#4f7cff" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
              <div style={{ fontSize: "11px", color: "var(--muted-fg)" }}>{item.type} · {item.pages}</div>
            </div>
            {item.acc > 0 && <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>{item.acc}%</span>}
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px",
              ...(item.status === "trained"
                ? { background: "rgba(34,197,94,0.15)", color: "#22c55e" }
                : item.status === "training"
                  ? { background: "rgba(234,179,8,0.15)", color: "#eab308" }
                  : { background: "var(--muted-bg)", color: "var(--muted-fg)" }
              ),
            }}>
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IntegrationTab() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", marginBottom: "16px" }}>Connected Data Sources</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { name: "PostgreSQL", type: "Database", icon: "🗄️", status: "connected", queries: "12,847 queries" },
          { name: "Shopify API", type: "E-Commerce", icon: "🛍️", status: "connected", queries: "8,231 queries" },
          { name: "HubSpot CRM", type: "CRM", icon: "📊", status: "connected", queries: "3,402 queries" },
          { name: "Custom REST API", type: "API", icon: "⚡", status: "connected", queries: "5,119 queries" },
          { name: "MySQL Database", type: "Database", icon: "🗄️", status: "pending", queries: "—" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 14px", borderRadius: "12px",
              background: "var(--muted-bg)", border: "1px solid var(--card-border)",
            }}
          >
            <span style={{ fontSize: "20px", width: "24px", textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>{item.name}</div>
              <div style={{ fontSize: "11px", color: "var(--muted-fg)" }}>{item.type} · {item.queries}</div>
            </div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.status === "connected" ? "#22c55e" : "#eab308", animation: "pulseGlow 2s ease-in-out infinite" }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HandoffTab() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Zap, label: "AI detects frustration (Sentiment: 😠 Angry)", color: "#ef4444" },
    { icon: TrendingUp, label: "Escalation triggered automatically", color: "#f59e0b" },
    { icon: User, label: "Human agent Sarah notified with full context", color: "#22c55e" },
    { icon: BarChart3, label: "Resolution achieved — Customer satisfied ✓", color: "#4f7cff" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", marginBottom: "16px" }}>Live Handoff Flow</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {steps.map((s, i) => (
          <motion.div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px",
              border: `1px solid ${i === step ? "rgba(79,124,255,0.5)" : i < step ? "rgba(34,197,94,0.3)" : "var(--card-border)"}`,
              background: i === step ? "rgba(79,124,255,0.08)" : i < step ? "rgba(34,197,94,0.04)" : "var(--muted-bg)",
              transition: "all 0.4s ease",
            }}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
              background: `${s.color}20`, border: `1px solid ${s.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <s.icon style={{ width: "15px", height: "15px", color: s.color }} />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--fg)", flex: 1 }}>{s.label}</span>
            {i < step && <span style={{ color: "#22c55e", fontSize: "16px" }}>✓</span>}
            {i === step && (
              <div style={{ display: "flex", gap: "3px" }}>
                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => setStep((p) => (p + 1) % 5 === 4 ? 0 : p + 1)}
        className="btn-primary"
        style={{ marginTop: "16px", fontSize: "12px", padding: "8px 16px" }}
      >
        Simulate Next Step
      </button>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Weekly Analytics</div>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>
          <ArrowUp style={{ width: "12px", height: "12px" }} /> +34% MoM
        </span>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={weekData} barSize={20}>
          <defs>
            <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f7cff" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fill: "#8899bb", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="conversations" fill="url(#barG)" radius={[4, 4, 0, 0]} name="Conversations" />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5">
        {[
          { label: "Top Question", value: "How does billing work?", icon: "💬" },
          { label: "Abandonment", value: "18 before checkout", icon: "⚠️" },
          { label: "Opportunity", value: "Create pricing FAQ", icon: "💡" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "10px", borderRadius: "10px", background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
            <div style={{ fontSize: "16px", marginBottom: "4px" }}>{item.icon}</div>
            <div style={{ fontSize: "10px", color: "var(--muted-fg)" }}>{item.label}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--fg)" }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabContent: Record<string, React.ComponentType> = { dashboard: DashboardTab, knowledge: KnowledgeTab, integration: IntegrationTab, handoff: HandoffTab, analytics: AnalyticsTab };

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ActiveContent = tabContent[activeTab];

  return (
    <section id="demo" style={{ position: "relative", overflow: "hidden", padding: "50px 0", background: "rgba(79,124,255,0.02)" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "rgba(79,124,255,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <Play style={{ width: "12px", height: "12px" }} fill="currentColor" />
            Live Demo
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            See the Platform in <span className="gradient-text">Action</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)" }}>Interactive product mockups — no signup required.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass"
          style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 80px var(--shadow)" }}
        >
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center",
            padding: "0 20px", paddingTop: "14px",
            borderBottom: "1px solid var(--card-border)",
            background: "rgba(79,124,255,0.04)",
            overflowX: "auto",
            gap: "2px",
          }}>
            <div style={{ display: "flex", gap: "5px", marginRight: "16px", flexShrink: 0 }}>
              {["#ef4444", "#eab308", "#22c55e"].map((c) => (
                <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, opacity: 0.75 }} />
              ))}
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 14px", fontSize: "12px", fontWeight: 600,
                  cursor: "pointer", background: "none", border: "none", whiteSpace: "nowrap",
                  borderBottom: `2px solid ${activeTab === tab.id ? "var(--accent)" : "transparent"}`,
                  color: activeTab === tab.id ? "var(--accent)" : "var(--muted-fg)",
                  transition: "color 0.2s, border-color 0.2s",
                  flexShrink: 0,
                }}
              >
                <tab.icon style={{ width: "14px", height: "14px" }} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ minHeight: "380px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ActiveContent />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
