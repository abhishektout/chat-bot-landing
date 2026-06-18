"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Zap, Share2, Link2, Code2, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Status", href: "/status" },
  ],
  Solutions: [
    { label: "E-Commerce", href: "/e-commerce" },
    { label: "Healthcare", href: "/healthcare" },
    { label: "SaaS", href: "/saas" },
    { label: "Finance", href: "/finance" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "SDKs", href: "/sdks" },
    { label: "Webhooks", href: "/webhooks" },
    { label: "Status Page", href: "/status-page" },
  ],
  Company: [
    { label: "About", href: "https://v2.throughouttechnologies.com/about-us" },
    { label: "Blog", href: "https://v2.throughouttechnologies.com/blogs" },
    { label: "Careers", href: "https://v2.throughouttechnologies.com/careers" },
    { label: "Press", href: "https://v2.throughouttechnologies.com/awards" },
    { label: "Contact", href: "https://v2.throughouttechnologies.com/contact-us" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
    { label: "Security", href: "/security" },
  ],
};

const socialIcons = [Share2, Link2, Code2, Mail];

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--card-border)", background: "rgba(79,124,255,0.02)" }}>
      <div className="mt-6" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Main grid */}
        <div style={{ paddingBottom: "15px" }} className="pt-20 pb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2" style={{ minWidth: "180px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
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

            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "12px", maxWidth: "220px" }}>
              AI-powered customer support platform that reduces costs, captures leads, and delights customers 24/7.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {socialIcons.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "var(--muted-bg)", border: "1px solid var(--card-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted-fg)", textDecoration: "none",
                    transition: "color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(79,124,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-fg)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted-bg)";
                  }}
                >
                  <Icon style={{ width: "13px", height: "13px" }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ fontSize: "11px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "12px" }}>
                {section}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (link.href.startsWith("/#") || link.href.startsWith("#")) {
                          const hashIndex = link.href.indexOf("#");
                          const hash = hashIndex !== -1 ? link.href.substring(hashIndex) : "";
                          if (hash && hash !== "#") {
                            if (typeof window !== "undefined") {
                              if (window.location.pathname === "/") {
                                e.preventDefault();
                                document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
                              }
                            }
                          }
                        }
                      }}
                      style={{ fontSize: "12.5px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "28px 0",
          borderTop: "1px solid var(--card-border)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
        }}>
          <p style={{ fontSize: "12px", color: "var(--muted-fg)" }}>
            © {new Date().getFullYear()} Assistly Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "18px" }}>
            {["Privacy", "Terms", "Cookies"].map((label) => (
              <a key={label} href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: "12px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
              >
                {label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-fg)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
