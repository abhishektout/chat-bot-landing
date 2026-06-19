import { apiClient } from "./apiClient";

export const superAdminService = {
  // --- Clients ---
  getClients: async () => apiClient("/superadmin/clients", { role: "superadmin" }),
  getClient: async (clientId: string) => apiClient(`/superadmin/clients/${clientId}`, { role: "superadmin" }),
  createClient: async (data: any) => apiClient("/superadmin/clients", { method: "POST", body: JSON.stringify(data), role: "superadmin" }),
  deleteClient: async (clientId: string) => apiClient(`/superadmin/clients/${clientId}`, { method: "DELETE", role: "superadmin" }),
  recoverClient: async (clientId: string) => apiClient(`/superadmin/clients/${clientId}/recover`, { method: "PUT", role: "superadmin" }),
  toggleClient: async (clientId: string) => apiClient(`/superadmin/clients/${clientId}/toggle`, { method: "PUT", role: "superadmin" }),
  
  // --- Settings & Setup ---
  setupFirstRun: async (data: any) => apiClient("/superadmin/setup-first-run", { method: "POST", body: JSON.stringify(data), role: "superadmin" }),
  getSettings: async () => apiClient("/superadmin/settings", { role: "superadmin" }),
  updateSettings: async (data: any) => apiClient("/superadmin/settings", { method: "PUT", body: JSON.stringify(data), role: "superadmin" }),
};
