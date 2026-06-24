"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Clock,
  RefreshCw,
  X,
  ShieldAlert,
  Search,
  Copy,
  Plus
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { Input, Select, Button, Badge, ConfirmModal, Modal } from "@/components/ui";
import { adminService } from "@/services/admin.service";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const [copiedEmail, setCopiedEmail] = useState<string | number | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone_number?: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    startTime: "09:00",
    endTime: "17:00",
    is_active: "true"
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const fetchAgents = async () => {
    try {
      const data = await adminService.getAgents();
      setAgents(Array.isArray(data) ? data : (data.agents || data.data || []));
    } catch (e) {
      console.error(e);
      showToast("error", "Error", "Failed to fetch agents from directory.");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Time conversion: 24h -> 12h format
  const formatTime12h = (time24?: string): string => {
    if (!time24) return "12:00 AM";
    try {
      const [hStr, mStr] = time24.split(":");
      const h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (isNaN(h) || isNaN(m)) return time24;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const mPad = m.toString().padStart(2, "0");
      return `${h12}:${mPad} ${ampm}`;
    } catch (e) {
      return time24;
    }
  };

  // Formats "09:00 - 17:00" -> "9:00 AM - 5:00 PM"
  const formatShiftText = (chatHours?: string): string => {
    if (!chatHours || !chatHours.includes(" - ")) return "Anytime shift";
    const [start, end] = chatHours.split(" - ");
    return `${formatTime12h(start)} - ${formatTime12h(end)}`;
  };

  // Check if current time is within active shift
  const isShiftActive = (chatHours?: string): boolean => {
    if (!chatHours || !chatHours.includes(" - ")) return false;
    try {
      const [start, end] = chatHours.split(" - ");
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);

      const now = new Date();
      const curH = now.getHours();
      const curM = now.getMinutes();

      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;
      const curMin = curH * 60 + curM;

      if (startMin <= endMin) {
        return curMin >= startMin && curMin <= endMin;
      } else {
        // Night shift spanning midnight
        return curMin >= startMin || curMin <= endMin;
      }
    } catch (e) {
      return false;
    }
  };

  // Dynamic Avatar Initial & Color Generator
  const getAvatarGradient = (name: string) => {
    const cleanName = name.trim().toUpperCase();
    const firstChar = cleanName.charAt(0) || "A";
    const charCode = firstChar.charCodeAt(0);
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)", // Blue -> Purple
      "linear-gradient(135deg, #10b981, #3b82f6)", // Emerald -> Blue
      "linear-gradient(135deg, #f59e0b, #ef4444)", // Amber -> Red
      "linear-gradient(135deg, #ec4899, #8b5cf6)", // Pink -> Purple
      "linear-gradient(135deg, #06b6d4, #3b82f6)", // Cyan -> Blue
      "linear-gradient(135deg, #8b5cf6, #ec4899)", // Purple -> Pink
    ];
    return gradients[charCode % gradients.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleCopyEmail = (email: string, id: string | number) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(id);
    showToast("info", "Copied", "Email copied to clipboard.");
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone_number.trim();

    const tempErrors: typeof errors = {};

    if (!name) {
      tempErrors.name = "Full Name is required.";
    } else if (name.length < 2) {
      tempErrors.name = "Full Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (phone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        tempErrors.phone_number = "Please enter a valid phone number (minimum 7 digits).";
      }
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      showToast("error", "Validation Failed", "Please resolve all marked errors.");
      setIsSaving(false);
      return;
    }

    setErrors({});

    const payload = {
      name,
      email,
      role: "agent",
      phone_number: phone || undefined,
      chat_hours: `${formData.startTime} - ${formData.endTime}`,
      is_active: formData.is_active === "true",
    };

    try {
      if (editingId) {
        await adminService.updateAgent(editingId, payload);
        showToast("success", "Agent Updated", "Agent details updated successfully.");
        setEditingId(null);
      } else {
        await adminService.addAgent(payload);
        showToast("success", "Agent Created", "They will receive an email with their auto-generated password.");
      }
      setFormData({ name: "", email: "", phone_number: "", startTime: "09:00", endTime: "17:00", is_active: "true" });
      setErrors({});
      fetchAgents();
      setIsFormOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to process agent details.";
      showToast("error", "Process Failed", errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (agent: Agent) => {
    let start = "09:00", end = "17:00";
    if (agent.chat_hours?.includes(" - ")) [start, end] = agent.chat_hours.split(" - ");
    setFormData({
      name: agent.name || "",
      email: agent.email || "",
      phone_number: agent.phone_number || "",
      startTime: start,
      endTime: end,
      is_active: agent.is_active ? "true" : "false"
    });
    setEditingId(agent.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone_number: "", startTime: "09:00", endTime: "17:00", is_active: "true" });
    setErrors({});
  };

  const handleDelete = (agentId: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Support Agent",
      message: "Are you sure you want to delete this support agent? This action cannot be undone.",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await adminService.deleteAgent(agentId);
          showToast("success", "Deleted", "Agent deleted successfully.");
          fetchAgents();
        } catch {
          showToast("error", "Error", "Failed to delete agent.");
        }
      },
    });
  };

  // Roster Filter logic
  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      agent.name.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      (agent.phone_number && agent.phone_number.toLowerCase().includes(query));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && agent.is_active) ||
      (filterStatus === "blocked" && !agent.is_active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
        <span className="badge" style={{ width: "fit-content" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
            Team <span className="gradient-text">Management</span>
          </h2>
        </span>

      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1: Total Members */}
        <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "var(--accent-glow)",
            border: "1px solid rgba(79, 124, 255, 0.15)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Users style={{ width: "24px", height: "24px" }} />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Total Roster</p>
            <h3 style={{ fontSize: "28px", fontWeight: 900, color: "var(--fg)", lineHeight: 1 }}>{agents.length}</h3>
          </div>
        </div>

        {/* Metric Card 2: Active Agents */}
        <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Users style={{ width: "24px", height: "24px" }} />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Active Agents</p>
            <h3 style={{ fontSize: "28px", fontWeight: 900, color: "var(--fg)", lineHeight: 1 }}>{agents.filter(a => a.is_active).length}</h3>
          </div>
        </div>

        {/* Metric Card 3: On Duty Now */}
        <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "rgba(124, 58, 237, 0.1)",
            border: "1px solid rgba(124, 58, 237, 0.15)",
            color: "var(--accent2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Clock style={{ width: "24px", height: "24px" }} />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>On Duty Now</p>
            <h3 style={{ fontSize: "28px", fontWeight: 900, color: "var(--fg)", lineHeight: 1, display: "flex", alignItems: "center", gap: "8px" }}>
              {agents.filter(a => a.is_active && isShiftActive(a.chat_hours)).length}
              {agents.filter(a => a.is_active && isShiftActive(a.chat_hours)).length > 0 && (
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulseGlow 2s ease-in-out infinite" }} />
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Toolbar Options: Search & Filters */}
      <div className="card" style={{ padding: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", justifyContent: "space-between" }}>
        {/* Left Search */}
        <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--muted-fg)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px 11px 40px",
              borderRadius: "12px",
              background: "var(--muted-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--fg)",
              fontSize: "14px",
              fontWeight: 500,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--muted-fg)",
                cursor: "pointer",
                display: "flex",
                padding: "4px",
                borderRadius: "6px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <X style={{ width: "12px", height: "12px" }} />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          {/* Status Filter Pills */}
          <div style={{ display: "flex", background: "var(--muted-bg)", padding: "4px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
            {(["all", "active", "blocked"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: "none",
                  background: filterStatus === f ? "var(--card-bg)" : "transparent",
                  color: filterStatus === f ? "var(--accent)" : "var(--muted-fg)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: filterStatus === f ? "0 2px 8px var(--shadow)" : "none"
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Add Agent Trigger */}
          <Button
            variant="primary"
            icon={<Plus style={{ width: "16px", height: "16px" }} />}
            onClick={() => {
              cancelEdit();
              setIsFormOpen(true);
            }}
            style={{ padding: "10px 18px", borderRadius: "12px" } as React.CSSProperties}
          >
            Register Member
          </Button>
        </div>
      </div>

      {/* Main Roster List */}
      <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--glass-bg)" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)" }}>Registered Workgroup</h3>
            <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500, marginTop: "2px" }}>
              Showing {filteredAgents.length} of {agents.length} members
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAgents}
            icon={<RefreshCw style={{ width: "13px", height: "13px" }} />}
            style={{ fontSize: "11px", padding: "8px 16px" } as React.CSSProperties}
          >
            Sync Directory
          </Button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "860px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--muted-bg)", borderBottom: "1px solid var(--card-border)" }}>
                {["Team Member", "Contact Details", "Duty Shift", "Presence", "Account Status", "Actions"].map((h, i) => {
                  const widths = ["26%", "26%", "20%", "14%", "10%", "4%"];
                  return (
                    <th
                      key={h}
                      style={{
                        width: widths[i],
                        padding: "16px 20px",
                        paddingLeft: i === 0 ? "24px" : "20px",
                        paddingRight: i === 5 ? "24px" : "20px",
                        fontSize: "11px",
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--muted-fg)",
                        textAlign: i === 5 ? "right" : "left",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "80px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "var(--muted-fg)" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--muted-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-fg)" }}>
                        <ShieldAlert style={{ width: "24px", height: "24px", opacity: 0.6 }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", marginBottom: "4px" }}>No workgroup members found</p>
                        <p style={{ fontSize: "13px", lineHeight: 1.6 }}>Try clearing your search query or registering a new support agent.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map(agent => {
                  const isDuty = agent.is_active && isShiftActive(agent.chat_hours);
                  return (
                    <tr
                      key={agent.id}
                      style={{
                        borderBottom: "1px solid var(--card-border)",
                        transition: "background 0.2s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(79, 124, 255, 0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {/* Name Card */}
                      <td style={{ padding: "16px 20px", paddingLeft: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: getAvatarGradient(agent.name),
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            flexShrink: 0
                          }}>
                            {getInitials(agent.name)}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 750, color: "var(--fg)" }}>{agent.name}</span>
                            <span style={{ fontSize: "10px", color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                              Support Agent
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "13px", color: "var(--fg)", fontWeight: 500 }}>{agent.email}</span>
                            <button
                              onClick={() => handleCopyEmail(agent.email, agent.id)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: copiedEmail === agent.id ? "#10b981" : "var(--muted-fg)",
                                cursor: "pointer",
                                display: "flex",
                                padding: "4px",
                                borderRadius: "4px",
                                transition: "color 0.15s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "var(--muted-bg)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              title="Copy email address"
                            >
                              {copiedEmail === agent.id
                                ? <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#10b981" }}>Copied</span>
                                : <Copy style={{ width: "12px", height: "12px" }} />
                              }
                            </button>
                          </div>
                          {agent.phone_number && (
                            <span style={{ fontSize: "11.5px", color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Phone style={{ width: "11px", height: "11px" }} />
                              {agent.phone_number}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Shift Schedule */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--fg)", fontWeight: 500 }}>
                          <Clock style={{ width: "13px", height: "13px", color: "var(--muted-fg)" }} />
                          {formatShiftText(agent.chat_hours)}
                        </div>
                      </td>

                      {/* Presence (On/Off Duty) */}
                      <td style={{ padding: "16px 20px" }}>
                        {isDuty ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.15)",
                            color: "#10b981",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em"
                          }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "pulseGlow 2s ease-in-out infinite" }} />
                            On Duty
                          </span>
                        ) : (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "var(--muted-bg)",
                            border: "1px solid var(--card-border)",
                            color: "var(--muted-fg)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em"
                          }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--muted-fg)" }} />
                            Off Duty
                          </span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td style={{ padding: "16px 20px" }}>
                        {agent.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="error">Blocked</Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", paddingRight: "24px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            onClick={() => {
                              handleEdit(agent);
                              setIsFormOpen(true);
                            }}
                            style={{
                              padding: "8px",
                              borderRadius: "10px",
                              background: "var(--accent-glow)",
                              border: "1px solid rgba(79, 124, 255, 0.15)",
                              color: "var(--accent)",
                              cursor: "pointer",
                              display: "flex",
                              transition: "all 0.15s ease"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px var(--shadow)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            title="Edit details"
                          >
                            <Pencil style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            style={{
                              padding: "8px",
                              borderRadius: "10px",
                              background: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.15)",
                              color: "#ef4444",
                              cursor: "pointer",
                              display: "flex",
                              transition: "all 0.15s ease"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.1)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            title="Delete agent"
                          >
                            <Trash2 style={{ width: "14px", height: "14px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register/Edit Agent Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          cancelEdit();
          setIsFormOpen(false);
        }}
        title={editingId ? "Modify" : "Register"}
        title1={editingId ? "Team Member" : "Team Member"}

        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleSaveAgent} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px", paddingRight: "5px" }}>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
            {editingId
              ? "Update this agent's account credentials, active shifts, and access settings."
              : "Register a support agent account. They will receive credentials to access manual takeover chats."
            }
          </p>

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            error={errors.name}
          />
          <Input
            label="Login Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            icon={<Mail style={{ width: "14px", height: "14px" }} />}
            error={errors.email}
          />
          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+1 555-0100"
            icon={<Phone style={{ width: "14px", height: "14px" }} />}
            error={errors.phone_number}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg)" }}>Active Shifts</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={{ flex: 1, padding: "11px 14px", background: "var(--muted-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", fontSize: "14px", color: "var(--fg)", outline: "none" }}
              />
              <span style={{ color: "var(--muted-fg)", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", flexShrink: 0 }}>to</span>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={{ flex: 1, padding: "11px 14px", background: "var(--muted-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", fontSize: "14px", color: "var(--fg)", outline: "none" }}
              />
            </div>
          </div>

          <Select label="Account Status" name="is_active" value={formData.is_active} onChange={handleChange}>
            <option value="true">Active (Access Allowed)</option>
            <option value="false">Inactive (Suspended)</option>
          </Select>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                cancelEdit();
                setIsFormOpen(false);
              }}
              style={{ padding: "10px 20px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              style={{ padding: "10px 20px" }}
            >
              {editingId ? "Update Details" : "Register Agent"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
}
