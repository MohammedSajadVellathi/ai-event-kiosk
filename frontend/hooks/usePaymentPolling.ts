"use client";

import { useEffect, useRef } from "react";
import { checkPaymentStatus } from "@/services/payment";
import { useSessionStore } from "@/store/useSessionStore";

const POLL_INTERVAL_MS = 3_000;
const PAYMENT_TIMEOUT_MS = 5 * 60_000;

export function usePaymentPolling(enabled: boolean) {
  const sessionId = useSessionStore((s) => s.sessionId);
  const setPaymentStatus = useSessionStore((s) => s.setPaymentStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    startedAt.current = Date.now();

    intervalRef.current = setInterval(async () => {
      if (Date.now() - startedAt.current > PAYMENT_TIMEOUT_MS) {
        clearInterval(intervalRef.current!);
        setPaymentStatus("timeout");
        return;
      }

      const status = await checkPaymentStatus(sessionId);
      if (status === "success" || status === "failed") {
        clearInterval(intervalRef.current!);
        setPaymentStatus(status);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, sessionId, setPaymentStatus]);
}
