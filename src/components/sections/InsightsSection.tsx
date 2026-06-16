"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, AlertTriangle, HelpCircle, Lightbulb, ArrowUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = value / (1400 / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const pieData = [
  { name: "Pricing", value: 42, color: "#4f7cff" },
  { name: "Shipping", value: 23, color: "#00d4ff" },
  { name: "Returns", value: 18, color: "#8b5cf6" },
  { name: "Product Info", value: 11, color: "#22c55e" },
  { name: "Other", value: 6, color: "#f59e0b" },
];

const trendData = [
  { week: "W1", queries: 2100 }, { week: "W2", queries: 2800 },
  { week: "W3", queries: 2400 }, { week: "W4", queries: 3200 },
  { week: "W5", queries: 3800 }, { week: "W6", queries: 4200 },
];

const insights = [
  { icon: TrendingUp, title: "42% of customers ask about pricing", description: "Your pricing page gets the most queries but has the lowest satisfaction rate.", action: "Create a pricing FAQ page", priority: "High", color: "#4f7cff" },
  { icon: AlertTriangle, title: "18 customers abandoned before checkout", description: "Cart abandonment peaked on Tuesday evening. Shipping cost was the main concern.", action: "Add free shipping threshold info", priority: "High", color: "#ef4444" },
  { icon: HelpCircle, title: "Top unanswered: 'How does billing work?'", description: "This question appears 847 times this month with no satisfactory AI response.", action: "Update billing knowledge base", priority: "Medium", color: "#f59e0b" },
  { icon: Lightbulb, title: "Lead opportunity: 234 enterprise inquiries", description: "Users asking about team plans — no human follow-up occurred for 67% of them.", action: "Enable enterprise lead routing", priority: "High", color: "#22c55e" },
];

const tipStyle = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", fontSize: "11px", color: "var(--fg)" };

export default function InsightsSection() {
  return (
    <section id="insights" style={{ position: "relative", overflow: "hidden", padding: "96px 0" }}>
      <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "500px", height: "500px", background: "rgba(0,212,255,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span className="badge" style={{ marginBottom: "16px" }}>🧠 AI Insights</span>
          <h2 style={{ fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", marginTop: "12px", marginBottom: "20px" }}>
            Turn Conversations into<br />
            <span className="gradient-text">Business Intelligence</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted-fg)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
            AI analyzes every conversation to surface actionable insights that grow your business.
          </p>
        </motion.div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { value: 42, suffix: "%", label: "Ask about pricing", color: "#4f7cff" },
            { value: 18, suffix: "", label: "Abandoned checkouts", color: "#ef4444" },
            { value: 234, suffix: "+", label: "Enterprise leads found", color: "#22c55e" },
            { value: 847, suffix: "", label: "Unanswered queries", color: "#f59e0b" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-gradient-border"
              style={{ padding: "28px 24px", textAlign: "center" }}
            >
              <div style={{
                fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1,
                background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-fg)", marginTop: "8px" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-gradient-border" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "16px" }}>Top Query Categories</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tipStyle} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "var(--muted-fg)", flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)" }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-gradient-border" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)" }}>Query Volume Trend</h3>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>
                <ArrowUp style={{ width: "12px", height: "12px" }} /> +34% MoM
              </span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={trendData} barSize={24}>
                <defs>
                  <linearGradient id="barTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f7cff" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "#8899bb", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="queries" fill="url(#barTrend)" radius={[4, 4, 0, 0]} name="Queries" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-gradient-border"
              style={{ padding: "24px" }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${ins.color}16`, border: `1px solid ${ins.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ins.icon style={{ width: "18px", height: "18px", color: ins.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)", lineHeight: 1.3 }}>{ins.title}</h4>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px", background: `${ins.color}18`, color: ins.color, flexShrink: 0 }}>{ins.priority}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--muted-fg)", lineHeight: 1.65, marginBottom: "10px" }}>{ins.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 600, color: ins.color }}>
                    <Lightbulb style={{ width: "13px", height: "13px" }} />
                    {ins.action}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
