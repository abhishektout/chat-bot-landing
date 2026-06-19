"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCw, MoonStar, Unplug, TrendingUp, Eye, AlertTriangle } from "lucide-react";

const problems = [
  { icon: Clock, title: "Customers wait too long", description: "Average response times of 12+ hours frustrate customers and drive them to competitors.", stat: "12h avg wait time", color: "#ef4444" },
  { icon: RefreshCw, title: "Repetitive questions drain teams", description: "Support agents spend 70% of their time answering the same questions over and over.", stat: "70% repetitive tasks", color: "#f97316" },
  { icon: MoonStar, title: "Leads lost after hours", description: "Without 24/7 coverage, businesses lose 65% of potential customers who reach out at night.", stat: "65% leads lost", color: "#eab308" },
  { icon: Unplug, title: "Data is siloed and disconnected", description: "Support agents can't access order history, CRM data, or product info in real-time.", stat: "4+ systems to check", color: "#8b5cf6" },
  { icon: TrendingUp, title: "Support costs keep rising", description: "Hiring more agents to handle volume is expensive and doesn't scale efficiently.", stat: "₹10,00,000+ per agent/year", color: "#ec4899" },
  { icon: Eye, title: "Conversations go unanalyzed", description: "Valuable insights hidden in thousands of conversations are never acted on.", stat: "98% conversations lost", color: "#06b6d4" },
];

export default function ProblemSection() {
  return (
    <section id="problem" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "600px", height: "600px",
        background: "rgba(239,68,68,0.04)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div className="layout-container" style={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <AlertTriangle style={{ width: "12px", height: "12px" }} />
            The Problem
          </span> */}
          <h2 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "20px" }}>
            Customer Support Is{" "}
            <span className="gradient-text">Broken</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Traditional customer support costs too much, moves too slow, and loses too many opportunities.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              // whileHover={{ y: -5, boxShadow: `0 24px 60px var(--shadow)` }}
              className="card-gradient-border"
              style={{ padding: "24px" }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "14px", flexShrink: 0,
                  background: `${p.color}14`,
                  border: `1px solid ${p.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <p.icon style={{ width: "20px", height: "20px", color: p.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>{p.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.65, marginBottom: "12px" }}>{p.description}</p>
                  <span style={{
                    display: "inline-flex", padding: "4px 10px", borderRadius: "8px",
                    fontSize: "11px", fontWeight: 700,
                    background: `${p.color}14`, color: p.color,
                  }}>
                    {p.stat}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Arrow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: "56px", textAlign: "center" }}
        >
          <p style={{ fontSize: "17px", fontWeight: 600, color: "var(--muted-fg)", marginBottom: "16px" }}>There has to be a better way.</p>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "2px solid var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto", fontSize: "18px", color: "var(--accent)", fontWeight: 700,
            }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
