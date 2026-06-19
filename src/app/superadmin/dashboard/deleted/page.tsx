"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, RefreshCw, Archive, AlertTriangle, Building } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Badge, Button, Loader } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

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
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients/deleted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeletedClients(data.deleted_clients || []);
      }
    } catch (e) {
      console.error(e);
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
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/clients/${clientId}/recover`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Account Restored", "Client workspace recovered successfully.");
        fetchDeletedClients();
      } else {
        showToast("error", "Error", "Failed to recover account.");
      }
    } catch (e) {
      showToast("error", "Error", "Error recovering account.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
            Archived Workspace Records
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Archived <span className="gradient-text">Tenants</span>
        </h2>
        <p className="text-sm text-[var(--muted-fg)] font-medium">
          Review historical metadata or recover suspended client organizations back to active operations.
        </p>
      </div>

      {/* Archive History Table */}
      <Card className="p-0 overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--muted-bg)]/20">
            <h3 className="text-base font-bold text-[var(--fg)]">
              Archive History Logs
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDeletedClients}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-[10px] py-1.5 px-3"
            >
              Sync Archive
            </Button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)] border-b border-[var(--card-border)] text-[var(--muted-fg)] text-[10px] tracking-widest uppercase font-bold">
                  <th className="p-4 pl-6">Business Name</th>
                  <th className="p-4">Billing Plan</th>
                  <th className="p-4">Workspace API Key</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <Loader size="sm" label="Decrypting archives..." />
                    </td>
                  </tr>
                ) : deletedClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-[var(--muted-fg)]">
                        <Archive className="w-6 h-6 opacity-60" />
                        <span className="text-xs font-semibold">Archive index is completely empty</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  deletedClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-[var(--card-border)] hover:bg-[var(--muted-bg)]/20 transition-all text-xs"
                    >
                      <td className="p-4 pl-6 font-bold text-[var(--fg)]">
                        {client.company_name}
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral" className="text-[9px] py-0.5 px-2">
                          {client.subscription_plan}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-[var(--accent)] font-semibold">
                        {client.api_key ? `${client.api_key.substring(0, 12)}...` : "None"}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecover(client.id)}
                          icon={<RotateCcw className="w-3.5 h-3.5" />}
                          className="text-[9px] py-1.5 px-3 border-emerald-500/35 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                          Recover Account
                        </Button>
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
  );
}
