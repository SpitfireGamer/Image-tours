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
      
      setDebugInfo(`Fetching from: ${API_URL}/api/v1/auth/me...`);
      
      fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const text = await res.text();
          setDebugInfo(`Response status: ${res.status}. Body: ${text.substring(0, 100)}`);
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(`Failed to parse JSON: ${text.substring(0, 50)}`);
          }
        })
        .then((data) => {
          if (data.success) {
            setDebugInfo(`Success! Logging in user: ${JSON.stringify(data.data?.user || data.data)}`);
            login(token, data.data?.user || data.data);
          } else {
            setDebugInfo(`API Error: ${JSON.stringify(data)}`);
            // router.push("/login"); // Commented out to prevent redirect so we can read the error
          }
        })
        .catch((err) => {
          setDebugInfo(`Fetch Catch Error: ${err.message}`);
          // router.push("/login");
        });
    } else {
      setDebugInfo("No token or refreshToken found in URL");
    }
  }, [router, searchParams, login]); // Included login to avoid stale closures, though it comes from context.

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
      {debugInfo && (
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "rgba(255,0,0,0.1)",
          border: "1px solid rgba(255,0,0,0.3)",
          color: "#ff8888",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          maxWidth: "800px",
          wordWrap: "break-word"
        }}>
          <strong>Debug Info:</strong><br />
          {debugInfo}
          <br /><br />
          <button 
            onClick={() => router.push("/")}
            style={{
              padding: "8px 16px",
              background: "#d4a853",
              color: "#0a0a0f",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px"
            }}
          >
            Force Go To Home
          </button>
        </div>
      )}
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
