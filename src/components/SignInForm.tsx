"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, UserCheck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { authService } from "@/services/auth.service";

type Role = "super-admin" | "admin" | "team-member";
type AdminMethod = "otp" | "password";


const ROLE_INFO = {
  "super-admin": {
    title: "Super Admin",
    description: "Manage global tenants, system settings, organizations, billing, and platform-wide configurations.",
    icon: Crown,
    badge: "System Master",
  },
  admin: {
    title: "Organization Admin",
    description: "Configure company-specific AI models, manage integrations, customize widget branding, and oversee team members.",
    icon: Shield,
    badge: "Company Console",
  },
  "team-member": {
    title: "Team Member",
    description: "Access your support workspace, respond to live customer chats, and check resolved queries.",
    icon: UserCheck,
    badge: "Agent Inbox",
  },
};

interface FormErrors {
  email?: string;
  password?: string;
  otp?: string;
}

interface SignInFormProps {
  forcedRole?: "super-admin";
}

export default function SignInForm({ forcedRole }: SignInFormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [role, setRole] = useState<Role>(forcedRole || "admin");
  const [adminLoginMethod, setAdminLoginMethod] = useState<AdminMethod>("otp");
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto redirect if already signed in
  useEffect(() => {
    const saToken = localStorage.getItem("saas_superadmin_token") || localStorage.getItem("sa_token");
    const clientToken = localStorage.getItem("saas_client_token");

    if (forcedRole === "super-admin" && saToken) {
      router.push("/superadmin/dashboard");
    } else if (!forcedRole && clientToken) {
      router.push("/admin/dashboard");
    }
  }, [router, forcedRole]);

  const validateStep1 = () => {
    const tempErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    // Password validation:
    // - Team member: always password
    // - Super admin: always password
    // - Admin: only if using password method
    const needsPassword = role === "super-admin" || role === "team-member" || (role === "admin" && adminLoginMethod === "password");

    if (needsPassword && !password) {
      tempErrors.password = "Password is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSendOTPOrLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      showToast("error", "Validation Failed", "Please resolve all marked errors.");
      return;
    }

    setIsLoading(true);

    try {
      if (role === "super-admin") {
        // Step 1: Login Super Admin
        const loginData = await authService.superadminLogin(email.trim(), password);

        if (loginData.status !== "success") {
          showToast("error", "Access Denied", loginData.message || "Invalid Super Admin credentials.");
          setIsLoading(false);
          return;
        }

        // Step 2: Request OTP
        const otpData = await authService.sendSuperAdminOtp(email.trim(), password);

        if (otpData.status === "success") {
          showToast("success", "OTP Sent", "A secure verification code has been sent to your email.");
          setStep(2);
        } else {
          showToast("error", "OTP Failed", otpData.message || "Failed to generate security code.");
        }
      } else if (role === "admin") {
        if (adminLoginMethod === "otp") {
          // Request OTP for Client Admin
          const data = await authService.sendClientOtp(email.trim());

          if (data.status === "success") {
            showToast("success", "OTP Sent", "Please check your email for the verification code.");
            setStep(2);
          } else {
            showToast("error", "Error", data.message || "Failed to dispatch OTP code.");
          }
        } else {
          // Password Login for Admin
          const data = await authService.loginClientWithPassword(email.trim(), password);

          if (data && (data.status === "success" || data.access_token)) {
            localStorage.setItem("saas_client_token", data.access_token);
            localStorage.setItem("saas_user_role", "client_admin");
            showToast("success", "Welcome Back", "Successfully logged into Admin dashboard.");
            router.push("/admin/dashboard");
          } else {
            showToast("error", "Authentication Failed", (data && data.message) || "Incorrect admin password.");
          }
        }
      } else if (role === "team-member") {
        // Direct Password login for Agents
        const data = await authService.loginAgent(email.trim(), password);

        if (data.status === "success") {
          localStorage.setItem("saas_client_token", data.access_token);
          localStorage.setItem("saas_user_role", data.role || "agent");
          localStorage.setItem("saas_agent_id", data.agent_id);
          localStorage.setItem("saas_agent_name", data.name);
          localStorage.setItem("saas_agent_email", email.trim());

          showToast("success", "Welcome Back", `Successfully logged in as ${data.name}.`);
          router.push("/admin/dashboard");
        } else {
          showToast("error", "Authentication Failed", data.message || "Incorrect email or password.");
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Could not connect to the remote authentication server.";
      showToast("error", "Connection Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      if (role === "super-admin") {
        const otpData = await authService.sendSuperAdminOtp(email.trim(), password);
        if (otpData.status === "success") {
          showToast("success", "OTP Sent", "A secure verification code has been sent to your email.");
        } else {
          showToast("error", "OTP Failed", otpData.message || "Failed to generate security code.");
        }
      } else if (role === "admin") {
        const data = await authService.sendClientOtp(email.trim());
        if (data.status === "success") {
          showToast("success", "OTP Sent", "Please check your email for the verification code.");
        } else {
          showToast("error", "Error", data.message || "Failed to dispatch OTP code.");
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Could not connect to the remote authentication server.";
      showToast("error", "Connection Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit verification code." });
      return;
    }

    setIsLoading(true);

    try {
      if (role === "super-admin") {
        const data = await authService.verifySuperAdminOtp(email.trim(), otp.trim());

        if (data.status === "success") {
          localStorage.setItem("sa_token", data.access_token);
          localStorage.setItem("saas_superadmin_token", data.access_token);
          if (data.name) localStorage.setItem("sa_name", data.name);

          showToast("success", "Authorized", "Welcome to Assistly Master Console.");
          router.push("/superadmin/dashboard");
        } else {
          showToast("error", "Verification Failed", data.message || "Incorrect verification code.");
        }
      } else if (role === "admin") {
        const data = await authService.verifyClientOtp(email.trim(), otp.trim());

        if (data.status === "success") {
          localStorage.setItem("saas_client_token", data.access_token);
          localStorage.setItem("saas_user_role", "client_admin");

          showToast("success", "Authorized", "Welcome to your Organization Workspace Console.");
          router.push("/admin/dashboard");
        } else {
          showToast("error", "Verification Failed", data.message || "Invalid OTP code.");
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Server connection timed out.";
      showToast("error", "Connection Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep(1);
    setOtp("");
    setErrors({});
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();

    const emailParam = email.trim() ? `?email=${encodeURIComponent(email.trim())}&role=${role}` : `?role=${role}`;
    router.push(`/forgot-password${emailParam}`);
  };

  return (
    <SubpageLayout accentColor="#4f7cff">
      {/* Breadcrumb */}
      <nav
        style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Sign In</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ alignItems: "stretch" }}>
        {/* Left: role descriptions */}
        <div style={{ gridColumn: "span 2" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--accent)",
              background: "rgba(79,124,255,0.1)",
              padding: "6px 12px",
              borderRadius: "100px",
              marginBottom: "20px",
            }}
          >
            {forcedRole ? "1 System Console" : "2 Advanced Modules"}
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Log In to Your <span className="gradient-text">Assistly Workspace</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "16px" }}>
            {forcedRole
              ? "Access the system configuration master panel to verify active clients and customize fallback models."
              : "Select your access role to view your specific modules, configurations, and dashboards."}
          </p>

          {/* Dynamic role info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="card-gradient-border"
              style={{ padding: "24px", marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(79,124,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  {React.createElement(ROLE_INFO[role].icon, { style: { width: "20px", height: "20px" } })}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--accent)",
                      background: "rgba(79,124,255,0.1)",
                      padding: "3px 8px",
                      borderRadius: "100px",
                    }}
                  >
                    {ROLE_INFO[role].badge}
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", marginTop: "4px" }}>
                    {ROLE_INFO[role].title} Control
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                {ROLE_INFO[role].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: sign-in card */}
        <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOTPOrLogin}
                className="card-gradient-border"
                style={{
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  boxSizing: "border-box",
                  height: "100%",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Welcome Back</h2>

                {/* Role Select Tabs - Hidden if forcedRole is present */}
                {!forcedRole && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--fg)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Select Your Role
                    </label>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        background: "var(--muted-bg)",
                        borderRadius: "10px",
                        padding: "4px",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      {(["admin", "team-member"] as Role[]).map((r) => {
                        const isActive = role === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setRole(r);
                              setErrors({});
                            }}
                            style={{
                              position: "relative",
                              flex: 1,
                              padding: "10px 4px",
                              fontSize: "12px",
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? "var(--fg)" : "var(--muted-fg)",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              outline: "none",
                              zIndex: 1,
                              transition: "color 0.2s",
                            }}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeRoleTab"
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "var(--card-bg)",
                                  borderRadius: "7px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                  border: "1px solid var(--card-border)",
                                  zIndex: -1,
                                }}
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            {r === "admin" ? "Admin" : "Team Member"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label
                      htmlFor="email"
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--fg)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Work Email *
                    </label>
                    {role === "admin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminLoginMethod(adminLoginMethod === "otp" ? "password" : "otp");
                          setErrors({});
                        }}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--accent)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textDecoration: "underline",
                        }}
                      >
                        {adminLoginMethod === "otp" ? "Use Password Login" : "Use OTP Login"}
                      </button>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <Mail
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "15px",
                        height: "15px",
                        color: "var(--muted-fg)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 38px",
                        borderRadius: "8px",
                        background: "var(--muted-bg)",
                        border: errors.email ? "1px solid #ef4444" : "1px solid var(--card-border)",
                        color: "var(--fg)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password field (Only if required) */}
                {(role === "super-admin" || role === "team-member" || (role === "admin" && adminLoginMethod === "password")) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label
                        htmlFor="password"
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--fg)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--accent)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textDecoration: "underline",
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <Lock
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "15px",
                          height: "15px",
                          color: "var(--muted-fg)",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 40px 10px 38px",
                          borderRadius: "8px",
                          background: "var(--muted-bg)",
                          border: errors.password ? "1px solid #ef4444" : "1px solid var(--card-border)",
                          color: "var(--fg)",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--muted-fg)",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff style={{ width: "16px", height: "16px" }} />
                        ) : (
                          <Eye style={{ width: "16px", height: "16px" }} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                        {errors.password}
                      </span>
                    )}
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(79,124,255,0.35)" }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary"
                  style={{
                    padding: "14px",
                    fontSize: "14px",
                    justifyContent: "center",
                    cursor: "pointer",
                    width: "100%",
                    marginTop: "12px",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading
                    ? "Authenticating..."
                    : role === "admin" && adminLoginMethod === "otp"
                      ? "Send Verification Code"
                      : `Sign In as ${ROLE_INFO[role].title}`}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>

                {/* Bottom links */}
                {!forcedRole && (
                  <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px" }}>
                    Don't have an account?{" "}
                    <Link href="/get-started" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                      Get Started Free
                    </Link>
                  </div>
                )}

                {/* Dev Bypass Section */}
                {true && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px dashed var(--card-border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      🛠️ Developer Bypass Options
                    </span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem("saas_client_token", "test_admin_token");
                          localStorage.setItem("saas_user_role", "client_admin");
                          showToast("success", "Bypass Successful", "Logged in as Admin (Testing)");
                          router.push("/admin/dashboard");
                        }}
                        style={{
                          fontSize: "11px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "rgba(79,124,255,0.1)",
                          color: "var(--accent)",
                          border: "1px solid rgba(79,124,255,0.2)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Bypass Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem("saas_client_token", "test_agent_token");
                          localStorage.setItem("saas_user_role", "agent");
                          localStorage.setItem("saas_agent_id", "test_agent_id");
                          localStorage.setItem("saas_agent_name", "Test Agent");
                          localStorage.setItem("saas_agent_email", "support.agent@company.com");
                          showToast("success", "Bypass Successful", "Logged in as Team Member (Testing)");
                          router.push("/admin/dashboard");
                        }}
                        style={{
                          fontSize: "11px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "rgba(16,185,129,0.1)",
                          color: "#10b981",
                          border: "1px solid rgba(16,185,129,0.2)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Bypass Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem("sa_token", "test_superadmin_token");
                          localStorage.setItem("saas_superadmin_token", "test_superadmin_token");
                          localStorage.setItem("sa_name", "Test Super Admin");
                          showToast("success", "Bypass Successful", "Logged in as Super Admin (Testing)");
                          router.push("/superadmin/dashboard");
                        }}
                        style={{
                          fontSize: "11px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "rgba(245,158,11,0.1)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245,158,11,0.2)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Bypass Super Admin
                      </button>
                    </div>
                  </div>
                )}
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP}
                className="card-gradient-border"
                style={{
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  boxSizing: "border-box",
                  height: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted-fg)",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ArrowLeft style={{ width: "18px", height: "18px" }} />
                  </button>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>Security Verification</h2>
                </div>

                <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                  A 6-digit OTP verification code has been dispatched to <strong>{email}</strong>. Please enter the code below to access your workspace.
                </p>

                {/* OTP field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "20px" }}>
                  <label
                    htmlFor="otp"
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--fg)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      textAlign: "center",
                    }}
                  >
                    Enter 6-Digit OTP Code
                  </label>
                  <div style={{ position: "relative" }}>
                    <KeyRound
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "18px",
                        height: "18px",
                        color: "var(--muted-fg)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        if (errors.otp) setErrors({ ...errors, otp: "" });
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 14px 14px 44px",
                        borderRadius: "10px",
                        background: "var(--muted-bg)",
                        border: errors.otp ? "1px solid #ef4444" : "1px solid var(--card-border)",
                        color: "var(--fg)",
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "0.3em",
                        textAlign: "center",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                  {errors.otp && (
                    <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px", textAlign: "center" }}>
                      {errors.otp}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(16,185,129,0.25)" }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary"
                  style={{
                    padding: "14px",
                    fontSize: "14px",
                    justifyContent: "center",
                    cursor: "pointer",
                    width: "100%",
                    marginTop: "12px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Verifying..." : "Verify & Authorize"}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>

                {/* Resend link */}
                <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px" }}>
                  Haven't received a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Resend Code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SubpageLayout>
  );
}
