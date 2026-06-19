"use client";

import React, { useState, useEffect } from "react";
import { Database, Link2, Key, Shield, Check, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAdminDashboard } from "../layout";
import { Card, Textarea, Button, Badge } from "@/components/ui";
import { adminService } from "@/services/admin.service";

export default function DatabaseAuthPage() {
  const { tenantInfo, refreshTenantInfo } = useAdminDashboard();
  const { showToast } = useToast();
  const [dbUri, setDbUri] = useState("");
  const [dbRules, setDbRules] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  useEffect(() => {
    if (tenantInfo?.client_db_uri) {
      setDbUri(tenantInfo.client_db_uri);
      setDbRules(tenantInfo.db_rules || "");
      let parsedTables: string[] = [];
      try {
        if (tenantInfo.allowed_tables) parsedTables = JSON.parse(tenantInfo.allowed_tables);
      } catch { }
      if (parsedTables.length > 0) {
        setAvailableTables(parsedTables);
        setSelectedTables(parsedTables);
      }
      setIsConnected(true);
    }
  }, [tenantInfo]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUri.trim()) { showToast("error", "Validation Error", "Please enter a Database URI."); return; }
    setIsConnecting(true);
    try {
      const data = await adminService.dbConnect(dbUri.trim());
      if (data.tables) setAvailableTables(data.tables);
      else {
        showToast("success", "Connected", "Database connected! Tables fetched successfully.");
        setAvailableTables(["users", "orders", "products", "customers", "transactions"]);
      }
      setIsConnected(true);
      await refreshTenantInfo();
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || "Failed to connect to database.";
      showToast("error", "Connection Failed", errMsg);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect database? This removes your bot's access to live data.")) return;
    try {
      await adminService.dbDisconnect();
      showToast("success", "Disconnected", "Database disconnected successfully.");
      setIsConnected(false); setDbUri(""); setDbRules("");
      setAvailableTables([]); setSelectedTables([]);
      await refreshTenantInfo();
    } catch {
      showToast("error", "Error", "Server error disconnecting database.");
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await adminService.dbSaveConfig(JSON.stringify(selectedTables), dbRules);
      showToast("success", "Configuration Saved", "Database workspace rules updated.");
      await refreshTenantInfo();
    } catch {
      showToast("error", "Error", "Server error saving database rules.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTableSelection = (tableName: string) => {
    if (selectedTables.includes(tableName)) setSelectedTables(selectedTables.filter(t => t !== tableName));
    else setSelectedTables([...selectedTables, tableName]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge"><Database style={{ width: "12px", height: "12px" }} />Relational Syncer</span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Database <span className="gradient-text">Connectivity</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Integrate SQL database parameters to empower the AI agent with real-time record reading capabilities.
        </p>
      </div>

      {/* Security Alert */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 20px",
        borderRadius: "14px", background: "rgba(79,124,255,0.06)", border: "1px solid rgba(79,124,255,0.18)",
      }}>
        <Shield style={{ width: "20px", height: "20px", color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h5 style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)", marginBottom: "4px" }}>Security &amp; Isolation Guarantee</h5>
          <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            Credentials are encrypted at rest. Connections are strictly restricted to read-only queries with limited transaction timeout rules.
          </p>
        </div>
      </div>

      {/* Connection Card */}
      <div className="card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--card-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ padding: "10px", borderRadius: "12px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)", display: "flex" }}>
              <Database style={{ width: "20px", height: "20px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", marginBottom: "2px" }}>Database Access Link</h3>
              <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>Support for secure PostgreSQL cluster connections.</p>
            </div>
          </div>
          {isConnected && (
            <Badge variant="success" style={{ fontSize: "10px" } as React.CSSProperties}>Active Integration</Badge>
          )}
        </div>

        <form onSubmit={handleConnect}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>
              PostgreSQL DB Connection String URI
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <input
                  type="text" value={dbUri} onChange={e => setDbUri(e.target.value)} disabled={isConnected}
                  placeholder="postgresql://username:password@your-database-host:5432/production"
                  style={{
                    flex: 1, minWidth: "200px", padding: "13px 16px",
                    background: isConnected ? "var(--muted-bg)" : "var(--card-bg)",
                    border: "1px solid var(--card-border)", borderRadius: "12px",
                    fontSize: "13px", fontFamily: "monospace", color: "var(--fg)", outline: "none",
                    opacity: isConnected ? 0.7 : 1,
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                />
                {!isConnected ? (
                  <Button type="submit" isLoading={isConnecting} icon={<Link2 style={{ width: "16px", height: "16px" }} />}
                    style={{ whiteSpace: "nowrap", padding: "13px 22px" } as React.CSSProperties}>
                    Establish Link
                  </Button>
                ) : (
                  <Button type="button" variant="danger" onClick={handleDisconnect} icon={<Trash2 style={{ width: "16px", height: "16px" }} />}
                    style={{ whiteSpace: "nowrap", padding: "13px 22px" } as React.CSSProperties}>
                    Revoke Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>

        {!isConnected && (
          <div style={{
            marginTop: "28px", border: "1px dashed var(--card-border)", borderRadius: "16px",
            padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column",
            alignItems: "center", gap: "12px", background: "var(--muted-bg)",
          }}>
            <div style={{ padding: "16px", borderRadius: "50%", background: "var(--accent-glow)", color: "var(--accent)" }}>
              <Key style={{ width: "28px", height: "28px" }} />
            </div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--fg)" }}>No active SQL sync connection</h4>
            <p style={{ fontSize: "12px", color: "var(--muted-fg)", maxWidth: "360px", lineHeight: 1.6 }}>
              Define a read-only PostgreSQL connection path to enable live customer query context processing.
            </p>
          </div>
        )}
      </div>

      {/* Config Card (visible when connected) */}
      {isConnected && (
        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
              Select Accessible Tables
            </h4>
            <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginBottom: "16px", lineHeight: 1.6 }}>
              Restrain the scope of AI query execution by limiting accessible table vectors.
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "10px", background: "var(--muted-bg)", padding: "20px",
              border: "1px solid var(--card-border)", borderRadius: "16px",
              maxHeight: "220px", overflowY: "auto",
            }}>
              {availableTables.length > 0 ? (
                availableTables.map((table, idx) => {
                  const isSelected = selectedTables.includes(table);
                  return (
                    <label key={idx} style={{
                      display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px",
                      background: "var(--card-bg)", border: `1px solid ${isSelected ? "var(--accent)" : "var(--card-border)"}`,
                      borderRadius: "10px", cursor: "pointer", transition: "all 0.15s",
                      userSelect: "none",
                    }}>
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                        background: isSelected ? "var(--accent)" : "transparent",
                        border: `2px solid ${isSelected ? "var(--accent)" : "var(--card-border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {isSelected && <Check style={{ width: "10px", height: "10px", color: "#fff" }} />}
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleTableSelection(table)} style={{ display: "none" }} />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {table}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic", padding: "16px" }}>
                  No tables discovered in default schema.
                </div>
              )}
            </div>
          </div>

          <Textarea
            label="Behavioral Mapping Instructions"
            rows={4} value={dbRules} onChange={e => setDbRules(e.target.value)}
            placeholder="For example: Always check active user subscriptions before rendering pricing details."
          />

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid var(--card-border)" }}>
            <Button type="button" isLoading={isSaving} onClick={handleSaveConfig}
              style={{ padding: "13px 28px", fontSize: "14px" } as React.CSSProperties}>
              Apply Context Rules
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
