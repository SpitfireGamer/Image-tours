"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

const heroSlides = [
  {
    image: "/images/hero-tajmahal.png",
    title: "Discover India's",
    highlight: "Timeless Beauty",
    subtitle: "Handcrafted journeys to the world's most breathtaking destinations",
  },
  {
    image: "/images/destination-kashmir.png",
    title: "Paradise on",
    highlight: "Earth Awaits",
    subtitle: "From serene lakes to snow-capped peaks — experiences money can't buy",
  },
  {
    image: "/images/destination-goa.png",
    title: "Your Dream",
    highlight: "Getaway Starts Here",
    subtitle: "Beach escapes, mountain retreats, and cultural immersions tailored for you",
  },
];

const stats = [
  { value: "500+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "4.9★", label: "Rating" },
  { value: "24/7", label: "Support" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = heroSlides[current];

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Images */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.1)",
            transition: "opacity 1.5s ease, transform 8s ease",
          }}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.5) 40%, rgba(10,10,15,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Gradient Accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(180deg, transparent 0%, var(--bg-primary) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "8rem",
          paddingBottom: "6rem",
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              background: "rgba(200, 149, 108, 0.1)",
              border: "1px solid rgba(200, 149, 108, 0.2)",
              borderRadius: "2rem",
              marginBottom: "2rem",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#25d366" }} />
            <span
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-primary-light)",
              }}
            >
              Your Personal Travel Concierge
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(40px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}
          >
            {slide.title}
            <br />
            <span className="text-gradient-gold">{slide.highlight}</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: "550px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "4rem",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
            }}
          >
            <a
              href="https://wa.me/917875132513?text=Hi%2C%20I%20want%20to%20plan%20a%20trip!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ fontSize: "1rem", padding: "1.125rem 2.25rem" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Plan My Trip</span>
            </a>
            <a href="#destinations" className="btn-secondary">
              <span>Explore Destinations</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
              maxWidth: "500px",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s",
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-primary-light)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div
          style={{
            position: "absolute",
            right: "clamp(1.25rem, 4vw, 2.5rem)",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? "3px" : "3px",
                height: i === current ? "40px" : "20px",
                borderRadius: "2px",
                border: "none",
                background: i === current
                  ? "linear-gradient(180deg, var(--color-primary), var(--color-gold))"
                  : "rgba(200, 149, 108, 0.2)",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
