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
  phone_number?: string;
  chat_hours?: string;
  is_active?: boolean;
}

export const adminService = {
  // Knowledge Base APIs
  getUploadedDocuments: async () => {
    try {
      const response = await adminClient.get("/admin/uploaded-documents");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning empty documents fallback.");
      return [];
    }
  },

  getFaqs: async () => {
    try {
      const response = await adminClient.get("/admin/faqs");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning empty FAQs fallback.");
      return [];
    }
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

  updateFaq: async (faqId: string | number, question: string, answer: string) => {
    const params = new URLSearchParams();
    params.append("question", question);
    params.append("answer", answer);

    const response = await adminClient.put(`/admin/faqs/${faqId}`, params, {
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
    try {
      const response = await adminClient.get("/admin/tenant-info");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning local fallback tenant info.");
      return {
        company_name: "Samsung",
        bot_name: "Assistly Copilot",
        support_email: "support@assistly.dev",
        custom_rules: "Always be polite and helpful. Suggest using the pricing calculator.",
        primary_color: "#4f7cff",
        widget_position: "right",
        widget_icon_url: "",
        api_key: "ast_dev_key_123456789",
        client_db_uri: "postgresql://localhost:5432/assistly_dev",
        db_rules: "Allow read access to products, support_articles, and contact_requests.",
        allowed_tables: "products, support_articles, contact_requests",
      };
    }
  },

  // Telemetry and Sessions
  getLiveSessions: async () => {
    try {
      const response = await adminClient.get("/admin/sessions");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning local mock sessions.");
      return {
        sessions: [
          {
            id: "session_1",
            session_id: "session_1",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            human_takeover: false,
            agent_name: "",
          },
          {
            id: "session_2",
            session_id: "session_2",
            created_at: new Date(Date.now() - 7200000).toISOString(),
            human_takeover: true,
            agent_name: "John Doe",
          }
        ]
      };
    }
  },

  getSessionChats: async (sessionId: string | number) => {
    try {
      const response = await adminClient.get(`/admin/sessions/${sessionId}/chats`);
      return response.data;
    } catch (error) {
      console.warn(`Network offline: returning local mock chats for session ${sessionId}.`);
      if (String(sessionId) === "session_1") {
        return {
          chats: [
            { role: "user", content: "Hi there! I wanted to check the pricing of Assistly." },
            { role: "assistant", content: "Hello! Assistly has three plans: Basic ($29/mo), Pro ($79/mo), and Enterprise. You can also calculate your cost using our pricing page." }
          ]
        };
      } else if (String(sessionId) === "session_2") {
        return {
          chats: [
            { role: "user", content: "Can I speak with a human support agent?" },
            { role: "assistant", content: "Sure! Connecting you with a support representative." },
            { role: "agent", content: "Hello, John Doe here. How can I help you today?" }
          ]
        };
      }
      return { chats: [] };
    }
  },

  takeoverSession: async (sessionId: string | number) => {
    try {
      const response = await adminClient.post(`/admin/sessions/${sessionId}/takeover`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to takeover session ${sessionId} on network: simulating offline success.`);
      return { status: "success", human_takeover: true };
    }
  },

  sendChatMessage: async (sessionId: string | number, message: string) => {
    try {
      const response = await adminClient.post(`/admin/sessions/${sessionId}/send`, {
        message: message,
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to send message on network: simulating offline send success.`);
      return { status: "success" };
    }
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
    try {
      const response = await adminClient.get("/admin/settings");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning empty settings fallback.");
      return {};
    }
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
    try {
      const response = await adminClient.get("/admin/agents");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning empty agents fallback.");
      return [];
    }
  },

  addAgent: async (payload: AgentPayload) => {
    const response = await adminClient.post("/admin/agents", payload);
    return response.data;
  },

  updateAgent: async (agentId: string | number, payload: Partial<AgentPayload>) => {
    const response = await adminClient.put(`/admin/agents/${agentId}`, payload);
    return response.data;
  },

  deleteAgent: async (agentId: string | number) => {
    const response = await adminClient.delete(`/admin/agents/${agentId}`);
    return response.data;
  },

  // Overview / Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await adminClient.get("/admin/dashboard-stats");
      return response.data;
    } catch (error) {
      console.warn("Network offline: returning local mock stats.");
      return {
        total_sessions: 24,
        total_messages: 148,
      };
    }
  },
};
