"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const shouldDisable = 
      pathname.startsWith("/admin") || 
      pathname.startsWith("/superadmin") || 
      pathname.startsWith("/widget-window");

    if (shouldDisable) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as unknown as { customLenis: unknown }).customLenis = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        delete (window as unknown as { customLenis: unknown }).customLenis;
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (lenisRef.current) {
      if (typeof window !== "undefined" && window.location.hash) {
        return;
      }
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
