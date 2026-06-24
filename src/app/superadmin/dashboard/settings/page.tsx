"use client";

import React, { useState, useEffect } from "react";
import { Key, Mail, Server, Eye, EyeOff, ShieldAlert, Settings, Save, Sparkles } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Input, Button } from "@/components/ui";
import { superAdminService } from "@/services/superadmin.service";

export default function GlobalSettingsPage() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    gemini_api_key: "",
    smtp_server: "smtp.gmail.com:465",
    smtp_email: "sandbox.tout@gmail.com",
    smtp_password: "ronydgumvqjwwwou",
  });

  const fetchSettings = async () => {
    try {
      const data = await superAdminService.getSettings();
      const settings = data.settings || data || {};
      setFormData({
        gemini_api_key: settings.master_gemini_key || settings.gemini_api_key || "",
        smtp_server: settings.smtp_server || "",
        smtp_email: settings.smtp_email || "",
        smtp_password: settings.smtp_password || "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await superAdminService.saveSettings(formData);
      showToast("success", "Settings Saved", "Global fallback config saved successfully.");
    } catch (e) {
      showToast("error", "Error", "Server connection error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge" style={{ marginBottom: "4px", width: "fit-content" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
          Global Credentials
        </span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          System <span className="gradient-text">Configuration</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Configure platform-wide AI fallback parameters and SMTP relay notifications.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
        {/* Gemini fallback card */}
        <Card className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px", position: "relative", overflow: "hidden" }}>
          {/* Decorative element */}
          <div style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "var(--accent-glow)",
            filter: "blur(25px)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              padding: "10px",
              borderRadius: "12px",
              background: "var(--accent-glow)",
              border: "1px solid rgba(79,124,255,0.15)",
              color: "var(--accent)",
              display: "flex",
            }}>
              <Key style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)" }}>AI Engine Fallback Key</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500, marginTop: "2px" }}>
                Utilized when tenants do not configure dedicated model credentials.
              </p>
            </div>
          </div>

          <Input
            label="Gemini API Key (Global Fallback)"
            type="password"
            name="gemini_api_key"
            value={formData.gemini_api_key}
            onChange={handleChange}
            placeholder="AIzaSy..."
            icon={<Key style={{ width: "16px", height: "16px" }} />}
            className="font-mono text-sm"
          />
        </Card>

        {/* SMTP notifications card */}
        <Card className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px", position: "relative", overflow: "hidden" }}>
          {/* Decorative element */}
          <div style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(16,185,129,0.12)",
            filter: "blur(25px)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              padding: "10px",
              borderRadius: "12px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.15)",
              color: "#10b981",
              display: "flex",
            }}>
              <Mail style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--fg)" }}>SMTP Notification Gateway</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500, marginTop: "2px" }}>
                Relay credentials used for provisioning alerts, welcome codes and OTP dispatches.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              label="SMTP Server Hostname"
              name="smtp_server"
              value={formData.smtp_server}
              onChange={handleChange}
              placeholder="smtp.gmail.com:587"
              icon={<Server style={{ width: "16px", height: "16px" }} />}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <Input
                label="Sender Email Address"
                type="email"
                name="smtp_email"
                value={formData.smtp_email}
                onChange={handleChange}
                placeholder="notifications@assistly.io"
                icon={<Mail style={{ width: "16px", height: "16px" }} />}
              />
              <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
                <Input
                  label="SMTP Password / Auth Secret"
                  type={showPassword ? "text" : "password"}
                  name="smtp_password"
                  value={formData.smtp_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Key style={{ width: "16px", height: "16px" }} />}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    bottom: "10px",
                    background: "none",
                    border: "none",
                    color: "var(--muted-fg)",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid var(--card-border)" }}>
          <Button
            type="submit"
            isLoading={isSaving}
            icon={<Save style={{ width: "15px", height: "15px" }} />}
            style={{ fontSize: "13px", padding: "12px 28px" }}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
