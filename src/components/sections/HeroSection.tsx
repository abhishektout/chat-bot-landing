"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Play, Sparkles, MessageSquare, Database, User,
  BarChart3, Shield, Zap, FileText, Globe, Link, Cpu,
  CheckCircle, Headphones, ShieldCheck, Activity
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "human";
  text: string;
  isThinking?: boolean;
  isTyping?: boolean;
}

const liveMetrics = [
  { label: "AI Resolved Rate", value: "84%", change: "+3.2%" },
  { label: "Human Takeovers", value: "16%", change: "-1.5%" },
  { label: "Leads Captured", value: "1,204", change: "+14%" },
  { label: "Average Response Time", value: "0.8 sec", change: "Optimal" },
  { label: "Knowledge Sources", value: "5 Connected", change: "100%" },
  { label: "Active Conversations", value: "2,847", change: "+12%" },
];

function FlowPath({ d, active, color = "#4f7cff", speed = 1.5 }: { d: string; active: boolean; color?: string; speed?: number }) {
  return (
    <>
      {/* Background path */}
      <path d={d} stroke="var(--card-border)" strokeWidth="1.2" fill="none" opacity={0.3} />

      {/* Flow path */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={active ? 2.2 : 1.2}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: active ? 0.3 : 0.15, pathOffset: 0 }}
        animate={{ pathOffset: 1 }}
        transition={{
          repeat: Infinity,
          duration: active ? speed : 4,
          ease: "linear"
        }}
        style={{
          opacity: active ? 0.95 : 0.2,
          filter: active ? `drop-shadow(0 0 4px ${color})` : "none",
        }}
      />
    </>
  );
}

interface TooltipProps {
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  isVisible: boolean;
}

function Tooltip({ title, description, position = "top", isVisible }: TooltipProps) {
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 100,
    pointerEvents: "none",
    width: "160px",
    minWidth: "160px",
  };

  switch (position) {
    case "top":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(-50%)";
      break;
    case "bottom":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(-50%)";
      break;
    case "left":
      positionStyles.right = "calc(100% + 8px)";
      positionStyles.top = "50%";
      positionStyles.transform = "translateY(-50%)";
      break;
    case "right":
      positionStyles.left = "calc(100% + 8px)";
      positionStyles.top = "50%";
      positionStyles.transform = "translateY(-50%)";
      break;
    case "top-right":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "top-left":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.right = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "bottom-right":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "bottom-left":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.right = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            ...positionStyles,
            background: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            padding: "8px 10px",
            boxShadow: "0 8px 30px var(--shadow)",
            textAlign: "left",
          }}
        >
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--fg)",
            marginBottom: "3px",
            whiteSpace: "nowrap",
          }}>
            {title}
          </div>
          <div style={{
            fontSize: "9.5px",
            lineHeight: "1.3",
            color: "var(--muted-fg)",
            fontWeight: 500,
            whiteSpace: "normal",
          }}>
            {description}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AIDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [simState, setSimState] = useState<"idle" | "retrieving" | "deciding" | "routing-ai" | "routing-human" | "resolved">("idle");
  const [currentExample, setCurrentExample] = useState(0);
  const [confidence, setConfidence] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let timers: any[] = [];

    const addLog = (text: string, type: "success" | "info" | "warning" = "success") => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setLogs((prev) => [
        { id: Math.random().toString(), text, timestamp: timeStr, type },
        ...prev.slice(0, 3)
      ]);
    };

    const runExample = (exampleIndex: number) => {
      setCurrentExample(exampleIndex);
      if (exampleIndex === 0) {
        setMessages([]);
      }
      setSimState("idle");
      setConfidence("");

      if (exampleIndex === 0) {
        // Example 1: Refund Policy
        timers.push(setTimeout(() => {
          setMessages((prev) => [...prev, { id: "m1", type: "user", text: "What is your refund policy?" }]);
          addLog("Inbound customer message received", "info");
        }, 0));

        timers.push(setTimeout(() => {
          setSimState("retrieving");
          setMessages((prev) => [...prev, { id: "m2", type: "ai", text: "", isThinking: true }]);
          addLog("FAQ Answer Retrieved", "success");
        }, 1200));

        timers.push(setTimeout(() => {
          setSimState("deciding");
          setConfidence("98% Match");
          addLog("Evaluating response confidence: HIGH (98%)", "info");
        }, 2500));

        timers.push(setTimeout(() => {
          setSimState("routing-ai");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "m2"
                ? { ...msg, text: "We offer a 30-day money-back guarantee on all plans. You can cancel and refund directly from your dashboard. ✓", isThinking: false }
                : msg
            )
          );
          addLog("AI Auto-Response dispatched", "success");
        }, 3800));

        timers.push(setTimeout(() => {
          setSimState("resolved");
          addLog("AI Resolved Ticket", "success");
        }, 5500));
      } else if (exampleIndex === 1) {
        // Example 2: Order Status
        timers.push(setTimeout(() => {
          setMessages((prev) => [...prev, { id: "m3", type: "user", text: "Where is my order #4821?" }]);
          addLog("Inbound customer message received", "info");
        }, 0));

        timers.push(setTimeout(() => {
          setSimState("retrieving");
          setMessages((prev) => [...prev, { id: "m4", type: "ai", text: "", isThinking: true }]);
          addLog("Database Query Executed", "success");
        }, 1200));

        timers.push(setTimeout(() => {
          setSimState("deciding");
          setConfidence("95% Match");
          addLog("Evaluating response confidence: HIGH (95%)", "info");
        }, 2500));

        timers.push(setTimeout(() => {
          setSimState("routing-ai");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "m4"
                ? { ...msg, text: "Order #4821 shipped! Arrives tomorrow by 6 PM. Tracking: FX-78234 ✓", isThinking: false }
                : msg
            )
          );
          addLog("AI Auto-Response dispatched", "success");
        }, 3800));

        timers.push(setTimeout(() => {
          setSimState("resolved");
          addLog("AI Resolved Ticket", "success");
          addLog("Lead Captured", "info");
        }, 5500));
      } else {
        // Example 3: Unhappy Customer
        timers.push(setTimeout(() => {
          setMessages((prev) => [...prev, { id: "m5", type: "user", text: "I am extremely unhappy with your service." }]);
          addLog("Inbound customer message received", "info");
        }, 0));

        timers.push(setTimeout(() => {
          setSimState("retrieving");
          setMessages((prev) => [...prev, { id: "m6", type: "ai", text: "", isThinking: true }]);
          addLog("Sentiment Detected: Negative", "warning");
        }, 1200));

        timers.push(setTimeout(() => {
          setSimState("deciding");
          setConfidence("28% Match");
          addLog("Evaluating response confidence: LOW (28%)", "warning");
        }, 2500));

        timers.push(setTimeout(() => {
          setSimState("routing-human");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "m6"
                ? { ...msg, text: "I'm sorry to hear that. I'm connecting you with a human agent right now.", isThinking: false }
                : msg
            )
          );
          addLog("Human Takeover Triggered", "warning");
        }, 3800));

        timers.push(setTimeout(() => {
          setMessages((prev) => [...prev, { id: "m7", type: "human", text: "", isTyping: true }]);
          addLog("Human Agent Assigned", "info");
        }, 5200));

        timers.push(setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "m7"
                ? { ...msg, text: "Hi, this is Sarah. I'm reviewing your account details now. Let me make this right for you.", isTyping: false }
                : msg
            )
          );
        }, 7000));

        timers.push(setTimeout(() => {
          setSimState("resolved");
          addLog("Ticket Routed to Agent", "success");
        }, 8500));
      }
    };

    setLogs([
      { id: "init-1", text: "AI Agent Initialized", timestamp: "--:--:--", type: "info" },
      { id: "init-2", text: "Knowledge Bases Connected", timestamp: "--:--:--", type: "info" }
    ]);

    let currentEx = 0;
    runExample(0);

    const cycleInterval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = [];
      currentEx = (currentEx + 1) % 3;
      runExample(currentEx);
    }, 11000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(cycleInterval);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentMetric((p) => (p + 1) % liveMetrics.length), 2200);
    return () => clearInterval(t);
  }, []);

  const metric = liveMetrics[currentMetric];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "580px", margin: "0 auto" }}>
      {/* Backdrop glow */}
      <div style={{
        position: "absolute", inset: "-20px",
        background: "radial-gradient(ellipse, rgba(79,124,255,0.18) 0%, rgba(0,212,255,0.08) 50%, transparent 70%)",
        borderRadius: "32px", filter: "blur(20px)", pointerEvents: "none",
      }} />

      {/* Dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: "relative",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(79,124,255,0.15)",
        }}
      >
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(79,124,255,0.05)",
          borderBottom: "1px solid var(--card-border)",
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444", opacity: 0.8 }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#eab308", opacity: 0.8 }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#22c55e", opacity: 0.8 }} />
          </div>
          <span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 600 }}>Assistly — Live Dashboard</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5" style={{ minHeight: "400px" }}>
          {/* Left: Flow nodes & Architecture Diagram */}
          <div className="hidden md:flex md:col-span-2" style={{
            borderRight: "1px solid var(--card-border)",
            padding: "10px 10px",
            flexDirection: "column",
            background: "rgba(79,124,255,0.03)",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Cpu style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                Platform Architecture
              </div>

              {/* Responsive SVG Architecture Diagram */}
              <div style={{ position: "relative", width: "100%", height: "255px", marginBottom: "5px" }}>
                {/* SVG Connecting Lines */}
                <svg viewBox="0 0 220 240" style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: '10px', left: 0, pointerEvents: "none" }}>
                  {/* Surrounding to AI Agent (Center) */}
                  <FlowPath d="M 36,46 Q 60,70 110,95" active={simState === "retrieving" && currentExample === 0} color="#a855f7" /> {/* FAQ */}
                  <FlowPath d="M 184,46 Q 160,70 110,95" active={simState === "retrieving" && currentExample === 1} color="#6366f1" /> {/* DB */}
                  <FlowPath d="M 31,101 Q 60,98 110,95" active={simState === "retrieving" && currentExample === 2} color="#06b6d4" /> {/* Web */}
                  <FlowPath d="M 189,101 Q 160,98 110,95" active={simState === "retrieving" && currentExample === 0} color="#f43f5e" /> {/* PDF */}
                  <FlowPath d="M 110,25 L 110,95" active={simState === "retrieving" && currentExample === 2} color="#10b981" /> {/* APIs */}

                  {/* AI Agent to Decision */}
                  <FlowPath
                    d="M 110,95 L 110,150"
                    active={simState === "deciding" || simState === "routing-ai" || simState === "routing-human" || simState === "resolved"}
                    color="#3b82f6"
                  />

                  {/* Decision to AI Response / Human Takeover */}
                  <FlowPath
                    d="M 110,150 Q 80,175 55,195"
                    active={simState === "routing-ai" || (simState === "resolved" && currentExample !== 2)}
                    color="#10b981"
                  />
                  <FlowPath
                    d="M 110,150 Q 140,175 165,195"
                    active={simState === "routing-human" || (simState === "resolved" && currentExample === 2)}
                    color="#f97316"
                  />

                  {/* Branches to Resolution */}
                  <FlowPath
                    d="M 55,195 Q 80,215 110,230"
                    active={simState === "resolved" && currentExample !== 2}
                    color="#22c55e"
                  />
                  <FlowPath
                    d="M 165,195 Q 140,215 110,230"
                    active={simState === "resolved" && currentExample === 2}
                    color="#22c55e"
                  />
                </svg>

                {/* Nodes overlays */}
                {/* 1. PDF Documents */}
                <div
                  onMouseEnter={() => setHoveredNode("pdf")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "16.3%", top: "19.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "pdf" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(244,63,94,0.08)",
                      border: `1px solid ${simState === "retrieving" && currentExample === 0 ? "#f43f5e" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: simState === "retrieving" && currentExample === 0 ? "0 0 10px rgba(244,63,94,0.4)" : "none",
                    }}
                  >
                    <FileText style={{ width: "13px", height: "13px", color: "#f43f5e" }} />
                  </div>
                  <Tooltip
                    title="📄 PDF Knowledge Base"
                    description="Train AI using PDFs, manuals, documentation and product guides."
                    position="bottom-right"
                    isVisible={hoveredNode === "pdf"}
                  />
                </div>

                {/* 2. FAQ Knowledge */}
                <div
                  onMouseEnter={() => setHoveredNode("faq")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "83.6%", top: "19.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "faq" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(168,85,247,0.08)",
                      border: `1px solid ${simState === "retrieving" && currentExample === 0 ? "#a855f7" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: simState === "retrieving" && currentExample === 0 ? "0 0 10px rgba(168,85,247,0.4)" : "none",
                    }}
                  >
                    <MessageSquare style={{ width: "13px", height: "13px", color: "#a855f7" }} />
                  </div>
                  <Tooltip
                    title="❓ FAQ Knowledge"
                    description="Answer customer questions using predefined FAQs and support content."
                    position="bottom-left"
                    isVisible={hoveredNode === "faq"}
                  />
                </div>

                {/* 3. API Integrations */}
                <div
                  onMouseEnter={() => setHoveredNode("api")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "10.4%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "api" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(16,185,129,0.08)",
                      border: `1px solid ${simState === "retrieving" && currentExample === 2 ? "#10b981" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: simState === "retrieving" && currentExample === 2 ? "0 0 10px rgba(16,185,129,0.4)" : "none",
                    }}
                  >
                    <Link style={{ width: "13px", height: "13px", color: "#10b981" }} />
                  </div>
                  <Tooltip
                    title="🔗 External APIs"
                    description="Connect with CRMs, ERPs, payment systems and third-party services."
                    position="bottom"
                    isVisible={hoveredNode === "api"}
                  />
                </div>

                {/* 4. Website Data */}
                <div
                  onMouseEnter={() => setHoveredNode("website")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "14.1%", top: "42.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "website" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(6,182,212,0.08)",
                      border: `1px solid ${simState === "retrieving" && currentExample === 2 ? "#06b6d4" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: simState === "retrieving" && currentExample === 2 ? "0 0 10px rgba(6,182,212,0.4)" : "none",
                    }}
                  >
                    <Globe style={{ width: "13px", height: "13px", color: "#06b6d4" }} />
                  </div>
                  <Tooltip
                    title="🌐 Website Training"
                    description="Learn automatically from website pages and business content."
                    position="bottom-right"
                    isVisible={hoveredNode === "website"}
                  />
                </div>

                {/* 5. Database */}
                <div
                  onMouseEnter={() => setHoveredNode("database")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "85.9%", top: "42.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "database" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(99,102,241,0.08)",
                      border: `1px solid ${simState === "retrieving" && currentExample === 1 ? "#6366f1" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: simState === "retrieving" && currentExample === 1 ? "0 0 10px rgba(99,102,241,0.4)" : "none",
                    }}
                  >
                    <Database style={{ width: "13px", height: "13px", color: "#6366f1" }} />
                  </div>
                  <Tooltip
                    title="🗄 Business Database"
                    description="Retrieve real-time customer, order and business information."
                    position="bottom-left"
                    isVisible={hoveredNode === "database"}
                  />
                </div>

                {/* Center: AI Agent */}
                <div
                  onMouseEnter={() => setHoveredNode("agent")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "39.5%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "agent" ? 50 : 2 }}
                >
                  <motion.div
                    animate={{
                      scale: simState === "deciding" ? [1, 1.08, 1] : 1,
                      boxShadow: simState === "deciding"
                        ? "0 0 20px rgba(59,130,246,0.6)"
                        : "0 0 10px rgba(59,130,246,0.2)"
                    }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #fff",
                    }}
                  >
                    <Cpu style={{ width: "15px", height: "15px", color: "#fff" }} />
                  </motion.div>
                  {/* Floating 'AI' label */}
                  <div style={{
                    fontSize: "8px", fontWeight: 800, color: "var(--fg)",
                    marginTop: "3px", textAlign: "center", textTransform: "uppercase"
                  }}>
                    AI Agent
                  </div>
                  <Tooltip
                    title="🤖 AI Agent"
                    description="Central AI engine that analyzes requests and generates responses."
                    position="top"
                    isVisible={hoveredNode === "agent"}
                  />
                </div>

                {/* 6. Decision Engine */}
                <div
                  onMouseEnter={() => setHoveredNode("decision")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "62.5%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "decision" ? 50 : 2 }}
                >
                  <div style={{
                    width: "72px", padding: "3px 0", borderRadius: "6px",
                    background: "rgba(217,119,6,0.08)",
                    border: `1px solid ${confidence ? "#d97706" : "var(--card-border)"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: "7px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>
                      Decision
                    </span>
                    {confidence && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ fontSize: "8px", fontWeight: 800, color: currentExample === 2 ? "#ef4444" : "#10b981", marginTop: "1px" }}
                      >
                        {confidence}
                      </motion.span>
                    )}
                  </div>
                  <Tooltip
                    title="🧠 Decision Engine"
                    description="Evaluates confidence and decides whether AI should respond or hand over to a human."
                    position="top"
                    isVisible={hoveredNode === "decision"}
                  />
                </div>

                {/* 7. AI Response Branch */}
                <div
                  onMouseEnter={() => setHoveredNode("reply")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "25%", top: "81.2%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "reply" ? 50 : 2 }}
                >
                  <div style={{
                    padding: "3px 8px", borderRadius: "100px",
                    background: "rgba(16,185,129,0.08)",
                    border: `1px solid ${simState === "routing-ai" ? "#10b981" : "var(--card-border)"}`,
                    display: "flex", alignItems: "center", gap: "3px",
                    transition: "all 0.3s ease"
                  }}>
                    <CheckCircle style={{ width: "9px", height: "9px", color: "#10b981" }} />
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--fg)" }}>AI Reply</span>
                  </div>
                  <Tooltip
                    title="✅ AI Reply"
                    description="AI automatically resolves the customer's request."
                    position="top-right"
                    isVisible={hoveredNode === "reply"}
                  />
                </div>

                {/* 8. Human Takeover Branch */}
                <div
                  onMouseEnter={() => setHoveredNode("human")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "75%", top: "81.2%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "human" ? 50 : 2 }}
                >
                  <div style={{
                    padding: "3px 8px", borderRadius: "100px",
                    background: "rgba(249,115,22,0.08)",
                    border: `1px solid ${simState === "routing-human" ? "#f97316" : "var(--card-border)"}`,
                    display: "flex", alignItems: "center", gap: "3px",
                    transition: "all 0.3s ease"
                  }}>
                    <Headphones style={{ width: "9px", height: "9px", color: "#f97316" }} />
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--fg)" }}>Human</span>
                  </div>
                  <Tooltip
                    title="🎧 Human Takeover"
                    description="Transfer the conversation to a live support agent when needed."
                    position="top-left"
                    isVisible={hoveredNode === "human"}
                  />
                </div>

                {/* 9. Resolution */}
                <div
                  onMouseEnter={() => setHoveredNode("resolution")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "95.8%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "resolution" ? 50 : 2 }}
                >
                  <motion.div
                    animate={{
                      scale: simState === "resolved" ? [1, 1.05, 1] : 1,
                    }}
                    style={{
                      padding: "4px 10px", borderRadius: "100px",
                      background: simState === "resolved" ? "rgba(34,197,94,0.15)" : "var(--muted-bg)",
                      border: `1px solid ${simState === "resolved" ? "#22c55e" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", gap: "4px",
                      boxShadow: simState === "resolved" ? "0 0 10px rgba(34,197,94,0.3)" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <ShieldCheck style={{ width: "10px", height: "10px", color: simState === "resolved" ? "#22c55e" : "var(--muted-fg)" }} />
                    <span style={{ fontSize: "8px", fontWeight: 800, color: simState === "resolved" ? "#22c55e" : "var(--muted-fg)", textTransform: "uppercase" }}>
                      Resolved
                    </span>
                  </motion.div>
                  <Tooltip
                    title="🛡 Resolution"
                    description="Customer issue successfully resolved."
                    position="top"
                    isVisible={hoveredNode === "resolution"}
                  />
                </div>
              </div>
            </div>

            {/* Divider line */}
            {/* <div style={{ width: "100%", height: "1px", background: "var(--card-border)", margin: "8px 0" }} /> */}

            {/* Bottom: Live Activity Log */}
            <div style={{ display: "flex", flexDirection: "column", height: "95px" }}>
              <div style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span>Live Activity Log</span>
                <span style={{ fontSize: "8px", color: "#22c55e", fontWeight: 700 }}>● Active</span>
              </div>
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                overflow: "hidden",
                fontSize: "9px"
              }}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: `2px solid ${log.type === "warning" ? "#f97316" :
                        log.type === "info" ? "#3b82f6" : "#22c55e"
                        }`,
                    }}
                  >
                    <span style={{
                      color: log.type === "warning" ? "#ff7a29" :
                        log.type === "info" ? "var(--muted-fg)" : "#22c55e",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "140px"
                    }}>
                      {log.text}
                    </span>
                    <span style={{ fontSize: "8px", color: "var(--muted-fg)" }}>
                      {log.timestamp}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="col-span-1 md:col-span-3 flex flex-col" style={{ position: 'relative' }}>
            {/* Chat header */}
            <div style={{
              padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px",
              borderBottom: "1px solid var(--card-border)",
              background: "rgba(79,124,255,0.03)",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #4f7cff, #00d4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Zap style={{ width: "14px", height: "14px", color: "#fff" }} fill="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)" }}>AI Support Agent</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: "10px", color: "#22c55e" }}>Online · 0.8s avg reply</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                <MessageSquare style={{ width: "12px", height: "12px", color: "var(--muted-fg)" }} />
                <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>2,847 active</span>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={chatContainerRef}
              style={{
                flex: 1, padding: "12px 10px",
                display: "flex", flexDirection: "column",
                gap: "8px", overflowY: "auto",
                maxHeight: "280px", minHeight: "280px",
              }}
            >
              {messages.map((msg) => {
                return (
                  <motion.div
                    key={msg.id}
                    className="msg-in"
                    style={{
                      display: "flex",
                      justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-start",
                      gap: "6px",
                    }}
                  >
                    {msg.type !== "user" && (
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: msg.type === "human" ? "rgba(34,197,94,0.15)" : "rgba(79,124,255,0.15)",
                        border: `1px solid ${msg.type === "human" ? "rgba(34,197,94,0.4)" : "rgba(79,124,255,0.4)"}`,
                      }}>
                        {msg.type === "human"
                          ? <User style={{ width: "10px", height: "10px", color: "#22c55e" }} />
                          : <Zap style={{ width: "10px", height: "10px", color: "#4f7cff" }} />
                        }
                      </div>
                    )}
                    <div style={{
                      maxWidth: "72%", padding: "7px 11px", borderRadius: "12px",
                      fontSize: "11px", lineHeight: "1.5",
                      ...(msg.type === "user"
                        ? { background: "#4f7cff", color: "#fff", borderBottomRightRadius: "4px" }
                        : msg.type === "human"
                          ? { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--fg)", borderBottomLeftRadius: "4px" }
                          : { background: "var(--muted-bg)", border: "1px solid var(--card-border)", color: "var(--fg)", borderBottomLeftRadius: "4px" }
                      ),
                    }}>
                      {msg.isThinking
                        ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 0" }}>
                            <span style={{ fontSize: "9px", color: "var(--muted-fg)", marginRight: "4px" }}>AI thinking</span>
                            <div style={{ display: "flex", gap: "3px" }}>
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                            </div>
                          </div>
                        )
                        : msg.isTyping
                          ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 0" }}>
                              <span style={{ fontSize: "9px", color: "var(--muted-fg)", marginRight: "4px" }}>Sarah typing</span>
                              <div style={{ display: "flex", gap: "3px" }}>
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                              </div>
                            </div>
                          )
                          : msg.text
                      }
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Live metric strip */}
            <div style={{
              position: 'absolute',
              width: '100%',
              bottom: 10,
              padding: "8px 12px", borderTop: "1px solid var(--card-border)",
              background: "rgba(79,124,255,0.04)",
            }}>
              <motion.div
                key={currentMetric}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>{metric.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--fg)" }}>{metric.value}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#22c55e" }}>{metric.change}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="glass hidden sm:flex items-center gap-2"
        style={{
          position: "absolute", top: "-14px", right: "8px",
          padding: "8px 12px", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 style={{ width: "13px", height: "13px", color: "#22c55e" }} />
        </div>
        <div>
          <div style={{ fontSize: "9px", color: "var(--muted-fg)" }}>Cost Saved</div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#22c55e" }}>₹2,00,000/mo</div>
        </div>
      </motion.div>

      {/* <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass hidden sm:flex items-center gap-2"
        style={{
          position: "absolute", bottom: "-14px", left: "8px",
          padding: "8px 12px", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(79,124,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles style={{ width: "13px", height: "13px", color: "#4f7cff" }} />
        </div>
        <div>
          <div style={{ fontSize: "9px", color: "var(--muted-fg)" }}>AI Accuracy</div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#4f7cff" }}>94.3%</div>
        </div>
      </motion.div> */}
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 lg:py-0"
      style={{
        background: "linear-gradient(145deg, var(--hero-from) 0%, var(--bg) 50%, var(--hero-to) 100%)",
      }}
    >
      {/* Grid BG */}
      {/* <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} /> */}

      {/* Orbs */}
      <div className="orb" style={{ width: "500px", height: "500px", top: "-100px", left: "-100px", background: "var(--accent)" }} />
      <div className="orb" style={{ width: "350px", height: "350px", top: "40%", right: "-100px", background: "var(--accent2)" }} />
      <div className="orb" style={{ width: "300px", height: "300px", bottom: "0", left: "35%", background: "#8b5cf6" }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, width: "100%" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Badge */}
              {/* <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="badge">
                  <Sparkles style={{ width: "13px", height: "13px" }} />
                  AI-First Customer Support Platform
                  <span style={{
                    marginLeft: "6px", padding: "2px 7px",
                    background: "var(--accent)", color: "#fff",
                    fontSize: "10px", borderRadius: "100px", fontWeight: 700,
                  }}>NEW</span>
                </span>
              </motion.div> */}

              {/* H1 */}
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
                Transform<br />
                <span className="gradient-text">Customer</span><br />
                Support with AI
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                style={{
                  fontSize: "17px", lineHeight: 1.75,
                  color: "var(--muted-fg)",
                  maxWidth: "520px",
                }}
              >
                Reduce support costs, capture more leads, and automate customer conversations using{" "}
                <strong style={{ color: "var(--fg)", fontWeight: 600 }}>AI-powered support agents</strong>{" "}
                trained on your business knowledge and real-time data.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 14px 40px rgba(79,124,255,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ fontSize: "16px", padding: "14px 28px" }}
                  onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Start Free Trial
                  <ArrowRight style={{ width: "17px", height: "17px" }} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary"
                  style={{ fontSize: "16px", padding: "14px 28px" }}
                  onClick={() => document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play style={{ width: "15px", height: "15px" }} fill="currentColor" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}
              >
                <div style={{ display: "flex" }}>
                  {["#4f7cff", "#00d4ff", "#8b5cf6", "#22c55e", "#f59e0b"].map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: color, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 700,
                        border: "2px solid var(--bg)",
                        marginLeft: i > 0 ? "-8px" : 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "2px" }}>★★★★★</div>
                  <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>
                    <strong style={{ color: "var(--fg)" }}>2,847+</strong> businesses trust Assistly
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              style={{ paddingTop: "20px", paddingBottom: "20px" }}
            >
              <AIDashboard />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--muted-fg)", letterSpacing: "0.05em" }}>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            width: "22px", height: "36px",
            border: "2px solid var(--card-border)",
            borderRadius: "11px",
            display: "flex", justifyContent: "center", paddingTop: "6px",
          }}
        >
          <div style={{ width: "4px", height: "8px", borderRadius: "2px", background: "var(--accent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
