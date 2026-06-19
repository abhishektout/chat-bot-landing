import { adminClient } from "./apiClient";

export interface DatabaseConfigPayload {
  db_type: string;
  db_host: string;
  db_port: string;
  db_user: string;
  db_pass: string;
  db_name: string;
}

export interface AgentPayload {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export const adminService = {
  // Knowledge Base APIs
  getUploadedDocuments: async () => {
    const response = await adminClient.get("/admin/uploaded-documents");
    return response.data;
  },

  getFaqs: async () => {
    const response = await adminClient.get("/admin/faqs");
    return response.data;
  },

  uploadDocuments: async (formData: FormData) => {
    const response = await adminClient.post("/admin/upload-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteVectors: async () => {
    const response = await adminClient.post("/admin/delete-vectors");
    return response.data;
  },

  deleteDocument: async (docId: string | number) => {
    const response = await adminClient.delete(`/admin/documents/${docId}`);
    return response.data;
  },

  addFaq: async (question: string, answer: string) => {
    const params = new URLSearchParams();
    params.append("question", question);
    params.append("answer", answer);

    const response = await adminClient.post("/admin/faqs", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  deleteFaq: async (faqId: string | number) => {
    const response = await adminClient.delete(`/admin/faqs/${faqId}`);
    return response.data;
  },

  // Tenant / Organization Info
  getTenantInfo: async () => {
    const response = await adminClient.get("/admin/tenant-info");
    return response.data;
  },

  // Telemetry and Sessions
  getLiveSessions: async () => {
    const response = await adminClient.get("/admin/live-sessions");
    return response.data;
  },

  getSessionChats: async (sessionId: string | number) => {
    const response = await adminClient.get(`/admin/sessions/${sessionId}/chats`);
    return response.data;
  },

  takeoverSession: async (sessionId: string | number) => {
    const response = await adminClient.post(`/admin/sessions/${sessionId}/takeover`);
    return response.data;
  },

  sendChatMessage: async (sessionId: string | number, message: string) => {
    const params = new URLSearchParams();
    params.append("message", message);

    const response = await adminClient.post(`/admin/sessions/${sessionId}/send`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Database Connection Manager
  dbConnect: async (dbUri: string) => {
    const params = new URLSearchParams();
    params.append("db_uri", dbUri);

    const response = await adminClient.post("/admin/db-connect", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  dbDisconnect: async () => {
    const response = await adminClient.post("/admin/db-disconnect");
    return response.data;
  },

  dbSaveConfig: async (allowedTables: string, dbRules: string) => {
    const params = new URLSearchParams();
    params.append("allowed_tables", allowedTables);
    params.append("db_rules", dbRules);

    const response = await adminClient.post("/admin/db-save-config", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await adminClient.get("/admin/settings");
    return response.data;
  },

  saveSettings: async (payload: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      params.append(key, val);
    });

    const response = await adminClient.post("/admin/settings", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Agents & Team
  getAgents: async () => {
    const response = await adminClient.get("/admin/agents");
    return response.data;
  },

  addAgent: async (payload: AgentPayload) => {
    const response = await adminClient.post("/admin/agents", payload);
    return response.data;
  },

  deleteAgent: async (agentId: string | number) => {
    const response = await adminClient.delete(`/admin/agents/${agentId}`);
    return response.data;
  },

  // Overview / Dashboard stats
  getDashboardStats: async () => {
    const response = await adminClient.get("/admin/dashboard-stats");
    return response.data;
  },
};
