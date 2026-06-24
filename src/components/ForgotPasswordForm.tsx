"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, UserCheck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { authService } from "@/services/auth.service";

type Role = "super-admin" | "admin" | "team-member";

const ROLE_INFO = {
  "super-admin": {
    title: "Super Admin",
    description: "Verify your system master credentials to reset global tenant configuration console access.",
    icon: Crown,
    badge: "Master Access",
  },
  admin: {
    title: "Organization Admin",
    description: "Verify your administrative email to reset access to company integrations, models, and team logs.",
    icon: Shield,
    badge: "Admin Access",
  },
  "team-member": {
    title: "Team Member",
    description: "Verify your support email to reset access to customer workspaces and live agent desks.",
    icon: UserCheck,
    badge: "Agent Access",
  },
};

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ForgotPasswordForm() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step state: 1 (Request OTP), 2 (Verify OTP), 3 (New Password), 4 (Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasPrefilledRole, setHasPrefilledRole] = useState(false);

  // Auto-fill from query parameters if coming from signin page
  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qRole = searchParams.get("role");

    if (qEmail) {
      setEmail(qEmail);
    }
    if (qRole === "super-admin" || qRole === "admin" || qRole === "team-member") {
      setRole(qRole);
      setHasPrefilledRole(true);
    }
  }, [searchParams]);

  const validateStep1 = () => {
    const tempErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep3 = () => {
    const tempErrors: FormErrors = {};

    if (!password) {
      tempErrors.password = "Password is required.";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      showToast("error", "Validation Failed", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.sendForgotPasswordOtp(email.trim(), role);
      if (res.status === "success") {
        showToast("success", "OTP Sent", res.message || "Reset verification code sent to your email.");
        
        // Output OTP code to console in development so user can test without real email server
        console.log(`%c[OTP Recovery Code]: ${res.otp}`, "background: #111827; color: #10b981; font-size: 16px; font-weight: bold; padding: 8px; border-radius: 4px;");
        
        setStep(2);
      } else {
        showToast("error", "Failed", res.message || "Could not dispatch OTP.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Could not connect to the authentication server.";
      showToast("error", "Server Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit verification code." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyForgotPasswordOtp(email.trim(), role, otp.trim());
      if (res.status === "success") {
        showToast("success", "Verified", "Verification code matches. You may now choose a new password.");
        setStep(3);
      } else {
        showToast("error", "Verification Failed", res.message || "Invalid OTP code.");
        setErrors({ otp: res.message || "Invalid OTP code." });
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Server verification connection timed out.";
      showToast("error", "Server Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Create New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      showToast("error", "Validation Failed", "Please fix the password requirements.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email.trim(), role, otp.trim(), password);
      if (res.status === "success") {
        showToast("success", "Password Reset", "Your password has been successfully updated.");
        setStep(4);
      } else {
        showToast("error", "Reset Failed", res.message || "Failed to update password.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Server connection failed.";
      showToast("error", "Server Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setErrors({});
  };

  const handleBackToOtp = () => {
    setStep(2);
    setPassword("");
    setConfirmPassword("");
    setErrors({});
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
        <Link href="/signin" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>
          Sign In
        </Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Forgot Password</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ alignItems: "stretch" }}>
        {/* Left Info Panel */}
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
            Password Recovery Wizard
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
            Recover Your <span className="gradient-text">Assistly Account</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "16px" }}>
            Follow our high-security token verification workflow to securely reset your credentials and restore agent or administrator operations.
          </p>

          {/* Dynamic role info panel */}
          {step === 1 && (
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
          )}

          {step > 1 && (
            <div
              className="card-gradient-border"
              style={{ padding: "24px", marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>Verification Details</h3>
              <div style={{ fontSize: "13.5px", color: "var(--muted-fg)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <strong>Target Email:</strong> {email}
                </div>
                <div>
                  <strong>Role Profile:</strong> {role === "admin" ? "Organization Admin" : "Team Member"}
                </div>
                <div>
                  <strong>Security Progress:</strong> {step === 2 ? "OTP Code Verification" : step === 3 ? "Resetting Password" : "Completed"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Form Card */}
        <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRequestOTP}
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
                <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Account Verification</h2>
                <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                  {hasPrefilledRole
                    ? "Enter your registered work email below to receive a secure recovery code."
                    : "Enter your registered work email and select your workspace role below to receive a secure recovery code."}
                </p>

                {/* Role Tabs */}
                {!hasPrefilledRole && (
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
                      {(["admin", "team-member", "super-admin"] as Role[]).map((r) => {
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
                                layoutId="activeResetRoleTab"
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
                            {r === "admin" ? "Admin" : r === "team-member" ? "Team Member" : "Super Admin"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                    <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Submit button */}
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
                  {isLoading ? "Sending Recovery Code..." : "Send Verification Code"}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>

                <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px" }}>
                  Remembered your password?{" "}
                  <Link href="/signin" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                    Sign In instead
                  </Link>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2-otp"
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
                    onClick={handleBackToEmail}
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
                  A 6-digit OTP verification code has been dispatched to <strong>{email}</strong>. Enter it below to unlock the reset password tool.
                </p>

                {/* OTP Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
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
                    <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px", textAlign: "center" }}>
                      {errors.otp}
                    </span>
                  )}
                </div>

                {/* Submit button */}
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
                  {isLoading ? "Verifying..." : "Verify & Reset"}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>

                {/* Resend Link */}
                <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px" }}>
                  Haven't received a code?{" "}
                  <button
                    type="button"
                    onClick={handleRequestOTP}
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

            {step === 3 && (
              <motion.form
                key="step3-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
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
                    onClick={handleBackToOtp}
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
                  <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>Create New Password</h2>
                </div>

                <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                  Your identity has been verified. Establish a new strong password for your workspace account.
                </p>

                {/* New Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                    New Password *
                  </label>
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
                    <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Confirm New Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--fg)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Confirm Password *
                  </label>
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
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 38px",
                        borderRadius: "8px",
                        background: "var(--muted-bg)",
                        border: errors.confirmPassword ? "1px solid #ef4444" : "1px solid var(--card-border)",
                        color: "var(--fg)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? (
                        <EyeOff style={{ width: "16px", height: "16px" }} />
                      ) : (
                        <Eye style={{ width: "16px", height: "16px" }} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                {/* Requirements info */}
                <div style={{ fontSize: "12px", color: "var(--muted-fg)", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "6px", border: "1px solid var(--card-border)" }}>
                  <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li>Minimum 8 characters in length</li>
                    <li>Ensure it matches the confirmation field exactly</li>
                  </ul>
                </div>

                {/* Submit button */}
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
                  {isLoading ? "Saving Credentials..." : "Update Password"}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div
                key="step4-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card-gradient-border"
                style={{
                  padding: "40px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "24px",
                  boxSizing: "border-box",
                  height: "100%",
                }}
              >
                <div style={{ color: "#10b981", display: "flex", justifyContent: "center" }}>
                  <CheckCircle style={{ width: "64px", height: "64px" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>Password Reset Successful</h2>
                  <p style={{ fontSize: "14.5px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
                    Your new credentials have been safely applied to your {role === "admin" ? "Organization Admin" : "Team Member"} profile.
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/signin?email=${encodeURIComponent(email)}&role=${role}`)}
                  className="btn-primary"
                  style={{
                    padding: "14px 28px",
                    fontSize: "14px",
                    justifyContent: "center",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "240px",
                  }}
                >
                  Return to Sign In
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SubpageLayout>
  );
}
