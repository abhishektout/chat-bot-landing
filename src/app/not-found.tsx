"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Terminal, 
  Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function NotFound() {
  const [backUrl, setBackUrl] = useState("/");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greet", sender: "ai", text: "Hello, I noticed your navigation went off-route. How can I assist you today?" }
  ]);
  const [logs, setLogs] = useState<string[]>([
    "Routing query processed"
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on messages, typing state, or suggestions change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, showSuggestions]);

  // Handle wheel events to scroll the chat box and prevent page scrolling when scrollable
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [messages, isTyping, showSuggestions]);

  useEffect(() => {
    const clientToken = localStorage.getItem("saas_client_token");
    const superadminToken = localStorage.getItem("saas_superadmin_token") || localStorage.getItem("sa_token");
    if (superadminToken) {
      setBackUrl("/superadmin/dashboard");
    } else if (clientToken) {
      setBackUrl("/admin/dashboard");
    }
  }, []);

  useEffect(() => {
    // 1. User response after 1000ms
    const userTimeout = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: "user-msg", sender: "user", text: "I'm looking for pricing." }
      ]);
      setLogs(prev => [
        "Suggested links generated",
        ...prev
      ]);
    }, 1000);

    // 2. AI starts typing after 2000ms
    const typingTimeout = setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    // 3. AI responds after 3200ms
    const aiTimeout = setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: "ai-msg", sender: "ai", text: "I can help with that. It looks like this page doesn't exist. Here are some helpful destinations:" }
      ]);
      setShowSuggestions(true);
      setLogs(prev => [
        "Recovery response prepared",
        ...prev
      ]);
    }, 3200);

    return () => {
      clearTimeout(userTimeout);
      clearTimeout(typingTimeout);
      clearTimeout(aiTimeout);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero Section Container (Identical to homepage hero bg and structure) */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 lg:py-0"
        style={{
          background: "linear-gradient(145deg, var(--hero-from) 0%, var(--bg) 50%, var(--hero-to) 100%)",
          flex: 1,
        }}
      >
        {/* Decorative Orbs matching homepage hero */}
        <div className="orb" style={{ width: "500px", height: "500px", top: "-100px", left: "-100px", background: "var(--accent)" }} />
        <div className="orb" style={{ width: "350px", height: "350px", top: "40%", right: "-100px", background: "var(--accent2)" }} />
        <div className="orb" style={{ width: "300px", height: "300px", bottom: "0", left: "35%", background: "#8b5cf6" }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div className="layout-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Copy Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="text-left">
                {/* Eyebrow */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <span className="badge">
                    404 — Routing Error
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  style={{
                    fontSize: "clamp(32px, 6vw, 72px)",
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "var(--fg)",
                  }}
                >
                  AI Couldn't Find<br />
                  <span className="gradient-text">This Page</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.75,
                    color: "var(--muted-fg)",
                    maxWidth: "520px",
                  }}
                >
                  The page you're looking for doesn't exist, was moved, or the link may be outdated. Let our AI help you get back on track.
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}
                >
                  <Link href={backUrl} passHref legacyBehavior>
                    <motion.a
                      whileHover={{ scale: 1.04, boxShadow: "0 14px 40px rgba(79,124,255,0.45)" }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary"
                      style={{ fontSize: "16px", padding: "14px 28px", textDecoration: "none" }}
                    >
                      Go Home
                    </motion.a>
                  </Link>

                  <Link href="/features" passHref legacyBehavior>
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-secondary"
                      style={{ fontSize: "16px", padding: "14px 28px", textDecoration: "none" }}
                    >
                      Explore Features
                    </motion.a>
                  </Link>

                  <Link href="/book-demo" passHref legacyBehavior>
                    <a 
                      className="text-sm font-semibold hover:underline flex items-center gap-1"
                      style={{ color: "var(--accent)", textDecoration: "none" }}
                    >
                      Book a Demo <ArrowRight style={{ width: "16px", height: "16px" }} />
                    </a>
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "12px", 
                    paddingTop: "24px", 
                    borderTop: "1px solid var(--card-border)",
                    maxWidth: "480px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--muted-fg)" }}>
                    <CheckCircle2 style={{ width: "18px", height: "18px", color: "#10b981", flexShrink: 0 }} />
                    <span>2,847+ businesses trust Assistly</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--muted-fg)" }}>
                    <CheckCircle2 style={{ width: "18px", height: "18px", color: "#10b981", flexShrink: 0 }} />
                    <span>99.9% uptime</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--muted-fg)" }}>
                    <CheckCircle2 style={{ width: "18px", height: "18px", color: "#10b981", flexShrink: 0 }} />
                    <span>AI-powered support automation</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Simulated Recovery AI Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <div style={{
                  position: "relative",
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(79,124,255,0.15)",
                }} className="w-full max-w-[540px] mx-auto">
                  
                  {/* Browser Mock Title Bar */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--muted-bg)",
                    borderBottom: "1px solid var(--card-border)",
                  }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444", opacity: 0.8 }} />
                      <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#eab308", opacity: 0.8 }} />
                      <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#22c55e", opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 600 }}>Assistly — Recovery Console</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite" }} />
                      <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Active</span>
                    </div>
                  </div>

                  {/* Header Bar */}
                  <div style={{
                    padding: "14px 18px",
                    background: "var(--card-bg)",
                    borderBottom: "1px solid var(--card-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff"
                      }}>
                        <Bot style={{ width: "18px", height: "18px" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>Assistly Recovery Copilot</span>
                        <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>
                    </div>
                    <div style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#10b981",
                    }}>
                      95% Match
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div 
                    ref={chatContainerRef}
                    style={{
                      padding: "20px",
                      height: "230px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      boxSizing: "border-box",
                      background: "var(--card-bg)"
                    }} 
                    className="text-left"
                  >
                    
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: "flex",
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                            width: "100%",
                            gap: "10px"
                          }}
                        >
                          {msg.sender === "ai" && (
                            <div style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              background: "var(--muted-bg)", border: "1px solid var(--card-border)",
                              display: "flex", alignItems: "center", justifyItems: "center", flexShrink: 0
                            }}>
                              <Bot style={{ width: "12px", height: "12px", margin: "auto", color: "var(--accent)" }} />
                            </div>
                          )}
                          <div style={{
                            padding: "10px 14px",
                            borderRadius: "14px",
                            borderTopLeftRadius: msg.sender === "ai" ? "2px" : "14px",
                            borderTopRightRadius: msg.sender === "user" ? "2px" : "14px",
                            background: msg.sender === "user" ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--muted-bg)",
                            border: msg.sender === "user" ? "none" : "1px solid var(--card-border)",
                            fontSize: "12.5px",
                            color: msg.sender === "user" ? "#fff" : "var(--fg)",
                            lineHeight: 1.5,
                            maxWidth: "80%"
                          }}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ display: "flex", gap: "10px", alignItems: "center" }}
                        >
                          <div style={{
                            width: "24px", height: "24px", borderRadius: "50%",
                            background: "var(--muted-bg)", border: "1px solid var(--card-border)",
                            display: "flex", alignItems: "center", justifyItems: "center", flexShrink: 0
                          }}>
                            <Bot style={{ width: "12px", height: "12px", margin: "auto", color: "var(--accent)" }} />
                          </div>
                          <div style={{
                            display: "flex", gap: "4px", padding: "10px 14px",
                            borderRadius: "14px", borderTopLeftRadius: "2px",
                            background: "var(--muted-bg)", border: "1px solid var(--card-border)"
                          }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </motion.div>
                      )}

                      {/* Clickable suggested options inside chat */}
                      {showSuggestions && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            paddingLeft: "34px",
                            width: "100%",
                            boxSizing: "border-box"
                          }}
                        >
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <Link href="/pricing" passHref legacyBehavior>
                              <a className="btn-secondary" style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px", textDecoration: "none" }}>
                                View Pricing
                              </a>
                            </Link>
                            <Link href="/features" passHref legacyBehavior>
                              <a className="btn-secondary" style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px", textDecoration: "none" }}>
                                Features
                              </a>
                            </Link>
                            <Link href="/book-demo" passHref legacyBehavior>
                              <a className="btn-primary" style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px", textDecoration: "none" }}>
                                Book Demo
                              </a>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Console Status & Logs */}
                  <div style={{
                    borderTop: "1px solid var(--card-border)",
                    background: "var(--muted-bg)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                  }}>
                    {/* Checklist */}
                    <div style={{
                      padding: "12px 14px",
                      borderRight: "1px solid var(--card-border)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "6px"
                    }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Verification Checklist
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "10px", color: "var(--fg)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 style={{ width: "10.5px", height: "10.5px", color: "#10b981" }} />
                          Route Verified
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 style={{ width: "10.5px", height: "10.5px", color: "#10b981" }} />
                          Model Initialized
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 style={{ width: "10.5px", height: "10.5px", color: "#10b981" }} />
                          Response Formulated
                        </span>
                      </div>
                    </div>

                    {/* Audit Logs */}
                    <div style={{
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "6px",
                      fontFamily: "monospace"
                    }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Terminal style={{ width: "10px", height: "10px" }} />
                        Activity Log
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "9px", color: "var(--muted-fg)", textAlign: "left", width: "100%", overflow: "hidden" }}>
                        {logs.map((log, idx) => (
                          <div key={idx} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", color: "#10b981" }}>
                            • {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
