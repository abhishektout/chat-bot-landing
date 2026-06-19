"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
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
  Bell,
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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const val = localStorage.getItem("saas_sidebar_collapsed");
    if (val === "true") setIsCollapsed(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("saas_sidebar_collapsed", next ? "true" : "false");
      return next;
    });
  };

  const showExpanded = !isCollapsed || isMobile;

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
  const customIcon = tenantInfo?.widget_icon_url || "";
  
  // Ensure "Test Agent" doesn't show in the sidebar, fallback to default name "Nitesh Bagora"
  const rawName = mounted ? localStorage.getItem("saas_agent_name") : "";
  const storedUserName = (rawName && rawName !== "Test Agent") ? rawName : "Nitesh Bagora";

  // Sidebar links (Show all links to both admins and agents as requested)
  const navLinks = [
    { href: "/admin/dashboard/overview", label: "Dashboard", icon: BarChart3, color: "var(--accent)" },
    { href: "/admin/dashboard/settings", label: "Bot Settings", icon: Settings, color: "var(--accent)" },
    { href: "/admin/dashboard/knowledge", label: "Knowledge Base", icon: BookOpen, color: "var(--accent)" },
    { href: "/admin/dashboard/database", label: "Database Auth", icon: Database, color: "var(--accent)" },
    { href: "/admin/dashboard/team", label: "Team Management", icon: Users, color: "var(--accent)" },
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

        {/* ── Mobile Top Bar (only on mobile via CSS) ── */}
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
        }} className="mobile-navbar">
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
              width: "100px",
              height: "28px",
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

          {/* Right Side of Mobile Top Bar: Notifications + Theme Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Notification Icon */}
            <button style={{
              background: "none",
              border: "none",
              color: "var(--muted-fg)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
              <Bell style={{ width: "18px", height: "18px" }} />
              <span style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#ef4444",
                border: "1.5px solid var(--bg)"
              }} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted-fg)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme === "dark" 
                ? <Sun style={{ width: "18px", height: "18px", color: "#f59e0b" }} /> 
                : <Moon style={{ width: "18px", height: "18px", color: "var(--accent)" }} />}
            </button>
          </div>
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
        <motion.aside
          animate={{ width: showExpanded ? 260 : 72 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
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
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
          className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          {/* ── Sidebar User Header (No Logo!) ── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: !showExpanded ? "16px 8px" : "24px 16px",
            borderBottom: "1px solid var(--glass-border)",
            position: "relative",
            minHeight: "72px",
            gap: "12px",
            transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            {/* User Avatar */}
            <div style={{
              width: !showExpanded ? "36px" : "56px",
              height: !showExpanded ? "36px" : "56px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: !showExpanded ? "14px" : "20px",
              boxShadow: "0 4px 12px var(--accent-glow)",
              flexShrink: 0,
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              {isAdmin && customIcon ? (
                <img src={customIcon} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              ) : (
                storedUserName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name + Workspace stack */}
            <AnimatePresence initial={false}>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <span style={{
                    fontSize: "14px",
                    fontWeight: 750,
                    color: "var(--fg)",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: "100%",
                    lineHeight: 1.3,
                  }}>
                    {storedUserName}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--muted-fg)",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: "100%",
                    marginTop: "2.5px",
                  }}>
                    {tenantInfo?.company_name || "Assistly Dev Corp"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop collapse toggle (Floats exactly on the horizontal dividing border line!) */}
            <button
              onClick={toggleCollapse}
              className="desktop-collapse-btn"
              style={{
                position: "absolute",
                right: "-12px",
                top: "100%",
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
                zIndex: 100,
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
                ? <ChevronRight style={{ width: "12px", height: "12px" }} />
                : <ChevronLeft style={{ width: "12px", height: "12px" }} />}
            </button>

            {/* Mobile close button inside sidebar */}
            {isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "16px",
                  padding: "5px",
                  borderRadius: "6px",
                  color: "var(--muted-fg)",
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
                className="md:hidden"
              >
                <X style={{ width: "12px", height: "12px" }} />
              </button>
            )}
          </div>

          {/* ── Navigation Links ── */}
          <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
            {showExpanded && (
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
                    padding: !showExpanded ? "12px" : "11px 12px",
                    borderRadius: "12px",
                    fontSize: "12.5px",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? "var(--accent)" : "var(--muted-fg)",
                    background: isActive ? "var(--accent-glow)" : "transparent",
                    border: isActive ? "1px solid rgba(79,124,255,0.2)" : "1px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.18s ease",
                    justifyContent: !showExpanded ? "center" : "flex-start",
                    position: "relative",
                    boxShadow: isActive ? "0 2px 8px var(--accent-glow)" : "none",
                    overflow: "hidden",
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
                  <AnimatePresence initial={false}>
                    {showExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active indicator */}
                  {isActive && showExpanded && (
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
                  {!showExpanded && (
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
            {/* Theme toggle in sidebar */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: !showExpanded ? "12px" : "11px 12px",
                borderRadius: "12px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--muted-fg)",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                width: "100%",
                justifyContent: !showExpanded ? "center" : "flex-start",
                transition: "all 0.18s ease",
                overflow: "hidden",
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
              <AnimatePresence initial={false}>
                {showExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: !showExpanded ? "12px" : "11px 12px",
                borderRadius: "12px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#ef4444",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                width: "100%",
                justifyContent: !showExpanded ? "center" : "flex-start",
                transition: "all 0.18s ease",
                overflow: "hidden",
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
              <AnimatePresence initial={false}>
                {showExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    Secure Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        {/* ── Main Content ── */}
        <motion.main
          animate={{ marginLeft: showExpanded ? 260 : 72 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            paddingTop: 0,
            paddingBottom: "40px",
            paddingLeft: 0,
            paddingRight: 0,
          }}
          className="admin-main"
        >
          {/* ── Desktop Top Navbar ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid var(--glass-border)",
            minHeight: "64px",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: "0 2px 20px var(--shadow)",
          }} className="desktop-navbar">
            {/* Left Side: Assistly Logo (Made larger on web) */}
            <div style={{
              width: "170px",
              height: "44px",
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

            {/* Right Side: Notification Icon + Theme Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Notification Icon */}
              <button style={{
                background: "none",
                border: "none",
                color: "var(--muted-fg)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--fg)";
                e.currentTarget.style.backgroundColor = "var(--muted-bg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--muted-fg)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              >
                <Bell style={{ width: "18px", height: "18px" }} />
                <span style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "1.5px solid var(--bg)"
                }} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted-fg)",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--fg)";
                  e.currentTarget.style.backgroundColor = "var(--muted-bg)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--muted-fg)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {theme === "dark" 
                  ? <Sun style={{ width: "18px", height: "18px", color: "#f59e0b" }} /> 
                  : <Moon style={{ width: "18px", height: "18px", color: "var(--accent)" }} />}
              </button>
            </div>
          </div>

          {/* Page content */}
          <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }} className="admin-content">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Global responsive styles using explicit media queries to guarantee proper hide/show */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-navbar {
            display: none !important;
          }
          .mobile-navbar {
            display: flex !important;
          }
          .desktop-collapse-btn {
            display: none !important;
          }
          .admin-main {
            margin-left: 0 !important;
            padding-top: 80px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .admin-content {
            padding-top: 0 !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
        @media (min-width: 769px) {
          .desktop-navbar {
            display: flex !important;
          }
          .mobile-navbar {
            display: none !important;
          }
          .desktop-collapse-btn {
            display: flex !important;
          }
          .admin-content {
            padding-top: 24px !important;
            padding-left: 32px !important;
            padding-right: 32px !important;
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
