"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Tell Me Your Dream",
    description:
      "Send me a WhatsApp message with your dates, destination ideas, budget, and group size. Even if you're unsure — I'll help you decide.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Get Your Custom Plan",
    description:
      "Within 24 hours, you'll receive a detailed itinerary with hotel options, activity suggestions, and a transparent price breakdown.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Confirm & Pay",
    description:
      "Happy with the plan? Confirm with a simple UPI payment or bank transfer. No hidden fees, no surprises — ever.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Travel & Enjoy",
    description:
      "Pack your bags and go! I handle all the logistics and stay on WhatsApp throughout your trip for any help you need.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      style={{
        padding: "var(--section-padding) 0",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="golden-line" style={{ margin: "0 auto 1.5rem" }} />
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
              How It Works
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              From Message to{" "}
              <span className="text-gradient-gold">Memory</span>
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Four simple steps. That&apos;s all it takes to turn your dream trip into
              reality.
            </p>
          </div>
        </Reveal>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            position: "relative",
          }}
          className="steps-grid"
        >
          {/* Connecting Line */}
          <div
            className="connecting-line"
            style={{
              position: "absolute",
              top: "55px",
              left: "calc(12.5% + 30px)",
              right: "calc(12.5% + 30px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--color-primary), var(--color-gold), var(--color-primary), transparent)",
              opacity: 0.3,
            }}
          />

          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.15} direction="up">
              <div style={{ textAlign: "center", position: "relative" }}>
                {/* Icon Circle */}
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    background: "rgba(200, 149, 108, 0.08)",
                    border: "1px solid rgba(200, 149, 108, 0.15)",
                    color: "var(--color-primary-light)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {step.icon}
                </div>

                {/* Number */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "var(--color-primary)",
                    marginBottom: "0.75rem",
                  }}
                >
                  STEP {step.number}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .connecting-line {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
