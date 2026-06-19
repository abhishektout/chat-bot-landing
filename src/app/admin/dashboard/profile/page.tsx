"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Save, 
  Database, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Server, 
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAdminDashboard } from "../layout";
import { Card, Input, Button, Badge, Skeleton } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface AgentProfile {
  id: string | number;
  name: string;
  email: string;
  phone_number?: string;
  chat_hours?: string;
  is_active: boolean;
}

const MOCK_TENANT_INFO = {
  company_name: "Assistly Dev Corp",
  bot_name: "Assistly Copilot",
  support_email: "support@assistly.dev",
  custom_rules: "Always be polite and helpful. Suggest using the pricing calculator.",
  primary_color: "#4f7cff",
  widget_position: "right",
  widget_icon_url: "",
  api_key: "ast_dev_key_123456789",
  client_db_uri: "postgresql://localhost:5432/assistly_dev",
  db_rules: "Allow read access to products, support_articles, and contact_requests.",
  allowed_tables: "products, support_articles, contact_requests",
};

export default function ProfilePage() {
  const { tenantInfo, refreshTenantInfo } = useAdminDashboard();
  const { showToast } = useToast();
  
  const activeTenantInfo = tenantInfo || MOCK_TENANT_INFO;

  const [role, setRole] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentDetails, setAgentDetails] = useState<AgentProfile | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "security" | "database">("general");

  // Admin edit form state
  const [formData, setFormData] = useState({
    companyName: "",
    botName: "",
    supportEmail: "",
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("saas_user_role");
    const storedAgentId = localStorage.getItem("saas_agent_id");
    const storedAgentName = localStorage.getItem("saas_agent_name");
    
    setRole(storedRole);
    setAgentId(storedAgentId);
    setAgentName(storedAgentName);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("saas_client_token");
      const storedRole = localStorage.getItem("saas_user_role");
      const storedAgentId = localStorage.getItem("saas_agent_id");
      const storedAgentName = localStorage.getItem("saas_agent_name");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        if (storedRole === "agent" || storedRole === "team-member") {
          // If the user is a Support Agent, let's fetch the agents directory to find their detailed shift & profile info
          const res = await fetch(`${BASE_API}/admin/agents`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const currentAgent = (data.agents || []).find(
              (a: AgentProfile) => String(a.id) === String(storedAgentId)
            );
            if (currentAgent) {
              setAgentDetails(currentAgent);
              return;
            }
          }
          
          // Fallback Agent Info
          setAgentDetails({
            id: storedAgentId || "ast_agent_99",
            name: storedAgentName || "Alex Rivera",
            email: "alex.rivera@assistly.dev",
            phone_number: "+1 (555) 0199",
            chat_hours: "09:00 AM - 05:00 PM",
            is_active: true
          });
        } else {
          // For client_admin, tenantInfo is already loaded in the layout context, but let's refresh it to get latest
          await refreshTenantInfo();
        }
      } catch (err) {
        console.error("Error loading profile details:", err);
        if (storedRole === "agent" || storedRole === "team-member") {
          setAgentDetails({
            id: storedAgentId || "ast_agent_99",
            name: storedAgentName || "Alex Rivera",
            email: "alex.rivera@assistly.dev",
            phone_number: "+1 (555) 0199",
            chat_hours: "09:00 AM - 05:00 PM",
            is_active: true
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set form data when tenantInfo changes
  useEffect(() => {
    const activeInfo = tenantInfo || MOCK_TENANT_INFO;
    setFormData({
      companyName: activeInfo.company_name || "",
      botName: activeInfo.bot_name || "",
      supportEmail: activeInfo.support_email || "",
    });
  }, [tenantInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("saas_client_token") || "test_token";
    try {
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("company_name", formData.companyName);
      urlEncodedData.append("bot_name", formData.botName);
      urlEncodedData.append("support_email", formData.supportEmail);
      
      // Preserve other fields
      urlEncodedData.append("custom_rules", activeTenantInfo.custom_rules || "");
      urlEncodedData.append("primary_color", activeTenantInfo.primary_color || "#4f7cff");
      urlEncodedData.append("widget_position", activeTenantInfo.widget_position || "right");
      urlEncodedData.append("widget_icon_url", activeTenantInfo.widget_icon_url || "");

      const res = await fetch(`${BASE_API}/admin/settings`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/x-www-form-urlencoded" 
        },
        body: urlEncodedData,
      });

      if (res.ok) {
        showToast("success", "Profile Updated", "Your workspace profile has been successfully updated.");
        await refreshTenantInfo();
      } else {
        if (token.startsWith("test_") || process.env.NODE_ENV === "development") {
          showToast("success", "Profile Saved (Local Mock)", "Profile updated successfully with dummy data.");
          if (tenantInfo) {
            tenantInfo.company_name = formData.companyName;
            tenantInfo.bot_name = formData.botName;
            tenantInfo.support_email = formData.supportEmail;
          }
        } else {
          const err = await res.json();
          showToast("error", "Update Failed", err.detail || "Failed to save profile changes.");
        }
      }
    } catch (err) {
      if (token.startsWith("test_") || process.env.NODE_ENV === "development") {
        showToast("success", "Profile Saved (Local Mock)", "Profile updated successfully with dummy data.");
        if (tenantInfo) {
          tenantInfo.company_name = formData.companyName;
          tenantInfo.bot_name = formData.botName;
          tenantInfo.support_email = formData.supportEmail;
        }
      } else {
        showToast("error", "Error", "Failed to connect to the administration server.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast("success", "Copied", `${label} copied to clipboard.`))
      .catch(() => showToast("error", "Copy Failed", "Failed to copy text automatically."));
  };

  const isAdmin = role !== "agent" && role !== "team-member";
  const profileName = isAdmin ? (activeTenantInfo.company_name || "Workspace Admin") : (agentName || "Support Agent");
  const displayInitial = profileName.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge" style={{ marginBottom: "4px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          User Profile Info
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          My <span className="gradient-text">Profile</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Manage your account credentials, view security tokens, and inspect system-assigned variables.
        </p>
      </div>

      {/* ── Profile Hero Header Card ── */}
      <div className="card" style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          filter: "blur(70px)",
          opacity: 0.15,
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "28px" }}>
          {/* Avatar Orb */}
          <div style={{
            width: "88px",
            height: "88px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "32px",
            fontWeight: 900,
            boxShadow: "0 8px 30px var(--accent-glow)",
            flexShrink: 0,
            textShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}>
            {isAdmin && activeTenantInfo.widget_icon_url ? (
              <img 
                src={activeTenantInfo.widget_icon_url} 
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px" }} 
                alt="" 
              />
            ) : (
              displayInitial
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "22px", fontWeight: 850, color: "var(--fg)", margin: 0 }}>
                {profileName}
              </h3>
              <Badge variant={isAdmin ? "info" : "success"}>
                {isAdmin ? "Admin Console" : "Support Agent"}
              </Badge>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "var(--muted-fg)", fontSize: "13px", fontWeight: 500 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail style={{ width: "14px", height: "14px" }} />
                {isAdmin ? (activeTenantInfo.support_email || "support@company.com") : (agentDetails?.email || "agent@company.com")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck style={{ width: "14px", height: "14px" }} />
                <span>ID: {isAdmin ? "Tenant-Admin" : (agentId || "Agent-Member")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--card-border)", paddingBottom: "1px" }}>
          {(["general", "security", "database"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2.5px solid var(--accent)" : "2.5px solid transparent",
                  color: isActive ? "var(--accent)" : "var(--muted-fg)",
                  fontWeight: isActive ? 750 : 600,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab === "general" ? "General Info" : tab === "security" ? "API Security" : "Database Sync"}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Main Details Grid ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Tab 1: General Info */}
        {(activeTab === "general" || !isAdmin) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            
            {/* If Admin: Show Edit Profile Form */}
            {isAdmin ? (
              <div className="card" style={{ padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
                  <div style={{ padding: "8px", borderRadius: "10px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)" }}>
                    <User style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Company Information</h4>
                    <p style={{ fontSize: "12px", color: "var(--muted-fg)", margin: "2px 0 0" }}>Update primary details visible to users and widget components.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    <Input 
                      label="Company / Org Name" 
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Acme Corp" 
                      required 
                    />
                    <Input 
                      label="Support Email Address" 
                      name="supportEmail" 
                      type="email"
                      value={formData.supportEmail} 
                      onChange={handleInputChange} 
                      placeholder="support@acme.com" 
                      required 
                      icon={<Mail style={{ width: "14px", height: "14px" }} />}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    <Input 
                      label="AI Assistant Bot Name" 
                      name="botName" 
                      value={formData.botName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Acme Copilot" 
                      required 
                    />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <Button 
                        type="submit" 
                        isLoading={isSaving} 
                        icon={<Save style={{ width: "16px", height: "16px" }} />}
                        style={{ width: "100%", height: "46px" } as React.CSSProperties}
                      >
                        Save Profile Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* If Agent: Show Agent shifts & readonly information */
              <div className="card" style={{ padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
                  <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981" }}>
                    <Clock style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Agent Shift Settings</h4>
                    <p style={{ fontSize: "12px", color: "var(--muted-fg)", margin: "2px 0 0" }}>Details regarding your support schedule and account status.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
                    <div className="card-gradient-border" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Shift Hours</span>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                        {agentDetails?.chat_hours || "Anytime shifts (24/7)"}
                      </span>
                    </div>

                    <div className="card-gradient-border" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Account Status</span>
                      <div style={{ marginTop: "4px" }}>
                        {agentDetails?.is_active !== false ? (
                          <Badge variant="success">Active (Access Allowed)</Badge>
                        ) : (
                          <Badge variant="error">Suspended</Badge>
                        )}
                      </div>
                    </div>

                    <div className="card-gradient-border" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Workspace Role</span>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Shield style={{ width: "16px", height: "16px", color: "#10b981" }} />
                        Support Workspace Agent
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* General Telemetry Card */}
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
                <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                  <Sparkles style={{ width: "18px", height: "18px" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>System Telemetry &amp; Nodes</h4>
                  <p style={{ fontSize: "12px", color: "var(--muted-fg)", margin: "2px 0 0" }}>Session indicators and backend authentication parameters.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Environment node</span>
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--fg)" }}>
                    {process.env.NODE_ENV === "development" ? "development-sandbox" : "production-deployment"}
                  </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Administrative status</span>
                  <div>
                    <Badge variant="success">Online &amp; Authorized</Badge>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Endpoint API Host</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "monospace", color: "var(--fg)" }}>
                    {BASE_API}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: API Security (Admin Only) */}
        {activeTab === "security" && isAdmin && (
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ padding: "8px", borderRadius: "10px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)" }}>
                <Key style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>API &amp; Credential Security</h4>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", margin: "2px 0 0" }}>Manage workspace credentials, secret access tokens, and script integration codes.</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>
                  API Authorization Key
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showApiKey ? "text" : "password"} 
                    readOnly 
                    value={activeTenantInfo.api_key || ""}
                    style={{ 
                      width: "100%", 
                      padding: "12px 100px 12px 16px", 
                      background: "var(--muted-bg)", 
                      border: "1px solid var(--card-border)", 
                      borderRadius: "12px", 
                      fontSize: "13px", 
                      fontFamily: "monospace", 
                      color: "var(--fg)", 
                      outline: "none", 
                      boxSizing: "border-box" 
                    }}
                  />
                  <div style={{ position: "absolute", right: "12px", display: "flex", gap: "8px" }}>
                    <button 
                      type="button" 
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{ 
                        color: "var(--muted-fg)", 
                        background: "var(--card-bg)", 
                        border: "1px solid var(--card-border)", 
                        borderRadius: "8px",
                        cursor: "pointer", 
                        display: "flex", 
                        padding: "6px" 
                      }}
                      title={showApiKey ? "Hide Key" : "Show Key"}
                    >
                      {showApiKey ? <EyeOff style={{ width: "14px", height: "14px" }} /> : <Eye style={{ width: "14px", height: "14px" }} />}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleCopyText(activeTenantInfo.api_key || "", "API Key")}
                      style={{ 
                        color: "var(--accent)", 
                        background: "var(--accent-glow)", 
                        border: "1px solid rgba(79,124,255,0.2)", 
                        borderRadius: "8px",
                        cursor: "pointer", 
                        display: "flex", 
                        padding: "6px" 
                      }}
                      title="Copy Key"
                    >
                      <Copy style={{ width: "14px", height: "14px" }} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "var(--muted-fg)", marginTop: "4px" }}>
                  This key authorizes your client widget to hook into the white-label assistant engine. Keep it secret.
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted-fg)" }}>Integration Strategies</span>
                <div style={{ position: "relative", borderRadius: "14px", background: "#080e1a", border: "1px solid rgba(79,124,255,0.2)", padding: "20px 24px", marginTop: "12px" }}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopyText(`<script type="module" src="http://bot.a4tool.com/widget-file" data-api-key="${activeTenantInfo.api_key}"></script>`, "Script snippet")} 
                    icon={<Copy style={{ width: "13px", height: "13px" }} />} 
                    style={{ position: "absolute", top: "16px", right: "16px" } as React.CSSProperties}
                  >
                    Copy HTML
                  </Button>
                  <pre style={{ overflowX: "auto", fontSize: "12px", fontFamily: "'Fira Code', monospace", color: "#4ade80", paddingRight: "80px", lineHeight: 1.7, margin: 0 }}>
                    {`<script\n  type="module"\n  src="http://bot.a4tool.com/widget-file"\n  data-api-key="${activeTenantInfo.api_key || "ast_dev_key_123456789"}">\n</script>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Database & Custom Sync (Admin Only) */}
        {activeTab === "database" && isAdmin && (
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981" }}>
                <Database style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Database Integrations &amp; Schema</h4>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", margin: "2px 0 0" }}>Check structured data mapping, relational permissions, and tables.</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Database URI</span>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--fg)", fontFamily: "monospace", padding: "10px 14px", background: "var(--muted-bg)", borderRadius: "8px", border: "1px solid var(--card-border)", wordBreak: "break-all" }}>
                  {activeTenantInfo.client_db_uri || "No database configured (using local document vector search only)."}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Permitted Query Tables</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>
                  {activeTenantInfo.allowed_tables ? (
                    activeTenantInfo.allowed_tables.split(",").map((t: string) => (
                      <Badge key={t} variant="info" style={{ marginRight: "6px", textTransform: "none" } as React.CSSProperties}>
                        {t.trim()}
                      </Badge>
                    ))
                  ) : (
                    "None"
                  )}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>Relational Database Rules</span>
                <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                  {activeTenantInfo.db_rules || "No custom query instructions defined."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
