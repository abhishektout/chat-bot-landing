import { superAdminClient } from "./apiClient";

export interface ClientPayload {
  company_name: string;
  email: string;
  phone: string;
  website?: string;
  industry?: string;
  subscription_plan?: string;
}

export interface ClientUpdatePayload {
  company_name: string;
  bot_name: string;
  support_email: string;
  subscription_plan: string;
  custom_rules?: string;
  primary_color?: string;
  widget_position?: string;
  widget_icon_url?: string;
}

export interface GlobalSettingsPayload {
  gemini_api_key: string;
  smtp_server: string;
  smtp_email: string;
  smtp_password: string;
}

export const superAdminService = {
  // Get all active clients
  getClients: async () => {
    const response = await superAdminClient.get("/superadmin/clients");
    return response.data;
  },

  // Onboard new client
  createClient: async (payload: ClientPayload) => {
    const response = await superAdminClient.post("/superadmin/clients", payload);
    return response.data;
  },

  // Toggle client status (Active/Suspended) - Uses the PUT /toggle endpoint
  toggleClientStatus: async (clientId: string | number) => {
    const response = await superAdminClient.put(`/superadmin/clients/${clientId}/toggle`);
    return response.data;
  },

  // Update client configuration details (if supported by client-level admin)
  updateClientDetails: async (clientId: string | number, payload: ClientUpdatePayload) => {
    const response = await superAdminClient.put(`/superadmin/clients/${clientId}`, payload);
    return response.data;
  },

  // Suspend/Archive a client
  deleteClient: async (clientId: string | number) => {
    const response = await superAdminClient.delete(`/superadmin/clients/${clientId}`);
    return response.data;
  },

  // Get all deleted/archived clients
  getDeletedClients: async () => {
    const response = await superAdminClient.get("/superadmin/clients", {
      params: { deleted: true }
    });
    return response.data;
  },

  // Restore an archived client
  recoverClient: async (clientId: string | number) => {
    const response = await superAdminClient.put(`/superadmin/clients/${clientId}/recover`);
    return response.data;
  },

  // Get global settings (Gemini, SMTP)
  getSettings: async () => {
    const response = await superAdminClient.get("/superadmin/settings");
    return response.data;
  },

  // Update global settings - Uses PUT and maps field names for Gemini
  saveSettings: async (payload: GlobalSettingsPayload) => {
    const backendPayload = {
      master_gemini_key: payload.gemini_api_key || "",
      smtp_server: payload.smtp_server || "",
      smtp_email: payload.smtp_email || "",
      smtp_password: payload.smtp_password || "",
    };
    const response = await superAdminClient.put("/superadmin/settings", backendPayload);
    return response.data;
  },
};
