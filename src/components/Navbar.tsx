"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Zap, ChevronDown } from "lucide-react";

const navLinks = [
  {
    label: "Features",
    href: "#features",
    dropdown: [
      { label: "AI Agent", href: "#features" },
      { label: "Human Takeover", href: "#features" },
      { label: "Lead Capture", href: "#features" },
      { label: "Analytics", href: "#features" },
    ],
  },
  {
    label: "Solutions",
    href: "#use-cases",
    dropdown: [
      { label: "E-Commerce", href: "#use-cases" },
      { label: "Healthcare", href: "#use-cases" },
      { label: "SaaS", href: "#use-cases" },
      { label: "Finance", href: "#use-cases" },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.4s ease",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--card-border)" : "1px solid transparent",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "66px" }}>

            {/* Logo */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer" }}
            >
              <div style={{
                width: "180px", height: "50px",
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <img
                  src={mounted && theme === "light" ? "/light-theme-logo.png" : "/dark-theme-logo.png"}
                  alt="Assistly Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </motion.button>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-[2px]">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => scrollTo(link.href)}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "8px 14px", fontSize: "14px", fontWeight: 500,
                      color: "var(--muted-fg)", background: "none", border: "none",
                      cursor: "pointer", borderRadius: "8px",
                      transition: "color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "var(--fg)";
                      (e.target as HTMLElement).style.background = "var(--muted-bg)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "var(--muted-fg)";
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown style={{
                        width: "14px", height: "14px",
                        transform: activeDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }} />
                    )}
                  </button>

                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="glass"
                      style={{
                        position: "absolute", top: "100%", left: 0, marginTop: "4px",
                        width: "180px", borderRadius: "12px",
                        boxShadow: "0 12px 40px var(--shadow)",
                        padding: "4px", zIndex: 100,
                      }}
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => scrollTo(item.href)}
                          style={{
                            display: "block", width: "100%", textAlign: "left",
                            padding: "9px 14px", fontSize: "13px",
                            color: "var(--muted-fg)", background: "none",
                            border: "none", cursor: "pointer", borderRadius: "8px",
                            transition: "color 0.15s, background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "var(--fg)";
                            (e.target as HTMLElement).style.background = "var(--muted-bg)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "var(--muted-fg)";
                            (e.target as HTMLElement).style.background = "transparent";
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "var(--muted-bg)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted-fg)",
                  }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {theme === "dark"
                        ? <Sun style={{ width: "16px", height: "16px" }} />
                        : <Moon style={{ width: "16px", height: "16px" }} />
                      }
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}

              <div className="hidden md:flex" style={{ gap: "8px" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollTo("#contact")}
                  className="btn-secondary"
                  style={{ padding: "9px 18px", fontSize: "14px" }}
                >
                  Book Demo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollTo("#pricing")}
                  className="btn-primary"
                  style={{ padding: "9px 18px", fontSize: "14px" }}
                >
                  Start Free Trial
                </motion.button>
              </div>

              <button
                className="flex lg:hidden items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "var(--muted-bg)", border: "none", cursor: "pointer",
                  color: "var(--muted-fg)",
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X style={{ width: "18px", height: "18px" }} /> : <Menu style={{ width: "18px", height: "18px" }} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="glass lg:hidden"
            style={{
              position: "fixed", top: "66px", left: 0, right: 0, zIndex: 49,
              borderBottom: "1px solid var(--card-border)",
              boxShadow: "0 8px 32px var(--shadow)",
            }}
          >
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    textAlign: "left", padding: "12px 14px", fontSize: "15px", fontWeight: 500,
                    color: "var(--fg)", background: "none", border: "none",
                    cursor: "pointer", borderRadius: "8px",
                    transition: "background 0.2s",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <div style={{ paddingTop: "12px", borderTop: "1px solid var(--card-border)", marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => scrollTo("#contact")} className="btn-secondary">Book Demo</button>
                <button onClick={() => scrollTo("#pricing")} className="btn-primary">Start Free Trial</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
