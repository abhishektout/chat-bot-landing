"use client";

import { motion } from "framer-motion";
import { Globe, Key, Code2, Cpu, FileText, Users, Headphones, Shield } from "lucide-react";

const entFeatures = [
  { icon: Globe, title: "Custom Domains", desc: "Deploy on your own domain with SSL certificates automatically managed.", color: "#4f7cff" },
  { icon: Key, title: "SSO Authentication", desc: "SAML 2.0 and OIDC support for enterprise identity providers.", color: "#00d4ff" },
  { icon: Code2, title: "API First", desc: "RESTful APIs for every feature with comprehensive SDK support.", color: "#8b5cf6" },
  { icon: Cpu, title: "Custom AI Models", desc: "Fine-tune AI on your specific data and terminology.", color: "#22c55e" },
  { icon: FileText, title: "Audit Logs", desc: "Complete audit trail for all actions and conversations.", color: "#f59e0b" },
  { icon: Users, title: "Role Management", desc: "Granular permissions for admins, agents, and viewers.", color: "#ec4899" },
  { icon: Headphones, title: "Dedicated Support", desc: "99.9% SLA with dedicated enterprise support team.", color: "#06b6d4" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II, GDPR, HIPAA compliant infrastructure.", color: "#ef4444" },
];

const codeLines = [
  { text: "// Assistly API — Create conversation", comment: true },
  { text: "const response = await assistly.conversations.create({", comment: false },
  { text: "  customer: {", comment: false },
  { text: "    id: \"cust_847201\",", comment: false },
  { text: "    email: \"john@company.com\",", comment: false },
  { text: "    name: \"John Smith\"", comment: false },
  { text: "  },", comment: false },
  { text: "  channel: \"website\",", comment: false },
  { text: "  metadata: { page: \"/pricing\", plan: \"enterprise\" }", comment: false },
  { text: "});", comment: false },
  { text: "", comment: false },
  { text: "// AI responds in < 800ms", comment: true },
  { text: "const { message, sentiment, leadScore } = response;", comment: false },
  { text: "console.log(`Sentiment: ${sentiment}`);   // \"positive\"", comment: true },
  { text: "console.log(`Lead Score: ${leadScore}`);  // 87", comment: true },
];

export default function EnterpriseSection() {
  return (
    <section id="enterprise" style={{ position: "relative", overflow: "hidden", padding: "50px 0", background: "rgba(79,124,255,0.02)" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
      <div style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: "450px", height: "450px", background: "rgba(79,124,255,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", width: "400px", height: "400px", background: "rgba(0,212,255,0.04)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div className="layout-container">
        {/* Enterprise header */}
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "52px" }}>
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <Shield style={{ width: "12px", height: "12px" }} />
            Enterprise
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            Advanced Features for <span className="gradient-text">Growing Businesses</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Security, compliance, and control at enterprise scale — without the enterprise complexity.
          </p>
        </motion.div>

        {/* Enterprise feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          {entFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="card-gradient-border"
              style={{ padding: "20px" }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${f.color}16`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                <f.icon style={{ width: "18px", height: "18px", color: f.color }} />
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "6px" }}>{f.title}</h3>
              <p style={{ fontSize: "12px", color: "var(--muted-fg)", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Developer section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="badge" style={{ marginBottom: "16px" }}>
              <Code2 style={{ width: "12px", height: "12px" }} />
              For Developers
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "12px", marginBottom: "20px" }}>
              API-First Architecture for <span className="gradient-text">Any Stack</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {[
                "RESTful API with comprehensive documentation",
                "WebSocket support for real-time conversations",
                "Webhook support for all platform events",
                "Official SDKs for Node.js, Python, PHP, Ruby",
                "White-label embedding in minutes",
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
                  </div>
                  <span style={{ fontSize: "14px", color: "var(--muted-fg)" }}>{item}</span>
                </motion.div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>
              <Code2 style={{ width: "16px", height: "16px" }} />
              View API Docs
            </motion.button>
          </motion.div>

          {/* Code block */}
          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="code-block">
              <div style={{ display: "flex", gap: "5px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid rgba(79,124,255,0.15)" }}>
                {["#ef4444", "#eab308", "#22c55e"].map((c) => <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                <span style={{ marginLeft: "8px", fontSize: "11px", color: "#4a5568" }}>api-example.ts</span>
              </div>
              {codeLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.035 }}
                  style={{ color: line.comment ? "#6e7681" : "#c9d1e3", minHeight: "1.7em" }}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
