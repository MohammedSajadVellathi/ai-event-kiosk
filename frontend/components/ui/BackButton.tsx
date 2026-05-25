"use client";

import { motion } from "framer-motion";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ onClick, label = "Back", className = "" }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 text-white/50 hover:text-white/80 text-sm tracking-widest uppercase transition-colors ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </motion.button>
  );
}
