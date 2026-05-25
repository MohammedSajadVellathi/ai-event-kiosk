"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { generatePortrait } from "@/services/api";
import { LABELS } from "@/types";
import { StageProgress } from "@/components/ui/StageProgress";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";

// Stage timer is visual only — real progress comes from the API response.
const STAGE_DURATIONS_MS = [3000, 8000, 14000, 6000]; // upload, face, template, finalize
const MAX_RETRIES = 1;
const WATCHDOG_MS = 90_000; // abort fetch if RunPod goes silent for 90s

export function ProcessingScreen() {
  const { language, capturedImage, selectedTemplate, setGeneratedImage, goTo } = useSessionStore();
  const t = LABELS[language];

  const stages = [
    t.uploadingStage,
    t.faceProcessingStage,
    t.applyingTemplateStage,
    t.finalizingStage,
  ];

  const [stageIndex, setStageIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!capturedImage) { goTo("camera"); return; }

    // One AbortController per attempt — aborted on unmount OR 90s watchdog
    const controller = new AbortController();
    const watchdog = setTimeout(() => controller.abort(), WATCHDOG_MS);
    let stageTimer: ReturnType<typeof setTimeout>;

    async function run() {
      setFailed(false);
      setStageIndex(0);

      let s = 0;
      const advanceStage = () => {
        if (controller.signal.aborted || s >= stages.length - 1) return;
        s++;
        setStageIndex(s);
        stageTimer = setTimeout(advanceStage, STAGE_DURATIONS_MS[s] ?? 1500);
      };
      stageTimer = setTimeout(advanceStage, STAGE_DURATIONS_MS[0]);

      try {
        const result = await generatePortrait(capturedImage!, selectedTemplate?.id, controller.signal);
        clearTimeout(stageTimer);
        clearTimeout(watchdog);
        setStageIndex(stages.length - 1);
        setTimeout(() => {
          if (!controller.signal.aborted) setGeneratedImage(result.imageUrl);
        }, 600);
      } catch (err) {
        clearTimeout(stageTimer);
        clearTimeout(watchdog);

        // Aborted = watchdog fired or user left — don't show error, just stop
        if (controller.signal.aborted) {
          setErrMsg("Generation timed out. RunPod may be busy — please try again.");
          setFailed(true);
          return;
        }

        const msg = err instanceof Error ? err.message : "Request failed";
        if (attempt < MAX_RETRIES) {
          setTimeout(() => setAttempt((a) => a + 1), 2000);
        } else {
          setErrMsg(msg);
          setFailed(true);
        }
      }
    }

    run();

    // Cleanup: abort the in-flight fetch immediately when user navigates away
    return () => {
      controller.abort();
      clearTimeout(stageTimer!);
      clearTimeout(watchdog);
    };
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatedGrid />

      {failed ? (
        <motion.div
          className="relative z-10 flex flex-col items-center gap-8 px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-full border border-red-500/30 flex items-center justify-center">
            <span className="text-red-400 text-3xl font-thin">!</span>
          </div>
          <div className="space-y-2">
            <p className="text-white text-2xl font-light tracking-wide">{t.retryError}</p>
            <p className="text-white/40 text-sm">{errMsg || t.retryErrorSub}</p>
          </div>
          <button
            onClick={() => goTo("camera")}
            className="px-10 py-4 rounded-2xl border border-white/20 bg-white/5 text-white text-sm tracking-widest uppercase font-light"
          >
            {t.tryAgain}
          </button>
        </motion.div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-12 px-8 w-full max-w-sm">
          {/* Orb — CSS animations, zero JS thread cost */}
          <div className="relative w-32 h-32">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, rgba(250,204,21,0.8), rgba(251,146,60,0.6), rgba(250,204,21,0.8))",
                animation: "spin 2.5s linear infinite",
              }}
            />
            <div className="absolute inset-[3px] rounded-full bg-black" />
            <div
              className="absolute inset-5 rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 40%, rgba(250,204,21,0.3), transparent)",
                animation: "orb-pulse 2.5s ease-in-out infinite",
              }}
            />
          </div>

          <div className="text-center space-y-3">
            <p
              className="text-white text-2xl font-light tracking-wide"
              style={{ animation: "fade-pulse 2.5s ease-in-out infinite" }}
            >
              {t.processingTitle}
            </p>
            <p className="text-white/30 text-sm tracking-widest">{t.processingSubtitle}</p>
          </div>

          <StageProgress stages={stages} currentIndex={stageIndex} />

          {attempt > 0 && (
            <p className="text-white/30 text-xs tracking-widest">
              Retrying… ({attempt}/{MAX_RETRIES})
            </p>
          )}
        </div>
      )}
    </div>
  );
}
