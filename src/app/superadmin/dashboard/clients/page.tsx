"use client";

import React, { useState, useEffect } from "react";
import { Building, UserPlus, RefreshCw, Pencil, Trash2, Key, HelpCircle, Shield, Check, Info, Settings, Eye, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Input, Select, Textarea, Button, Badge, Alert, Modal } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

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

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (e) {
      console.error(e);
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
    const payload = new URLSearchParams();
    payload.append("company_name", companyName.trim());
    payload.append("bot_name", botName.trim());
    payload.append("support_email", supportEmail.trim());
    payload.append("subscription_plan", subscriptionPlan);
    payload.append("is_active", String(isActive));

    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
      });

      if (res.ok) {
        showToast("success", "Tenant Onboarded", "Client created successfully! Verification details emailed.");
        setCompanyName("");
        setBotName("");
        setSupportEmail("");
        setSubscriptionPlan("free");
        setIsActive(true);
        fetchClients();
      } else {
        const err = await res.json();
        showToast("error", "Process Failed", err.detail || "Failed to create client.");
      }
    } catch (error) {
      showToast("error", "Error", "Server error creating client.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (clientId: string | number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients/${clientId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ is_active: String(!currentStatus) }),
      });
      if (res.ok) {
        showToast("success", "Status Updated", "Client status toggled successfully.");
        fetchClients();
      }
    } catch (error) {
      showToast("error", "Error", "Failed to toggle status.");
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const payload = new URLSearchParams();
      payload.append("company_name", editDetails.company_name || "");
      payload.append("bot_name", editDetails.bot_name || "");
      payload.append("support_email", editDetails.support_email || "");
      payload.append("subscription_plan", editDetails.subscription_plan || "free");
      payload.append("custom_rules", editDetails.custom_rules || "");
      payload.append("primary_color", editDetails.primary_color || "#2563eb");
      payload.append("widget_position", editDetails.widget_position || "right");
      payload.append("widget_icon_url", editDetails.widget_icon_url || "");

      const res = await fetch(`${BASE_API}/superadmin/clients/${editingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
      });

      if (res.ok) {
        showToast("success", "Configuration Saved", "Client information updated successfully.");
        setShowEditModal(false);
        setEditingId(null);
        fetchClients();
      } else {
        showToast("error", "Update Failed", "Failed to save client details.");
      }
    } catch (e) {
      showToast("error", "Error", "Server error during details update.");
    }
  };

  const handleDelete = async (clientId: string | number) => {
    if (!window.confirm("Archive this client account? It will be suspended and moved to archive.")) return;
    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients/${clientId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Archived", "Client account archived successfully.");
        fetchClients();
      }
    } catch (e) {
      showToast("error", "Error", "Failed to delete account.");
    }
  };

  const openEditModal = (client: Client) => {
    setEditDetails(client);
    setEditingId(client.id);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
            Platform Master Console
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Manage <span className="gradient-text">Clients</span>
        </h2>
        <p className="text-sm text-[var(--muted-fg)] font-medium">
          Provision new organization tenants, control subscription tiers, and configure default branding rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboard Client Form */}
        <Card className="p-8 lg:col-span-1 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--accent-glow)] text-[var(--accent)]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--fg)]">Provision Tenant</h3>
                <p className="text-xs text-[var(--muted-fg)] font-medium mt-0.5">
                  Launch a new company workspace.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
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
                className="w-full text-xs py-3.5 mt-2"
              >
                Onboard Account
              </Button>
            </form>
          </div>
        </Card>

        {/* Tenants Table Grid */}
        <Card className="p-0 lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--muted-bg)]/20">
              <h3 className="text-base font-bold text-[var(--fg)]">
                Active Business Tenants
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchClients}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-[10px] py-1.5 px-3"
              >
                Refresh List
              </Button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)] border-b border-[var(--card-border)] text-[var(--muted-fg)] text-[10px] tracking-widest uppercase font-bold">
                    <th className="p-4 pl-6">Business / Bot</th>
                    <th className="p-4">Super User</th>
                    <th className="p-4">Workspace API Key</th>
                    <th className="p-4">Tier Plan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-[var(--muted-fg)]">
                          <Building className="w-6 h-6 opacity-60" />
                          <span className="text-xs font-semibold">No business tenants active</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-[var(--card-border)] hover:bg-[var(--muted-bg)]/20 transition-all text-xs"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[var(--fg)]">{client.company_name}</span>
                            <span className="text-[10px] text-[var(--muted-fg)]">Bot: {client.bot_name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[var(--muted-fg)]">
                          {client.support_email}
                        </td>
                        <td className="p-4 font-mono text-[var(--accent)] font-semibold">
                          {client.api_key ? `${client.api_key.substring(0, 10)}...` : "None"}
                        </td>
                        <td className="p-4">
                          <Badge variant="neutral" className="text-[9px] py-0.5 px-2">
                            {client.subscription_plan}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(client.id, client.is_active)}
                            className="border-0 bg-transparent p-0 cursor-pointer outline-none"
                          >
                            <Badge
                              variant={client.is_active ? "success" : "error"}
                              className="text-[9px] py-0.5 px-2 font-bold cursor-pointer"
                            >
                              {client.is_active ? "Active" : "Suspended"}
                            </Badge>
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(client)}
                              className="text-[var(--accent)] hover:bg-[var(--accent-glow)] p-2 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(client.id)}
                              className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
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
              className="text-xs py-2.5 px-5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDetails}
              className="text-xs py-2.5 px-5"
            >
              Save Configuration
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateDetails} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    </div>
  );
}
