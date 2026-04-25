"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";

const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Custom Itineraries",
    description:
      "Every trip is crafted from scratch. No cookie-cutter packages. Tell me where you want to go, and I'll design the perfect journey.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
        <path d="M16 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2" />
      </svg>
    ),
    title: "Flight & Hotel Bookings",
    description:
      "Best deals on flights and handpicked hotels. I negotiate directly with properties to get you premium stays at honest prices.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "24/7 WhatsApp Support",
    description:
      "From the moment you book to the moment you return home, I'm one message away. Real-time support, real human care.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Group & Family Packages",
    description:
      "Honeymoon getaways, family vacations, corporate retreats, friend trips. Every group size gets special attention.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Visa Assistance",
    description:
      "International trip? I handle the paperwork. Visa documentation, travel insurance, forex — everything sorted before you fly.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Transparent Pricing",
    description:
      "No hidden charges, no surprise costs. You'll see the full breakdown before you pay a single rupee. UPI & bank transfer accepted.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{
        padding: "var(--section-padding) 0",
        position: "relative",
      }}
    >
      {/* Background Accent */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200, 149, 108, 0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              className="golden-line"
              style={{ margin: "0 auto 1.5rem" }}
            />
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                marginBottom: "1rem",
              }}
            >
              What I Offer
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              Everything You Need,{" "}
              <span className="text-gradient-gold">One Person Away</span>
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              No apps, no bots, no waiting on hold. Just a real human who
              genuinely cares about making your trip unforgettable.
            </p>
          </div>
        </Reveal>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {services.map((service, i) => (
            <Reveal key={i} delay={i * 0.1} direction="up">
              <div
                className="glass-card"
                style={{
                  padding: "2.5rem",
                  cursor: "default",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.2)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(200, 149, 108, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(200, 149, 108, 0.08)",
                    border: "1px solid rgba(200, 149, 108, 0.1)",
                    color: "var(--color-primary-light)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {service.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.375rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.875rem",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
