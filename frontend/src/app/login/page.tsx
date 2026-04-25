"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type AuthMode = "login" | "register" | "verify-otp" | "forgot-password" | "reset-password";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login: authLogin } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animated background
  const [bgOffset, setBgOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgOffset((prev) => (prev + 0.05) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Already logged in? Go to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let endpoint = "";
      let body: Record<string, string> = {};

      switch (mode) {
        case "register":
          endpoint = "/api/v1/auth/register";
          body = { name, email, phone, password };
          break;
        case "login":
          endpoint = "/api/v1/auth/login";
          body = { email, password };
          break;
        case "verify-otp":
          endpoint = "/api/v1/auth/verify-otp";
          body = { email, otp };
          break;
        case "forgot-password":
          endpoint = "/api/v1/auth/forgot-password";
          body = { email };
          break;
        case "reset-password":
          endpoint = "/api/v1/auth/reset-password";
          body = { email, otp, newPassword };
          break;
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        // If email not verified, switch to OTP mode
        if (data.error?.code === "EMAIL_NOT_VERIFIED") {
          setMode("verify-otp");
          setSuccess("A verification code has been sent to your email.");
          return;
        }
        
        // Show detailed validation errors if they exist
        if (data.error?.details && Array.isArray(data.error.details) && data.error.details.length > 0) {
          throw new Error(data.error.details[0].message); // Show the first specific validation error
        }
        
        throw new Error(data.error?.message || "Something went wrong");
      }

      switch (mode) {
        case "register":
          setSuccess("Account created! Check your email for the verification code.");
          setMode("verify-otp");
          break;
        case "login":
          localStorage.setItem("refreshToken", data.data.refreshToken);
          authLogin(data.data.token, data.data.user);
          break;
        case "verify-otp":
          localStorage.setItem("refreshToken", data.data.refreshToken);
          authLogin(data.data.token, data.data.user);
          break;
        case "forgot-password":
          setSuccess("If an account exists, you'll receive a reset code.");
          setMode("reset-password");
          break;
        case "reset-password":
          setSuccess("Password reset! You can now login.");
          setMode("login");
          break;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
    }}>
      {/* ── Background Image ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}>
        <Image
          src="/images/login-bg.png"
          alt="India Gate at twilight"
          fill
          style={{ objectFit: "cover", objectPosition: `${50 + bgOffset}% center` }}
          priority
          quality={90}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.75) 40%, rgba(10,10,15,0.5) 100%)",
        }} />
      </div>

      {/* ── Left: Branding Panel ── */}
      <div style={{
        flex: "1 1 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 5rem)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: 520 }}>
          {/* Logo */}
          <div style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            <span style={{
              background: "linear-gradient(135deg, #dbb08e 0%, #d4a853 50%, #c8956c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Image</span>
            {" "}
            <span style={{ color: "#f5f0eb" }}>Tours</span>
          </div>

          <div style={{
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, #c8956c, #d4a853)",
            borderRadius: 1,
            marginBottom: 24,
          }} />

          <p style={{
            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            color: "#f5f0eb",
            lineHeight: 1.3,
            marginBottom: 16,
          }}>
            Your Personal Travel{" "}
            <span style={{ color: "#d4a853", fontStyle: "italic" }}>Concierge</span>
          </p>

          <p style={{
            color: "#a8a0b0",
            fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
            lineHeight: 1.8,
            maxWidth: 400,
          }}>
            Handcrafted journeys across India. No bots, no
            generic packages — just a real person planning your
            perfect trip with transparent pricing and 24/7 WhatsApp support.
          </p>

          {/* Trust indicators */}
          <div style={{
            display: "flex",
            gap: "clamp(1.5rem, 3vw, 3rem)",
            marginTop: "clamp(2rem, 4vw, 3rem)",
          }}>
            {[
              { num: "500+", label: "Happy Travelers" },
              { num: "50+", label: "Destinations" },
              { num: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
                  color: "#d4a853",
                }}>{stat.num}</div>
                <div style={{
                  fontSize: 11,
                  color: "#706880",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div style={{
        flex: "1 1 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.5rem, 3vw, 3rem)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(20, 20, 30, 0.7)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: "1px solid rgba(200, 149, 108, 0.1)",
          borderRadius: 20,
          padding: "clamp(2rem, 4vw, 2.5rem)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        }}>
          {/* Tab */}
          <h2 style={{
            fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            fontWeight: 600,
            color: "#f5f0eb",
            marginBottom: 8,
          }}>
            {mode === "login" && "Welcome Back"}
            {mode === "register" && "Create Account"}
            {mode === "verify-otp" && "Verify Email"}
            {mode === "forgot-password" && "Reset Password"}
            {mode === "reset-password" && "New Password"}
          </h2>
          <p style={{ color: "#706880", fontSize: 14, marginBottom: 24 }}>
            {mode === "login" && "Sign in to manage your trips"}
            {mode === "register" && "Start planning your dream trip"}
            {mode === "verify-otp" && "Enter the 6-digit code sent to your email"}
            {mode === "forgot-password" && "We'll send a reset code to your email"}
            {mode === "reset-password" && "Enter the code and set a new password"}
          </p>

          {/* Error/Success */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "#86efac",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}>{success}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Name (register only) */}
            {mode === "register" && (
              <Input label="Full Name" type="text" value={name} onChange={setName} placeholder="Your full name" required />
            )}

            {/* Email (all except OTP) */}
            {(mode !== "verify-otp" || !email) && mode !== "reset-password" && (
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            )}

            {/* Phone (register only) */}
            {mode === "register" && (
              <Input label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+91XXXXXXXXXX" required />
            )}

            {/* Password */}
            {(mode === "login" || mode === "register") && (
              <div style={{ position: "relative" }}>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder={mode === "register" ? "Min 8 chars, 1 upper, 1 number, 1 special" : "Enter password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: 34, background: "none",
                    border: "none", color: "#706880", cursor: "pointer", fontSize: 13,
                  }}
                >{showPassword ? "Hide" : "Show"}</button>
              </div>
            )}

            {/* OTP */}
            {(mode === "verify-otp" || mode === "reset-password") && (
              <Input label="Verification Code" type="text" value={otp} onChange={setOtp} placeholder="000000" maxLength={6} required />
            )}

            {/* New password */}
            {mode === "reset-password" && (
              <Input label="New Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Min 8 chars, 1 upper, 1 number, 1 special" required />
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: loading
                  ? "rgba(200, 149, 108, 0.3)"
                  : "linear-gradient(135deg, #c8956c 0%, #d4a853 100%)",
                color: "#0a0a0f",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.03em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                marginTop: 4,
                fontFamily: "var(--font-accent, 'Outfit', sans-serif)",
              }}
            >
              {loading ? "Please wait..." : (
                mode === "login" ? "Sign In" :
                mode === "register" ? "Create Account" :
                mode === "verify-otp" ? "Verify Email" :
                mode === "forgot-password" ? "Send Reset Code" :
                "Reset Password"
              )}
            </button>
          </form>

          {/* Google OAuth */}
          {(mode === "login" || mode === "register") && (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "18px 0",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(200,149,108,0.12)" }} />
                <span style={{ color: "#706880", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(200,149,108,0.12)" }} />
              </div>

              <button
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(200,149,108,0.15)",
                  borderRadius: 10,
                  color: "#f5f0eb",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-body, 'Inter', sans-serif)",
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.target as HTMLElement).style.borderColor = "rgba(200,149,108,0.3)";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.target as HTMLElement).style.borderColor = "rgba(200,149,108,0.15)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Mode switchers */}
          <div style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            {mode === "login" && (
              <>
                <button
                  type="button"
                  onClick={() => { setMode("forgot-password"); setError(""); setSuccess(""); }}
                  style={linkStyle}
                >Forgot password?</button>
                <p style={{ color: "#706880", fontSize: 13 }}>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                    style={{ ...linkStyle, color: "#d4a853" }}
                  >Sign up</button>
                </p>
              </>
            )}
            {mode === "register" && (
              <p style={{ color: "#706880", fontSize: 13 }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                  style={{ ...linkStyle, color: "#d4a853" }}
                >Sign in</button>
              </p>
            )}
            {(mode === "verify-otp" || mode === "forgot-password" || mode === "reset-password") && (
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                style={linkStyle}
              >← Back to login</button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile responsive overlay */}
      <style jsx>{`
        @media (max-width: 768px) {
          div:first-child > div:nth-child(2) {
            display: none !important;
          }
          div:first-child > div:nth-child(3) {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Reusable input component ──
function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        color: "#a8a0b0",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(200,149,108,0.15)",
          borderRadius: 10,
          color: "#f5f0eb",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.3s ease",
          fontFamily: "var(--font-body, 'Inter', sans-serif)",
        }}
        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(200,149,108,0.4)"; }}
        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(200,149,108,0.15)"; }}
      />
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#a8a0b0",
  fontSize: 13,
  cursor: "pointer",
  textDecoration: "underline",
  textUnderlineOffset: 3,
  fontFamily: "inherit",
};
