"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SubpageLayoutProps {
  children: React.ReactNode;
  /** Ambient glow colour in hex, e.g. "#4f7cff". Defaults to accent. */
  accentColor?: string;
}

/**
 * Shared wrapper for every subpage route.
 * Renders:  Navbar → decorative bg → content slot → Footer
 *
 * Usage (Server component):
 *   return <SubpageLayout><YourContent /></SubpageLayout>
 */
export default function SubpageLayout({ children, accentColor = "#4f7cff" }: SubpageLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Background decoration */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          paddingTop: "120px",
          paddingBottom: "100px",
          flex: 1,
        }}
      >
        {/* Subtle grid */}
        <div
          className="grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none" }}
        />
        {/* Ambient glow blob */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: `${accentColor}08`,
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        {/* Page content */}
        <div
          className="layout-container"
          style={{
            position: "relative",
            zIndex: 10,
          }}
        >
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
