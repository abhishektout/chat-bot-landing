"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, RefreshCw, Bot, User, Send, Zap, Sparkles, Clock, Lock, Headphones } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button, Badge } from "@/components/ui";
import { adminService } from "@/services/admin.service";

interface LiveSession {
  id?: string;
  session_id?: string;
  created_at?: string;
  human_takeover?: boolean;
  agent_name?: string;
  user_name?: string;
  visitor_name?: string;
  client_name?: string;
  last_active?: string;
}

interface ChatMessage {
  role: string;
  message?: string;
  content?: string;
  text?: string;
}

const formatMessageText = (text: string) => {
  if (!text) return "";
  
  const lines = text.split("\n");
  const resultElements: React.ReactNode[] = [];

  const parseInlineMarkdown = (str: string) => {
    const parts = str.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ fontWeight: 700 }}>{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\*\s+/.test(trimmed) || /^-\s+/.test(trimmed);
    
    if (isBullet) {
      const content = trimmed.replace(/^\*\s+|^-\s+/, "");
      resultElements.push(
        <div key={index} style={{ display: "flex", gap: "8px", marginLeft: "12px", marginTop: "4px", marginBottom: "4px" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span>
          <span style={{ flex: 1 }}>{parseInlineMarkdown(content)}</span>
        </div>
      );
    } else if (trimmed === "") {
      if (index > 0 && index < lines.length - 1) {
        resultElements.push(<div key={index} style={{ height: "8px" }} />);
      }
    } else {
      resultElements.push(
        <div key={index} style={{ marginBottom: "4px" }}>
          {parseInlineMarkdown(line)}
        </div>
      );
    }
  });

  return <div style={{ display: "flex", flexDirection: "column" }}>{resultElements}</div>;
};

export default function ChatLogsPage() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasScrolledForSessionRef = useRef<string | number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevChatsLengthRef = useRef<number>(0);

  const currentRole = typeof window !== "undefined" ? localStorage.getItem("saas_user_role") : null;
  const currentAgentName = typeof window !== "undefined" ? localStorage.getItem("saas_agent_name") : null;
  const currentAdminName = typeof window !== "undefined" ? localStorage.getItem("sa_name") || "Workspace Administrator" : "Workspace Administrator";

  const getLocalTakeoverStates = () => {
    try {
      return JSON.parse(localStorage.getItem("saas_takeover_states") || "{}") || {};
    } catch (e) {
      return {};
    }
  };

  const getLocalTakeoverAgents = () => {
    try {
      return JSON.parse(localStorage.getItem("saas_takeover_agents") || "{}") || {};
    } catch (e) {
      return {};
    }
  };

  const isTakeoverOwner = (() => {
    if (!selectedSession || !selectedSession.human_takeover) return false;
    
    const takenBy = selectedSession.agent_name;
    if (!takenBy) {
      // Fallback to localStorage if backend is offline / doesn't provide agent_name
      const localStates = getLocalTakeoverStates();
      const sId = selectedSession.id || selectedSession.session_id;
      return sId ? localStates[sId] === true : false;
    }

    const cleanTakenBy = takenBy.trim().toLowerCase();
    
    if (currentRole === "agent") {
      return currentAgentName && cleanTakenBy === currentAgentName.trim().toLowerCase();
    } else {
      // For client admin / admin role
      const cleanAdminName = currentAdminName.trim().toLowerCase();
      return cleanTakenBy === cleanAdminName || cleanTakenBy === "admin" || cleanTakenBy === "workspace administrator" || cleanTakenBy === "human support";
    }
  })();

  const [deducedStates, setDeducedStates] = useState<Record<string, { human_takeover: boolean; agent_name: string }>>({});
  const deducedStatesRef = useRef<Record<string, { human_takeover: boolean; agent_name: string }>>({});

  const updateDeducedState = (sId: string, takeover: boolean, name: string) => {
    const updated = { ...deducedStatesRef.current, [sId]: { human_takeover: takeover, agent_name: name } };
    deducedStatesRef.current = updated;
    setDeducedStates(updated);
  };

  const fetchSessions = async () => {
    try {
      const data = await adminService.getLiveSessions();
      let sessionsList: LiveSession[] = [];
      if (data?.sessions && Array.isArray(data.sessions)) {
        sessionsList = data.sessions;
      } else if (data?.data && Array.isArray(data.data)) {
        sessionsList = data.data;
      } else if (Array.isArray(data)) {
        sessionsList = data;
      }

      // Sort sessions by the most recent active time
      sessionsList.sort((a, b) => {
        const timeA = new Date(a.last_active || a.created_at || 0).getTime();
        const timeB = new Date(b.last_active || b.created_at || 0).getTime();
        return timeB - timeA;
      });

      // Apply persistent takeover state from localStorage and deduced chat history states
      const localStates = getLocalTakeoverStates();
      const localAgents = getLocalTakeoverAgents();
      const currentDeduced = deducedStatesRef.current;
      sessionsList = sessionsList.map(s => {
        const sId = s.id || s.session_id;
        if (sId && currentDeduced[sId] !== undefined) {
          return { 
            ...s, 
            human_takeover: currentDeduced[sId].human_takeover, 
            agent_name: currentDeduced[sId].agent_name 
          };
        }
        if (sId && localStates[sId] !== undefined) {
          return { 
            ...s, 
            human_takeover: localStates[sId],
            agent_name: localStates[sId] ? (localAgents[sId] || s.agent_name || "Human Support") : ""
          };
        }
        return s;
      });

      setSessions(sessionsList);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchChats = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const data = await adminService.getSessionChats(sessionId);
      let chatsData: ChatMessage[] = [];
      if (data?.chats && Array.isArray(data.chats)) chatsData = data.chats;
      else if (data?.messages && Array.isArray(data.messages)) chatsData = data.messages;
      else if (data?.history && Array.isArray(data.history)) chatsData = data.history;
      else if (data?.data && Array.isArray(data.data)) chatsData = data.data;
      else if (Array.isArray(data)) chatsData = data;

      // Filter out empty messages
      const validChats = chatsData.filter(msg => {
        const text = msg.message || msg.content || msg.text || "";
        return text.trim() !== "";
      });
      
      setChats(validChats);

      // Deduce human takeover state and owner from the chat message history
      let deducedTakeover = false;
      let deducedAgentName = "";

      for (let i = validChats.length - 1; i >= 0; i--) {
        const msg = validChats[i];
        const text = msg.message || msg.content || msg.text || "";
        const plainText = text.replace(/<[^>]+>/g, "").trim();
        
        if (/took over the conversation|has taken over the chat|joined the chat|joined the conversation/i.test(plainText)) {
          deducedTakeover = true;
          const match = plainText.match(/(?:👤|User)?\s*(?:Admin|Agent)?\s*(.*?)\s+(?:has taken over|joined|took over)/i);
          deducedAgentName = match ? match[1].trim() : "Human Support";
          break;
        } else if (/resumed control/i.test(plainText)) {
          deducedTakeover = false;
          deducedAgentName = "";
          break;
        }
      }

      updateDeducedState(sessionId, deducedTakeover, deducedAgentName);

      // Save deduced states back to local storage to sync across pages/tabs
      const localStates = getLocalTakeoverStates();
      const localAgents = getLocalTakeoverAgents();
      localStates[sessionId] = deducedTakeover;
      localAgents[sessionId] = deducedAgentName;
      localStorage.setItem("saas_takeover_states", JSON.stringify(localStates));
      localStorage.setItem("saas_takeover_agents", JSON.stringify(localAgents));

      setSelectedSession(prev => {
        if (!prev) return null;
        const prevId = prev.id || prev.session_id;
        if (prevId === sessionId) {
          if (prev.human_takeover !== deducedTakeover || prev.agent_name !== deducedAgentName) {
            return {
              ...prev,
              human_takeover: deducedTakeover,
              agent_name: deducedTakeover ? (deducedAgentName || prev.agent_name || "Human Support") : ""
            };
          }
        }
        return prev;
      });

      setSessions(prev => prev.map(s => {
        const sId = s.id || s.session_id;
        if (sId === sessionId) {
          if (s.human_takeover !== deducedTakeover || s.agent_name !== deducedAgentName) {
            return {
              ...s,
              human_takeover: deducedTakeover,
              agent_name: deducedTakeover ? (deducedAgentName || s.agent_name || "Human Support") : ""
            };
          }
        }
        return s;
      }));
      // Only update if chats actually changed (avoids resetting scroll position unnecessarily)
      setChats(prev => {
        const isSame = prev.length === validChats.length && 
          prev.every((msg, idx) => {
            const prevText = msg.message || msg.content || msg.text || "";
            const nextText = validChats[idx].message || validChats[idx].content || validChats[idx].text || "";
            const prevRole = msg.role || (msg as any).sender || "";
            const nextRole = validChats[idx].role || (validChats[idx] as any).sender || "";
            return prevRole === nextRole && prevText === nextText;
          });
        return isSame ? prev : validChats;
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sessions.length > 0 && !selectedSession) {
      const params = new URLSearchParams(window.location.search);
      const sessionParam = params.get("session") || params.get("sessionId");
      if (sessionParam) {
        const found = sessions.find(s => (s.id || s.session_id) === sessionParam);
        if (found) {
          setSelectedSession(found);
        }
      }
    }
  }, [sessions, selectedSession]);

  useEffect(() => {
    if (selectedSession) {
      const sId = selectedSession.id || selectedSession.session_id;
      if (sId) {
        setChats([]); // Clear chats immediately to prevent visual flash of previous session
        hasScrolledForSessionRef.current = null; // Reset scroll tracker for new session
        fetchChats(sId);
        const interval = setInterval(() => fetchChats(sId), 3000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedSession]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const currentSessionId = selectedSession ? (selectedSession.id || selectedSession.session_id || null) : null;

    if (!currentSessionId) return;

    const isNewSession = currentSessionId !== hasScrolledForSessionRef.current;

    if (isNewSession && chats.length > 0) {
      hasScrolledForSessionRef.current = currentSessionId;
      prevChatsLengthRef.current = chats.length;
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    } else if (!isNewSession && chats.length > prevChatsLengthRef.current) {
      prevChatsLengthRef.current = chats.length;
      // When a new message actually arrives, always scroll to the bottom to show it
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [chats, selectedSession]);

  const handleTakeover = async () => {
    if (!selectedSession) return;
    try {
      const sId = selectedSession.id || selectedSession.session_id;
      if (!sId) return;

      if (selectedSession.human_takeover && !isTakeoverOwner) {
        showToast("error", "Access Denied", `This chat is locked by ${selectedSession.agent_name || "another user"}.`);
        return;
      }

      await adminService.takeoverSession(sId);
      const isNowHuman = !selectedSession.human_takeover;
      
      const takerName = isNowHuman
        ? (currentRole === "agent"
          ? (currentAgentName || "Human Support")
          : (currentAdminName || "Workspace Administrator"))
        : "";

      // Update localStorage persistent state
      const localStates = getLocalTakeoverStates();
      const localAgents = getLocalTakeoverAgents();
      localStates[sId] = isNowHuman;
      localAgents[sId] = takerName;
      localStorage.setItem("saas_takeover_states", JSON.stringify(localStates));
      localStorage.setItem("saas_takeover_agents", JSON.stringify(localAgents));

      // Sync deducedState directly to prevent visual lag
      updateDeducedState(sId, isNowHuman, takerName);

      showToast("success", isNowHuman ? "Takeover Activated" : "AI Restored", isNowHuman ? "You have taken over this chat." : "AI has resumed control.");
      setSelectedSession(prev => prev ? { ...prev, human_takeover: isNowHuman, agent_name: takerName } : null);
      
      // Optimistically update sessions list
      setSessions(prev => prev.map(s => (s.id || s.session_id) === sId ? { ...s, human_takeover: isNowHuman, agent_name: takerName } : s));

      // Send a system takeover/resume notification message to the conversation
      const notificationMsg = isNowHuman 
        ? `👤 ${currentRole === "agent" ? "Agent" : "Admin"} ${takerName} has taken over the chat.` 
        : "🤖 The AI has resumed control of the chat.";
      try {
        await adminService.sendChatMessage(sId, notificationMsg);
        fetchChats(sId);
      } catch (err) {
        console.error("Failed to send takeover notification:", err);
      }
    } catch {
      showToast("error", "Error", "Failed to toggle takeover.");
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSession) return;
    setIsSending(true);
    try {
      const sId = selectedSession.id || selectedSession.session_id;
      if (!sId) return;
      await adminService.sendChatMessage(sId, replyText.trim());
      setReplyText("");
      fetchChats(sId);
    } catch {
      showToast("error", "Error", "Error sending message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, alignItems: "flex-start" }}>
        <span className="badge" style={{ width: "fit-content" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
            Live Chat <span className="gradient-text">Stream Logs</span>
          </h2>
        </span>

      </div>

      {/* Main Panel */}
      <div style={{ display: "flex", gap: "10px", flex: 1, minHeight: 0, overflow: "hidden", paddingTop: "10px" }}>
        {/* Session Sidebar */}
        <div className="card" style={{
          width: "340px", flexShrink: 0, padding: "16px",
          display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden",
        }}>
          <Button variant="outline" onClick={fetchSessions} icon={<RefreshCw style={{ width: "13px", height: "13px" }} />}
            style={{ width: "100%", fontSize: "12px", padding: "10px" } as React.CSSProperties}>
            Refresh Stream
          </Button>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 12px", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic" }}>
                No active conversations
              </div>
            ) : (
              sessions.map((session, idx) => {
                const sId = session.id || session.session_id || "";
                const isSelected = selectedSession && (selectedSession.id || selectedSession.session_id) === sId;
                const isSessionAdmin = session.agent_name?.toLowerCase().includes("admin") || session.agent_name?.toLowerCase().includes("workspace");
                
                // Determine if session was active in the last 5 minutes
                const lastActiveTime = new Date(session.last_active || session.created_at || Date.now()).getTime();
                const isActiveRecently = (Date.now() - lastActiveTime) < 5 * 60 * 1000;

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
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {isActiveRecently && (
                          <span className="relative flex h-2 w-2 flex-shrink-0" title="Active recently">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        <span style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "var(--accent)" : "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {session.human_takeover
                            ? (session.agent_name || localStorage.getItem("saas_agent_name") || "Human Support")
                            : (session.user_name || `Session: ${sId.substring(0, 10)}`)}
                        </span>
                      </div>
                      {session.human_takeover ? (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#10b981",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          flexShrink: 0
                        }} title="Agent Takeover">
                          <User style={{ width: "10px", height: "10px" }} />
                        </div>
                      ) : (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "var(--accent-glow)",
                          color: "var(--accent)",
                          border: "1px solid var(--card-border)",
                          flexShrink: 0
                        }} title="AI Managed">
                          <Bot style={{ width: "10px", height: "10px" }} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px", fontSize: "10px", color: "var(--muted-fg)", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock style={{ width: "10px", height: "10px" }} />
                        {new Date(session.last_active || session.created_at || Date.now()).toLocaleTimeString()}
                      </div>
                      {isSelected && (
                        <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)" }} /> Auditing
                        </span>
                      )}
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
                    Auditing: {selectedSession.visitor_name || (selectedSession as any).client_name || selectedSession.user_name || "Web Visitor"} ({selectedSession.id || selectedSession.session_id})
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge variant={selectedSession.human_takeover ? "warning" : "success"} style={{ fontSize: "9px" , padding: "4px"} as React.CSSProperties}>
                      {selectedSession.human_takeover ? "Live Agent" : "AI Autopilot"}
                    </Badge>
                    {selectedSession.human_takeover && (
                      <span style={{ fontSize: "10px", color: "var(--muted-fg)", fontWeight: 500 }}>
                        Active Handler: {isTakeoverOwner ? `You (${currentRole === "agent" ? "Agent" : "Admin"})` : selectedSession.agent_name}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant={selectedSession.human_takeover ? (isTakeoverOwner ? "outline" : "secondary") : "danger"}
                  onClick={handleTakeover}
                  disabled={selectedSession.human_takeover && !isTakeoverOwner}
                  icon={selectedSession.human_takeover && !isTakeoverOwner ? <Lock style={{ width: "14px", height: "14px" }} /> : <Zap style={{ width: "14px", height: "14px" }} />}
                  style={{ 
                    fontSize: "12px", 
                    padding: "10px 20px", 
                    cursor: selectedSession.human_takeover && !isTakeoverOwner ? "not-allowed" : "pointer" 
                  } as React.CSSProperties}
                >
                  {selectedSession.human_takeover 
                    ? (isTakeoverOwner ? "Return Control to AI" : `Locked by ${selectedSession.agent_name || "Agent"}`) 
                    : "Take Over Stream"}
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
                    const text = msg.message || msg.content || msg.text || "";
                    if (!text.trim()) return null;

                    const plainText = text.replace(/<[^>]+>/g, "").trim();
                    const isSystem = /joined the chat|resumed control|joined the conversation|took over the conversation|left the conversation/i.test(plainText);

                    if (isSystem) {
                      const isHuman = plainText.includes("joined");
                      return (
                        <div key={`sys-${idx}`} style={{ alignSelf: "center", marginTop: "12px", marginBottom: "12px", maxWidth: "90%" }}>
                          <div style={{
                            background: isHuman ? "var(--accent-glow)" : "var(--muted-bg)",
                            color: isHuman ? "var(--accent)" : "var(--muted-fg)",
                            fontSize: "12px",
                            padding: "8px 20px",
                            borderRadius: "9999px",
                            fontWeight: 600,
                            textAlign: "center",
                            border: isHuman ? "1px solid var(--accent)" : "1px solid var(--card-border)",
                            boxShadow: "0 2px 6px var(--shadow)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxSizing: "border-box"
                          }}>
                            {plainText}
                          </div>
                        </div>
                      );
                    }

                    let isUser = false;
                    let isAgent = false;
                    let isAI = false;

                    const getSenderRole = () => {
                      const keys = Object.keys(msg);
                      for (let k of keys) {
                        const lk = k.toLowerCase();
                        if (["role", "sender", "type", "sender_type"].includes(lk)) {
                          const val = String((msg as any)[k]).toLowerCase();
                          if (val === "user" || val === "human" || val === "customer" || val === "visitor") {
                            return "user";
                          }
                          if (val === "agent" || val === "support" || val === "admin") {
                            return "agent";
                          }
                          if (val === "ai" || val === "bot" || val === "assistant" || val === "copilot") {
                            return "ai";
                          }
                        }
                      }
                      return null;
                    };

                    const resolvedRole = getSenderRole() || msg.role || "user";
                    if (resolvedRole === "user" || resolvedRole === "human") {
                      isUser = true;
                    } else if (resolvedRole === "agent" || resolvedRole === "support" || resolvedRole === "admin") {
                      isAgent = true;
                    } else if (resolvedRole === "ai" || resolvedRole === "bot" || resolvedRole === "assistant" || resolvedRole === "copilot") {
                      isAI = true;
                    } else {
                      const lowerText = text.toLowerCase();
                      if (lowerText.includes("welcome to") || lowerText.includes("how may i help")) {
                        isAI = true;
                      } else {
                        isUser = true;
                      }
                    }

                    const getAgentDisplayName = () => {
                      if ((msg as any).agent_name) return (msg as any).agent_name;
                      if ((msg as any).sender_name) return (msg as any).sender_name;
                      if ((msg as any).name) return (msg as any).name;

                      const currentRole = typeof window !== "undefined" ? localStorage.getItem("saas_user_role") : null;
                      const currentAgentName = typeof window !== "undefined" ? localStorage.getItem("saas_agent_name") : null;

                      if (currentRole === "client_admin") {
                        return "Organization Admin";
                      }
                      if (currentAgentName) {
                        return currentAgentName;
                      }
                      return selectedSession?.agent_name || "Support Agent";
                    };

                    const agentName = getAgentDisplayName();

                    const isOutgoing = isAgent || isAI;
                    return (
                      <div key={`msg-${idx}`} style={{
                        display: "flex", gap: "10px", maxWidth: "78%",
                        marginLeft: isOutgoing ? "auto" : "0px",
                        marginRight: !isOutgoing ? "auto" : "0px",
                        flexDirection: isOutgoing ? "row-reverse" : "row",
                      }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isUser 
                            ? "var(--accent)" 
                            : isAgent 
                            ? "rgba(16, 185, 129, 0.15)" 
                            : "var(--card-bg)",
                          color: isUser 
                            ? "#fff" 
                            : isAgent 
                            ? "#10b981" 
                            : "var(--accent)",
                          border: isUser 
                            ? "none" 
                            : isAgent 
                            ? "1px solid rgba(16, 185, 129, 0.3)" 
                            : "1px solid var(--card-border)",
                          boxShadow: "0 2px 4px var(--shadow)",
                          fontWeight: 800, fontSize: "10px",
                        }}>
                          {isUser || isAgent ? (
                            <User style={{ width: "13px", height: "13px" }} />
                          ) : (
                            <Bot style={{ width: "13px", height: "13px" }} />
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: isOutgoing ? "flex-end" : "flex-start" }}>
                          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {isUser
                              ? "User"
                              : isAgent
                              ? agentName
                              : "Copilot AI"}
                          </span>
                          <div style={{
                            padding: "12px 16px", borderRadius: "14px", fontSize: "12.5px", fontWeight: 500, lineHeight: 1.6,
                            borderTopRightRadius: isOutgoing ? "4px" : "14px",
                            borderTopLeftRadius: !isOutgoing ? "4px" : "14px",
                            background: isUser 
                              ? "var(--accent)" 
                              : isAgent 
                              ? "rgba(16, 185, 129, 0.08)" 
                              : "var(--muted-bg)",
                            color: isUser ? "#fff" : "var(--fg)",
                            border: isUser 
                              ? "none" 
                              : isAgent 
                              ? "1px solid rgba(16, 185, 129, 0.25)" 
                              : "1px solid var(--card-border)",
                            boxShadow: "0 2px 8px var(--shadow)",
                          }}>
                            {formatMessageText(text)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Panel */}
              {selectedSession.human_takeover ? (
                isTakeoverOwner ? (
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
                      style={{ padding: "10px 20px", fontSize: "12px" } as React.CSSProperties}>
                      Send
                    </Button>
                  </div>
                ) : (
                  <div style={{
                    padding: "16px 20px", borderTop: "1px solid var(--card-border)",
                    background: "rgba(239, 68, 68, 0.04)", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px", borderBottomRightRadius: "12px", borderBottomLeftRadius: "12px"
                  }}>
                    <Lock style={{ width: "14px", height: "14px", color: "#ef4444" }} />
                    <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700, letterSpacing: "0.02em" }}>
                      🔒 Chat locked. Taken over by {selectedSession.agent_name || "another team member"}.
                    </span>
                  </div>
                )
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
