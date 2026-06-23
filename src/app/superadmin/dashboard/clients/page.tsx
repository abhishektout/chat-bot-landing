"use client";

import React, { useState, useEffect } from "react";
import { Building, UserPlus, RefreshCw, Pencil, Trash2, Key, HelpCircle, Shield, Check, Info, Settings, Eye, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Input, Select, Textarea, Button, Badge, Alert, Modal, Skeleton, ConfirmModal } from "@/components/ui";
import { superAdminService } from "@/services/superadmin.service";

interface Client {
  id: string | number;
  company_name: string;
  bot_name: string;
  support_email: string;
  subscription_plan: string;
  is_active: boolean;
  api_key: string;
  custom_rules?: string;
  primary_color?: string;
  widget_position?: string;
  widget_icon_url?: string;
}

export default function ManageClientsPage() {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [botName, setBotName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [isActive, setIsActive] = useState(true);

  // Edit states for details
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState<Partial<Client>>({});
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
    onConfirm: () => {},
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getClients();
      setClients(data.clients || []);
    } catch (e) {
      console.error(e);
      showToast("error", "Sync Error", "Failed to retrieve tenants list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !botName.trim() || !supportEmail.trim()) {
      showToast("error", "Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      await superAdminService.createClient({
        company_name: companyName.trim(),
        bot_name: botName.trim(),
        support_email: supportEmail.trim(),
        subscription_plan: subscriptionPlan,
        is_active: String(isActive),
      });

      showToast("success", "Tenant Onboarded", "Client created successfully! Verification details emailed.");
      setCompanyName("");
      setBotName("");
      setSupportEmail("");
      setSubscriptionPlan("free");
      setIsActive(true);
      fetchClients();
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || "Failed to create client.";
      showToast("error", "Process Failed", errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (clientId: string | number, currentStatus: boolean) => {
    try {
      await superAdminService.toggleClientStatus(clientId, !currentStatus);
      showToast("success", "Status Updated", "Client status toggled successfully.");
      fetchClients();
    } catch (error) {
      showToast("error", "Error", "Failed to toggle status.");
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await superAdminService.updateClientDetails(editingId, {
        company_name: editDetails.company_name || "",
        bot_name: editDetails.bot_name || "",
        support_email: editDetails.support_email || "",
        subscription_plan: editDetails.subscription_plan || "free",
        custom_rules: editDetails.custom_rules || "",
        primary_color: editDetails.primary_color || "#2563eb",
        widget_position: editDetails.widget_position || "right",
        widget_icon_url: editDetails.widget_icon_url || "",
      });

      showToast("success", "Configuration Saved", "Client information updated successfully.");
      setShowEditModal(false);
      setEditingId(null);
      fetchClients();
    } catch (e) {
      showToast("error", "Error", "Server error during details update.");
    }
  };

  const handleDelete = (clientId: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: "Archive Client Account",
      message: "Are you sure you want to archive this client account? It will be suspended and moved to the archive section.",
      confirmText: "Archive",
      onConfirm: async () => {
        try {
          await superAdminService.deleteClient(clientId);
          showToast("success", "Archived", "Client account archived successfully.");
          fetchClients();
        } catch (e) {
          showToast("error", "Error", "Failed to delete account.");
        }
      },
    });
  };

  const openEditModal = (client: Client) => {
    setEditDetails(client);
    setEditingId(client.id);
    setShowEditModal(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge" style={{ marginBottom: "4px", width: "fit-content" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          Platform Master Console
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Manage <span className="gradient-text">Clients</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Provision new organization tenants, control subscription tiers, and configure default branding rules.
        </p>
      </div>

      {/* ── Action Bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <Button
          variant="outline"
          onClick={fetchClients}
          isLoading={isLoading}
          icon={<RefreshCw style={{ width: "14px", height: "14px" }} />}
          style={{ fontSize: "12px", padding: "8px 18px" } as React.CSSProperties}
        >
          Sync Tenants
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboard Client Form */}
        <Card className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
            {/* Decorative element */}
            <div style={{
              position: "absolute",
              top: "-15px",
              right: "-15px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--accent-glow)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }} />
            <div style={{
              padding: "10px",
              borderRadius: "12px",
              background: "var(--accent-glow)",
              border: "1px solid rgba(79,124,255,0.15)",
              color: "var(--accent)",
              display: "flex",
            }}>
              <UserPlus style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)" }}>Provision Tenant</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500, marginTop: "2px" }}>
                Launch a new company workspace.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              required
            />
            <Input
              label="Bot Identifier Name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="e.g. Acme Assistant"
              required
            />
            <Input
              label="Super User Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="admin@acme.com"
              required
            />
            <Select
              label="Subscription Tier"
              value={subscriptionPlan}
              onChange={(e) => setSubscriptionPlan(e.target.value)}
            >
              <option value="free">Free Starter Plan</option>
              <option value="premium">Premium Pro Plan</option>
              <option value="enterprise">Enterprise Scaling Plan</option>
            </Select>

            <Select
              label="Access Status"
              value={String(isActive)}
              onChange={(e) => setIsActive(e.target.value === "true")}
            >
              <option value="true">Active / Verified</option>
              <option value="false">Deactivated / Suspended</option>
            </Select>

            <Button
              type="submit"
              isLoading={isSaving}
              style={{ fontSize: "13px", padding: "12px", width: "100%", marginTop: "8px" }}
            >
              Onboard Account
            </Button>
          </form>
        </Card>

        {/* Tenants Table Grid */}
        <Card className="card" style={{ padding: 0, overflow: "hidden", gridColumn: "span 2" } as React.CSSProperties}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--muted-bg)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px" }}>
                <span style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  opacity: 0.6,
                  animation: "pulseGlow 1.5s ease-in-out infinite",
                }} />
                <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              </span>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)" }}>
                Active Business Tenants
              </h3>
            </div>
            <Badge variant="info" style={{ fontSize: "9px" } as React.CSSProperties}>
              {clients.length} Total
            </Badge>
          </div>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{
                  background: "var(--muted-bg)",
                  borderBottom: "1px solid var(--card-border)",
                }}>
                  {["Business / Bot", "Super User", "API Key", "Tier Plan", "Status", "Actions"].map((h, i) => (
                    <th key={h} style={{
                      padding: "14px 16px",
                      paddingLeft: i === 0 ? "24px" : "16px",
                      paddingRight: i === 5 ? "24px" : "16px",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--muted-fg)",
                      textAlign: i === 5 ? "right" : "left",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--card-border)" }}>
                      <td style={{ padding: "16px 24px" }}><Skeleton className="h-5 w-40" /></td>
                      <td style={{ padding: "16px" }}><Skeleton className="h-4 w-32" /></td>
                      <td style={{ padding: "16px" }}><Skeleton className="h-4 w-24" /></td>
                      <td style={{ padding: "16px" }}><Skeleton className="h-5 w-16" /></td>
                      <td style={{ padding: "16px" }}><Skeleton className="h-5 w-16" /></td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}><Skeleton className="h-8 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px 24px", textAlign: "center" }}>
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
                          <Building style={{ width: "22px", height: "22px", opacity: 0.5 }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>No Business Tenants</p>
                          <p style={{ fontSize: "12px", maxWidth: "320px", lineHeight: 1.6 }}>
                            Provision your first organization workspace using the panel on the left.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
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
                            {client.company_name}
                          </span>
                          <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>
                            Bot: {client.bot_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px", fontSize: "12.5px", color: "var(--muted-fg)", fontWeight: 500 }}>
                        {client.support_email}
                      </td>
                      <td style={{ padding: "16px", fontFamily: "monospace", fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
                        {client.api_key ? `${client.api_key.substring(0, 10)}...` : "None"}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Badge variant="neutral" style={{ fontSize: "9px", padding: "3px 8px" }}>
                          {client.subscription_plan}
                        </Badge>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <button
                          onClick={() => handleToggleStatus(client.id, client.is_active)}
                          style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                        >
                          <Badge
                            variant={client.is_active ? "success" : "error"}
                            style={{ fontSize: "9px", padding: "3px 8px", cursor: "pointer" }}
                          >
                            {client.is_active ? "Active" : "Suspended"}
                          </Badge>
                        </button>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(client)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--accent)",
                              cursor: "pointer",
                              padding: "6px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-glow)")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                            title="Edit"
                          >
                            <Pencil style={{ width: "15px", height: "15px" }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(client.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "6px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                            title="Archive"
                          >
                            <Trash2 style={{ width: "15px", height: "15px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modify Tenant Properties Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modify Tenant Properties"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              style={{ fontSize: "12px", padding: "10px 20px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDetails}
              style={{ fontSize: "12px", padding: "10px 20px" }}
            >
              Save Configuration
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateDetails} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={editDetails.company_name || ""}
              onChange={(e) => setEditDetails({ ...editDetails, company_name: e.target.value })}
              required
            />
            <Input
              label="Bot Identifier Name"
              value={editDetails.bot_name || ""}
              onChange={(e) => setEditDetails({ ...editDetails, bot_name: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Super User Email"
                type="email"
                value={editDetails.support_email || ""}
                onChange={(e) => setEditDetails({ ...editDetails, support_email: e.target.value })}
                required
              />
            </div>
            <Select
              label="Subscription Tier"
              value={editDetails.subscription_plan || "free"}
              onChange={(e) => setEditDetails({ ...editDetails, subscription_plan: e.target.value })}
            >
              <option value="free">Free Starter Plan</option>
              <option value="premium">Premium Pro Plan</option>
              <option value="enterprise">Enterprise Scaling Plan</option>
            </Select>
            <Select
              label="Widget Position"
              value={editDetails.widget_position || "right"}
              onChange={(e) => setEditDetails({ ...editDetails, widget_position: e.target.value })}
            >
              <option value="right">Bottom Right</option>
              <option value="left">Bottom Left</option>
            </Select>
            <Input
              label="Widget Icon URL"
              value={editDetails.widget_icon_url || ""}
              onChange={(e) => setEditDetails({ ...editDetails, widget_icon_url: e.target.value })}
            />
            <Input
              label="Brand Color Theme (HEX)"
              value={editDetails.primary_color || "#2563eb"}
              onChange={(e) => setEditDetails({ ...editDetails, primary_color: e.target.value })}
            />
          </div>
          <Textarea
            label="Workspace Core Prompt Rules"
            rows={4}
            value={editDetails.custom_rules || ""}
            onChange={(e) => setEditDetails({ ...editDetails, custom_rules: e.target.value })}
          />
        </form>
      </Modal>

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
