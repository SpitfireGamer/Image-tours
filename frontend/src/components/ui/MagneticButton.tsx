"use client";

import React from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>({
    strength,
  });

  const content = (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ display: "inline-block" }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <button onClick={onClick} type="button">
          {children}
        </button>
      )}
    </div>
  );

  return content;
}
