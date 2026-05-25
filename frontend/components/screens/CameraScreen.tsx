"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";
import { useSessionStore } from "@/store/useSessionStore";
import { LABELS } from "@/types";
import { BackButton } from "@/components/ui/BackButton";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Tiny transparent 1×1 JPEG used as placeholder captured image in demo mode
const DEMO_CAPTURE_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAABCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKgAB/9k=";

export function CameraScreen() {
  const { language, selectedTemplate, captureImage, setConsent, consent, goTo } = useSessionStore();
  const t = LABELS[language];
  const { videoRef, isReady, error, capture } = useCamera();

  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(3);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up countdown tick if component unmounts mid-countdown
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    if (counting || !consent) return;
    setCounting(true);
    setCount(3);

    let n = 3;
    tickRef.current = setInterval(() => {
      n -= 1;
      setCount(n);
      if (n <= 0) {
        clearInterval(tickRef.current!);
        tickRef.current = null;
        setTimeout(() => {
          const img = capture();
          if (img) captureImage(img);
          setCounting(false);
        }, 80);
      }
    }, 1000);
  }, [counting, consent, capture, captureImage]);

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      onClick={!counting && isReady && consent ? startCountdown : undefined}
    >
      {/* Live camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/50 z-10" />

      {/* Camera loading */}
      {!isReady && !error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
          <div
            className="w-12 h-12 rounded-full border-2 border-white/20 border-t-yellow-400"
            style={{ animation: "spin 1s linear infinite", willChange: "transform" }}
          />
        </div>
      )}

      {/* Camera error */}
      {error && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30 gap-6 text-center px-8">
          <p className="text-white/60 text-lg">Camera unavailable</p>
          <p className="text-white/30 text-sm">{error}</p>
          {IS_DEMO && (
            <button
              onClick={() => captureImage(DEMO_CAPTURE_PLACEHOLDER)}
              className="px-10 py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-sm tracking-[0.2em] uppercase mt-2"
            >
              DEMO: Skip Camera
            </button>
          )}
        </div>
      )}

      {/* Demo mode badge */}
      {IS_DEMO && isReady && (
        <div className="absolute top-24 right-6 z-30 bg-yellow-400/15 border border-yellow-400/30 text-yellow-400/80 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full pointer-events-none">
          Demo
        </div>
      )}

      {/* Face alignment guide */}
      {isReady && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div
            className="rounded-full border border-white/20"
            style={{ width: "55vmin", height: "70vmin", maxWidth: 300, maxHeight: 380, marginTop: "-12%", animation: "fade-pulse 3s ease-in-out infinite", willChange: "opacity" }}
          />
        </div>
      )}

      {/* Top bar */}
      {isReady && (
        <div className="absolute top-0 inset-x-0 z-30 pt-safe pt-8 px-6 flex items-start justify-between">
          <BackButton
            onClick={() => goTo("template")}
            label={t.changeTemplate}
            className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
          />

          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-500"
                style={{ animation: "blink 1.2s ease-in-out infinite", willChange: "opacity" }}
              />
              <span className="text-white/80 text-xs tracking-widest uppercase">{t.live}</span>
            </div>
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white/60 text-xs tracking-widest">4K</span>
            </div>
          </div>
        </div>
      )}

      {/* Template indicator */}
      {selectedTemplate && isReady && (
        <motion.div
          className="absolute top-24 left-6 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
            <p className="text-white/30 text-[10px] tracking-widest uppercase">Template</p>
            <p className="text-white/80 text-sm font-light">{selectedTemplate.title}</p>
          </div>
        </motion.div>
      )}

      {/* Position label */}
      {isReady && !counting && (
        <motion.div
          className="absolute top-0 inset-x-0 z-20 flex flex-col items-center pt-safe pt-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* spacer for top bar */}
          <div className="h-16" />
          <p className="text-white text-xl font-light tracking-wider">{t.positionYourself}</p>
          <p className="text-white/40 text-sm tracking-wider mt-1">{t.faceCenter}</p>
        </motion.div>
      )}

      {/* Bottom controls */}
      {isReady && !counting && (
        <motion.div
          className="absolute bottom-0 inset-x-0 z-30 pb-safe pb-10 px-6 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Consent */}
          <button
            className="flex items-center gap-3 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setConsent(!consent); }}
          >
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                consent ? "border-yellow-400 bg-yellow-400" : "border-white/30 bg-transparent"
              }`}
            >
              {consent && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-white/50 text-sm text-left max-w-xs">{t.consent}</span>
          </button>

          {/* Hint */}
          <p className="text-white/30 text-xs tracking-widest uppercase">
            {consent ? t.tapCapture : "Check consent to enable capture"}
          </p>

          {/* Capture button */}
          <motion.button
            disabled={!consent}
            onClick={(e) => { e.stopPropagation(); startCountdown(); }}
            whileTap={consent ? { scale: 0.95 } : {}}
            className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all ${
              consent
                ? "border-white/60 bg-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                : "border-white/15 bg-white/3 cursor-not-allowed"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full transition-all ${
                consent ? "bg-white/90" : "bg-white/20"
              }`}
            />
          </motion.button>
        </motion.div>
      )}

      {/* Countdown overlay */}
      <AnimatePresence>
        {counting && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                className="text-white font-thin select-none"
                style={{ fontSize: "clamp(160px, 32vw, 320px)", lineHeight: 1 }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
            <p className="text-white/40 text-sm tracking-[0.4em] uppercase mt-6">Get Ready</p>
            <motion.div
              key={`ring-${count}`}
              className="absolute w-64 h-64 rounded-full border border-yellow-400/20 pointer-events-none"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
