import axios from "axios";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

// Axios instance for Tenant Admins
export const adminClient = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for Super Admins
export const superAdminClient = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach client token to all adminClient requests
adminClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("saas_client_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to attach superadmin token to all superAdminClient requests
superAdminClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("saas_superadmin_token") || localStorage.getItem("sa_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Global response interceptors for error handling / redirecting on 401
const handleUnauthorized = (error: any) => {
  if (error.response?.status === 401) {
    if (typeof window !== "undefined") {
      console.warn("Session expired or unauthorized. Please sign in again.");
      // You could trigger logout or redirect here if needed
    }
  }
  return Promise.reject(error);
};

adminClient.interceptors.response.use((response) => response, handleUnauthorized);
superAdminClient.interceptors.response.use((response) => response, handleUnauthorized);
