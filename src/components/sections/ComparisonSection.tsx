"use client";

import { motion } from "framer-motion";
import { Check, X, Minus, BarChart3 } from "lucide-react";

const features = [
  "AI Responses", "Human Takeover", "Database Integration",
  "Website Training", "Lead Capture", "Sentiment Detection",
  "Business Insights", "Voice Agent", "Multi-Channel", "White Label", "Custom AI Models",
];

const columns = [
  { name: "Assistly", subtitle: "Our Platform", highlight: true, values: [true, true, true, true, true, true, true, true, true, true, true], price: "From ₹3,999/mo", color: "#4f7cff" },
  { name: "Live Chat", subtitle: "Traditional", highlight: false, values: [false, true, false, false, false, false, false, false, "partial", false, false], price: "From ₹16,000/mo", color: "#8899bb" },
  { name: "Basic AI Bots", subtitle: "Rule-based", highlight: false, values: ["partial", false, false, false, "partial", false, false, false, "partial", false, false], price: "From ₹8,000/mo", color: "#8899bb" },
];

function Cell({ v }: { v: boolean | "partial" }) {
  if (v === true) return <Check style={{ width: "18px", height: "18px", color: "#22c55e", margin: "0 auto" }} />;
  if (v === "partial") return <Minus style={{ width: "18px", height: "18px", color: "#eab308", margin: "0 auto" }} />;
  return <X style={{ width: "18px", height: "18px", color: "#ef4444", margin: "0 auto" }} />;
}

export default function ComparisonSection() {
  return (
    <section id="comparison" style={{ position: "relative", overflow: "hidden", padding: "50px 0", background: "rgba(79,124,255,0.02)" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "300px", background: "rgba(79,124,255,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "52px" }}
        >
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <BarChart3 style={{ width: "12px", height: "12px" }} />
            Comparison
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            Why  <span className="gradient-text">Choose Assistly?</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)" }}>See how Assistly stacks up against the competition.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ overflowX: "auto" }}
        >
          <div style={{ minWidth: "560px" }}>
            {/* Headers */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              <div />
              {columns.map((col, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center", padding: "16px 8px",
                    borderRadius: "14px 14px 0 0",
                    background: col.highlight ? "rgba(79,124,255,0.12)" : "var(--card-bg)",
                    border: `1px solid ${col.highlight ? "rgba(79,124,255,0.4)" : "var(--card-border)"}`,
                    borderBottom: "none",
                  }}
                >
                  <div style={{ fontSize: "15px", fontWeight: 800, color: col.highlight ? "#4f7cff" : "var(--fg)" }}>{col.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-fg)", marginTop: "2px" }}>{col.subtitle}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px", color: col.highlight ? "#4f7cff" : "var(--muted-fg)" }}>{col.price}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {features.map((feat, fi) => (
              <motion.div
                key={fi}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: fi * 0.04 }}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
              >
                <div style={{
                  padding: "12px 16px", display: "flex", alignItems: "center",
                  border: `1px solid var(--card-border)`,
                  borderTop: fi === 0 ? `1px solid var(--card-border)` : "none",
                  borderRight: "none",
                  background: "var(--card-bg)",
                  borderRadius: fi === features.length - 1 ? "0 0 0 12px" : 0,
                }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--fg)" }}>{feat}</span>
                </div>
                {columns.map((col, ci) => (
                  <div
                    key={ci}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "12px 8px",
                      border: `1px solid ${col.highlight ? "rgba(79,124,255,0.3)" : "var(--card-border)"}`,
                      borderTop: fi === 0 ? undefined : "none",
                      borderLeft: "none",
                      background: col.highlight ? "rgba(79,124,255,0.05)" : "var(--card-bg)",
                      borderRadius: fi === features.length - 1 && ci === columns.length - 1 ? "0 0 12px 0" : 0,
                    }}
                  >
                    <Cell v={col.values[fi] as boolean | "partial"} />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px" }}>
          {[
            { Icon: Check, color: "#22c55e", label: "Full support" },
            { Icon: Minus, color: "#eab308", label: "Partial" },
            { Icon: X, color: "#ef4444", label: "Not available" },
          ].map(({ Icon, color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon style={{ width: "15px", height: "15px", color }} />
              <span style={{ fontSize: "12px", color: "var(--muted-fg)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
