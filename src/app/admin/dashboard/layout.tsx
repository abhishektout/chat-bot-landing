"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  BarChart3,
  Settings,
  BookOpen,
  Database,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Zap,
  User,
} from "lucide-react";
import { useToast } from "@/components/Toast";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://bot.a4tool.com";

interface TenantInfo {
  company_name: string;
  bot_name: string;
  support_email: string;
  custom_rules: string;
  primary_color: string;
  widget_position: string;
  widget_icon_url: string;
  api_key: string;
  client_db_uri?: string;
  db_rules?: string;
  allowed_tables?: string;
}

interface AdminDashboardContextType {
  tenantInfo: TenantInfo | null;
  isLoading: boolean;
  role: string | null;
  agentName: string | null;
  refreshTenantInfo: () => Promise<void>;
}

const AdminDashboardContext = createContext<AdminDashboardContextType>({
  tenantInfo: null,
  isLoading: true,
  role: null,
  agentName: null,
  refreshTenantInfo: async () => { },
});

export const useAdminDashboard = () => useContext(AdminDashboardContext);

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const val = localStorage.getItem("saas_sidebar_collapsed");
    if (val === "true") setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("saas_sidebar_collapsed", next ? "true" : "false");
      return next;
    });
  };

  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const MOCK_TENANT_INFO: TenantInfo = {
    company_name: "Assistly Dev Corp",
    bot_name: "Assistly Copilot",
    support_email: "support@assistly.dev",
    custom_rules: "Always be polite and helpful. Suggest using the pricing calculator.",
    primary_color: "#4f7cff",
    widget_position: "right",
    widget_icon_url: "",
    api_key: "ast_dev_key_123456789",
    client_db_uri: "postgresql://localhost:5432/assistly_dev",
    db_rules: "Allow read access to products, support_articles, and contact_requests.",
    allowed_tables: "products, support_articles, contact_requests",
  };

  const fetchTenantInfo = async (authToken: string) => {
    if (authToken.startsWith("test_")) {
      setTenantInfo(MOCK_TENANT_INFO);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_API}/admin/tenant-info`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setTenantInfo(data.data);
      } else {
        if (process.env.NODE_ENV === "development") {
          setTenantInfo(MOCK_TENANT_INFO);
          showToast("info", "Local Mode", "Loaded fallback mock configuration.");
        } else {
          showToast("error", "Session Expired", "Please log in again.");
          handleLogout();
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        setTenantInfo(MOCK_TENANT_INFO);
        showToast("info", "Local Mode", "Backend offline. Loaded mock configuration.");
      } else {
        showToast("error", "Connection Error", "Failed to connect to administrative services.");
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenantInfo = async () => {
    if (token) await fetchTenantInfo(token);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("saas_client_token");
    const storedRole = localStorage.getItem("saas_user_role");
    const storedAgentName = localStorage.getItem("saas_agent_name");
    if (!storedToken) { router.push("/signin"); return; }
    setToken(storedToken);
    setRole(storedRole);
    setAgentName(storedAgentName);
    fetchTenantInfo(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("saas_client_token");
    localStorage.removeItem("saas_user_role");
    localStorage.removeItem("saas_agent_id");
    localStorage.removeItem("saas_agent_name");
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--fg)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          {/* Animated logo icon */}
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px var(--accent-glow)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}>
            <Zap style={{ width: "24px", height: "24px", color: "#fff" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "32px",
              height: "3px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, var(--accent), var(--accent2))",
              animation: "loadingBar 1.2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-fg)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Loading Console...
            </span>
          </div>
        </div>
        <style>{`
          @keyframes loadingBar {
            0%, 100% { width: 32px; opacity: 0.5; }
            50% { width: 80px; opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  const isAdmin = role !== "agent";
  const displayName = isAdmin ? (tenantInfo?.company_name || "Workspace") : (agentName || "Team Agent");
  const displayInitial = displayName.charAt(0).toUpperCase();
  const customIcon = tenantInfo?.widget_icon_url || "";

  const navLinks = [
    { href: "/admin/dashboard/overview", label: "Dashboard", icon: BarChart3, color: "var(--accent)" },
    ...(isAdmin ? [
      { href: "/admin/dashboard/settings", label: "Bot Settings", icon: Settings, color: "var(--accent)" },
      { href: "/admin/dashboard/knowledge", label: "Knowledge Base", icon: BookOpen, color: "var(--accent)" },
      { href: "/admin/dashboard/database", label: "Database Auth", icon: Database, color: "var(--accent)" },
      { href: "/admin/dashboard/team", label: "Team Management", icon: Users, color: "var(--accent)" },
    ] : []),
    { href: "/admin/dashboard/history", label: "Chat Logs", icon: MessageSquare, color: "var(--accent)" },
    { href: "/admin/dashboard/profile", label: "My Profile", icon: User, color: "var(--accent)" },
  ];

  return (
    <AdminDashboardContext.Provider value={{ tenantInfo, isLoading, role, agentName, refreshTenantInfo }}>
      <div className="dot-bg" style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg)",
        color: "var(--fg)",
        transition: "background 0.4s ease, color 0.3s ease",
      }}>

        {/* ── Mobile Top Bar (only on mobile) ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "0 20px",
          zIndex: 40,
          boxShadow: "0 2px 20px var(--shadow)",
        }} className="md:hidden">
          {/* Brand logo on mobile navbar left with hamburger menu */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--fg)",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--muted-bg)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              title="Open Menu"
            >
              <Menu style={{ width: "20px", height: "20px" }} />
            </button>
            <div style={{
              width: "120px",
              height: "32px",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}>
              <img
                src={mounted && theme === "light" ? "/light-theme-logo.png" : "/dark-theme-logo.png"}
                alt="Assistly Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left center" }}
              />
            </div>
          </div>
          <Link
            href="/admin/dashboard/profile"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 12px var(--accent-glow)",
              flexShrink: 0,
              textDecoration: "none",
            }}
          >
            {isAdmin && customIcon
              ? <img src={customIcon} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              : displayInitial}
          </Link>
        </div>

        {/* ── Mobile Overlay ── */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 45,
            }}
            className="md:hidden"
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          style={{
            width: isCollapsed ? "72px" : "260px",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRight: "1px solid var(--glass-border)",
            boxShadow: "2px 0 32px var(--shadow)",
            transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
          className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          {/* ── Brand Header ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 16px",
            borderBottom: "1px solid var(--glass-border)",
            position: "relative",
            minHeight: "72px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: isCollapsed ? "0px" : "12px",
              width: "100%",
              justifyContent: isCollapsed ? "center" : "flex-start",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              {/* Logo icon container */}
              <div style={{
                width: "36px",
                height: "36px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transform: isCollapsed ? "translateX(2px)" : "translateX(0px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
                <img
                  src={mounted && theme === "light" ? "/light-theme-logo.png" : "/dark-theme-logo.png"}
                  alt="Assistly Logo"
                  style={{
                    height: "100%",
                    width: "140px",
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                />
              </div>

              {/* Organization name and console label (hidden on mobile) */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                opacity: isCollapsed ? 0 : 1,
                maxWidth: isCollapsed ? "0px" : "160px",
                transform: isCollapsed ? "translateX(-10px)" : "translateX(0px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
                className="hidden md:flex"
              >
                <span style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "var(--fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}>
                  {displayName}
                </span>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--accent)",
                  marginTop: "2px",
                }}>
                  {isAdmin ? "Admin Console" : "Agent Console"}
                </span>
              </div>
            </div>

            {/* Mobile close button - only when mobile menu is open */}
            {isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: "7px",
                  borderRadius: "8px",
                  color: "var(--muted-fg)",
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                className="md:hidden"
              >
                <X style={{ width: "15px", height: "15px" }} />
              </button>
            )}

            {/* Desktop collapse toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex"
              style={{
                position: "absolute",
                right: "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted-fg)",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 2px 8px var(--shadow)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-fg)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--card-border)";
              }}
            >
              {isCollapsed
                ? <ChevronRight style={{ width: "13px", height: "13px" }} />
                : <ChevronLeft style={{ width: "13px", height: "13px" }} />}
            </button>
          </div>

          {/* ── Navigation Links ── */}
          <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
            {!isCollapsed && (
              <span style={{
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--muted-fg)",
                padding: "8px 10px 4px",
              }}>Navigation</span>
            )}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: isCollapsed ? "12px" : "11px 12px",
                    borderRadius: "12px",
                    fontSize: "12.5px",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? "var(--accent)" : "var(--muted-fg)",
                    background: isActive ? "var(--accent-glow)" : "transparent",
                    border: isActive ? "1px solid rgba(79,124,255,0.2)" : "1px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.18s ease",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    position: "relative",
                    boxShadow: isActive ? "0 2px 8px var(--accent-glow)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted-bg)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-fg)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }
                  }}
                >
                  <Icon style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    color: isActive ? "var(--accent)" : "inherit",
                  }} />
                  {!isCollapsed && <span>{link.label}</span>}

                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <span style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                    }} />
                  )}

                  {/* Collapsed tooltip */}
                  {isCollapsed && (
                    <div style={{
                      position: "absolute",
                      left: "calc(100% + 12px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "6px 12px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--fg)",
                      whiteSpace: "nowrap",
                      zIndex: 99,
                      boxShadow: "0 4px 16px var(--shadow)",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.15s",
                    }} className="sidebar-tooltip">
                      {link.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Sidebar Footer ── */}
          <div style={{
            padding: "12px 10px",
            borderTop: "1px solid var(--glass-border)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: isCollapsed ? "12px" : "11px 12px",
                borderRadius: "12px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--muted-fg)",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                width: "100%",
                justifyContent: isCollapsed ? "center" : "flex-start",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--muted-bg)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-fg)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {theme === "dark"
                ? <Sun style={{ width: "16px", height: "16px", color: "#f59e0b", flexShrink: 0 }} />
                : <Moon style={{ width: "16px", height: "16px", color: "var(--accent)", flexShrink: 0 }} />}
              {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: isCollapsed ? "12px" : "11px 12px",
                borderRadius: "12px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#ef4444",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                width: "100%",
                justifyContent: isCollapsed ? "center" : "flex-start",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
              }}
            >
              <LogOut style={{ width: "16px", height: "16px", flexShrink: 0 }} />
              {!isCollapsed && <span>Secure Logout</span>}
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            paddingTop: "24px",
            paddingBottom: "40px",
            paddingLeft: "32px",
            paddingRight: "32px",
            marginLeft: isCollapsed ? "0px" : "260px",
            transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="admin-main"
        >
          {/* Main top header bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "15px",

          }}>
            {/* Assistly Brand Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "120px",
                height: "34px",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}>
                <img
                  src={mounted && theme === "light" ? "/light-theme-logo.png" : "/dark-theme-logo.png"}
                  alt="Assistly Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left center" }}
                />
              </div>
            </div>

            {/* Right: Company + role */}
            <Link
              href="/admin/dashboard/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--muted-bg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg)" }}>{displayName}</div>
                <div style={{ fontSize: "10px", color: "var(--muted-fg)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isAdmin ? "Organization Admin" : "Support Agent"}
                </div>
              </div>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "14px",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 4px 12px var(--accent-glow)",
              }}>
                {isAdmin && customIcon
                  ? <img src={customIcon} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : displayInitial}
              </div>
            </Link>
          </div>

          {/* Page content */}
          <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        </main>
      </div>

      {/* Global styles for tooltip & mobile */}
      <style>{`
        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0 !important;
            padding-top: 80px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
        a:has(.sidebar-tooltip):hover .sidebar-tooltip,
        a:hover .sidebar-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </AdminDashboardContext.Provider>
  );
}
