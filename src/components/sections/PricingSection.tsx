"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter", icon: "🚀",
    price: { monthly: 49, annual: 39 },
    desc: "Perfect for small businesses getting started with AI support.",
    features: ["Up to 1,000 conversations/mo", "1 AI Agent", "Website widget", "PDF & URL training", "Basic analytics", "Email support", "API access"],
    color: "#4f7cff", featured: false, cta: "Start Free Trial",
  },
  {
    name: "Growth", icon: "📈",
    price: { monthly: 149, annual: 119 },
    desc: "For growing teams that need more power and integrations.",
    features: ["Up to 10,000 conversations/mo", "5 AI Agents", "All channels (Web, WhatsApp, FB)", "Database integration", "Human takeover", "Lead capture & sentiment", "Advanced analytics", "Priority support", "Custom branding"],
    color: "#00d4ff", featured: true, cta: "Start Free Trial",
  },
  {
    name: "Agency", icon: "🏢",
    price: { monthly: 399, annual: 319 },
    desc: "For agencies managing multiple client accounts.",
    features: ["Unlimited conversations", "20 AI Agents", "White label platform", "Custom domains", "Multi-tenant management", "AI business insights", "Voice agent (beta)", "Dedicated account manager", "SLA guarantee"],
    color: "#8b5cf6", featured: false, cta: "Start Free Trial",
  },
  {
    name: "Enterprise", icon: "⚡",
    price: { monthly: null, annual: null },
    desc: "Custom plans for large organizations with complex requirements.",
    features: ["Unlimited everything", "Custom AI models", "SSO / SAML", "Audit logs", "Role-based access", "On-premise option", "Custom SLA", "24/7 dedicated support", "Security review"],
    color: "#f59e0b", featured: false, cta: "Contact Sales",
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" style={{ position: "relative", overflow: "hidden", padding: "96px 0", background: "rgba(79,124,255,0.02)" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "350px", background: "rgba(79,124,255,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="badge" style={{ marginBottom: "16px" }}>💰 Pricing</span>
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", marginBottom: "28px" }}>No setup fees. No hidden charges. Cancel anytime.</p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: !annual ? "var(--fg)" : "var(--muted-fg)" }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: "44px", height: "24px", borderRadius: "100px", border: "none", cursor: "pointer",
                background: annual ? "var(--accent)" : "var(--muted-bg)",
                position: "relative", transition: "background 0.3s ease",
              }}
            >
              <motion.div
                animate={{ x: annual ? 21 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{ position: "absolute", top: "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
              />
            </button>
            <span style={{ fontSize: "14px", fontWeight: 600, color: annual ? "var(--fg)" : "var(--muted-fg)" }}>
              Annual
              <span style={{ marginLeft: "6px", padding: "2px 7px", background: "rgba(34,197,94,0.18)", color: "#22c55e", fontSize: "10px", borderRadius: "100px", fontWeight: 700 }}>Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: plan.featured ? -2 : -6 }}
              className={plan.featured ? "pricing-featured" : "card-gradient-border"}
              style={{
                padding: "28px 22px",
                display: "flex", flexDirection: "column",
                borderRadius: "16px",
                border: `1px solid ${plan.featured ? plan.color : "var(--card-border)"}`,
                background: plan.featured
                  ? `linear-gradient(160deg, ${plan.color}12 0%, var(--card-bg) 100%)`
                  : "var(--card-bg)",
                boxShadow: plan.featured ? `0 8px 40px ${plan.color}25` : undefined,
                marginTop: plan.featured ? "-8px" : 0,
              }}
            >
              {/* Icon + name */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>{plan.icon}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "var(--fg)" }}>{plan.name}</h3>
                <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", marginTop: "4px", lineHeight: 1.6 }}>{plan.desc}</p>
              </div>

              {/* Price */}
              <div style={{ marginBottom: "22px", minHeight: "56px" }}>
                {plan.price.monthly ? (
                  <>
                    <motion.div
                      key={annual ? "a" : "m"}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}
                    >
                      <span style={{ fontSize: "40px", fontWeight: 900, color: "var(--fg)", lineHeight: 1 }}>
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--muted-fg)", paddingBottom: "4px" }}>/mo</span>
                    </motion.div>
                    {annual && (
                      <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px" }}>
                        ${(plan.price.monthly! - plan.price.annual!) * 12}/yr saved
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: "34px", fontWeight: 900, color: "var(--fg)", lineHeight: 1 }}>Custom</div>
                )}
              </div>

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1, marginBottom: "22px", listStyle: "none" }}>
                {plan.features.map((feat, fi) => (
                  <li key={fi} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <Check style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px", color: plan.color }} />
                    <span style={{ fontSize: "12.5px", color: "var(--muted-fg)" }}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={plan.featured ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", padding: "12px", fontSize: "14px", justifyContent: "center" }}
              >
                {plan.cta}
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "var(--muted-fg)" }}>
          All plans include a <strong style={{ color: "var(--fg)" }}>14-day free trial</strong> with no credit card required.{" "}
          <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Compare all features →</a>
        </motion.p>
      </div>
    </section>
  );
}
