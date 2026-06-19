"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, Pencil, Trash2, Mail, Phone, Clock, RefreshCw, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Input, Select, Button, Badge } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface Agent {
  id: string | number;
  name: string;
  email: string;
  phone_number?: string;
  chat_hours?: string;
  is_active: boolean;
}

export default function TeamManagementPage() {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone_number: "", startTime: "09:00", endTime: "17:00", is_active: "true" });

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/agents`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setAgents(data.agents || []); }
    } catch (e) { console.warn(e); }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { name: formData.name, email: formData.email, role: "agent", phone_number: formData.phone_number, chat_hours: `${formData.startTime} - ${formData.endTime}`, is_active: formData.is_active === "true" };
    try {
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/agents`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        if (editingId) { showToast("info", "Information", "Backend update API pending. Please delete and recreate for now."); setEditingId(null); }
        else showToast("success", "Agent Created", "They will receive an email with their auto-generated password.");
        setFormData({ name: "", email: "", phone_number: "", startTime: "09:00", endTime: "17:00", is_active: "true" });
        fetchAgents();
      } else {
        const err = await res.json();
        showToast("error", "Process Failed", err.detail || "Failed to process agent details.");
      }
    } catch { showToast("error", "Error", "Server connection failed."); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (agent: Agent) => {
    let start = "09:00", end = "17:00";
    if (agent.chat_hours?.includes(" - ")) [start, end] = agent.chat_hours.split(" - ");
    setFormData({ name: agent.name || "", email: agent.email || "", phone_number: agent.phone_number || "", startTime: start, endTime: end, is_active: agent.is_active ? "true" : "false" });
    setEditingId(agent.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone_number: "", startTime: "09:00", endTime: "17:00", is_active: "true" });
  };

  const handleDelete = async (agentId: string | number) => {
    if (!window.confirm("Delete this agent?")) return;
    try {
      const token = localStorage.getItem("saas_client_token");
      const res = await fetch(`${BASE_API}/admin/agents/${agentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { showToast("success", "Deleted", "Agent deleted successfully."); fetchAgents(); }
    } catch { showToast("error", "Error", "Failed to delete agent."); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge"><Users style={{ width: "12px", height: "12px" }} />Identity Directory</span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Team <span className="gradient-text">Management</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Provision customer support agents to handle real-time manual takeover inquiries.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {/* On larger screens: side-by-side */}
        <style>{`
          @media (min-width: 1024px) {
            .team-grid { grid-template-columns: 340px 1fr !important; }
          }
        `}</style>
        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Form Card */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px", paddingBottom: "18px", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ padding: "10px", borderRadius: "12px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)", display: "flex" }}>
                <UserPlus style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", marginBottom: "2px" }}>
                  {editingId ? "Modify Member" : "Add Team Member"}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>
                  {editingId ? "Update account variables." : "Provision credentials."}
                </p>
              </div>
              {editingId && (
                <button onClick={cancelEdit} style={{ marginLeft: "auto", padding: "6px", borderRadius: "8px", background: "var(--muted-bg)", border: "none", color: "var(--muted-fg)", cursor: "pointer", display: "flex" }}>
                  <X style={{ width: "14px", height: "14px" }} />
                </button>
              )}
            </div>

            <form onSubmit={handleSaveAgent} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" required />
              <Input label="Login Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" required icon={<Mail style={{ width: "14px", height: "14px" }} />} />
              <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+1 555-0100" icon={<Phone style={{ width: "14px", height: "14px" }} />} />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>Active Shifts</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                    style={{ flex: 1, padding: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", fontSize: "13px", color: "var(--fg)", outline: "none" }} />
                  <span style={{ color: "var(--muted-fg)", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", flexShrink: 0 }}>to</span>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                    style={{ flex: 1, padding: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", fontSize: "13px", color: "var(--fg)", outline: "none" }} />
                </div>
              </div>

              <Select label="Account Status" name="is_active" value={formData.is_active} onChange={handleChange}>
                <option value="true">Active (Access Allowed)</option>
                <option value="false">Inactive (Suspended)</option>
              </Select>

              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit} style={{ flex: 1 } as React.CSSProperties}>Cancel</Button>
                )}
                <Button type="submit" isLoading={isSaving} style={{ flex: 1 } as React.CSSProperties}>
                  {editingId ? "Update" : "Register"}
                </Button>
              </div>
            </form>
          </div>

          {/* Table Card */}
          <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--muted-bg)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)" }}>Registered Workgroup</h3>
              <Button variant="outline" size="sm" onClick={fetchAgents} icon={<RefreshCw style={{ width: "13px", height: "13px" }} />}
                style={{ fontSize: "11px", padding: "7px 14px" } as React.CSSProperties}>
                Sync Directory
              </Button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--muted-bg)", borderBottom: "1px solid var(--card-border)" }}>
                    {["Full Name / Role", "Contact Detail", "Shift Schedule", "Status", "Actions"].map((h, i) => (
                      <th key={h} style={{ padding: "13px 16px", paddingLeft: i === 0 ? "24px" : "16px", paddingRight: i === 4 ? "24px" : "16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-fg)", textAlign: i === 4 ? "right" : "left", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "60px 24px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "var(--muted-fg)" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--muted-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShieldAlert style={{ width: "22px", height: "22px", opacity: 0.5 }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>No team members registered</p>
                            <p style={{ fontSize: "12px", lineHeight: 1.6 }}>Add your first support agent using the form.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    agents.map(agent => (
                      <tr key={agent.id} style={{ borderBottom: "1px solid var(--card-border)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--muted-bg)"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>{agent.name}</span>
                            <span style={{ fontSize: "10px", color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Agent Support</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "12px", color: "var(--fg)", fontWeight: 500 }}>{agent.email}</span>
                            {agent.phone_number && <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>{agent.phone_number}</span>}
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>
                            <Clock style={{ width: "12px", height: "12px" }} />
                            {agent.chat_hours || "Anytime shift"}
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          {agent.is_active
                            ? <Badge variant="success">Active</Badge>
                            : <Badge variant="error">Blocked</Badge>}
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button onClick={() => handleEdit(agent)}
                              style={{ padding: "8px", borderRadius: "10px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)", cursor: "pointer", display: "flex", transition: "all 0.15s" }}
                              title="Edit agent">
                              <Pencil style={{ width: "14px", height: "14px" }} />
                            </button>
                            <button onClick={() => handleDelete(agent.id)}
                              style={{ padding: "8px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", display: "flex", transition: "all 0.15s" }}
                              title="Delete agent">
                              <Trash2 style={{ width: "14px", height: "14px" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
