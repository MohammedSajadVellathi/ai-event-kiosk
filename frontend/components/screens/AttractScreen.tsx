"use client";

import { motion } from "framer-motion";
import { CornerBracket } from "@/components/ui/AnimatedGrid";
import { useSessionStore } from "@/store/useSessionStore";
import { LABELS } from "@/types";

export function AttractScreen() {
  const { startSession, setLanguage, language } = useSessionStore();
  const t = LABELS[language];

  return (
    <div
      className="relative w-full h-full bg-black flex flex-col items-center justify-between overflow-hidden cursor-pointer select-none"
      onClick={startSession}
    >
      {/* Static dot grid — no animation, no CPU cost */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Language toggle */}
      <div className="absolute top-8 right-16 z-20 flex gap-1">
        {(["en", "hi"] as const).map((lang) => (
          <button
            key={lang}
            onClick={(e) => {
              e.stopPropagation();
              setLanguage(lang);
            }}
            className={`px-3 py-1 rounded-full text-xs tracking-widest uppercase transition-all ${
              language === lang
                ? "bg-yellow-400 text-black font-semibold"
                : "bg-white/5 text-white/40 border border-white/10"
            }`}
          >
            {lang === "en" ? "EN" : "हिं"}
          </button>
        ))}
      </div>

      {/* CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center gap-12 px-8 z-10">
        {/* Hero text — one-shot animation, not infinite */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-white/30 text-sm tracking-[0.4em] uppercase font-light">
            Powered by AI
          </p>
          <h1
            className="text-white font-thin tracking-[0.25em] uppercase"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 1 }}
          >
            {t.magicAvatar}
          </h1>
          <p className="text-yellow-400 text-lg font-light tracking-[0.4em] uppercase">
            {t.aiKiosk}
          </p>
        </motion.div>

        {/* Selfie → Avatar — one-shot, no infinite scale pulses */}
        <motion.div
          className="flex items-center gap-6 sm:gap-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-60">
              <circle cx="20" cy="14" r="8" stroke="white" strokeWidth="1.5" />
              <path d="M6 36C6 28.268 12.268 22 20 22C27.732 22 34 28.268 34 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Arrow — CSS bounce, compositor-only */}
          <div
            style={{ animation: "arrow-bounce 2.2s ease-in-out infinite", willChange: "transform" }}
            className="flex flex-col items-center gap-1"
          >
            <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
              <path d="M0 8H28M28 8L22 2M28 8L22 14" stroke="rgba(250,204,21,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-white/20 text-[10px] tracking-widest uppercase">AI</p>
          </div>

          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-yellow-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.15)]"
            style={{ background: "radial-gradient(circle, rgba(250,204,21,0.12), rgba(0,0,0,0))" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-80">
              <polygon points="20,3 23,14 35,14 26,21 29,33 20,26 11,33 14,21 5,14 17,14" stroke="rgba(250,204,21,0.9)" strokeWidth="1.5" fill="rgba(250,204,21,0.15)" />
            </svg>
          </div>
        </motion.div>

        {/* CTA — CSS blink, compositor-only */}
        <div
          className="flex flex-col items-center gap-5"
          style={{ animation: "cta-blink 3s ease-in-out infinite", willChange: "opacity" }}
        >
          <button className="bg-yellow-400 text-black font-semibold text-base tracking-[0.2em] uppercase px-14 py-5 rounded-full shadow-[0_0_40px_rgba(250,204,21,0.35)] pointer-events-none">
            {t.tapToStart}
          </button>
          <p className="text-white/25 text-xs tracking-[0.3em] uppercase">
            Touch anywhere to begin
          </p>
        </div>

        {/* Single pulse ring — CSS animation, no JS */}
        <div
          className="absolute w-64 h-64 rounded-full border border-yellow-400/10 pointer-events-none"
          style={{ animation: "ring-pulse 3s ease-out infinite", willChange: "transform, opacity" }}
        />
      </div>

      {/* Footer */}
      <motion.div
        className="relative z-10 pb-safe pb-8 flex items-center gap-6 sm:gap-10 text-white/30 text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {t.instantDelivery}
        </span>
        <span className="w-px h-3 bg-white/15" />
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          {t.printAvailable}
        </span>
      </motion.div>
    </div>
  );
}
