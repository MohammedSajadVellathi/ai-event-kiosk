"use client";

import { motion } from "framer-motion";

// AnimatedGrid uses only static divs; motion is kept for CornerBracket below.
export function AnimatedGrid() {
  return (
    <>
      {/* Static dot grid — no animation needed */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none opacity-50"
        style={{ background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.4), transparent)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.4), transparent)" }}
      />
    </>
  );
}

interface CornerBracketProps {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
  className?: string;
}

export function CornerBracket({ position, size = 44, className = "" }: CornerBracketProps) {
  const posMap = {
    tl: "top-5 left-5",
    tr: "top-5 right-5",
    bl: "bottom-5 left-5",
    br: "bottom-5 right-5",
  };

  const rotateMap = { tl: 0, tr: 90, br: 180, bl: 270 };
  const deg = rotateMap[position];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`absolute ${posMap[position]} pointer-events-none ${className}`}
      style={{ transform: `rotate(${deg}deg)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <path
        d={`M${size} 2 L2 2 L2 ${size}`}
        fill="none"
        stroke="rgba(250,204,21,0.5)"
        strokeWidth="1.5"
      />
    </motion.svg>
  );
}
