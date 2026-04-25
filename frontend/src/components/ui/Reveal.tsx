"use client";

import React from "react";
import { useInView } from "@/hooks/useInView";

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
}: RevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const transforms: Record<string, string> = {
    up: "translateY(60px)",
    down: "translateY(-60px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
    scale: "scale(0.9)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translate(0) scale(1)" : transforms[direction],
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
