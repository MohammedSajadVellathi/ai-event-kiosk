"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

const TIMEOUT_MS = 60_000;
const CHECK_INTERVAL_MS = 5_000;

// Steps where waiting is expected — don't reset on inactivity
const NO_TIMEOUT_STEPS = new Set(["attract", "processing"]);

export function useSessionTimeout() {
  const step = useSessionStore((s) => s.step);
  const resetSession = useSessionStore((s) => s.resetSession);

  useEffect(() => {
    if (NO_TIMEOUT_STEPS.has(step)) return;

    const interval = setInterval(() => {
      const { lastActivity } = useSessionStore.getState();
      if (Date.now() - lastActivity > TIMEOUT_MS) {
        resetSession();
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [step, resetSession]);
}
