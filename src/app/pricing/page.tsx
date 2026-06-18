"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    icon: "bi bi-rocket-takeoff",
    price: { monthly: 3999, annual: 3199 },
    desc: "Perfect for small businesses getting started with AI support.",
    features: [
      "Up to 1,000 conversations/mo",
      "1 AI Agent",
      "Website widget",
      "PDF & URL training",
      "Basic analytics",
      "Email support",
      "API access",
    ],
    color: "#4f7cff",
    featured: false,
  },
  {
    name: "Growth",
    icon: "bi bi-graph-up-arrow",
    price: { monthly: 11999, annual: 9599 },
    desc: "For growing teams that need more power and integrations.",
    features: [
      "Up to 10,000 conversations/mo",
      "5 AI Agents",
      "All channels (Web, WhatsApp, FB)",
      "Database integration",
      "Human takeover",
      "Lead capture & sentiment",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    color: "#00d4ff",
    featured: true,
  },
  {
    name: "Agency",
    icon: "bi bi-building",
    price: { monthly: 31999, annual: 25599 },
    desc: "For agencies managing multiple client accounts.",
    features: [
      "Unlimited conversations",
      "20 AI Agents",
      "White label platform",
      "Custom domains",
      "Multi-tenant management",
      "AI business insights",
      "Voice agent (beta)",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    color: "#8b5cf6",
    featured: false,
  },
  {
    name: "Enterprise",
    icon: "bi bi-lightning-charge",
    price: { monthly: null, annual: null },
    desc: "Custom plans for large organizations with complex requirements.",
    features: [
      "Unlimited everything",
      "Custom AI models",
      "SSO / SAML",
      "Audit logs",
      "Role-based access",
      "On-premise option",
      "Custom SLA",
      "24/7 dedicated support",
      "Security review",
    ],
    color: "#f59e0b",
    featured: false,
  },
];

const TRUST_BADGES = ["SOC 2 Certified", "GDPR Compliant", "99.9% Uptime SLA", "ISO 27001"];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <SubpageLayout>
        {/* Breadcrumb */}
        <nav
          style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)", fontWeight: 600 }}>Pricing</span>
        </nav>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "18px",
            }}
          >
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", marginBottom: "28px" }}>
            No setup fees. No hidden charges. Cancel anytime.
          </p>

          {/* Annual / Monthly toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: !annual ? "var(--fg)" : "var(--muted-fg)" }}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle billing period"
              style={{
                width: "44px", height: "24px", borderRadius: "100px", border: "none", cursor: "pointer",
                background: annual ? "var(--accent)" : "var(--muted-bg)",
                position: "relative", transition: "background 0.3s ease",
              }}
            >
              <motion.div
                animate={{ x: annual ? 21 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{
                  position: "absolute", top: "3px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
            </button>
            <span style={{ fontSize: "14px", fontWeight: 600, color: annual ? "var(--fg)" : "var(--muted-fg)" }}>
              Annual{" "}
              <span
                style={{
                  marginLeft: "6px", padding: "2px 7px",
                  background: "rgba(34,197,94,0.18)", color: "#22c55e",
                  fontSize: "10px", borderRadius: "100px", fontWeight: 700,
                }}
              >
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start" style={{ marginBottom: "40px" }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className={plan.featured ? "pricing-featured card" : "card-gradient-border"}
              style={{
                padding: "28px 22px",
                display: "flex", flexDirection: "column",
                borderRadius: "16px",
                border: plan.featured ? "1px solid var(--accent)" : "1px solid var(--card-border)",
                background: plan.featured
                  ? "linear-gradient(160deg, rgba(79, 124, 255, 0.08) 0%, var(--card-bg) 100%)"
                  : "var(--card-bg)",
                boxShadow: plan.featured ? "0 8px 30px var(--shadow)" : undefined,
                marginTop: plan.featured ? "-8px" : 0,
              }}
            >
              {/* Icon + name */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>
                  <i className={plan.icon} style={{ color: plan.color }} />
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--fg)" }}>{plan.name}</h2>
                <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", marginTop: "4px", lineHeight: 1.6 }}>
                  {plan.desc}
                </p>
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
                        ₹{(annual ? plan.price.annual : plan.price.monthly)?.toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--muted-fg)", paddingBottom: "4px" }}>/mo</span>
                    </motion.div>
                    {annual && (
                      <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px" }}>
                        ₹{((plan.price.monthly! - plan.price.annual!) * 12).toLocaleString("en-IN")}/yr saved
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: "34px", fontWeight: 900, color: "var(--fg)", lineHeight: 1 }}>Custom</div>
                )}
              </div>

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1, marginBottom: "22px", listStyle: "none" }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <Check style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px", color: plan.color }} />
                    <span style={{ fontSize: "12.5px", color: "var(--muted-fg)" }}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.price.monthly ? "/get-started" : "/book-demo"}
                className={plan.featured ? "btn-primary" : "btn-secondary"}
                style={{
                  width: "100%", padding: "12px", fontSize: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "6px", textDecoration: "none", borderRadius: "10px",
                }}
              >
                {plan.price.monthly ? "Start Free Trial" : "Contact Sales"}
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fine print */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginBottom: "40px" }}>
          All plans include a{" "}
          <strong style={{ color: "var(--fg)" }}>14-day free trial</strong> with no credit card required.
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px",
            padding: "28px", borderTop: "1px solid var(--card-border)",
          }}
        >
          {TRUST_BADGES.map((badge) => (
            <div key={badge} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--muted-fg)" }}>
              <div
                style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "rgba(34,197,94,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
              </div>
              {badge}
            </div>
          ))}
        </div>
    </SubpageLayout>
  );
}
