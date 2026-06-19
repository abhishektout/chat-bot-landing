import { apiClient } from "./apiClient";

export const widgetService = {
  getWidgetConfig: async (tenantId?: string) => {
    const query = tenantId ? `?tenant_id=${tenantId}` : "";
    return apiClient(`/widget/config${query}`, { requireAuth: false });
  },
  
  getAgentMessages: async (sessionId: string) => {
    return apiClient(`/widget/agent-messages/${sessionId}`, { requireAuth: false });
  },

  askQuestion: async (data: { question: string; session_id: string; tenant_id?: string }) => {
    return apiClient("/ask_question", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: false,
    });
  },
};
