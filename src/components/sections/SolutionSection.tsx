"use client";

import { motion } from "framer-motion";
import { Zap, User, Database, BarChart3, Target, Globe } from "lucide-react";

const pillars = [
  { icon: Zap, label: "AI Agent", color: "#4f7cff", desc: "Handles 94% of queries instantly" },
  { icon: User, label: "Human Agent", color: "#22c55e", desc: "Seamless handoff when needed" },
  { icon: Database, label: "Business Data", color: "#8b5cf6", desc: "Real-time data access" },
  { icon: BarChart3, label: "Analytics", color: "#00d4ff", desc: "Deep conversation insights" },
  { icon: Target, label: "Lead Generation", color: "#f59e0b", desc: "Capture opportunities 24/7" },
  { icon: Globe, label: "Multi-Channel", color: "#ec4899", desc: "Web, WhatsApp, Social, Voice" },
];

export default function SolutionSection() {
  return (
    <section id="solution" style={{ position: "relative", overflow: "hidden", padding: "96px 0", background: "rgba(79,124,255,0.02)" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "rgba(79,124,255,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span className="badge" style={{ marginBottom: "16px" }}>✨ The Solution</span>
          <h2 style={{ fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "20px" }}>
            One Platform.{" "}
            <span className="gradient-text">Complete</span>
            <br />Customer Support Automation.
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
            Everything you need to deliver world-class customer support, powered by AI and enhanced by humans.
          </p>
        </motion.div>

        {/* Center hub */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "56px" }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ position: "relative" }}
          >
            <div
              className="pulse-glow"
              style={{
                width: "112px", height: "112px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 50px var(--accent-glow)",
                color: "#fff",
              }}
            >
              <Zap style={{ width: "32px", height: "32px" }} fill="white" />
              <span style={{ fontSize: "11px", fontWeight: 800, marginTop: "4px", textAlign: "center", lineHeight: 1.2 }}>Support<br/>AI</span>
            </div>
            {/* Orbit rings */}
            <div className="spin-slow" style={{ position: "absolute", inset: "-48px", borderRadius: "50%", border: "1px dashed rgba(79,124,255,0.3)" }} />
            <div className="spin-slow-rev" style={{ position: "absolute", inset: "-80px", borderRadius: "50%", border: "1px dashed rgba(0,212,255,0.2)" }} />
          </motion.div>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 20px 50px var(--shadow)` }}
              className="card-gradient-border"
              style={{ padding: "24px", textAlign: "center" }}
            >
              <div style={{
                width: "56px", height: "56px", borderRadius: "18px",
                background: `${pillar.color}16`, border: `1px solid ${pillar.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px", boxShadow: `0 8px 24px ${pillar.color}18`,
              }}>
                <pillar.icon style={{ width: "24px", height: "24px", color: pillar.color }} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", marginBottom: "6px" }}>{pillar.label}</h3>
              <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
