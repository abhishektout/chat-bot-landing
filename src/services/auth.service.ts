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

  // ── Forgot Password & Reset ──

  /**
   * Send OTP for Forgot Password
   * API Endpoint: POST /auth/forgot-password/send-otp
   */
  sendForgotPasswordOtp: async (email: string, role: string) => {
    // ──────── REAL API ENDPOINT (Uncomment to use real backend) ────────
    // const response = await axios.post(`${BASE_API}/auth/forgot-password/send-otp`, { email, role });
    // return response.data;
    // ───────────────────────────────────────────────────────────────────

    console.log(`authService.sendForgotPasswordOtp called for ${email} as ${role}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Generate a 6-digit code and store in localStorage for interactive web flow testing
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_reset_${email}`, testOtp);
    
    console.log(`[DEVELOPER MODE] Forgot Password OTP for ${email}: ${testOtp}`);
    
    return {
      status: "success",
      message: `OTP verification code has been dispatched to ${email}.`,
      otp: testOtp // Exposed only for frontend convenience / developer visibility in testing
    };
  },

  /**
   * Verify OTP for Forgot Password
   * API Endpoint: POST /auth/forgot-password/verify-otp
   */
  verifyForgotPasswordOtp: async (email: string, role: string, otpCode: string) => {
    // ──────── REAL API ENDPOINT (Uncomment to use real backend) ────────
    // const response = await axios.post(`${BASE_API}/auth/forgot-password/verify-otp`, {
    //   email,
    //   role,
    //   otp_code: otpCode,
    // });
    // return response.data;
    // ───────────────────────────────────────────────────────────────────

    console.log(`authService.verifyForgotPasswordOtp called for ${email} with code ${otpCode}`);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const storedOtp = localStorage.getItem(`otp_reset_${email}`);
    
    // Accept either the correct generated OTP or the fallback developer code 123456
    if (otpCode === storedOtp || otpCode === "123456") {
      return {
        status: "success",
        message: "OTP verification code is valid.",
      };
    } else {
      return {
        status: "error",
        message: "Invalid or expired verification code.",
      };
    }
  },

  /**
   * Reset Password to a New Value
   * API Endpoint: POST /auth/forgot-password/reset
   */
  resetPassword: async (email: string, role: string, otpCode: string, newPassword: string) => {
    // ──────── REAL API ENDPOINT (Uncomment to use real backend) ────────
    // const response = await axios.post(`${BASE_API}/auth/forgot-password/reset`, {
    //   email,
    //   role,
    //   otp_code: otpCode,
    //   new_password: newPassword,
    // });
    // return response.data;
    // ───────────────────────────────────────────────────────────────────

    console.log(`authService.resetPassword called for ${email} with role ${role}`);
    
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Clear OTP after successful reset
    localStorage.removeItem(`otp_reset_${email}`);
    
    return {
      status: "success",
      message: "Your password has been successfully updated.",
    };
  },

  /**
   * Send OTP for authenticated Change Password
   * API Endpoint: POST /auth/change-password/send-otp
   */
  sendChangePasswordOtp: async (oldPassword: string, newPassword: string, role: string) => {
    // ──────── REAL API ENDPOINT (Uncomment to use real backend) ────────
    // const client = role === "super-admin" ? superAdminClient : adminClient;
    // const response = await client.post("/auth/change-password/send-otp", {
    //   old_password: oldPassword,
    //   new_password: newPassword,
    // });
    // return response.data;
    // ───────────────────────────────────────────────────────────────────

    console.log(`authService.sendChangePasswordOtp called for role ${role}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Generate a 6-digit code and store in localStorage for interactive web flow testing
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_change_password`, testOtp);
    
    console.log(`[DEVELOPER MODE] Change Password OTP: ${testOtp}`);
    
    return {
      status: "success",
      message: "A verification code has been successfully dispatched to your registered email address.",
      otp: testOtp
    };
  },

  /**
   * Verify OTP and change password
   * API Endpoint: POST /auth/change-password/verify
   */
  verifyChangePasswordOtp: async (oldPassword: string, newPassword: string, otpCode: string, role: string) => {
    // ──────── REAL API ENDPOINT (Uncomment to use real backend) ────────
    // const client = role === "super-admin" ? superAdminClient : adminClient;
    // const response = await client.post("/auth/change-password/verify", {
    //   old_password: oldPassword,
    //   new_password: newPassword,
    //   otp_code: otpCode,
    // });
    // return response.data;
    // ───────────────────────────────────────────────────────────────────

    console.log(`authService.verifyChangePasswordOtp called for role ${role} with code ${otpCode}`);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const storedOtp = localStorage.getItem(`otp_change_password`);
    
    // Accept either the correct generated OTP or the fallback developer code 123456
    if (otpCode === storedOtp || otpCode === "123456") {
      localStorage.removeItem(`otp_change_password`);
      return {
        status: "success",
        message: "Your account password has been successfully updated.",
      };
    } else {
      return {
        status: "error",
        message: "Invalid or expired verification code.",
      };
    }
  },
};
