"use client";

import React, { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const destinations = [
  {
    image: "/images/destination-goa.png",
    name: "Goa",
    tagline: "Sun, Sand & Soul",
    duration: "3N / 4D",
    price: "₹8,999",
    highlights: ["Beach Parties", "Water Sports", "Heritage Churches"],
  },
  {
    image: "/images/destination-manali.png",
    name: "Manali",
    tagline: "Mountain Magic",
    duration: "4N / 5D",
    price: "₹12,499",
    highlights: ["Solang Valley", "Old Manali", "Rohtang Pass"],
  },
  {
    image: "/images/destination-kerala.png",
    name: "Kerala",
    tagline: "God's Own Country",
    duration: "5N / 6D",
    price: "₹15,999",
    highlights: ["Backwaters", "Houseboat Stay", "Munnar Tea Gardens"],
  },
  {
    image: "/images/destination-rajasthan.png",
    name: "Rajasthan",
    tagline: "Royal Heritage",
    duration: "6N / 7D",
    price: "₹18,999",
    highlights: ["Jaipur Forts", "Desert Safari", "Udaipur Lakes"],
  },
  {
    image: "/images/destination-kashmir.png",
    name: "Kashmir",
    tagline: "Paradise Found",
    duration: "5N / 6D",
    price: "₹16,499",
    highlights: ["Dal Lake", "Shikara Ride", "Gulmarg Gondola"],
  },
];

export default function Destinations() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="destinations"
      style={{
        padding: "var(--section-padding) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-15%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 168, 83, 0.03) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

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
              Top Destinations
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              Where Would You{" "}
              <span className="text-gradient-gold">Like to Go?</span>
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Popular packages handcrafted by me. Each one is flexible — tell me
              what you want changed, and I'll make it happen.
            </p>
          </div>
        </Reveal>

        {/* Destination Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "1.75rem",
          }}
        >
          {destinations.map((dest, i) => (
            <Reveal key={i} delay={i * 0.1} direction="up">
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hovered === i ? "translateY(-10px)" : "translateY(0)",
                  boxShadow:
                    hovered === i
                      ? "0 30px 80px rgba(200, 149, 108, 0.12)"
                      : "0 4px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    height: "260px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: hovered === i ? "scale(1.1)" : "scale(1)",
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.9) 100%)",
                    }}
                  />
                  {/* Price Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      padding: "0.375rem 0.875rem",
                      background: "rgba(10, 10, 15, 0.7)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(200, 149, 108, 0.15)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--color-gold-light)",
                      }}
                    >
                      From {dest.price}
                    </span>
                  </div>
                  {/* Duration */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "1.25rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.625rem",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "0.125rem",
                      }}
                    >
                      {dest.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "0.8125rem",
                        color: "var(--color-primary-light)",
                        fontWeight: 500,
                      }}
                    >
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-tertiary)"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "0.8125rem",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {dest.duration}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                    {dest.highlights.map((h, j) => (
                      <span
                        key={j}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.6875rem",
                          fontFamily: "var(--font-accent)",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          background: "rgba(200, 149, 108, 0.06)",
                          border: "1px solid rgba(200, 149, 108, 0.1)",
                          borderRadius: "1rem",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={`https://wa.me/917875132513?text=Hi%2C%20I'm%20interested%20in%20the%20${dest.name}%20package!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                      fontFamily: "var(--font-accent)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-primary-light)",
                      background: "rgba(200, 149, 108, 0.06)",
                      border: "1px solid rgba(200, 149, 108, 0.15)",
                      borderRadius: "0.625rem",
                      textDecoration: "none",
                      transition: "all 0.4s ease",
                      letterSpacing: "0.03em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(200, 149, 108, 0.12)";
                      e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(200, 149, 108, 0.06)";
                      e.currentTarget.style.borderColor = "rgba(200, 149, 108, 0.15)";
                    }}
                  >
                    Enquire Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
