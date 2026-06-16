"use client";

import { motion } from "framer-motion";
import { Globe, FileText, Database, User, Sparkles, Target, Heart, BookOpen, Wifi, Palette, Mic, BarChart3 } from "lucide-react";

const features = [
  { icon: Globe, title: "Website URL Training", description: "Paste a website URL and automatically train the AI on your entire website content in minutes.", color: "#4f7cff", tag: "Training" },
  { icon: FileText, title: "PDF Knowledge Base", description: "Upload PDFs and instantly create an intelligent support assistant with deep document understanding.", color: "#00d4ff", tag: "Knowledge" },
  { icon: Database, title: "Business Data Integration", description: "Connect PostgreSQL, MySQL, REST APIs, CRMs, and internal systems for real-time data access.", color: "#8b5cf6", tag: "Integration" },
  { icon: User, title: "Human Takeover", description: "Escalate conversations to live agents instantly with full context and conversation history.", color: "#22c55e", tag: "Handoff" },
  { icon: Sparkles, title: "AI Suggested Replies", description: "AI assists your human agents with intelligent response suggestions, boosting their productivity 3×.", color: "#f59e0b", tag: "AI Assist" },
  { icon: Target, title: "Lead Capture AI", description: "Automatically identify and capture customer information and sales opportunities 24/7.", color: "#ec4899", tag: "Revenue" },
  { icon: Heart, title: "AI Sentiment Detection", description: "Detect frustrated or angry customers in real-time and trigger automatic human intervention.", color: "#ef4444", tag: "Smart Routing" },
  { icon: BookOpen, title: "Training Suggestions", description: "Identify unanswered questions and get AI-powered suggestions to continuously improve accuracy.", color: "#06b6d4", tag: "Improvement" },
  { icon: Wifi, title: "Multi-Channel Support", description: "Deploy across Website, WhatsApp, Facebook, Instagram, and Telegram from a single dashboard.", color: "#10b981", tag: "Omnichannel" },
  { icon: Palette, title: "White Label Platform", description: "Custom branding, domains, colors, CSS, and HTML templates — sell it as your own product.", color: "#6366f1", tag: "White Label" },
  { icon: Mic, title: "Voice Agent", description: "Enable natural voice conversations with AI for phone support and voice-first interfaces.", color: "#d946ef", tag: "Voice" },
  { icon: BarChart3, title: "AI Business Insights", description: "Discover customer trends, identify missing knowledge, and uncover hidden revenue opportunities.", color: "#f97316", tag: "Analytics" },
];

export default function FeaturesSection() {
  return (
    <section id="features" style={{ position: "relative", overflow: "hidden", padding: "96px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
      <div style={{ position: "absolute", top: "20%", right: 0, width: "400px", height: "400px", background: "rgba(79,124,255,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", left: 0, width: "300px", height: "300px", background: "rgba(0,212,255,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span className="badge" style={{ marginBottom: "16px" }}>🚀 Platform Features</span>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "20px" }}>
            Everything You Need to<br />
            <span className="gradient-text">Automate Support</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
            12 powerful capabilities working together to deliver exceptional customer experiences at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 20px 50px var(--shadow)` }}
              className="card-gradient-border"
              style={{ padding: "22px", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              {/* Hover glow */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
                background: `radial-gradient(circle at 50% 0%, ${f.color}08, transparent 70%)`,
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "14px",
                    background: `${f.color}16`,
                    border: `1px solid ${f.color}32`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <f.icon style={{ width: "20px", height: "20px", color: f.color }} />
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, padding: "4px 9px",
                    borderRadius: "8px", background: `${f.color}16`, color: f.color,
                  }}>
                    {f.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px", lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", lineHeight: 1.65 }}>{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
