"use client";

import React from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: "var(--section-padding) 0",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Image Side */}
          <Reveal direction="left">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/5",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  border: "1px solid var(--border-glass)",
                }}
              >
                <Image
                  src="/images/agent-portrait.png"
                  alt="Your Travel Concierge"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Floating Card */}
              <div
                className="glass-card"
                style={{
                  position: "absolute",
                  bottom: "-2rem",
                  right: "-1.5rem",
                  padding: "1.5rem 2rem",
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--color-primary-light)",
                    lineHeight: 1,
                  }}
                >
                  5+
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginTop: "0.25rem",
                  }}
                >
                  Years of Trust
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text Side */}
          <div>
            <Reveal>
              <div className="golden-line" style={{ marginBottom: "1.5rem" }} />
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
                Meet Your Concierge
              </p>
              <h2
                className="section-title"
                style={{ marginBottom: "1.5rem" }}
              >
                A Real Person.{" "}
                <span className="text-gradient-gold">Real Care.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "1.0625rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                I&apos;m not a faceless agency with a call center. I&apos;m one person who
                genuinely loves travel and genuinely cares about making your trip
                perfect. When you message me, you talk to me — not a bot, not an
                intern.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "1.0625rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                Over the years, I&apos;ve helped hundreds of families, couples, and
                groups plan trips they still talk about. I handle everything — from
                finding the right flight to recommending the best local restaurants.
                Your only job is to pack your bags and show up.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  "Personalized Itineraries",
                  "No Hidden Costs",
                  "WhatsApp-First Support",
                  "Trusted by 500+ Travelers",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(200, 149, 108, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-primary-light)"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <a
                href="https://wa.me/917875132513?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>Let&apos;s Plan Together</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
