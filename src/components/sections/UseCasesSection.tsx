"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Heart, Shield, BookOpen, TrendingUp, Layers, Plane } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import type { LucideIcon } from "lucide-react";

/** Map slugs to Lucide icons (kept here to avoid bloating the data file) */
const ICON_MAP: Record<string, LucideIcon> = {
  "e-commerce": ShoppingCart,
  healthcare: Heart,
  insurance: Shield,
  education: BookOpen,
  finance: TrendingUp,
  saas: Layers,
  travel: Plane,
};

export default function UseCasesSection() {
  // Enterprise is not shown in the grid (it's a separate top-level pitch)
  const displayIndustries = INDUSTRIES.filter((i) => i.slug !== "enterprise");

  return (
    <section id="use-cases" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

      <div className="layout-container" style={{ position: "relative", zIndex: 10 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <h2
            style={{
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: "18px",
            }}
          >
            Built for Every
            <br />
            <span className="gradient-text">Industry</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            No matter your industry, Assistly adapts to your business processes and customer needs.
          </p>
        </motion.div>

        {/* Industry card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayIndustries.map((ind, i) => {
            const Icon = ICON_MAP[ind.slug] ?? ShoppingCart;
            return (
              <motion.div
                key={ind.slug}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/solutions/${ind.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                >
                  <div
                    className="card-gradient-border"
                    style={{
                      padding: "22px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      height: "100%",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
                  >
                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
                        background: `linear-gradient(135deg, ${ind.color}10, transparent)`,
                      }}
                    />

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: "48px", height: "48px", borderRadius: "16px",
                          background: `${ind.color}16`, border: `1px solid ${ind.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: "14px", boxShadow: `0 6px 18px ${ind.color}14`,
                        }}
                      >
                        <Icon style={{ width: "22px", height: "22px", color: ind.color }} />
                      </div>

                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", marginBottom: "8px" }}>
                        {ind.name}
                      </h3>
                      <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", lineHeight: 1.65, marginBottom: "12px" }}>
                        {ind.description}
                      </p>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: ind.color }}>
                        {ind.stat} {ind.statLabel} →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
