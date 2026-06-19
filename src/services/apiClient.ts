const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  role?: "client" | "superadmin" | "agent";
  isFormData?: boolean;
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const { requireAuth = true, role = "client", isFormData = false, headers: customHeaders, ...fetchOptions } = options;

  let headers = new Headers(customHeaders as HeadersInit);

  // If it's not FormData, default to JSON
  if (!isFormData && !headers.has("Content-Type")) {
    // Check if body is URLSearchParams, in which case we set the appropriate content type
    if (fetchOptions.body instanceof URLSearchParams) {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
    } else {
      headers.set("Content-Type", "application/json");
    }
  }

  if (requireAuth) {
    let token = null;
    if (role === "superadmin") {
      token = localStorage.getItem("sa_token") || localStorage.getItem("saas_superadmin_token");
    } else {
      token = localStorage.getItem("saas_client_token");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.warn(`[API Client] No auth token found for role: ${role}`);
    }
  }

  const url = `${BASE_API}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    return response;
  } catch (error) {
    // Log the error globally but rethrow so individual services can handle it
    console.warn(`[API Client] Network error when fetching ${endpoint}:`, error);
    throw error;
  }
};
