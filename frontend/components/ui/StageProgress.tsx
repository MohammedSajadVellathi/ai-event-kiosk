"use client";

import { motion } from "framer-motion";

interface StageProgressProps {
  stages: string[];
  currentIndex: number;
}

export function StageProgress({ stages, currentIndex }: StageProgressProps) {
  return (
    <div className="flex flex-col gap-5 w-full max-w-xs">
      {stages.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={stage} className="flex items-center gap-4">
            {/* Indicator */}
            <div className="relative flex-shrink-0 w-8 h-8">
              {done ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              ) : active ? (
                <div
                  className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent"
                  style={{ animation: "spin 1s linear infinite", willChange: "transform" }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-white/15" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1">
              <p
                className={`text-sm tracking-wider transition-colors ${
                  active ? "text-yellow-400" : done ? "text-white/60" : "text-white/20"
                }`}
              >
                {stage}
              </p>
              {active && (
                <motion.div
                  className="mt-1.5 h-0.5 rounded-full bg-white/10 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                >
                  <div
                    className="h-full bg-yellow-400/60 rounded-full"
                    style={{ animation: "shimmer 1.5s ease-in-out infinite", willChange: "transform" }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
