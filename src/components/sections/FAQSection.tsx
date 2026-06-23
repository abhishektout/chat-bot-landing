"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  { q: "How is Assistly different from a basic AI chatbot?", a: "Assistly is a complete customer support platform, not just a chatbot. It includes AI responses, seamless human handoff, real database integration, lead capture, sentiment detection, analytics, and multi-channel support — all working together. A basic chatbot just handles simple scripted responses." },
  { q: "How does the AI get trained on my business?", a: "You can train your AI by uploading PDFs, pasting website URLs, entering FAQs, or connecting your database. Our system crawls and processes your content to create a custom knowledge base. Training typically completes within minutes." },
  { q: "Can I connect my database or CRM?", a: "Yes! Assistly integrates with PostgreSQL, MySQL, REST APIs, HubSpot, Salesforce, Shopify, and custom CRMs. The AI can query real-time data to answer customer questions about orders, accounts, or any live information." },
  { q: "How does human takeover work?", a: "When the AI detects a complex issue, frustrated customer, or explicit request, it automatically routes the conversation to a human agent with full conversation context. Agents get AI-suggested replies to respond faster. Transition is seamless for the customer." },
  { q: "Is the platform available 24/7?", a: "The AI runs 24/7/365 with 99.9% uptime SLA. Human agents can set their availability, and when offline, the AI handles conversations autonomously and captures leads for follow-up." },
  { q: "Can I use it on WhatsApp and other channels?", a: "Yes! Deploy on Website Widget, WhatsApp Business, Facebook Messenger, Instagram DMs, and Telegram from a single dashboard. All conversations are centralized in one place." },
  { q: "What's the white label option?", a: "With our Agency or Enterprise plans, you can completely rebrand the platform with your own logo, colors, domain, and custom CSS. Sell it to clients as your own AI support product." },
  { q: "Do you offer a free trial?", a: "Yes! All plans come with a 14-day free trial — no credit card required. You get full access to all features so you can see the impact before committing." },
  { q: "Is my data secure?", a: "Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. We're SOC 2 Type II certified, GDPR compliant, and HIPAA compliant. Your data is never used to train shared AI models." },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="card-gradient-border"
      style={{ overflow: "hidden" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: "16px",
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--fg)", lineHeight: 1.4 }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
            background: "var(--muted-bg)", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <ChevronDown style={{ width: "15px", height: "15px", color: "var(--muted-fg)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ padding: "0 20px 18px", borderTop: "1px solid var(--card-border)" }}>
              <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.75, paddingTop: "14px" }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" style={{ position: "relative", overflow: "hidden", padding: "50px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "52px" }}>
          {/* <span className="badge" style={{ marginBottom: "16px" }}>
            <HelpCircle style={{ width: "12px", height: "12px" }} />
            FAQ
          </span> */}
          <h2 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "18px" }}>
            <span className="gradient-text">Questions</span> You May Have
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)" }}>Everything you need to know about Assistly.</p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-gradient-border" style={{ marginTop: "40px", padding: "36px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--fg)", marginBottom: "8px" }}>Still have questions?</h3>
          <p style={{ fontSize: "14px", color: "var(--muted-fg)", marginBottom: "20px" }}>Our team is ready to help you evaluate if Assistly is the right fit.</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
            Chat with Sales
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
