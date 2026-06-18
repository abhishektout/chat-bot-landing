"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, UserCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";
import { useToast } from "@/components/Toast";

type Role = "super-admin" | "admin" | "team-member";

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
}

export default function SignInPage() {
  const { showToast } = useToast();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const tempErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      tempErrors.password = "Password is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Sign In Failed", "Please resolve all marked errors.");
      return;
    }

    showToast(
      "success",
      `Welcome back! 🎉`,
      `Successfully signed in as ${ROLE_INFO[role].title}. Redirecting to console...`
    );

    // Reset inputs
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <SubpageLayout accentColor="#4f7cff">
      {/* Breadcrumb */}
      <nav
        style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Sign In</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ alignItems: "flex-start" }}>
        {/* Left: role descriptions */}
        <div style={{ gridColumn: "span 2" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--accent)", background: "rgba(79,124,255,0.1)",
              padding: "6px 12px", borderRadius: "100px", marginBottom: "20px",
            }}
          >
            2 Advanced Modules
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900, letterSpacing: "-0.03em",
              lineHeight: 1.15, marginBottom: "16px",
            }}
          >
            Log In to Your{" "}
            <span className="gradient-text">Assistly Workspace</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "16px" }}>
            Select your access role to view your specific modules, configurations, and dashboards.
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
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "rgba(79,124,255,0.12)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  {React.createElement(ROLE_INFO[role].icon, { style: { width: "20px", height: "20px" } })}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                      color: "var(--accent)", background: "rgba(79,124,255,0.1)",
                      padding: "3px 8px", borderRadius: "100px",
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
        <form
          onSubmit={handleSubmit}
          className="card-gradient-border"
          style={{
            padding: "28px",
            gridColumn: "span 3",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Welcome Back</h2>

          {/* Role Select Tabs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                    onClick={() => setRole(r)}
                    style={{
                      position: "relative",
                      flex: 1,
                      padding: "10px 4px",
                      fontSize: "12.5px",
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
                    {r === "super-admin" ? "Super Admin" : r === "admin" ? "Admin" : "Team Member"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="email" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Work Email *
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  width: "15px", height: "15px", color: "var(--muted-fg)", pointerEvents: "none",
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
                  width: "100%", padding: "10px 14px 10px 38px", borderRadius: "8px",
                  background: "var(--muted-bg)", border: errors.email ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)", fontSize: "14px", outline: "none", transition: "border-color 0.2s",
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

          {/* Password field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="password" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password *
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("success", "Password Reset Link Sent", "Please check your inbox for reset instructions.");
                }}
                style={{ fontSize: "12.5px", color: "var(--accent)", textDecoration: "none" }}
              >
                Forgot Password?
              </a>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  width: "15px", height: "15px", color: "var(--muted-fg)", pointerEvents: "none",
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
                  width: "100%", padding: "10px 40px 10px 38px", borderRadius: "8px",
                  background: "var(--muted-bg)", border: errors.password ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)", fontSize: "14px", outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(79,124,255,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: "14px", fontSize: "15px", justifyContent: "center", cursor: "pointer", width: "100%", marginTop: "10px" }}
          >
            Sign In as {role === "super-admin" ? "Super Admin" : role === "admin" ? "Admin" : "Team Member"}
            <ArrowRight style={{ width: "16px", height: "16px" }} />
          </motion.button>

          {/* Bottom links */}
          <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)", marginTop: "12px" }}>
            Don't have an account?{" "}
            <Link href="/get-started" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Get Started Free
            </Link>
          </div>
        </form>
      </div>
    </SubpageLayout>
  );
}
