"use client";

import React, { useState, useEffect } from "react";
import { Settings, Palette, Eye, EyeOff, Copy, Save, Mail, Bot, Globe, Key, ShieldCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAdminDashboard } from "../layout";
import { Card, Input, Select, Textarea, Button } from "@/components/ui";
import { adminService } from "@/services/admin.service";

export default function BotSettingsPage() {
  const { tenantInfo, refreshTenantInfo } = useAdminDashboard();
  const { showToast } = useToast();
  const [embedMethod, setEmbedMethod] = useState("script");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCustomGeminiKey, setShowCustomGeminiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "", botName: "", supportEmail: "",
    customRules: "", primaryColor: "#2563eb",
    widgetPosition: "right", widgetIconUrl: "", apiKey: "",
    apiKeyType: "ours", customGeminiKey: "",
  });
  const [errors, setErrors] = useState<{
    companyName?: string;
    botName?: string;
    supportEmail?: string;
    customGeminiKey?: string;
  }>({});

  useEffect(() => {
    if (tenantInfo) {
      setFormData({
        companyName: tenantInfo.company_name || "",
        botName: tenantInfo.bot_name || "",
        supportEmail: tenantInfo.support_email || "",
        customRules: tenantInfo.custom_rules || "",
        primaryColor: tenantInfo.primary_color || "#2563eb",
        widgetPosition: tenantInfo.widget_position || "right",
        widgetIconUrl: tenantInfo.widget_icon_url || "",
        apiKey: tenantInfo.api_key || "",
        apiKeyType: tenantInfo.api_key_type || "ours",
        customGeminiKey: tenantInfo.custom_gemini_key || "",
      });
    }
  }, [tenantInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: typeof errors = {};

    if (!formData.companyName.trim()) {
      tempErrors.companyName = "Company name is required.";
    }
    if (!formData.botName.trim()) {
      tempErrors.botName = "Bot assistant name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.supportEmail.trim()) {
      tempErrors.supportEmail = "Support email is required.";
    } else if (!emailRegex.test(formData.supportEmail.trim())) {
      tempErrors.supportEmail = "Please enter a valid email address.";
    }

    if (formData.apiKeyType === "client" && !formData.customGeminiKey.trim()) {
      tempErrors.customGeminiKey = "Your Custom Gemini API Key is required.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      showToast("error", "Validation Failed", "Please resolve all marked errors.");
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await adminService.saveSettings({
        company_name: formData.companyName,
        bot_name: formData.botName,
        support_email: formData.supportEmail,
        custom_rules: formData.customRules,
        primary_color: formData.primaryColor,
        widget_position: formData.widgetPosition,
        widget_icon_url: formData.widgetIconUrl,
        api_key_type: formData.apiKeyType,
        custom_gemini_key: formData.customGeminiKey,
      });

      showToast("success", "Settings Saved", "Your workspace configuration has been updated.");
      await refreshTenantInfo();
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to save settings.";
      showToast("error", "Save Failed", errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const activeKey = formData.apiKeyType === 'client' && formData.customGeminiKey ? formData.customGeminiKey : formData.apiKey;

  const handleCopyCode = () => {
    const code = embedMethod === "script"
      ? `<script\n  type="module"\n  src="https://bot.a4tool.com/widget-file"\n  data-api-key="${activeKey}">\n</script>`
      : `<iframe\n  allow="clipboard-write"\n  style="border: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; background-color: #0000;"\n  src="https://bot.a4tool.com/chatbot?key=${activeKey}">\n</iframe>`;
    navigator.clipboard.writeText(code)
      .then(() => showToast("success", "Copied", "Embed code copied to clipboard."))
      .catch(() => showToast("error", "Copy Failed", "Could not copy code automatically."));
  };

  const sectionHeader = (icon: React.ReactNode, title: string, desc: string, accent = "var(--accent)", bg = "var(--accent-glow)", border = "rgba(79,124,255,0.15)") => (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid var(--card-border)" }}>
      <div style={{ padding: "10px", borderRadius: "12px", background: bg, border: `1px solid ${border}`, color: accent, display: "flex" }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)", marginBottom: "2px" }}>{title}</h3>
        <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
        <span className="badge" style={{ width: "fit-content" }}><Settings style={{ width: "12px", height: "12px" }} />Workspace Configuration</span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Bot &amp; Widget <span className="gradient-text">Settings</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Customize agent behavior, brand styles, and integrate the chat widget into your website.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Card 1: AI Agent Config */}
        <div className="card" style={{ padding: "32px" }}>
          {sectionHeader(<Bot style={{ width: "20px", height: "20px" }} />, "AI Agent Configuration", "Set core identity metadata and communication templates.")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Acme Inc" icon={<Globe style={{ width: "14px", height: "14px" }} />} error={errors.companyName} />
            <Input label="Bot Assistant Name" name="botName" value={formData.botName} onChange={handleChange} placeholder="e.g. Assistly Bot" icon={<Bot style={{ width: "14px", height: "14px" }} />} error={errors.botName} />
            <Input label="Support Email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} placeholder="e.g. support@acme.com" icon={<Mail style={{ width: "14px", height: "14px" }} />} error={errors.supportEmail} />
          </div>
          <Textarea label="System Instructions / Personality Prompt" name="customRules" value={formData.customRules} onChange={handleChange} placeholder="Define custom rules. E.g: Keep responses polite and brief." rows={5} />

          {/* Gemini API Key Allocation */}
          <div style={{
            marginTop: "28px",
            padding: "24px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--card-border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--fg)", fontWeight: 800, fontSize: "14px", letterSpacing: "-0.01em" }}>
              <Key style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
              Gemini API Key Allocation
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", color: "var(--fg)", fontWeight: 600 }}>
                <input type="radio" name="apiKeyType" value="ours" checked={formData.apiKeyType === 'ours'} onChange={handleChange} 
                  style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
                Use Platform's Default Key
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", color: "var(--fg)", fontWeight: 600 }}>
                <input type="radio" name="apiKeyType" value="client" checked={formData.apiKeyType === 'client'} onChange={handleChange}
                  style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
                Use My Own Gemini Key
              </label>
            </div>

            {formData.apiKeyType === 'client' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px", animation: "fadeIn 0.3s ease" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Custom Gemini API Key *</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showCustomGeminiKey ? "text" : "password"}
                    name="customGeminiKey"
                    value={formData.customGeminiKey}
                    onChange={handleChange}
                    placeholder="AIzaSy..."
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      background: "var(--muted-bg)",
                      border: errors.customGeminiKey ? "1.5px solid #ef4444" : "1px solid var(--card-border)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      color: "var(--fg)",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button type="button" onClick={() => setShowCustomGeminiKey(!showCustomGeminiKey)}
                    style={{ position: "absolute", right: "14px", color: "var(--muted-fg)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
                    {showCustomGeminiKey ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                  </button>
                </div>
                {errors.customGeminiKey ? (
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <AlertCircle style={{ width: "13px", height: "13px" }} />
                    {errors.customGeminiKey}
                  </span>
                ) : (
                  <span style={{ fontSize: "11px", color: "#10b981", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <ShieldCheck style={{ width: "14px", height: "14px" }} />
                    This key will be securely stored and used exclusively for your workspace.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Design & Embedding */}
        <div className="card" style={{ padding: "32px" }}>
          {sectionHeader(<Palette style={{ width: "20px", height: "20px" }} />, "Design & Embedding", "Design custom UI colors and extract integration snippet.", "#10b981", "rgba(16,185,129,0.1)", "rgba(16,185,129,0.15)")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            {/* API Key */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>API Authorization Key</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showApiKey ? "text" : "password"} readOnly value={activeKey}
                  style={{ width: "100%", padding: "12px 44px 12px 16px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", fontSize: "13px", fontFamily: "monospace", color: "var(--fg)", outline: "none", boxSizing: "border-box" }}
                />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)}
                  style={{ position: "absolute", right: "14px", color: "var(--muted-fg)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
                  {showApiKey ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>
            {/* Brand Color */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>Brand Theme Accent</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "6px 16px" }}>
                <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange}
                  style={{ width: "36px", height: "36px", padding: 0, border: "none", borderRadius: "8px", cursor: "pointer", background: "transparent" }} />
                <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 700, color: "var(--fg)" }}>{formData.primaryColor}</span>
              </div>
            </div>
            <Select label="Widget Alignment Position" name="widgetPosition" value={formData.widgetPosition} onChange={handleChange}>
              <option value="right">Bottom Right corner</option>
              <option value="left">Bottom Left corner</option>
            </Select>
            <Input label="Widget Avatar Brand Icon URL (Optional)" name="widgetIconUrl" value={formData.widgetIconUrl} onChange={handleChange} placeholder="https://example.com/logo.png" icon={<Globe style={{ width: "14px", height: "14px" }} />} />
          </div>

          {/* Embed Code */}
          <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>Integration Strategy</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {["script", "iframe"].map(m => (
                  <button key={m} type="button" onClick={() => setEmbedMethod(m)}
                    style={{ padding: "8px 18px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, border: "1px solid", cursor: "pointer", transition: "all 0.18s", background: embedMethod === m ? "var(--accent-glow)" : "var(--card-bg)", borderColor: embedMethod === m ? "var(--accent)" : "var(--card-border)", color: embedMethod === m ? "var(--accent)" : "var(--muted-fg)" }}>
                    {m === "script" ? "HTML Script Tag" : "iFrame Embed"}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "var(--muted-fg)", marginTop: "8px", fontWeight: 500, lineHeight: 1.6 }}>
                {embedMethod === "script" ? "Loads a reactive overlay bubble. Perfect for standard SaaS products." : "Directly mounts the conversation window inside a fixed container."}
              </p>
            </div>
            <div style={{ position: "relative", borderRadius: "14px", background: "#080e1a", border: "1px solid rgba(79,124,255,0.2)", padding: "20px 24px" }}>
              <Button type="button" variant="primary" size="sm" onClick={handleCopyCode} icon={<Copy style={{ width: "13px", height: "13px" }} />} style={{ position: "absolute", top: "16px", right: "16px",padding: "10px 15px" } as React.CSSProperties}>Copy</Button>
              <pre style={{ overflowX: "auto", fontSize: "13px", fontFamily: "'Fira Code', monospace", color: "#4ade80", paddingRight: "80px", lineHeight: 1.7, margin: 0 }}>
                {embedMethod === "script"
                  ? `<script\n  type="module"\n  src="https://bot.a4tool.com/widget-file"\n  data-api-key="${activeKey || "YOUR_API_KEY_HERE"}">\n</script>`
                  : `<iframe\n  allow="clipboard-write"\n  style="border: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; background-color: #0000;"\n  src="https://bot.a4tool.com/chatbot?key=${activeKey || "YOUR_API_KEY_HERE"}">\n</iframe>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" isLoading={isSaving} icon={<Save style={{ width: "16px", height: "16px" }} />} style={{ minWidth: "220px", padding: "10px 20px", fontSize: "14px" } as React.CSSProperties}>
            Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
}
