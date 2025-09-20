"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/i/flow/login");
  }, []);
  return null;
}
