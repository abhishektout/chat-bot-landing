import axios from "axios";
import { adminClient, superAdminClient } from "./apiClient";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

export interface ClientRegisterPayload {
  name: string;
  email: string;
  company: string;
  phone?: string;
  password?: string;
}

export interface BookDemoPayload {
  name: string;
  email: string;
  company: string;
  industry: string;
  date: string;
  slot: string;
  message?: string;
}

export const authService = {
  // ── Client Admin Authentication ──
  
  /**
   * Dispatch OTP verification email to the Client Admin
   * API Endpoint: POST /client/auth/send-otp
   */
  sendClientOtp: async (email: string) => {
    const response = await axios.post(`${BASE_API}/client/auth/send-otp`, { email });
    return response.data;
  },

  /**
   * Verify the 6-digit OTP received by the Client Admin
   * API Endpoint: POST /client/auth/verify-otp
   */
  verifyClientOtp: async (email: string, otpCode: string) => {
    const response = await axios.post(`${BASE_API}/client/auth/verify-otp`, {
      email,
      otp_code: otpCode,
    });
    return response.data;
  },

  /**
   * Client Admin Login with Email & Password
   * API Endpoint: POST /client/login
   */
  loginClientWithPassword: async (email: string, password: string) => {
    // Attempt standard JSON payload
    try {
      const response = await axios.post(`${BASE_API}/client/login`, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      // Fallback to x-www-form-urlencoded if backend uses oauth2 form format
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const response = await axios.post(`${BASE_API}/client/login`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    }
  },

  // ── Support Agent Authentication ──

  /**
   * Support Agent Login with Email & Password
   * API Endpoint: POST /agent/login
   */
  loginAgent: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await axios.post(`${BASE_API}/agent/login`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // ── Super Admin Authentication ──

  /**
   * Super Admin Login Request (Validates password before OTP step)
   * API Endpoint: POST /superadmin/login
   */
  superadminLogin: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_API}/superadmin/login`, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Dispatch OTP verification email to the Super Admin
   * API Endpoint: POST /superadmin/auth/send-otp
   */
  sendSuperAdminOtp: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_API}/superadmin/auth/send-otp`, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Verify the 6-digit OTP received by the Super Admin
   * API Endpoint: POST /superadmin/auth/verify-otp
   */
  verifySuperAdminOtp: async (email: string, otpCode: string) => {
    const response = await axios.post(`${BASE_API}/superadmin/auth/verify-otp`, {
      email,
      otp_code: otpCode,
    });
    return response.data;
  },

  // ── Client Sign Up (Public Onboarding) ──

  /**
   * Register a new Tenant account (Public Signup)
   * 
   * NOTE: Public registration/signup endpoint is not defined in openapi.json.
   * If a real endpoint is available in the future, e.g. POST /client/register,
   * update BASE_API and replace the dummy logic below.
   * 
   * Proposed API Endpoint: POST /client/register
   */
  registerClient: async (payload: ClientRegisterPayload) => {
    console.log("authService.registerClient called with payload:", payload);

    // DUMMY IMPLEMENTATION (simulate network latency)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulated response. Once the real API is ready, replace this block with:
    // const response = await axios.post(`${BASE_API}/client/register`, payload);
    // return response.data;

    return {
      status: "success",
      message: "Onboarding successful. Please verify the OTP code sent to your email.",
      data: {
        email: payload.email,
        company_name: payload.company,
        name: payload.name,
      },
    };
  },

  // ── Book a Demo (Public Request) ──

  /**
   * Book a product demo
   * 
   * NOTE: Demo booking endpoint is not defined in openapi.json.
   * If a real endpoint is available in the future, e.g. POST /demo/book,
   * update BASE_API and replace the dummy logic below.
   * 
   * Proposed API Endpoint: POST /demo/book
   */
  bookDemo: async (payload: BookDemoPayload) => {
    console.log("authService.bookDemo called with payload:", payload);

    // DUMMY IMPLEMENTATION (simulate network latency)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulated response. Once the real API is ready, replace this block with:
    // const response = await axios.post(`${BASE_API}/demo/book`, payload);
    // return response.data;

    return {
      status: "success",
      message: "Demo booked successfully!",
      data: payload,
    };
  },
};
