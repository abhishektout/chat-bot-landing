import { apiClient } from "./apiClient";

export const adminService = {
  // --- Dashboard ---
  getDashboardStats: async () => apiClient("/admin/dashboard-stats"),
  getLiveSessions: async () => apiClient("/admin/live-sessions"),
  getTenantInfo: async () => apiClient("/admin/tenant-info"),
  
  // --- Knowledge Base (Documents) ---
  getUploadedDocuments: async () => apiClient("/admin/uploaded-documents"),
  uploadDocuments: async (formData: FormData) => {
    return apiClient("/admin/upload-documents", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteDocument: async (docName: string | number) => apiClient(`/admin/documents/${docName}`, { method: "DELETE" }),
  deleteAllVectors: async () => apiClient("/admin/delete-vectors", { method: "POST" }),
  
  // --- Knowledge Base (FAQs) ---
  getFaqs: async () => apiClient("/admin/faqs"),
  addFaq: async (formData: URLSearchParams) => {
    return apiClient("/admin/faqs", {
      method: "POST",
      body: formData,
    });
  },
  updateFaq: async (faqId: string | number, formData: URLSearchParams) => {
    return apiClient(`/admin/faqs/${faqId}`, {
      method: "PUT",
      body: formData,
    });
  },
  deleteFaq: async (faqId: string | number) => apiClient(`/admin/faqs/${faqId}`, { method: "DELETE" }),

  // --- Sessions and Chats ---
  getSessions: async () => apiClient("/admin/sessions"),
  getSessionChats: async (sessionId: string) => apiClient(`/admin/sessions/${sessionId}/chats`),
  takeoverSession: async (sessionId: string, agentName: string) => {
    return apiClient(`/admin/sessions/${sessionId}/takeover`, {
      method: "POST",
      body: JSON.stringify({ agent_name: agentName }),
    });
  },
  sendMessage: async (sessionId: string, message: string, agentName: string) => {
    return apiClient(`/admin/sessions/${sessionId}/send`, {
      method: "POST",
      body: JSON.stringify({ message, agent_name: agentName }),
    });
  },

  // --- Agents (Team) ---
  getAgents: async () => apiClient("/admin/agents"),
  createAgent: async (data: any) => apiClient("/admin/agents", { method: "POST", body: JSON.stringify(data) }),
  updateAgent: async (agentId: string, data: any) => apiClient(`/admin/agents/${agentId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAgent: async (agentId: string) => apiClient(`/admin/agents/${agentId}`, { method: "DELETE" }),

  // --- Settings & Integrations ---
  validateKey: async (key: string) => apiClient("/admin/validate-key", { method: "POST", body: JSON.stringify({ key }) }),
  updateSettings: async (settings: any) => apiClient("/admin/settings", { method: "POST", body: JSON.stringify(settings) }),
  dbConnect: async (data: any) => apiClient("/admin/db-connect", { method: "POST", body: JSON.stringify(data) }),
  dbDisconnect: async () => apiClient("/admin/db-disconnect", { method: "POST" }),
  dbSaveConfig: async (data: any) => apiClient("/admin/db-save-config", { method: "POST", body: JSON.stringify(data) }),
};
