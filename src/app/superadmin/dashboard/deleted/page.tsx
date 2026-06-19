"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, RefreshCw, Archive, AlertTriangle, Building } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Badge, Button, Loader, Skeleton } from "@/components/ui";
import { superAdminService } from "@/services/superadmin.service";

interface DeletedClient {
  id: string | number;
  company_name: string;
  subscription_plan: string;
  api_key: string;
}

export default function DeletedAccountsPage() {
  const { showToast } = useToast();
  const [deletedClients, setDeletedClients] = useState<DeletedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeletedClients = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getDeletedClients();
      setDeletedClients(data.deleted_clients || []);
    } catch (e) {
      console.error(e);
      showToast("error", "Sync Error", "Failed to retrieve archives list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedClients();
  }, []);

  const handleRecover = async (clientId: string | number) => {
    if (!window.confirm("Recover this client account? It will become active again.")) return;
    try {
      await superAdminService.recoverClient(clientId);
      showToast("success", "Account Restored", "Client workspace recovered successfully.");
      fetchDeletedClients();
    } catch (e) {
      showToast("error", "Error", "Error recovering account.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge" style={{ marginBottom: "4px", width: "fit-content", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          Archived Workspace Records
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Archived <span className="gradient-text" style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Tenants</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Review historical metadata or recover suspended client organizations back to active operations.
        </p>
      </div>

      {/* ── Top Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <Button
          variant="outline"
          onClick={fetchDeletedClients}
          isLoading={isLoading}
          icon={<RefreshCw style={{ width: "14px", height: "14px" }} />}
          style={{ fontSize: "12px", padding: "8px 18px" } as React.CSSProperties}
        >
          Sync Archive
        </Button>
      </div>

      {/* Archive History Table */}
      <Card className="card" style={{ padding: 0, overflow: "hidden" }}>
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
                background: "#ef4444",
                opacity: 0.6,
                animation: "pulseGlow 1.5s ease-in-out infinite",
              }} />
              <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            </span>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)" }}>
              Archive History Logs
            </h3>
          </div>
          <Badge variant="neutral" style={{ fontSize: "9px", padding: "3px 8px" }}>
            {deletedClients.length} Archived
          </Badge>
        </div>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                background: "var(--muted-bg)",
                borderBottom: "1px solid var(--card-border)",
              }}>
                {["Business Name", "Billing Plan", "Workspace API Key", "Actions"].map((h, i) => (
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
                    <td style={{ padding: "16px 24px" }}><Skeleton className="h-5 w-48" /></td>
                    <td style={{ padding: "16px" }}><Skeleton className="h-5 w-20" /></td>
                    <td style={{ padding: "16px" }}><Skeleton className="h-4 w-32" /></td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}><Skeleton className="h-8 w-28 ml-auto" /></td>
                  </tr>
                ))
              ) : deletedClients.length === 0 ? (
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
                        <Archive style={{ width: "22px", height: "22px", opacity: 0.5 }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>Archive index is empty</p>
                        <p style={{ fontSize: "12px", maxWidth: "320px", lineHeight: 1.6 }}>
                          When tenants are deleted, their archived records will be stored in this directory.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                deletedClients.map((client) => (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom: "1px solid var(--card-border)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--muted-bg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 24px", fontSize: "13px", fontWeight: 750, color: "var(--fg)" }}>
                      {client.company_name}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Badge variant="neutral" style={{ fontSize: "9px", padding: "3px 8px" }}>
                        {client.subscription_plan}
                      </Badge>
                    </td>
                    <td style={{ padding: "16px", fontFamily: "monospace", fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
                      {client.api_key ? `${client.api_key.substring(0, 12)}...` : "None"}
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <Button
                        variant="outline"
                        onClick={() => handleRecover(client.id)}
                        icon={<RotateCcw style={{ width: "13px", height: "13px" }} />}
                        style={{
                          fontSize: "11px",
                          padding: "6px 14px",
                          borderColor: "rgba(16,185,129,0.35)",
                          color: "var(--accent)",
                          background: "transparent",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.08)";
                          (e.currentTarget as HTMLButtonElement).style.color = "#10b981";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#10b981";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.35)";
                        }}
                      >
                        Recover Tenant
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
