"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export function SessionManager({ children }: { children: React.ReactNode }) {
  const { step, markActivity } = useSessionStore();

  // Fullscreen request on first touch
  useEffect(() => {
    const requestFullscreen = () => {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    };
    document.addEventListener("click", requestFullscreen, { once: true });
    document.addEventListener("touchstart", requestFullscreen, { once: true });
    return () => {
      document.removeEventListener("click", requestFullscreen);
      document.removeEventListener("touchstart", requestFullscreen);
    };
  }, []);

  // Track user activity for session timeout
  useEffect(() => {
    if (step === "attract") return;
    const events = ["touchstart", "click", "mousemove", "keydown"] as const;
    const handler = () => markActivity();
    events.forEach((e) => document.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => document.removeEventListener(e, handler));
  }, [step, markActivity]);

  // Session timeout logic
  useSessionTimeout();

  return <>{children}</>;
}
