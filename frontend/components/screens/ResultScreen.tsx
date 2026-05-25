"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { LABELS } from "@/types";

const AUTO_RESET_S = 60;

export function ResultScreen() {
  const { language, generatedImage, goTo, resetSession } = useSessionStore();
  const t = LABELS[language];

  const [countdown, setCountdown] = useState(AUTO_RESET_S);

  useEffect(() => {
    if (!generatedImage) { goTo("camera"); return; }

    const tick = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(tick); resetSession(); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [generatedImage, goTo, resetSession]);

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-avatar.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(generatedImage, "_blank");
    }
  };

  if (!generatedImage) return null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Generated image — full screen, fade in */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={generatedImage}
          alt="Your AI Avatar"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />

      {/* Top bar */}
      <motion.div
        className="absolute top-0 inset-x-0 z-20 pt-safe pt-8 px-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">AI Kiosk</p>
          <p className="text-white text-lg font-light tracking-wider mt-0.5">{t.resultTitle}</p>
        </div>
        <div className="text-right bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
          <p className="text-white/30 text-[10px] tracking-widest uppercase">{t.autoReset}</p>
          <p className="text-yellow-400/80 text-xl font-thin tabular-nums">{countdown}s</p>
        </div>
      </motion.div>

      {/* Bottom controls */}
      <motion.div
        className="absolute bottom-0 inset-x-0 z-20 pb-safe pb-10 px-6 flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => goTo("camera")}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-5 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-sm text-white/70 text-sm tracking-widest uppercase font-light"
        >
          {t.retake}
        </motion.button>

        <motion.button
          onClick={handleDownload}
          whileTap={{ scale: 0.97 }}
          className="flex-[1.4] py-5 rounded-2xl bg-yellow-400 text-black font-semibold text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(250,204,21,0.35)]"
        >
          {t.download}
        </motion.button>

        <motion.button
          onClick={() => goTo("payment")}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm text-white/80 text-sm tracking-widest uppercase font-light"
        >
          {t.continueBtn}
        </motion.button>
      </motion.div>
    </div>
  );
}
