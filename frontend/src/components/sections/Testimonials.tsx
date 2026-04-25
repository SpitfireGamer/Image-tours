"use client";

import React, { useState, useEffect, useCallback } from "react";
import Reveal from "@/components/ui/Reveal";

const testimonials = [
  {
    name: "Priya & Arjun Sharma",
    location: "Honeymoon — Goa",
    text: "We had the most magical honeymoon thanks to Image Tours. Every detail was taken care of — from the candlelight dinner on the beach to the private boat ride. Truly unforgettable!",
    rating: 5,
  },
  {
    name: "Rajesh Mehta",
    location: "Family Trip — Kerala",
    text: "Took my parents on their first ever houseboat stay. The way everything was organized, from pickup to drop — my dad said it was the best trip of his life. That means everything.",
    rating: 5,
  },
  {
    name: "Sneha & Friends",
    location: "Girls Trip — Manali",
    text: "Planning a trip with 8 girls is chaos. But one WhatsApp message to Image Tours and everything was sorted. The hotel was gorgeous, the snow activities were perfect. 10/10!",
    rating: 5,
  },
  {
    name: "Vikram Patel",
    location: "Solo Trip — Kashmir",
    text: "I was nervous about traveling solo to Kashmir. But the itinerary was so well planned and the local contacts so reliable, I felt safe and pampered the entire time. Will book again!",
    rating: 5,
  },
  {
    name: "The Gupta Family",
    location: "Family Reunion — Rajasthan",
    text: "12 family members, 3 generations, 7 days in Rajasthan. The logistics should have been a nightmare but Image Tours made it seamless. Heritage hotels, private buses, everything perfect.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, next]);

  return (
    <section
      id="testimonials"
      style={{
        padding: "var(--section-padding) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
              Real Stories
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              What Travelers{" "}
              <span className="text-gradient-gold">Say About Us</span>
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Don&apos;t take my word for it — here&apos;s what people who traveled with
              me have to say.
            </p>
          </div>
        </Reveal>

        {/* Testimonial Card */}
        <Reveal>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              position: "relative",
            }}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div
              className="glass-card"
              style={{
                padding: "3rem 3.5rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Quote Icon */}
              <div
                style={{
                  position: "absolute",
                  top: "-1.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, var(--color-gold) 100%)",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="var(--bg-primary)"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.25rem",
                  marginBottom: "1.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {Array.from({ length: testimonials[current].rating }).map(
                  (_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="var(--color-gold)"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )
                )}
              </div>

              {/* Text */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  color: "var(--text-primary)",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  minHeight: "100px",
                }}
              >
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--color-primary-light)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {testimonials[current].name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "0.8125rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {testimonials[current].location}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(200, 149, 108, 0.08)",
                  border: "1px solid rgba(200, 149, 108, 0.15)",
                  cursor: "pointer",
                  color: "var(--color-primary-light)",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dots */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: i === current ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      border: "none",
                      background:
                        i === current
                          ? "linear-gradient(90deg, var(--color-primary), var(--color-gold))"
                          : "rgba(200, 149, 108, 0.2)",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next testimonial"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(200, 149, 108, 0.08)",
                  border: "1px solid rgba(200, 149, 108, 0.15)",
                  cursor: "pointer",
                  color: "var(--color-primary-light)",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
