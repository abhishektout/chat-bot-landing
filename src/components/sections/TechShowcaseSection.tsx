"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const techBadges = {
  "AI Models": [
    { name: "OpenAI GPT-4", icon: "bi bi-robot", color: "#10a37f" },
    { name: "Claude 3.5", icon: "bi bi-braces", color: "#b08cff" },
    { name: "Gemini Pro", icon: "bi bi-stars", color: "#4285f4" },
    { name: "Llama 3", icon: "bi bi-cpu", color: "#f97316" },
  ],
  "Knowledge Sources": [
    { name: "PDF Training", icon: "bi bi-file-earmark-pdf", color: "#ef4444" },
    { name: "FAQ Training", icon: "bi bi-question-circle", color: "#f59e0b" },
    { name: "Website Crawl", icon: "bi bi-globe", color: "#4f7cff" },
    { name: "Database Sync", icon: "bi bi-database", color: "#8b5cf6" },
  ],
  "Channels": [
    { name: "Website Widget", icon: "bi bi-chat-dots", color: "#4f7cff" },
    { name: "WhatsApp", icon: "bi bi-whatsapp", color: "#25d366" },
    { name: "Facebook", icon: "bi bi-facebook", color: "#1877f2" },
    { name: "Instagram", icon: "bi bi-instagram", color: "#e4405f" },
    { name: "Telegram", icon: "bi bi-telegram", color: "#2aabee" },
  ],
  "Enterprise": [
    { name: "SSO / SAML", icon: "bi bi-shield-lock", color: "#f59e0b" },
    { name: "API Access", icon: "bi bi-lightning-charge", color: "#00d4ff" },
    { name: "White Label", icon: "bi bi-tags", color: "#ec4899" },
    { name: "Custom Domains", icon: "bi bi-globe2", color: "#22c55e" },
  ],
  "Infrastructure": [
    { name: "PostgreSQL", icon: "bi bi-database-fill", color: "#336791" },
    { name: "Vector DB", icon: "bi bi-cpu-fill", color: "#8b5cf6" },
    { name: "RAG Architecture", icon: "bi bi-search", color: "#4f7cff" },
    { name: "Real-Time Analytics", icon: "bi bi-bar-chart-line", color: "#00d4ff" },
    { name: "WebSocket", icon: "bi bi-plug", color: "#22c55e" },
  ],
};

const archLayers = [
  { label: "Customer Channels", items: ["Website", "WhatsApp", "Facebook", "Telegram", "Voice"], color: "#4f7cff" },
  { label: "AI Processing Layer", items: ["Intent Detection", "Sentiment Analysis", "Context Memory", "Language Model"], color: "#00d4ff" },
  { label: "Knowledge & Data", items: ["PDF / FAQ / URLs", "PostgreSQL / MySQL", "REST APIs / CRM", "Vector Database"], color: "#8b5cf6" },
  { label: "Human Layer", items: ["Agent Dashboard", "Smart Routing", "AI Suggestions", "Handoff Protocol"], color: "#22c55e" },
  { label: "Analytics & Insights", items: ["Conversation Mining", "Lead Scoring", "Business Insights", "Performance KPIs"], color: "#f59e0b" },
];

export default function TechShowcaseSection() {
  return (
    <section id="tech" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <Settings style={{ width: "12px", height: "12px" }} />
            Technology
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            Built on Modern<br /><span className="gradient-text">AI Infrastructure</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Enterprise-grade infrastructure powering AI conversations at global scale.
          </p>
        </motion.div>

        {/* Tech badge categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "64px" }}>
          {Object.entries(techBadges).map(([category, items], catIdx) => (
            <motion.div key={category} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: catIdx * 0.08 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>{category}</h3>
                <div style={{ flex: 1, height: "1px", background: "var(--card-border)" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.04 + i * 0.04 }}
                    whileHover={{ y: -1 }}
                    className="card-gradient-border"
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 14px", cursor: "default" }}
                  >
                    <span style={{ fontSize: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={item.icon} style={{ color: "var(--fg)" }} />
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", whiteSpace: "nowrap" }}>{item.name}</span>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}`, marginLeft: "4px" }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture diagram */}
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card-gradient-border" style={{ padding: "36px 28px" }}>
          <h3 style={{ textAlign: "center", fontSize: "18px", fontWeight: 800, color: "var(--fg)", marginBottom: "32px" }}>Platform Architecture</h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
            {archLayers.map((layer, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.85 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    width: "100%", maxWidth: "720px",
                    borderRadius: "12px", padding: "14px 18px",
                    border: `1px solid ${layer.color}35`,
                    background: `${layer.color}08`,
                    display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, color: layer.color, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: "140px" }}>{layer.label}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
                    {layer.items.map((item) => (
                      <span key={item} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "8px", background: `${layer.color}14`, border: `1px solid ${layer.color}28`, color: "var(--fg)", fontWeight: 500 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
                {i < archLayers.length - 1 && (
                  <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.08 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0" }}>
                    <div style={{ width: "1px", height: "18px", background: `linear-gradient(to bottom, ${layer.color}, ${archLayers[i + 1].color})`, opacity: 0.6 }} />
                    <span style={{ color: layer.color, fontSize: "14px", lineHeight: 1 }}>↓</span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
