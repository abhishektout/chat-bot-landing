"use client";

import React, { useState, useEffect } from "react";
import { Key, Mail, Server, Eye, EyeOff, ShieldAlert, Settings, Save } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Card, Input, Button } from "@/components/ui";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

export default function GlobalSettingsPage() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    gemini_api_key: "",
    smtp_server: "",
    smtp_email: "",
    smtp_password: "",
  });

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("saas_superadmin_token");
      const res = await fetch(`${BASE_API}/superadmin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          gemini_api_key: data.gemini_api_key || "",
          smtp_server: data.smtp_server || "",
          smtp_email: data.smtp_email || "",
          smtp_password: data.smtp_password || "",
        });
      }
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
      const token = localStorage.getItem("saas_superadmin_token");
      const payload = new URLSearchParams();
      payload.append("gemini_api_key", formData.gemini_api_key);
      payload.append("smtp_server", formData.smtp_server);
      payload.append("smtp_email", formData.smtp_email);
      payload.append("smtp_password", formData.smtp_password);

      const res = await fetch(`${BASE_API}/superadmin/settings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
      });

      if (res.ok) {
        showToast("success", "Settings Saved", "Global fallback config saved successfully.");
      } else {
        showToast("error", "Error", "Failed to save settings");
      }
    } catch (e) {
      showToast("error", "Error", "Server connection error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
            Global Credentials
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          System <span className="gradient-text">Configuration</span>
        </h2>
        <p className="text-sm text-[var(--muted-fg)] font-medium">
          Configure platform-wide AI fallback parameters and SMTP relay notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* Gemini fallback card */}
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-glow)] text-[var(--accent)]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--fg)]">AI Engine Fallback Key</h3>
              <p className="text-xs text-[var(--muted-fg)] mt-0.5">
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
            icon={<Key className="w-4 h-4" />}
            className="font-mono text-sm"
          />
        </Card>

        {/* SMTP notifications card */}
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-glow)] text-[var(--accent)]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--fg)]">SMTP Notification Gateway</h3>
              <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                Relay credentials used for provisioning alerts, welcome codes and OTP dispatches.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="SMTP Server Hostname"
                name="smtp_server"
                value={formData.smtp_server}
                onChange={handleChange}
                placeholder="smtp.gmail.com:587"
                icon={<Server className="w-4 h-4" />}
              />
            </div>
            <Input
              label="Sender Email Address"
              type="email"
              name="smtp_email"
              value={formData.smtp_email}
              onChange={handleChange}
              placeholder="notifications@assistly.io"
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="relative flex items-end">
              <Input
                label="SMTP Password / Auth Secret"
                type={showPassword ? "text" : "password"}
                name="smtp_password"
                value={formData.smtp_password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Key className="w-4 h-4" />}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-all bg-transparent border-0 cursor-pointer outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-[var(--card-border)]">
          <Button
            type="submit"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
            className="text-xs py-3 px-6"
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
