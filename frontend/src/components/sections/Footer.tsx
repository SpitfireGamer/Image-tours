"use client";

import React from "react";

const footerLinks = {
  Destinations: [
    { label: "Goa", href: "#destinations" },
    { label: "Kerala", href: "#destinations" },
    { label: "Manali", href: "#destinations" },
    { label: "Kashmir", href: "#destinations" },
    { label: "Rajasthan", href: "#destinations" },
  ],
  Services: [
    { label: "Custom Itineraries", href: "#services" },
    { label: "Flight Booking", href: "#services" },
    { label: "Hotel Booking", href: "#services" },
    { label: "Visa Assistance", href: "#services" },
    { label: "Group Packages", href: "#services" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        padding: "4rem 0 2rem",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <a
              href="#home"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              <span className="text-gradient-gold">Image</span>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                  marginLeft: "0.35rem",
                }}
              >
                Tours
              </span>
            </a>
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "0.9375rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "320px",
                marginBottom: "1.5rem",
              }}
            >
              Your personal travel concierge. Handcrafted journeys, honest
              pricing, and 24/7 WhatsApp support. Let&apos;s create memories
              together.
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                {
                  label: "Instagram",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
                    </svg>
                  ),
                },
                {
                  label: "Twitter",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(200, 149, 108, 0.06)",
                    border: "1px solid rgba(200, 149, 108, 0.1)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(200, 149, 108, 0.12)";
                    e.currentTarget.style.color = "var(--color-primary-light)";
                    e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(200, 149, 108, 0.06)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.1)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-primary-light)",
                  marginBottom: "1.25rem",
                }}
              >
                {title}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link, i) => (
                  <li key={i} style={{ marginBottom: "0.625rem" }}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-glass)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "0.8125rem",
              color: "var(--text-tertiary)",
            }}
          >
            © {new Date().getFullYear()} Image Tours & Travel. All rights
            reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "0.8125rem",
              color: "var(--text-tertiary)",
            }}
          >
            Made with ❤️ in Saoner, Nagpur
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
