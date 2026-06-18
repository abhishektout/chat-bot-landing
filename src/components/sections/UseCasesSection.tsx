"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Heart, Shield, BookOpen, TrendingUp, Layers, Plane, Briefcase } from "lucide-react";

const industries = [
  { icon: ShoppingCart, name: "E-Commerce", slug: "e-commerce", desc: "Order tracking, returns, product queries, and upselling — automated.", stat: "45% fewer support tickets", color: "#4f7cff" },
  { icon: Heart, name: "Healthcare", slug: "healthcare", desc: "Appointment scheduling, insurance queries, and patient support at scale.", stat: "60% faster response", color: "#ec4899" },
  { icon: Shield, name: "Insurance", slug: "insurance", desc: "Claims status, policy information, and premium support for every client.", stat: "3.2× more claims resolved", color: "#f59e0b" },
  { icon: BookOpen, name: "Education", slug: "education", desc: "Student queries, course information, and enrollment support 24/7.", stat: "40% enrollment increase", color: "#10b981" },
  { icon: TrendingUp, name: "Finance", slug: "finance", desc: "Account queries, transaction history, and regulatory-compliant support.", stat: "99.9% compliance rate", color: "#00d4ff" },
  { icon: Layers, name: "SaaS", slug: "saas", desc: "Onboarding, technical support, and customer success at enterprise scale.", stat: "70% support cost reduction", color: "#8b5cf6" },
  { icon: Plane, name: "Travel", slug: "travel", desc: "Booking management, itinerary support, and real-time travel assistance.", stat: "4.8★ customer rating", color: "#f97316" },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <Briefcase style={{ width: "12px", height: "12px" }} />
            Industries
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            Built for Every<br /><span className="gradient-text">Industry</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            No matter your industry, Assistly adapts to your business processes and customer needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind, i) => (
            <Link key={i} href={`/${ind.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-gradient-border"
                style={{ padding: "22px", cursor: "pointer", position: "relative", overflow: "hidden", height: "100%" }}
              >
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
                  background: `linear-gradient(135deg, ${ind.color}10, transparent)`,
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "16px",
                    background: `${ind.color}16`, border: `1px solid ${ind.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "14px", boxShadow: `0 6px 18px ${ind.color}14`,
                  }}>
                    <ind.icon style={{ width: "22px", height: "22px", color: ind.color }} />
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>{ind.name}</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", lineHeight: 1.65, marginBottom: "12px" }}>{ind.desc}</p>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: ind.color }}>{ind.stat} →</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
