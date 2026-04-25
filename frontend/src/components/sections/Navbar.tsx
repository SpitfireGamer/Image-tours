"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Services", href: "/#services" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { ref: logoRef, onMouseMove: logoMove, onMouseLeave: logoLeave } =
    useMagnetic<HTMLAnchorElement>({ strength: 0.2 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        background: scrolled
          ? "rgba(10, 10, 15, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(200, 149, 108, 0.08)"
          : "1px solid transparent",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link
          ref={logoRef as any}
          onMouseMove={logoMove as any}
          onMouseLeave={logoLeave as any}
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="text-gradient-gold">Image</span>
          <span style={{ color: "var(--text-secondary)", fontWeight: 400, marginLeft: "0.35rem" }}>
            Tours
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.25rem",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.label}
            </Link>
          ))}

          {/* Dashboard link in topbar for logged-in users */}
          {user && (
            <Link
              href="/dashboard"
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            >
              Dashboard
            </Link>
          )}

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/917875132513?text=Hi%2C%20I%20want%20to%20plan%20a%20trip!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ padding: "0.625rem 1.25rem", fontSize: "0.8125rem", borderRadius: "0.5rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* ─── Avatar Circle with Dropdown ─── */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label={user ? "User menu" : "Login"}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "2px solid",
                borderColor: dropdownOpen ? "#4d9fff" : "rgba(77, 159, 255, 0.35)",
                background: "rgba(10, 20, 40, 0.6)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                padding: 0,
                flexShrink: 0,
                boxShadow: dropdownOpen ? "0 0 16px rgba(77, 159, 255, 0.35)" : "none",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4d9fff";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(77, 159, 255, 0.35)";
              }}
              onMouseLeave={(e) => {
                if (!dropdownOpen) {
                  e.currentTarget.style.borderColor = "rgba(77, 159, 255, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <img
                src="/images/plane-logo.png"
                alt="Menu"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                minWidth: "220px",
                background: "rgba(18, 18, 22, 0.96)",
                backdropFilter: "blur(24px) saturate(1.8)",
                border: "1px solid rgba(200, 149, 108, 0.15)",
                borderRadius: "1rem",
                padding: "0.5rem",
                opacity: dropdownOpen ? 1 : 0,
                transform: dropdownOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
                pointerEvents: dropdownOpen ? "auto" : "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(200, 149, 108, 0.05)",
                zIndex: 9999,
              }}
            >
              {user ? (
                <>
                  {/* User Info Header */}
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(200, 149, 108, 0.1)",
                    marginBottom: "0.25rem",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.15rem",
                    }}>
                      {user.name}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                    }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Dashboard */}
                  <button
                    onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200, 149, 108, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span>Dashboard</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200, 149, 108, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Settings</span>
                  </button>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "rgba(200, 149, 108, 0.1)", margin: "0.25rem 0" }} />

                  {/* Logout */}
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="dropdown-item"
                    style={{ ...dropdownItemStyle, color: "#e05252" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(224, 82, 82, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Guest header */}
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(200, 149, 108, 0.1)",
                    marginBottom: "0.25rem",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--text-tertiary)",
                    }}>
                      Welcome, Traveller
                    </p>
                  </div>

                  {/* Login */}
                  <button
                    onClick={() => { setDropdownOpen(false); router.push("/login"); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200, 149, 108, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Client Login</span>
                  </button>

                  {/* Register */}
                  <button
                    onClick={() => { setDropdownOpen(false); router.push("/login"); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200, 149, 108, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>Create Account</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="mobile-controls">
          {/* Mobile Avatar */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label={user ? "User menu" : "Login"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "rgba(200, 149, 108, 0.35)",
              background: user
                ? "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))"
                : "rgba(200, 149, 108, 0.08)",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              padding: 0,
              flexShrink: 0,
            }}
            className="mobile-avatar"
          >
            {user ? (
              <span style={{
                fontFamily: "var(--font-accent)", fontSize: "0.75rem", fontWeight: 700, color: "white", lineHeight: 1,
              }}>
                {getInitials(user.name)}
              </span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M5.5 21c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: "none",
              flexDirection: "column",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <span style={{ display: "block", width: "24px", height: "2px", background: "var(--color-primary-light)", transition: "all 0.3s ease", transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", width: "24px", height: "2px", background: "var(--color-primary-light)", transition: "all 0.3s ease", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "24px", height: "2px", background: "var(--color-primary-light)", transition: "all 0.3s ease", transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(20px)",
          padding: mobileOpen ? "2rem" : "0 2rem",
          maxHeight: mobileOpen ? "500px" : "0",
          overflow: "hidden",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          borderBottom: mobileOpen ? "1px solid rgba(200, 149, 108, 0.08)" : "none",
        }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              padding: "0.875rem 0",
              fontFamily: "var(--font-accent)",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(200, 149, 108, 0.06)",
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.4s ease ${i * 0.05}s`,
            }}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 0",
                fontFamily: "var(--font-accent)",
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--color-primary)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(200, 149, 108, 0.06)",
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.875rem 0",
                fontFamily: "var(--font-accent)",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#e05252",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(200, 149, 108, 0.06)",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              padding: "0.875rem 0",
              fontFamily: "var(--font-accent)",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--color-primary)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(200, 149, 108, 0.06)",
            }}
          >
            Client Login
          </Link>
        )}
        <a
          href="https://wa.me/917875132513?text=Hi%2C%20I%20want%20to%20plan%20a%20trip!"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{ marginTop: "1.25rem", width: "100%", justifyContent: "center" }}
        >
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .mobile-avatar {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}

/* ── Shared dropdown item style ── */
const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  width: "100%",
  padding: "0.65rem 1rem",
  background: "transparent",
  border: "none",
  borderRadius: "0.6rem",
  cursor: "pointer",
  fontFamily: "var(--font-accent)",
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "var(--text-secondary)",
  textAlign: "left",
  transition: "background 0.2s ease",
};
