"use client";

import React from "react";
import SignInForm from "@/components/SignInForm";

export default function SuperAdminSignInPage() {
  return <SignInForm forcedRole="super-admin" />;
}
