import { apiClient } from "./apiClient";

export const authService = {
  // --- Admin (Client) Auth ---
  sendClientOtp: async (email: string) => {
    return apiClient("/client/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      requireAuth: false,
    });
  },

  verifyClientOtp: async (email: string, otp_code: string) => {
    return apiClient("/client/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp_code }),
      requireAuth: false,
    });
  },

  loginClientPassword: async (email: string, password?: string) => {
    // Note: The original code tries both JSON and x-www-form-urlencoded. 
    // We'll stick to JSON here, but the component handles the fallback if needed.
    return apiClient("/client/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requireAuth: false,
    });
  },

  loginClientPasswordUrlEncoded: async (username: string, password?: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    if (password) formData.append("password", password);
    return apiClient("/client/login", {
      method: "POST",
      body: formData,
      requireAuth: false,
    });
  },

  // --- SuperAdmin Auth ---
  loginSuperAdmin: async (email: string, password?: string) => {
    return apiClient("/superadmin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requireAuth: false,
    });
  },

  sendSuperAdminOtp: async (email: string, password?: string) => {
    return apiClient("/superadmin/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requireAuth: false,
    });
  },

  verifySuperAdminOtp: async (email: string, otp_code: string) => {
    return apiClient("/superadmin/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp_code }),
      requireAuth: false,
    });
  },

  // --- Agent Auth ---
  loginAgent: async (email: string, password?: string) => {
    const formData = new FormData();
    formData.append("email", email);
    if (password) formData.append("password", password);

    return apiClient("/agent/login", {
      method: "POST",
      body: formData,
      requireAuth: false,
      isFormData: true,
    });
  },
};
