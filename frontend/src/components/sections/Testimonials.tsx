"use client";

import React, { useState, useEffect } from "react";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState<
    { name: string; rating: number; comment: string; date: string }[]
  >([]);

  // Load saved reviews from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("imageTours_reviews");
    if (saved) {
      try { setReviews(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleSubmitReview = () => {
    if (userRating === 0 || !userName.trim()) return;

    const newReview = {
      name: userName.trim(),
      rating: userRating,
      comment: userComment.trim(),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("imageTours_reviews", JSON.stringify(updated));
    setSubmitted(true);
    setUserRating(0);
    setUserName("");
    setUserComment("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const StarIcon = ({ filled, size = 18 }: { filled: boolean; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "var(--color-gold)" : "none"} stroke={filled ? "var(--color-gold)" : "rgba(200,149,108,0.3)"} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <section id="testimonials" style={{ padding: "var(--section-padding) 0", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="golden-line" style={{ margin: "0 auto 1.5rem" }} />
            <p style={{ fontFamily: "var(--font-accent)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: "1rem" }}>
              Your Voice Matters
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              Rate & Review{" "}
              <span className="text-gradient-gold">Your Experience</span>
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              We believe in transparency — real feedback from real travelers.
            </p>
          </div>
        </Reveal>

        {/* Stats Bar */}
        {reviews.length > 0 && (
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginBottom: "3rem", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary-light)" }}>{avgRating}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "0.25rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < Math.round(Number(avgRating))} size={14} />)}
                </div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Average Rating</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary-light)" }}>{reviews.length}</div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Total Reviews</div>
              </div>
            </div>
          </Reveal>
        )}

        <div style={{ display: "grid", gridTemplateColumns: reviews.length > 0 ? "1fr 1fr" : "1fr", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }} className="review-grid">
          {/* Rate Us Card */}
          <Reveal>
            <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "white", marginBottom: "0.5rem" }}>Rate Us</h3>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Share your experience with Image Tours</p>

              {/* Star Rating */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setUserRating(i + 1)} onMouseEnter={() => setHoveredStar(i + 1)} onMouseLeave={() => setHoveredStar(0)} style={{ cursor: "pointer", background: "none", border: "none", padding: "0.15rem", transition: "transform 0.2s", transform: (hoveredStar || userRating) >= i + 1 ? "scale(1.15)" : "scale(1)" }}>
                    <StarIcon filled={(hoveredStar || userRating) >= i + 1} size={32} />
                  </button>
                ))}
              </div>

              <input placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ width: "100%", padding: "0.7rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,149,108,0.15)", borderRadius: "0.5rem", color: "white", fontSize: "0.9rem", marginBottom: "0.75rem", outline: "none" }} />
              <textarea placeholder="Tell us about your experience (optional)" value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: "100%", padding: "0.7rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,149,108,0.15)", borderRadius: "0.5rem", color: "white", fontSize: "0.9rem", minHeight: "80px", resize: "vertical", marginBottom: "1rem", outline: "none" }} />

              <button onClick={handleSubmitReview} disabled={userRating === 0 || !userName.trim()} style={{ width: "100%", padding: "0.8rem", background: userRating > 0 && userName.trim() ? "linear-gradient(135deg, #c8956c, #d4a853)" : "rgba(200,149,108,0.15)", border: "none", borderRadius: "0.5rem", color: userRating > 0 && userName.trim() ? "#0a0a0f" : "var(--text-tertiary)", fontWeight: 700, cursor: userRating > 0 && userName.trim() ? "pointer" : "default", fontSize: "0.9rem", transition: "all 0.3s" }}>
                {submitted ? "✓ Thank You!" : "Submit Review"}
              </button>
            </div>
          </Reveal>

          {/* Recent Reviews */}
          {reviews.length > 0 && (
            <Reveal delay={0.15}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "420px", overflowY: "auto" }}>
                {reviews.slice(0, 6).map((r, i) => (
                  <div key={i} className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontFamily: "var(--font-accent)", fontWeight: 600, color: "var(--color-primary-light)", fontSize: "0.95rem" }}>{r.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{r.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
                      {Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} filled={j < r.rating} size={14} />)}
                    </div>
                    {r.comment && <p style={{ fontFamily: "var(--font-accent)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>&ldquo;{r.comment}&rdquo;</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .review-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
