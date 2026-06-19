"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, RefreshCw, Bot, User, Send, Zap, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button, Badge } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface LiveSession {
  id?: string;
  session_id?: string;
  created_at?: string;
  human_takeover?: boolean;
  agent_name?: string;
}

interface ChatMessage {
  role: string;
  message?: string;
  content?: string;
  text?: string;
}

export default function ChatLogsPage() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/live-sessions`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setSessions(data.sessions || data || []); }
    } catch (error) { console.warn("Error fetching sessions:", error); }
  };

  const fetchChats = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/sessions/${sessionId}/chats`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        let chatsData: ChatMessage[] = [];
        if (data?.chats && Array.isArray(data.chats)) chatsData = data.chats;
        else if (data?.messages && Array.isArray(data.messages)) chatsData = data.messages;
        else if (data?.history && Array.isArray(data.history)) chatsData = data.history;
        else if (data?.data && Array.isArray(data.data)) chatsData = data.data;
        else if (Array.isArray(data)) chatsData = data;
        setChats(chatsData);
      }
    } catch (error) { console.warn("Error fetching chats:", error); }
  };

  useEffect(() => { fetchSessions(); }, []);

  useEffect(() => {
    if (selectedSession) {
      const sId = selectedSession.id || selectedSession.session_id;
      if (sId) {
        fetchChats(sId);
        const interval = setInterval(() => fetchChats(sId), 3000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedSession]);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chats]);

  const handleTakeover = async () => {
    if (!selectedSession) return;
    try {
      const sId = selectedSession.id || selectedSession.session_id;
      if (!sId) return;
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/sessions/${sId}/takeover`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const isNowHuman = !selectedSession.human_takeover;
        showToast("success", isNowHuman ? "Takeover Activated" : "AI Restored", isNowHuman ? "You have taken over this chat." : "AI has resumed control.");
        setSelectedSession(prev => prev ? { ...prev, human_takeover: isNowHuman } : null);
        fetchSessions();
      }
    } catch { showToast("error", "Error", "Failed to toggle takeover."); }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSession) return;
    setIsSending(true);
    try {
      const sId = selectedSession.id || selectedSession.session_id;
      if (!sId) return;
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/sessions/${sId}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) { setReplyText(""); fetchChats(sId); }
      else showToast("error", "Error", "Failed to send message.");
    } catch { showToast("error", "Error", "Error sending message."); }
    finally { setIsSending(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "calc(85vh - 60px)" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
        <span className="badge"><MessageSquare style={{ width: "12px", height: "12px" }} />Workspace Conversations</span>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Live Chat <span className="gradient-text">Stream Logs</span>
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Monitor conversations, analyze AI responses, and takeover active sessions when needed.
        </p>
      </div>

      {/* Main Panel */}
      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Session Sidebar */}
        <div className="card" style={{
          width: "280px", flexShrink: 0, padding: "16px",
          display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden",
        }}>
          <Button variant="outline" onClick={fetchSessions} icon={<RefreshCw style={{ width: "13px", height: "13px" }} />}
            style={{ width: "100%", fontSize: "12px", padding: "10px" } as React.CSSProperties}>
            Refresh Stream
          </Button>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 12px", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic" }}>
                No active conversations
              </div>
            ) : (
              sessions.map((session, idx) => {
                const sId = session.id || session.session_id || "";
                const isSelected = selectedSession && (selectedSession.id || selectedSession.session_id) === sId;
                return (
                  <div key={sId || idx} onClick={() => setSelectedSession(session)}
                    style={{
                      padding: "12px 14px", border: `1px solid ${isSelected ? "var(--accent)" : "var(--card-border)"}`,
                      borderRadius: "12px", cursor: "pointer", transition: "all 0.15s",
                      background: isSelected ? "var(--accent-glow)" : "var(--card-bg)",
                      boxShadow: isSelected ? "0 2px 8px var(--accent-glow)" : "none",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(79,124,255,0.4)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "var(--accent)" : "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {session.human_takeover ? "Support Handover" : `Session: ${sId.substring(0, 10)}`}
                      </span>
                      {session.human_takeover
                        ? <Badge variant="warning" style={{ fontSize: "9px" } as React.CSSProperties}>Agent</Badge>
                        : <Badge variant="success" style={{ fontSize: "9px" } as React.CSSProperties}>AI</Badge>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px", fontSize: "10px", color: "var(--muted-fg)" }}>
                      <Clock style={{ width: "10px", height: "10px" }} />
                      {new Date(session.created_at || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="card" style={{ flex: 1, minWidth: 0, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!selectedSession ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", textAlign: "center", padding: "32px", background: "var(--muted-bg)" }}>
              <div style={{ padding: "20px", borderRadius: "50%", background: "var(--accent-glow)", color: "var(--accent)" }}>
                <MessageSquare style={{ width: "32px", height: "32px" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", marginBottom: "6px" }}>No Session Selected</h4>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", maxWidth: "280px", lineHeight: 1.6 }}>
                  Select a live feed instance from the sidebar to audit active message telemetry.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Top Header */}
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid var(--card-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "12px", flexWrap: "wrap", background: "var(--muted-bg)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>
                    Auditing {selectedSession.id || selectedSession.session_id}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge variant={selectedSession.human_takeover ? "warning" : "success"} style={{ fontSize: "9px" } as React.CSSProperties}>
                      {selectedSession.human_takeover ? "Handed Over" : "AI Automated"}
                    </Badge>
                    {selectedSession.human_takeover && (
                      <span style={{ fontSize: "10px", color: "var(--muted-fg)", fontWeight: 500 }}>
                        Agent: {selectedSession.agent_name || localStorage.getItem("saas_agent_name") || "Human Support"}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant={selectedSession.human_takeover ? "outline" : "danger"}
                  onClick={handleTakeover}
                  icon={<Zap style={{ width: "14px", height: "14px" }} />}
                  style={{ fontSize: "12px", padding: "9px 18px" } as React.CSSProperties}
                >
                  {selectedSession.human_takeover ? "Return Control to AI" : "Take Over Stream"}
                </Button>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} style={{
                flex: 1, overflowY: "auto", padding: "24px 20px",
                display: "flex", flexDirection: "column", gap: "16px",
                background: "var(--muted-bg)",
              }}>
                {!Array.isArray(chats) || chats.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 24px", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic" }}>
                    Waiting for message events...
                  </div>
                ) : (
                  chats.map((msg, idx) => {
                    const isUser = msg.role === "user";
                    const isAgent = msg.role === "agent";
                    return (
                      <div key={idx} style={{
                        display: "flex", gap: "10px", maxWidth: "78%",
                        marginLeft: isUser ? "auto" : undefined,
                        flexDirection: isUser ? "row-reverse" : "row",
                      }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isUser ? "var(--accent)" : isAgent ? "#f59e0b" : "linear-gradient(135deg, var(--accent), var(--accent2))",
                          color: "#fff", fontWeight: 800, fontSize: "10px",
                        }}>
                          {isUser || isAgent ? <User style={{ width: "13px", height: "13px" }} /> : <Bot style={{ width: "13px", height: "13px" }} />}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {isUser ? "User" : isAgent ? "Support Agent" : "Copilot AI"}
                          </span>
                          <div style={{
                            padding: "12px 16px", borderRadius: "14px", fontSize: "12.5px", fontWeight: 500, lineHeight: 1.6,
                            borderTopRightRadius: isUser ? "4px" : "14px",
                            borderTopLeftRadius: !isUser ? "4px" : "14px",
                            background: isUser ? "var(--accent)" : isAgent ? "rgba(245,158,11,0.12)" : "var(--card-bg)",
                            color: isUser ? "#fff" : isAgent ? "#b45309" : "var(--fg)",
                            border: isUser ? "none" : isAgent ? "1px solid rgba(245,158,11,0.25)" : "1px solid var(--card-border)",
                            boxShadow: "0 2px 8px var(--shadow)",
                          }}>
                            {msg.message || msg.content || msg.text || ""}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Panel */}
              {selectedSession.human_takeover ? (
                <div style={{
                  padding: "14px 16px", borderTop: "1px solid var(--card-border)",
                  background: "var(--card-bg)", display: "flex", gap: "10px", alignItems: "center",
                }}>
                  <input
                    type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendReply()}
                    placeholder="Type response as agent..."
                    style={{
                      flex: 1, padding: "11px 16px", background: "var(--muted-bg)",
                      border: "1px solid var(--card-border)", borderRadius: "12px",
                      fontSize: "13px", fontWeight: 500, color: "var(--fg)", outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "var(--card-border)"}
                  />
                  <Button type="button" isLoading={isSending} disabled={!replyText.trim()} onClick={handleSendReply}
                    icon={<Send style={{ width: "13px", height: "13px" }} />}
                    style={{ padding: "11px 20px", fontSize: "12px" } as React.CSSProperties}>
                    Send
                  </Button>
                </div>
              ) : (
                <div style={{
                  padding: "12px 16px", borderTop: "1px solid var(--card-border)",
                  background: "var(--muted-bg)", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px",
                }}>
                  <Sparkles style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                  <span style={{ fontSize: "10px", color: "var(--muted-fg)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    AI is handling this conversation. Takeover above to reply manually.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
