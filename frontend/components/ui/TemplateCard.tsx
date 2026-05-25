"use client";

import { motion } from "framer-motion";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  selected: boolean;
  onClick: () => void;
}

export function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
        selected
          ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.25)]"
          : "border-white/8 hover:border-white/20"
      }`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${template.colors[0]}, ${template.colors[1]})`,
        }}
      />

      {/* Face zone oval */}
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 rounded-full border border-white/15"
        style={{
          width: "52%",
          height: "42%",
          background: `radial-gradient(ellipse, ${template.accentColor}18 0%, transparent 70%)`,
        }}
      />

      {/* Accent lines */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-30"
        style={{ background: `linear-gradient(90deg, transparent, ${template.accentColor}, transparent)` }}
      />

      {/* Bottom info */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <p className="text-white font-light text-sm tracking-wide leading-tight">{template.title}</p>
      </div>

      {/* Premium badge */}
      {template.premium && (
        <div className="absolute top-3 right-3 bg-yellow-400/90 text-black text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full">
          Premium
        </div>
      )}

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
