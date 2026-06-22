"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Shopify", abbr: "SH", color: "#96bf48" },
  { name: "Zendesk", abbr: "ZD", color: "#03363d" },
  { name: "HubSpot", abbr: "HS", color: "#ff7a59" },
  { name: "Intercom", abbr: "IC", color: "#0057ff" },
  { name: "Salesforce", abbr: "SF", color: "#1798c1" },
  { name: "Stripe", abbr: "ST", color: "#6772e5" },
  { name: "Notion", abbr: "NO", color: "#ffffff" },
  { name: "Linear", abbr: "LN", color: "#5e6ad2" },
  { name: "Vercel", abbr: "VC", color: "#ffffff" },
  { name: "Figma", abbr: "FG", color: "#f24e1e" },
];

export default function SocialProof() {
  const triple = [...logos, ...logos, ...logos];
  // display: grid;grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));gap: 16px;margin-top: 48px;opacity: 1;transform: none;display: flex;justify-content: space-around;

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "56px 0", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
      <div className="layout-container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "36px" }}
        >
          Trusted by modern businesses worldwide
        </motion.p>

        {/* CSS marquee */}
        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-100% / 3)); }
          }
          .marquee-logos {
            display: flex;
            width: max-content;
            gap: 2rem;
            align-items: center;
            animation: marquee-scroll 32s linear infinite;
          }
          .marquee-logos:hover { animation-play-state: paused; }
        `}</style>

        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Fade left */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 10, pointerEvents: "none" }} />
          {/* Fade right */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 10, pointerEvents: "none" }} />

          <div className="marquee-logos">
            {triple.map((logo, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  opacity: 0.45, cursor: "pointer", flexShrink: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: "rgba(79,124,255,0.1)",
                  border: "1px solid var(--card-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800, color: "var(--accent)",
                }}>
                  {logo.abbr}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", whiteSpace: "nowrap" }}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", justifyContent: 'space-around', gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginTop: "48px" }}
        >
          {[
            { value: "60%", label: "Reduction in support costs", color: "#4f7cff" },
            { value: "94.3%", label: "AI resolution accuracy", color: "#00d4ff" },
            { value: "0.8s", label: "Average AI response time", color: "#8b5cf6" },
            { value: "3.4×", label: "More leads captured after hours", color: "#22c55e" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              style={{ textAlign: "center" }}
            >
              <div style={{
                fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, marginBottom: "6px",
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-fg)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
