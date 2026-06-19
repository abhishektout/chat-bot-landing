"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { 
  Building, 
  Trash2, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  LogOut, 
  Crown, 
  Menu, 
  X,
  Compass
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui";

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Super Admin");
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("sa_token");
    const name = localStorage.getItem("sa_name");
    
    if (!token) {
      router.push("/signin");
      return;
    }

    if (name) {
      setAdminName(name);
    }
    
    // Load collapsed state
    const savedState = localStorage.getItem("saas_superadmin_sidebar_collapsed");
    if (savedState === "true") {
      setIsCollapsed(true);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("sa_token");
    localStorage.removeItem("sa_name");
    router.push("/signin");
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("saas_superadmin_sidebar_collapsed", String(newState));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)] text-[var(--fg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 rounded-full border-3 border-[var(--accent)] border-t-transparent"></div>
          <span className="text-sm font-medium text-[var(--muted-fg)]">Loading administrative services...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/superadmin/dashboard/clients", label: "Manage Clients", icon: Building },
    { href: "/superadmin/dashboard/settings", label: "Global Settings", icon: Settings },
    { href: "/superadmin/dashboard/deleted", label: "Deleted Accounts", icon: Trash2 }
  ];

  return (
    <div className="dot-bg flex min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-all duration-300">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-white">
            <Crown className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-extrabold tracking-tight">
            Assistly <span className="gradient-text">Master</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-2.5 rounded-xl bg-[var(--muted-bg)] border-0 text-[var(--fg)] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-45"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--glass-bg)] backdrop-blur-md border-r border-[var(--glass-border)] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-30`}
        style={{ width: isCollapsed ? "80px" : "280px" }}
      >
        {/* Brand/Header */}
        <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-white shrink-0 shadow-md">
              <Crown className="w-4.5 h-4.5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-sm font-black tracking-tight text-[var(--fg)]">
                  Assistly <span className="gradient-text">Master</span>
                </h1>
                <span className="text-[10px] text-[var(--muted-fg)] font-bold uppercase tracking-wider">
                  Admin Platform
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden p-1.5 text-[var(--muted-fg)] hover:text-[var(--fg)] cursor-pointer bg-transparent border-0"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] items-center justify-center text-[var(--muted-fg)] hover:text-[var(--fg)] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Workspace Quick-Info */}
        {!isCollapsed && (
          <div className="mx-4 mt-5 p-4 rounded-2xl bg-[var(--muted-bg)]/40 border border-[var(--card-border)]/55 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-500/10 border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] font-bold text-xs uppercase shadow-inner">
              {adminName.substring(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--fg)] truncate">{adminName}</span>
              <span className="text-[9px] text-[var(--muted-fg)] uppercase tracking-wider font-semibold">
                Superuser Console
              </span>
            </div>
          </div>
        )}

        {/* Links Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-xs transition-all relative group ${
                  isActive
                    ? "bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/10"
                    : "text-[var(--muted-fg)] hover:text-[var(--fg)] hover:bg-[var(--muted-bg)]/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted-fg)]"
                }`} />
                {!isCollapsed && <span>{link.label}</span>}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Utility actions */}
        <div className="p-4 border-t border-[var(--glass-border)] space-y-1">
          <button 
            onClick={toggleTheme} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl hover:bg-[var(--muted-bg)]/60 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-all font-bold text-xs text-left cursor-pointer border-0 bg-transparent"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                {!isCollapsed && <span>Light Theme</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                {!isCollapsed && <span>Dark Theme</span>}
              </>
            )}
          </button>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all font-bold text-xs text-left cursor-pointer border-0 bg-transparent"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Exit Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Administrative Panel Content */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col px-6 pt-24 pb-10 md:px-10 md:pt-10 md:pb-10">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
