"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="contact" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(79,124,255,0.08) 0%, transparent 50%, rgba(0,212,255,0.06) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", background: "rgba(79,124,255,0.08)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "880px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="card-gradient-border"
          style={{ padding: "clamp(40px, 8vw, 80px)", textAlign: "center", position: "relative", overflow: "hidden" }}
        >
          {/* Decorative orbs */}
          <div style={{ position: "absolute", top: 0, left: "20%", width: "200px", height: "200px", background: "rgba(79,124,255,0.12)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, right: "20%", width: "200px", height: "200px", background: "rgba(0,212,255,0.1)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* <span className="badge" style={{ marginBottom: "20px" }}>
              <Sparkles style={{ width: "13px", height: "13px" }} />
              Get Started Today
            </span> */}

            <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "20px", lineHeight: 1.1, marginTop: "12px" }}>
              Ready to Automate<br /><span className="gradient-text">Customer Support?</span>
            </h2>

            <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "560px", margin: "0 auto 36px", lineHeight: 1.75 }}>
              Join 2,847+ businesses that reduced support costs by 60%, captured 3× more leads, and delighted customers with instant AI support.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 16px 50px rgba(79,124,255,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ fontSize: "17px", padding: "15px 34px" }}
                onClick={() => scrollTo("#pricing")}
              >
                Start Free Trial
                <ArrowRight style={{ width: "18px", height: "18px" }} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
                style={{ fontSize: "17px", padding: "15px 34px" }}
                onClick={() => { router.push("/book-demo"); }}
              >
                Book a Demo
              </motion.button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px" }}>
              No credit card required · 14-day free trial · Setup in 5 minutes
            </p>

            {/* Trust badges */}
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px",
              paddingTop: "24px", borderTop: "1px solid var(--card-border)",
            }}>
              {["SOC 2 Certified", "GDPR Compliant", "99.9% Uptime SLA", "ISO 27001"].map((badge) => (
                <div key={badge} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--muted-fg)" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
