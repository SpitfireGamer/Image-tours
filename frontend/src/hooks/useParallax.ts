"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useParallax<T extends HTMLElement = HTMLElement>(
  speed: number = 0.5
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const scrolled = window.scrollY;
        const offset = (rect.top + scrolled) * speed;
        element.style.transform = `translateY(${scrolled * speed - offset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return ref;
}
