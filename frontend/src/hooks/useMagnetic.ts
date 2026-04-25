"use client";

import { useCallback, useRef, type RefObject, type MouseEvent } from "react";

interface UseMagneticOptions {
  strength?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {}
): {
  ref: RefObject<T | null>;
  onMouseMove: (e: MouseEvent<T>) => void;
  onMouseLeave: () => void;
} {
  const { strength = 0.3 } = options;
  const ref = useRef<T | null>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 500);
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
