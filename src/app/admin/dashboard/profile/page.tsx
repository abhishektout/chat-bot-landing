"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Save,
  ShieldCheck,
  Lock,
  Activity,
  Edit2,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAdminDashboard } from "../layout";
import { Card, Input, Button, Badge, Skeleton, Modal } from "@/components/ui";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
  oldPasswordVal: string;
  newPasswordVal: string;
  role: string;
  onResendOtp: () => Promise<void>;
}

/**
 * OTPVerificationModal component
 * Handles the OTP code input step for the password change flow.
 */
function OTPVerificationModal({ isOpen, onClose, onVerifySuccess, oldPasswordVal, newPasswordVal, role, onResendOtp }: OTPVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Clear modal inputs & error states when closed
  useEffect(() => {
    if (!isOpen) {
      setOtp('');
      setError('');
    }
  }, [isOpen]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await authService.verifyChangePasswordOtp(oldPasswordVal, newPasswordVal, otp.trim(), role);
      if (res.status === "success") {
        onVerifySuccess();
      } else {
        setError(res.message || "Invalid verification code.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Verification failed. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await onResendOtp();
      showToast("success", "OTP Sent", "A new verification code has been sent to your email.");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to resend verification code.";
      showToast("error", "Error", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Change" title1="Security Verification" isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
          A 6-digit OTP verification code has been dispatched to your email. Please enter the code below to confirm this password change.
        </p>

        {/* OTP Input Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="profile-otp"
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
              id="profile-otp"
              type="text"
              maxLength={6}
              disabled={isLoading}
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "14px 14px 14px 44px",
                borderRadius: "10px",
                background: "var(--muted-bg)",
                border: error ? "1.5px solid #ef4444" : "1px solid var(--card-border)",
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
              onFocus={e => {
                if (!error) {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = error ? "#ef4444" : "var(--card-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          {error && (
            <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2.6px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <AlertCircle style={{ width: "13px", height: "13px" }} />
              {error}
            </span>
          )}
        </div>

        {/* Resend Link */}
        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted-fg)" }}>
          Haven't received a code?{" "}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: 0,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            Resend Code
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            style={{ padding: "10px 20px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(16,185,129,0.2)"
            }}
          >
            Verify & Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOTP: (oldPass: string, newPass: string) => void;
  role: string;
}

/**
 * PasswordChangeModal component
 * Form validation and modal display for changing a user's password.
 */
function PasswordChangeModal({ isOpen, onClose, onOpenOTP, role }: PasswordChangeModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Clear modal inputs, errors & password visibility states when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  // Helper to validate password strength
  const validateStrength = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword) newErrors.oldPassword = "Old password is required.";
    if (!formData.newPassword) newErrors.newPassword = "New password is required.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";

    if (formData.newPassword) {
      const strength = validateStrength(formData.newPassword);
      if (!strength.length || !strength.uppercase || !strength.number || !strength.special) {
        newErrors.newPassword = "Password does not meet the requirements.";
      }
    }

    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await authService.sendChangePasswordOtp(formData.oldPassword, formData.newPassword, role);
      if (res.status === "success") {
        showToast("success", "OTP Sent", res.message || "A verification code has been sent to your email.");
        if ((res as any).otp) {
          console.log(`%c[OTP Change Password Code]: ${(res as any).otp}`, "background: #111827; color: #3b82f6; font-size: 16px; font-weight: bold; padding: 8px; border-radius: 4px;");
        }
        onOpenOTP(formData.oldPassword, formData.newPassword);
      } else {
        showToast("error", "Error", res.message || "Failed to send verification code.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to initiate password change. Check your current password.";
      showToast("error", "Error", errMsg);
      setErrors({ oldPassword: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthChecks = validateStrength(formData.newPassword);

  return (
    <Modal title="Change" title1="Account Password" isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <form onSubmit={handleVerifyOTP} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Old Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="oldPassword"
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--fg)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Old Password *
          </label>
          <div style={{ position: "relative" }}>
            <Lock
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
              id="oldPassword"
              type={showOld ? "text" : "password"}
              name="oldPassword"
              disabled={isLoading}
              placeholder="••••••••"
              value={formData.oldPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px 44px 14px 44px",
                borderRadius: "10px",
                background: "var(--muted-bg)",
                border: errors.oldPassword ? "1px solid #ef4444" : "1px solid var(--card-border)",
                color: "var(--fg)",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowOld(!showOld)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-fg)",
                display: "flex",
                alignItems: "center",
                padding: "4px"
              }}
            >
              {showOld ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
            </button>
          </div>
          {errors.oldPassword && (
            <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
              {errors.oldPassword}
            </span>
          )}
        </div>

        {/* New Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="newPassword"
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
              id="newPassword"
              type={showNew ? "text" : "password"}
              name="newPassword"
              disabled={isLoading}
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px 44px 14px 44px",
                borderRadius: "10px",
                background: "var(--muted-bg)",
                border: errors.newPassword ? "1px solid #ef4444" : "1px solid var(--card-border)",
                color: "var(--fg)",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-fg)",
                display: "flex",
                alignItems: "center",
                padding: "4px"
              }}
            >
              {showNew ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
            </button>
          </div>
          {errors.newPassword && (
            <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
              {errors.newPassword}
            </span>
          )}
        </div>

        {/* Strength requirements checklist */}
        {formData.newPassword && (
          <div style={{
            padding: "16px",
            background: "var(--muted-bg)",
            borderRadius: "12px",
            border: "1px solid var(--card-border)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "12px",
            color: "var(--muted-fg)"
          }}>
            <p style={{ fontWeight: 800, margin: 0, color: "var(--fg)" }}>Password Requirements:</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: strengthChecks.length ? "#10b981" : "#ef4444",
                display: "inline-block"
              }} />
              <span style={{ color: strengthChecks.length ? "var(--fg)" : "var(--muted-fg)" }}>At least 8 characters</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: strengthChecks.uppercase ? "#10b981" : "#ef4444",
                display: "inline-block"
              }} />
              <span style={{ color: strengthChecks.uppercase ? "var(--fg)" : "var(--muted-fg)" }}>At least 1 uppercase letter</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: strengthChecks.number ? "#10b981" : "#ef4444",
                display: "inline-block"
              }} />
              <span style={{ color: strengthChecks.number ? "var(--fg)" : "var(--muted-fg)" }}>At least 1 digit</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: strengthChecks.special ? "#10b981" : "#ef4444",
                display: "inline-block"
              }} />
              <span style={{ color: strengthChecks.special ? "var(--fg)" : "var(--muted-fg)" }}>At least 1 special character</span>
            </div>
          </div>
        )}

        {/* Confirm Password */}
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
            Confirm New Password *
          </label>
          <div style={{ position: "relative" }}>
            <Lock
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
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              disabled={isLoading}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px 44px 14px 44px",
                borderRadius: "10px",
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
              disabled={isLoading}
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-fg)",
                display: "flex",
                alignItems: "center",
                padding: "4px"
              }}
            >
              {showConfirm ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              background: "transparent",
              border: "1px solid var(--card-border)",
              color: "var(--fg)",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isLoading ? "Sending..." : "Send OTP"}
            <ArrowRight style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * ProfilePage Component
 * Renders user profile details dynamically based on user role (Super Admin, Admin, Support Agent).
 * Uses CSS variables for rich design, dark mode compatibility and a premium enterprise style.
 */
export default function ProfilePage() {
  const { showToast } = useToast();

  // Safe extraction of tenant info from Admin Dashboard context
  let tenantInfo: any = null;
  let refreshTenantInfo = async () => { };
  try {
    const context = useAdminDashboard();
    tenantInfo = context?.tenantInfo;
    refreshTenantInfo = context?.refreshTenantInfo;
  } catch {
    // Superadmin route doesn't have useAdminDashboard
  }

  // Detect Role safely in browser/server environment
  const isSuperAdmin = typeof window !== 'undefined' && window.location.pathname.includes('/superadmin');
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('saas_user_role') || '' : '';
  const isAgent = userRole === 'agent';
  const isAdmin = !isSuperAdmin && !isAgent;

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [oldPasswordVal, setOldPasswordVal] = useState("");
  const [newPasswordVal, setNewPasswordVal] = useState("");

  // Form states
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Local state for profile details (mock database values, merged with active tenant details)
  const [profileData, setProfileData] = useState(() => {
    if (isSuperAdmin) {
      const saName = typeof window !== 'undefined' ? localStorage.getItem('sa_name') || 'Super Admin' : 'Super Admin';
      return {
        fullName: saName,
        email: 'master@admin.com',
        phone: '+1 (555) 019-2834',
        role: 'Super Admin',
        department: 'Operations & Security Control',
        status: 'Active',
        companyName: '',
        website: '',
        industry: '',
        planType: ''
      };
    } else if (isAgent) {
      const agentName = typeof window !== 'undefined' ? localStorage.getItem('saas_agent_name') || 'Support Agent' : 'Support Agent';
      return {
        fullName: agentName,
        email: 'support.agent@company.com',
        phone: '+1 (555) 432-1098',
        role: 'Support User',
        status: 'Active',
        companyName: '',
        website: '',
        industry: '',
        planType: ''
      };
    } else {
      return {
        fullName: 'Workspace Administrator',
        email: 'admin@acmecorp.com',
        phone: '+1 (555) 123-4567',
        role: 'Workspace Admin',
        companyName: 'Acme Corp',
        website: 'https://www.acmecorp.com',
        industry: 'Software Development',
        planType: 'Enterprise',
        status: 'Active'
      };
    }
  });

  // Load initial value safely after mount
  useEffect(() => {
    if (isSuperAdmin) {
      const savedPhone = localStorage.getItem('saas_profile_phone') || '+1 (555) 019-2834';
      setPhoneValue(savedPhone);
      setProfileData(prev => ({ ...prev, phone: savedPhone }));
    } else {
      const savedPhone = localStorage.getItem('saas_profile_phone') || (isAgent ? '+1 (555) 432-1098' : '+1 (555) 123-4567');
      const company = tenantInfo?.company_name || 'Acme Corp';
      const email = isAgent ? (localStorage.getItem('saas_agent_email') || 'support.agent@company.com') : (tenantInfo?.support_email || 'admin@acmecorp.com');
      const website = (tenantInfo as any)?.website || 'https://www.acmecorp.com';
      const industry = (tenantInfo as any)?.industry || 'Software Development';
      const plan = tenantInfo?.subscription_plan || 'Enterprise';

      setProfileData(prev => ({
        ...prev,
        email: email,
        phone: savedPhone,
        companyName: company,
        website: website,
        industry: industry,
        planType: plan,
      }));
      setPhoneValue(savedPhone);
    }
  }, [tenantInfo, isSuperAdmin, isAgent]);

  // Keep state in sync with tenantInfo if it resolves asynchronously
  useEffect(() => {
    if (tenantInfo && !isSuperAdmin) {
      setProfileData(prev => ({
        ...prev,
        email: isAgent ? prev.email : (tenantInfo.support_email || prev.email),
        phone: isAgent ? prev.phone : ((tenantInfo as any).phone || prev.phone),
        companyName: tenantInfo.company_name || prev.companyName,
        website: (tenantInfo as any).website || prev.website,
        industry: (tenantInfo as any).industry || prev.industry,
        planType: tenantInfo.subscription_plan || prev.planType
      }));
      if (!isAgent) {
        setPhoneValue((tenantInfo as any).phone || profileData.phone);
      }
    }
  }, [tenantInfo, isSuperAdmin, isAgent]);

  // Fetch active agent details from team list to get real email and phone number
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (isAgent) {
        try {
          const agents = await adminService.getAgents();
          const agentId = typeof window !== "undefined" ? localStorage.getItem("saas_agent_id") : null;
          const agentName = typeof window !== "undefined" ? localStorage.getItem("saas_agent_name") : null;
          const currentAgent = agents.find((a: any) =>
            (agentId && String(a.id) === String(agentId)) ||
            (agentName && a.name === agentName)
          );
          if (currentAgent) {
            setProfileData(prev => ({
              ...prev,
              email: currentAgent.email || prev.email,
              phone: currentAgent.phone_number || prev.phone,
            }));
            if (currentAgent.phone_number) {
              setPhoneValue(currentAgent.phone_number);
            }
          }
        } catch (e) {
          console.warn("Failed to fetch agent details from API", e);
        }
      }
    };
    fetchAgentDetails();
  }, [isAgent]);

  // Direct tenant info fallback fetch
  useEffect(() => {
    const loadTenantDetailsDirect = async () => {
      if (!isSuperAdmin) {
        try {
          const data = await adminService.getTenantInfo();
          const info = data && data.status === "success" ? data.data : data;
          if (info && info.company_name) {
            setProfileData(prev => ({
              ...prev,
              companyName: info.company_name || prev.companyName,
              website: info.website || prev.website,
              industry: info.industry || prev.industry,
              planType: info.subscription_plan || prev.planType,
            }));
          }
        } catch (e) {
          console.warn("Failed to load tenant info directly in profile page", e);
        }
      }
    };
    loadTenantDetailsDirect();
  }, [isSuperAdmin]);

  // Direct settings fallback fetch for maximum data coverage
  useEffect(() => {
    const loadSettingsFallback = async () => {
      if (!isSuperAdmin) {
        try {
          const settings = await adminService.getSettings();
          if (settings && settings.company_name) {
            setProfileData(prev => ({
              ...prev,
              companyName: settings.company_name || prev.companyName,
              website: settings.website || prev.website,
              industry: settings.industry || prev.industry,
            }));
          }
        } catch (e) {
          console.warn("Failed to load settings fallback in profile page", e);
        }
      }
    };
    loadSettingsFallback();
  }, [isSuperAdmin]);

  // Handle Phone Number update
  const handlePhoneSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneValue.trim()) {
      setPhoneError("Phone number is required.");
      return;
    }

    const hasCountryCode = phoneValue.startsWith('+');
    const digitsOnly = phoneValue.replace(/\D/g, '');

    if (!hasCountryCode) {
      setPhoneError("Phone number must include country code (e.g. +1).");
      return;
    }

    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      setPhoneError("Phone number must contain between 8 and 15 digits.");
      return;
    }

    setPhoneError('');
    setProfileData(prev => ({ ...prev, phone: phoneValue }));
    setIsEditingPhone(false);

    try {
      localStorage.setItem("saas_profile_phone", phoneValue);
      if (tenantInfo && !isSuperAdmin && !isAgent) {
        await adminService.saveSettings({
          company_name: tenantInfo.company_name || "Acme Corp",
          support_email: tenantInfo.support_email || "admin@acmecorp.com",
          bot_name: tenantInfo.bot_name || "Support Bot",
          custom_rules: tenantInfo.custom_rules || "",
          primary_color: tenantInfo.primary_color || "#2563eb",
          widget_position: tenantInfo.widget_position || "right",
          widget_icon_url: tenantInfo.widget_icon_url || "",
          phone: phoneValue,
        });
        await refreshTenantInfo();
      }
      showToast("success", "Phone Updated", "Phone number updated successfully.");
    } catch (err) {
      showToast("success", "Phone Updated (Local)", "Phone number updated successfully locally.");
    }
  };

  const handlePhoneCancel = () => {
    setPhoneValue(profileData.phone);
    setPhoneError('');
    setIsEditingPhone(false);
  };

  const handleVerifyPasswordChangeSuccess = () => {
    setIsOTPModalOpen(false);
    setIsPasswordModalOpen(false);
    showToast("success", "Password Updated", "Password updated successfully.");
  };

  const profileName = profileData.fullName;
  const displayInitial = profileName.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
        <span className="badge" style={{ marginBottom: "4px", width: "fit-content" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
            My <span className="gradient-text">Profile</span>
          </h2>
        </span>

      </div>


      {/* ── Two-Column Main Layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.75fr 1fr",
        gap: "32px",
      }} className="profile-grid">

        {/* Left Column: Personal Information Card */}
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
            <div style={{ padding: "8px", borderRadius: "10px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)" }}>
              <User style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Personal Information</h4>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {isAgent && (
              <Input
                label="Support Person Name"
                name="fullName"
                value={profileData.fullName}
                readOnly
                style={{ opacity: 0.8, cursor: "not-allowed" }}
              />
            )}

            <Input
              label="Email Address"
              name="emailAddress"
              type="email"
              value={profileData.email}
              readOnly
              style={{ opacity: 0.8, cursor: "not-allowed" }}
            />

            <div>
              {!isEditingPhone ? (
                <div style={{ position: "relative" }}>
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileData.phone}
                    readOnly
                    style={{ opacity: 0.8 }}
                  />
                  <span
                    onClick={() => setIsEditingPhone(true)}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "40px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      textTransform: "uppercase"
                    }}
                  >
                    <Edit2 style={{ width: "11px", height: "11px" }} /> Edit
                  </span>
                </div>
              ) : (
                <form onSubmit={handlePhoneSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    error={phoneError || undefined}
                    placeholder="e.g. +1 555 123 4567"
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePhoneCancel}
                      style={{ padding: "8px 16px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      style={{ padding: "8px 16px" }}
                    >
                      Save
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {isSuperAdmin && (
              <Input
                label="Department"
                value={profileData.department}
                readOnly
                style={{ opacity: 0.8, cursor: "not-allowed" }}
              />
            )}

            {(isAdmin || isAgent) && (
              <>
                <div style={{ margin: "8px 0", borderTop: "1px solid var(--card-border)" }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <Input
                    label="Company Name"
                    value={profileData.companyName}
                    readOnly
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                  <Input
                    label="Industry"
                    value={profileData.industry}
                    readOnly
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <Input
                    label="Website"
                    value={profileData.website}
                    readOnly
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                  <Input
                    label="Subscription Plan"
                    value={profileData.planType}
                    readOnly
                    style={{ opacity: 0.8, cursor: "not-allowed", color: "var(--accent)", fontWeight: 700 }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Security & Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Security Settings Card */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ padding: "8px", borderRadius: "10px", background: "var(--accent-glow)", border: "1px solid rgba(79,124,255,0.15)", color: "var(--accent)" }}>
                <Shield style={{ width: "18px", height: "18px" }} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Security Settings</h4>
            </div>

            <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "24px" }}>
              Update your authentication credentials to secure your user account. Changing password requires email OTP validation.
            </p>

            <Button
              type="button"
              variant="primary"
              onClick={() => setIsPasswordModalOpen(true)}
              icon={<Lock style={{ width: "15px", height: "15px" }} />}
              style={{ width: "100%", justifyContent: "center", padding: "10px" }}
            >
              Change Password
            </Button>
          </div>

          {/* Activity Information Card */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981" }}>
                <Activity style={{ width: "18px", height: "18px" }} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", margin: 0 }}>Activity Information</h4>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>Account Status</span>
              <Badge variant="success" style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                Active
              </Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Change Password Modals Flow */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        role={isSuperAdmin ? "super-admin" : isAgent ? "team-member" : "admin"}
        onOpenOTP={(oldPass, newPass) => {
          setOldPasswordVal(oldPass);
          setNewPasswordVal(newPass);
          setIsPasswordModalOpen(false);
          setIsOTPModalOpen(true);
        }}
      />

      <OTPVerificationModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        oldPasswordVal={oldPasswordVal}
        newPasswordVal={newPasswordVal}
        role={isSuperAdmin ? "super-admin" : isAgent ? "team-member" : "admin"}
        onResendOtp={async () => {
          await authService.sendChangePasswordOtp(
            oldPasswordVal,
            newPasswordVal,
            isSuperAdmin ? "super-admin" : isAgent ? "team-member" : "admin"
          );
        }}
        onVerifySuccess={handleVerifyPasswordChangeSuccess}
      />

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 991px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
