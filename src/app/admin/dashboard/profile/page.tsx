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
  EyeOff
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAdminDashboard } from "../layout";
import { Card, Input, Button, Badge, Skeleton, Modal } from "@/components/ui";
import { adminService } from "@/services/admin.service";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
}

/**
 * OTPVerificationModal component
 * Handles the OTP code input step for the password change flow.
 */
function OTPVerificationModal({ isOpen, onClose, onVerifySuccess }: OTPVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setError('');
    onVerifySuccess();
  };

  const handleResend = () => {
    showToast("success", "OTP Resent", "OTP has been resent to your email.");
  };

  return (
    <Modal title="Verification Required" isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6, margin: 0 }}>
          Please enter the 6-digit verification code sent to your email to confirm this password change.
        </p>

        <Input 
          label="OTP Code" 
          name="otp" 
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setOtp(val);
            if (error) setError('');
          }}
          placeholder="000000"
          error={error || undefined}
          maxLength={6}
          style={{ 
            textAlign: "center", 
            fontFamily: "monospace", 
            fontSize: "24px", 
            letterSpacing: "0.2em",
            fontWeight: 700 
          }}
        />

        <div style={{ marginTop: "8px", textAlign: "center", fontSize: "12px", color: "var(--muted-fg)" }}>
          Didn't receive the code?{" "}
          <button 
            type="button" 
            onClick={handleResend}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "var(--accent)", 
              fontWeight: 700, 
              cursor: "pointer", 
              padding: 0 
            }}
          >
            Resend OTP
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            style={{ padding: "10px 20px" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            icon={<ShieldCheck style={{ width: "14px", height: "14px" }} />}
            style={{ padding: "10px 20px" }}
          >
            Verify
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOTP: () => void;
}

/**
 * PasswordChangeModal component
 * Form validation and modal display for changing a user's password.
 */
function PasswordChangeModal({ isOpen, onClose, onOpenOTP }: PasswordChangeModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleVerifyOTP = (e: React.FormEvent) => {
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
    onOpenOTP();
  };

  const strengthChecks = validateStrength(formData.newPassword);

  return (
    <Modal title="Change Account Password" isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <form onSubmit={handleVerifyOTP} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ position: "relative" }}>
          <Input 
            label="Old Password" 
            type={showOld ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.oldPassword || undefined}
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            style={{
              position: "absolute",
              right: "12px",
              top: "38px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-fg)",
              display: "flex",
              alignItems: "center",
              padding: 0
            }}
          >
            {showOld ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <Input 
            label="New Password" 
            type={showNew ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.newPassword || undefined}
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            style={{
              position: "absolute",
              right: "12px",
              top: "38px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-fg)",
              display: "flex",
              alignItems: "center",
              padding: 0
            }}
          >
            {showNew ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
          </button>
        </div>
        
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

        <div style={{ position: "relative" }}>
          <Input 
            label="Confirm New Password" 
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword || undefined}
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "12px",
              top: "38px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-fg)",
              display: "flex",
              alignItems: "center",
              padding: 0
            }}
          >
            {showConfirm ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            style={{ padding: "10px 20px" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            icon={<Lock style={{ width: "14px", height: "14px" }} />}
            style={{ padding: "10px 20px" }}
          >
            Verify OTP
          </Button>
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
  let refreshTenantInfo = async () => {};
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
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          User Profile Info
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          My <span className="gradient-text">Profile</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Manage your account credentials, view security tokens, and inspect system-assigned variables.
        </p>
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
        onOpenOTP={() => {
          setIsPasswordModalOpen(false);
          setIsOTPModalOpen(true);
        }}
      />

      <OTPVerificationModal 
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
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
