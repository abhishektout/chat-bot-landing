import { superAdminClient } from "./apiClient";

export interface ClientPayload {
  company_name: string;
  bot_name: string;
  support_email: string;
  subscription_plan: string;
  is_active: string;
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
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      params.append(key, val);
    });

    const response = await superAdminClient.post("/superadmin/clients", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Toggle client status (Active/Suspended)
  toggleClientStatus: async (clientId: string | number, isActive: boolean) => {
    const params = new URLSearchParams();
    params.append("is_active", String(isActive));

    const response = await superAdminClient.put(`/superadmin/clients/${clientId}/status`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Update client configuration details
  updateClientDetails: async (clientId: string | number, payload: ClientUpdatePayload) => {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined) {
        params.append(key, val);
      }
    });

    const response = await superAdminClient.put(`/superadmin/clients/${clientId}`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Suspend/Archive a client
  deleteClient: async (clientId: string | number) => {
    const response = await superAdminClient.delete(`/superadmin/clients/${clientId}`);
    return response.data;
  },

  // Get all deleted/archived clients
  getDeletedClients: async () => {
    const response = await superAdminClient.get("/superadmin/clients/deleted");
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

  // Update global settings
  saveSettings: async (payload: GlobalSettingsPayload) => {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      params.append(key, val);
    });

    const response = await superAdminClient.post("/superadmin/settings", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },
};
