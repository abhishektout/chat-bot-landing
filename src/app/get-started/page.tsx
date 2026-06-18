"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Check, ArrowRight, User, Mail, Building2, Lock, ShieldCheck } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";
import { useToast } from "@/components/Toast";

const PERKS = [
  "14-day free trial — no credit card required",
  "Setup in under 5 minutes",
  "Import your docs, PDFs, and URLs instantly",
  "Cancel anytime — no lock-in",
];

interface FormFields {
  name: string;
  email: string;
  company: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
}

export default function GetStartedPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [form, setForm] = useState<FormFields>({ name: "", email: "", password: "", company: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  // OTP Verification State
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  function validateField(field: keyof FormFields, value: string) {
    let errMessage = "";
    if (field === "name") {
      if (!value.trim()) errMessage = "Name is required.";
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) errMessage = "Work email is required.";
      else if (!emailRegex.test(value)) errMessage = "Please enter a valid work email.";
    }
    if (field === "password") {
      if (!value) errMessage = "Password is required.";
      else if (value.length < 8) errMessage = "Password must be at least 8 characters.";
      else if (!/[A-Z]/.test(value)) errMessage = "Password must contain at least one uppercase letter.";
      else if (!/[a-z]/.test(value)) errMessage = "Password must contain at least one lowercase letter.";
      else if (!/\d/.test(value)) errMessage = "Password must contain at least one number.";
      else if (!/[^A-Za-z0-9]/.test(value)) errMessage = "Password must contain at least one special character.";
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMessage ? errMessage : undefined,
    }));
  }

  function handleInputChange(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  }

  const validateAll = React.useCallback(() => {
    const tempErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) tempErrors.name = "Name is required.";
    if (!form.email.trim()) {
      tempErrors.email = "Work email is required.";
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Please enter a valid work email.";
    }
    if (!form.password) {
      tempErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      tempErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(form.password)) {
      tempErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      tempErrors.password = "Password must contain at least one special character.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [form]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateAll()) {
      showToast("error", "Registration Failed", "Please fix the marked fields before submitting.");
      return;
    }

    try {
      showToast(
        "success",
        "Verification Code Sent!",
        `We sent a 6-digit verification code to ${form.email}.`
      );
      setStep("otp");
      setOtp(new Array(6).fill(""));
      setOtpError("");
      setResendTimer(45);
    } catch {
      showToast("error", "Network Error", "Could not complete request. Please try again.");
    }
  }

  // OTP Handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setOtpError("");

    if (index < 5 && element.value) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setOtpError("");
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    if (otpCode === "123456") {
      showToast("success", "Email Verified Successfully! 🎉", "Your account has been activated.");
      setStep("success");
    } else {
      setOtpError("Invalid verification code. Use '123456' for testing.");
    }
  };

  const handleResendOtp = () => {
    setResendTimer(45);
    setOtp(new Array(6).fill(""));
    setOtpError("");
    showToast("success", "New verification code sent!", `We sent another code to ${form.email}.`);
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
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Get Started Free</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ alignItems: "flex-start" }}>
        {/* Left: pitch panel */}
        <div style={{ gridColumn: "span 2" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--accent)", background: "rgba(79,124,255,0.1)",
              padding: "6px 12px", borderRadius: "100px", marginBottom: "20px",
            }}
          >
            <Zap style={{ width: "12px", height: "12px" }} />
            Free for 14 Days
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900, letterSpacing: "-0.03em",
              lineHeight: 1.15, marginBottom: "16px",
            }}
          >
            Start Automating{" "}
            <span className="gradient-text">Support Today</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "32px" }}>
            Create your free account and deploy your first AI support agent in under 5 minutes.
          </p>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px", padding: 0 }}>
            {PERKS.map((perk) => (
              <li key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--fg)" }}>
                <div
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                    background: "rgba(79,124,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Check style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                </div>
                {perk}
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="card-gradient-border" style={{ padding: "20px" }}>
            <p style={{ fontSize: "13.5px", color: "var(--fg)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "12px" }}>
              "Assistly reduced our support ticket volume by 45% in the first week. Setup was genuinely 5 minutes."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "var(--muted-bg)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: 700, color: "var(--accent)",
                }}
              >
                S
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>Sarah Jenkins</p>
                <p style={{ fontSize: "12px", color: "var(--muted-fg)" }}>Operations Director · Global Logistics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Renders Form or OTP or Success based on state */}
        {step === "form" && (
          <form
            onSubmit={handleSubmit}
            className="card-gradient-border"
            style={{
              padding: "28px",
              gridColumn: "span 3",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "580px",
              boxSizing: "border-box",
            }}
          >
            {/* Top portion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Create Your Free Account</h2>

              {/* Fields */}
              {[
                { id: "name", label: "Full Name *", placeholder: "Abhishek", field: "name" as const, icon: User, type: "text" },
                { id: "email", label: "Work Email *", placeholder: "you@company.com", field: "email" as const, icon: Mail, type: "email" },
                { id: "company", label: "Company Name", placeholder: "Acme Corp", field: "company" as const, icon: Building2, type: "text" },
                { id: "password", label: "Password *", placeholder: "8+ characters", field: "password" as const, icon: Lock, type: "password" },
              ].map(({ id, label, placeholder, field, icon: Icon, type }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor={id} style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Icon
                      style={{
                        position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                        width: "15px", height: "15px", color: "var(--muted-fg)", pointerEvents: "none",
                      }}
                    />
                    <input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      style={{
                        width: "100%", padding: "10px 14px 10px 38px", borderRadius: "8px",
                        background: "var(--muted-bg)", border: errors[field] ? "1px solid #ef4444" : "1px solid var(--card-border)",
                        color: "var(--fg)", fontSize: "14px", outline: "none", transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  {errors[field] && (
                    <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                      {errors[field]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom portion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(79,124,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ padding: "14px", fontSize: "15px", justifyContent: "center", cursor: "pointer", width: "100%" }}
              >
                Start Free Trial
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </motion.button>

              <p style={{ fontSize: "12px", color: "var(--muted-fg)", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
                By creating an account you agree to our{" "}
                <Link href="/legal/terms" style={{ color: "var(--accent)", textDecoration: "none" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/legal/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>.
              </p>

              <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)" }}>
                Already have an account?{" "}
                <Link href="/signin" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
              </div>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            className="card-gradient-border"
            style={{
              padding: "28px",
              gridColumn: "span 3",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "580px",
              boxSizing: "border-box",
            }}
          >
            {/* Top portion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(79,124,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <ShieldCheck style={{ width: "26px", height: "26px", color: "var(--accent)" }} />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Verify Your Email</h2>
                <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6 }}>
                  We've sent a 6-digit verification code to<br />
                  <strong style={{ color: "var(--fg)" }}>{form.email}</strong>
                </p>
              </div>
            </div>

            {/* Middle portion (centered) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onPaste={handleOtpPaste}
                    style={{
                      width: "48px",
                      height: "56px",
                      borderRadius: "10px",
                      background: "var(--muted-bg)",
                      border: otpError ? "2px solid #ef4444" : "1px solid var(--card-border)",
                      color: "var(--fg)",
                      fontSize: "20px",
                      fontWeight: 700,
                      textAlign: "center",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!otpError) {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(79,124,255,0.2)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!otpError) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#ef4444", textAlign: "center" }}>
                  {otpError}
                </span>
              )}

              <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginTop: "4px" }}>
                Tip: Enter <strong style={{ color: "var(--accent)" }}>123456</strong> to verify.
              </p>
            </div>

            {/* Bottom portion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(79,124,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ padding: "14px", fontSize: "15px", justifyContent: "center", cursor: "pointer", width: "100%" }}
              >
                Verify & Create Account
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </motion.button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted-fg)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  Back to Sign Up
                </button>

                {resendTimer > 0 ? (
                  <span style={{ color: "var(--muted-fg)" }}>
                    Resend code in <strong style={{ color: "var(--fg)" }}>{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-gradient-border"
            style={{
              padding: "28px",
              gridColumn: "span 3",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "580px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            {/* Top spacer to align content nicely */}
            <div style={{ height: "40px" }} />

            {/* Center: Success info */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flexGrow: 1, justifyContent: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)",
                  border: "2px solid #22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check style={{ width: "32px", height: "32px", color: "#22c55e" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>
                  Welcome to Assistly!
                </h1>
                <p style={{ fontSize: "15px", color: "var(--muted-fg)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
                  Your email <strong style={{ color: "var(--fg)" }}>{form.email}</strong> has been successfully verified. Your 14-day free trial has started.
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link
                href="/"
                className="btn-primary"
                style={{ textDecoration: "none", padding: "14px 32px", fontSize: "15px", display: "flex", justifyContent: "center", width: "100%", boxSizing: "border-box" }}
              >
                Go to Dashboard
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </SubpageLayout>
  );
}
