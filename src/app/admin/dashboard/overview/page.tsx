"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, MessageSquare, ArrowUpRight, RefreshCw, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { Card, Badge, Button, Skeleton } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface Session {
  id?: string;
  session_id?: string;
  created_at?: string;
  human_takeover?: boolean;
  agent_name?: string;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({ total_sessions: 0, total_messages: 0 });
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("saas_client_token");
      const headers = { Authorization: `Bearer ${token}` };

      const statsRes = await fetch(`${BASE_API}/admin/dashboard-stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || statsData || { total_sessions: 0, total_messages: 0 });
      }

      const sessionsRes = await fetch(`${BASE_API}/admin/live-sessions`, { headers });
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        let sessionsList: Session[] = [];
        if (sessionsData?.sessions && Array.isArray(sessionsData.sessions)) {
          sessionsList = sessionsData.sessions;
        } else if (sessionsData?.data && Array.isArray(sessionsData.data)) {
          sessionsList = sessionsData.data;
        } else if (Array.isArray(sessionsData)) {
          sessionsList = sessionsData;
        }
        setLiveSessions(sessionsList);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge" style={{ marginBottom: "4px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          Workspace Overview
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Performance{" "}
          <span className="gradient-text">Analytics</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Real-time telemetry and automation performance details.
        </p>
      </div>

      {/* ── Top Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <Button
          variant="outline"
          onClick={fetchDashboardData}
          isLoading={isLoading}
          icon={<RefreshCw style={{ width: "14px", height: "14px" }} />}
          style={{ fontSize: "12px", padding: "8px 18px" } as React.CSSProperties}
        >
          Sync Telemetry
        </Button>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {/* Sessions Card */}
        <div className="card" style={{ padding: "28px", position: "relative", overflow: "hidden" }}>
          {/* Decorative orb */}
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "var(--accent-glow)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  padding: "10px",
                  borderRadius: "12px",
                  background: "var(--accent-glow)",
                  border: "1px solid rgba(79,124,255,0.15)",
                  color: "var(--accent)",
                  display: "flex",
                }}>
                  <Users style={{ width: "18px", height: "18px" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Total Chat Sessions
                </span>
              </div>
              <div>
                <h3 className="counter-value" style={{ fontSize: "3.2rem" }}>
                  {stats.total_sessions || 0}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#10b981",
                    background: "rgba(16,185,129,0.1)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    gap: "2px",
                  }}>
                    <ArrowUpRight style={{ width: "12px", height: "12px" }} /> +12.4%
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500 }}>vs last 30 days</span>
                </div>
              </div>
            </div>
            {/* Mini sparkline */}
            <div style={{ width: "80px", height: "40px", opacity: 0.7 }}>
              <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", stroke: "var(--accent)", strokeWidth: 2, fill: "none" }}>
                <path d="M 0,25 C 20,20 40,28 60,15 C 80,5 90,8 100,5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Messages Card */}
        <div className="card" style={{ padding: "28px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(16,185,129,0.12)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  padding: "10px",
                  borderRadius: "12px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.15)",
                  color: "#10b981",
                  display: "flex",
                }}>
                  <MessageSquare style={{ width: "18px", height: "18px" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Messages Processed
                </span>
              </div>
              <div>
                <h3 style={{
                  fontSize: "3.2rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {stats.total_messages || 0}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#10b981",
                    background: "rgba(16,185,129,0.1)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    gap: "2px",
                  }}>
                    <ArrowUpRight style={{ width: "12px", height: "12px" }} /> +6.1%
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500 }}>vs last 30 days</span>
                </div>
              </div>
            </div>
            <div style={{ width: "80px", height: "40px", opacity: 0.7 }}>
              <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", stroke: "#10b981", strokeWidth: 2, fill: "none" }}>
                <path d="M 0,22 C 20,28 40,15 60,18 C 80,10 90,5 100,8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Sessions Table ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--muted-bg)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Live pulse */}
            <span style={{ position: "relative", display: "inline-flex", width: "10px", height: "10px" }}>
              <span style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#ef4444",
                opacity: 0.6,
                animation: "pulseGlow 1.5s ease-in-out infinite",
              }} />
              <span style={{ position: "relative", width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            </span>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)" }}>
              Active Workspace Conversations
            </h3>
            <Badge variant="info" style={{ fontSize: "9px" } as React.CSSProperties}>
              Live Feed
            </Badge>
          </div>
        </div>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                background: "var(--muted-bg)",
                borderBottom: "1px solid var(--card-border)",
              }}>
                {["Session ID / Agent", "Started Time", "Automation Mode", "Action"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 16px",
                    paddingLeft: i === 0 ? "24px" : "16px",
                    paddingRight: i === 3 ? "24px" : "16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted-fg)",
                    textAlign: i === 3 ? "right" : "left",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "16px 24px" }}><Skeleton className="h-4 w-40" /></td>
                    <td style={{ padding: "16px" }}><Skeleton className="h-4 w-32" /></td>
                    <td style={{ padding: "16px" }}><Skeleton className="h-6 w-16" /></td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}><Skeleton className="h-6 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : liveSessions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "60px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "var(--muted-fg)" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--muted-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Sparkles style={{ width: "22px", height: "22px", opacity: 0.5 }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>No active sessions</p>
                        <p style={{ fontSize: "12px", maxWidth: "320px", lineHeight: 1.6 }}>
                          When users launch your customer widget, active chat sessions will appear here.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                liveSessions.map((session, idx) => {
                  const agentNameText = session.human_takeover
                    ? (session.agent_name || localStorage.getItem("saas_agent_name") || "Human Support")
                    : "AI Copilot Autopilot";
                  return (
                    <tr
                      key={session.id || session.session_id || idx}
                      style={{
                        borderBottom: "1px solid var(--card-border)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--muted-bg)"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>
                            {session.human_takeover ? "Support Handover" : "Anonymous Session"}
                          </span>
                          <span style={{ fontSize: "10px", color: "var(--muted-fg)", fontFamily: "monospace" }}>
                            {session.id || session.session_id || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>
                          <Calendar style={{ width: "13px", height: "13px" }} />
                          {new Date(session.created_at || Date.now()).toLocaleString()}
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        {session.human_takeover ? (
                          <Badge variant="warning">Live Agent</Badge>
                        ) : (
                          <Badge variant="success">AI Autopilot</Badge>
                        )}
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <Link href="/admin/dashboard/history" style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--accent)",
                          textDecoration: "none",
                          transition: "opacity 0.15s",
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"}
                          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                        >
                          View Stream <ArrowUpRight style={{ width: "13px", height: "13px" }} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
