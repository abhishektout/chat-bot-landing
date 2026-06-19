"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/superadmin/dashboard/clients");
  }, [router]);

  return null;
}
