"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

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
        .then(async (res) => {
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(`Failed to parse JSON`);
          }
        })
        .then((data) => {
          if (data.success) {
            login(token, data.data?.user || data.data);
            router.push("/");
          } else {
            router.push("/login");
          }
        })
        .catch((err) => {
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, [router, searchParams, login]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f",
      color: "#d4a853",
      fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
      padding: "2rem",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Signing you in...</div>
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
