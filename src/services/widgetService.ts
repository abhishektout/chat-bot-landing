import axios from "axios";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

export const widgetService = {
  getWidgetConfig: async (tenantId?: string) => {
    const query = tenantId ? `?tenant_id=${tenantId}` : "";
    const response = await axios.get(`${BASE_API}/widget/config${query}`);
    return response.data;
  },
  
  getAgentMessages: async (sessionId: string) => {
    const response = await axios.get(`${BASE_API}/widget/agent-messages/${sessionId}`);
    return response.data;
  },

  askQuestion: async (data: { question: string; session_id: string; tenant_id?: string }) => {
    const response = await axios.post(`${BASE_API}/ask_question`, data);
    return response.data;
  },
};
