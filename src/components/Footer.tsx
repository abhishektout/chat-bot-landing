"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Share2, Link2, Code2, Mail } from "lucide-react";
import Link from "next/link";
import { FOOTER_SECTIONS } from "@/data/navigation";
import { usePathname, useRouter } from "next/navigation";

const SOCIAL = [Share2, Link2, Code2, Mail];

export default function Footer() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /** Smooth-scroll anchors on homepage, route client-side otherwise */
  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#") && !href.startsWith("/#")) return;
    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
    if (!hash || hash === "#") return;

    e.preventDefault();
    if (pathname === "/") {
      const win = window as unknown as {
        customLenis?: {
          scrollTo: (target: string | number, options?: { immediate?: boolean; offset?: number }) => void;
        };
      };
      if (win.customLenis && typeof win.customLenis.scrollTo === "function") {
        win.customLenis.scrollTo(hash, { offset: 86 });
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/" + hash);
    }
  }

  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--card-border)", background: "rgba(79,124,255,0.02)" }}>
      <div className="layout-container">

        {/* Main grid */}
        <div className="mt-6 pt-20 pb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8" style={{ paddingBottom: "15px" }}>

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2" style={{ minWidth: "180px" }}>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ width: "180px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={mounted && theme === "light" ? "/light-theme-logo.png" : "/dark-theme-logo.png"}
                  alt="Assistly Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "16px", maxWidth: "220px" }}>
              AI-powered customer support platform that reduces costs, captures leads, and delights customers 24/7.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {SOCIAL.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Social link"
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

          {/* Nav link columns — driven from navigation.ts */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 style={{ fontSize: "11px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "14px" }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      /* External links — open in new tab */
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "12.5px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
                      >
                        {link.label}
                      </a>
                    ) : link.href.startsWith("#") || link.href.startsWith("/#") ? (
                      /* Anchor links — smooth scroll on home, navigate otherwise */
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        style={{ fontSize: "12.5px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
                      >
                        {link.label}
                      </a>
                    ) : (
                      /* Internal app routes — use Next.js Link for client-side navigation */
                      <Link
                        href={link.href}
                        style={{ fontSize: "12.5px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "28px 0",
            borderTop: "1px solid var(--card-border)",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--muted-fg)" }}>
            © {new Date().getFullYear()} Assistly Inc. A product of{" "}
            <a
              href="https://v2.throughouttechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
            >
              Throughout Technologies
            </a>
            . All rights reserved.
          </p>

          <div style={{ display: "flex", gap: "18px" }}>
            {[
              { label: "Privacy", href: "/legal/privacy" },
              { label: "Terms", href: "/legal/terms" },
              { label: "Cookies", href: "/legal/cookies" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ fontSize: "12px", color: "var(--muted-fg)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-fg)")}
              >
                {label}
              </Link>
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
