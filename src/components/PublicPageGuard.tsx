"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function PublicPageGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const clientToken = localStorage.getItem("saas_client_token");
    const superadminToken = localStorage.getItem("saas_superadmin_token") || localStorage.getItem("sa_token");

    // Don't redirect widget window path as it's embedded or used by customers
    if (pathname.startsWith("/widget-window")) {
      return;
    }

    if (superadminToken) {
      // Super admin is logged in
      // Redirect if the path is not under /superadmin (except if it is the signin page itself)
      if (!pathname.startsWith("/superadmin") || pathname === "/superadmin/signin") {
        router.push("/superadmin/dashboard");
      }
    } else if (clientToken) {
      // Client admin or agent is logged in
      // Redirect if the path is not under /admin
      if (!pathname.startsWith("/admin")) {
        router.push("/admin/dashboard");
      }
    }
  }, [mounted, pathname, router]);

  return null;
}
