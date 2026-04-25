"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Fetch user data and update AuthContext
      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            login(token, data.data.user);
            // login() already pushes to /dashboard
          } else {
            router.push("/login");
          }
        })
        .catch(() => router.push("/login"));
    } else {
      router.push("/login");
    }
  }, [router, searchParams]); // Removed unstable dependencies (login, refreshUser) to prevent infinite loops

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f",
      color: "#d4a853",
      fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
      fontSize: "1.5rem",
    }}>
      Signing you in...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "#d4a853",
      }}>
        Loading...
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
