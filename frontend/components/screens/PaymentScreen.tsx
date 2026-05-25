"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { TIERS, buildUPIString } from "@/constants/tiers";
import { LABELS } from "@/types";
import type { Tier } from "@/types";
import { UPIQRCode } from "@/components/ui/UPIQRCode";
import { BackButton } from "@/components/ui/BackButton";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";

export function PaymentScreen() {
  const {
    language, sessionId, selectedTier, paymentStatus,
    setSelectedTier, setPaymentStatus, goTo,
  } = useSessionStore();
  const t = LABELS[language];

  const [localTier, setLocalTier] = useState<Tier>(selectedTier ?? TIERS[0]);
  const [polling, setPolling] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min

  const upiString = sessionId
    ? buildUPIString(localTier.price, sessionId, localTier.id)
    : "";

  usePaymentPolling(polling);

  const handleProceed = () => {
    setSelectedTier(localTier);
    setPolling(true);
    setPaymentStatus("pending");
  };

  // Countdown timer while polling
  useEffect(() => {
    if (!polling) return;
    const tick = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(tick); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [polling]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-safe pt-10 pb-6 flex-shrink-0">
        <BackButton onClick={() => goTo("result")} label={t.back} />
        <div className="text-center">
          <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase">Step 5 of 5</p>
          <h2 className="text-white text-xl font-thin tracking-wider mt-0.5">{t.paymentTitle}</h2>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-safe pb-8">
        <AnimatePresence mode="wait">
          {/* ── Tier selection + QR ── */}
          {paymentStatus === "idle" || paymentStatus === "pending" ? (
            <motion.div
              key="payment-ui"
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Tier cards */}
              {!polling && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {TIERS.map((tier) => {
                    const active = localTier.id === tier.id;
                    return (
                      <motion.button
                        key={tier.id}
                        onClick={() => setLocalTier(tier)}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                          active
                            ? "border-yellow-400 bg-yellow-400/8 shadow-[0_0_20px_rgba(250,204,21,0.15)]"
                            : "border-white/10 bg-white/3"
                        }`}
                      >
                        {tier.badge && (
                          <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                            {tier.badge}
                          </div>
                        )}
                        <p className={`text-2xl font-thin mb-1 ${active ? "text-yellow-400" : "text-white/60"}`}>
                          ₹{tier.price}
                        </p>
                        <p className={`font-light tracking-wide mb-4 ${active ? "text-white" : "text-white/60"}`}>
                          {language === "hi" ? tier.nameHi : tier.name}
                        </p>
                        <ul className="space-y-2">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-white/40 text-xs">
                              <span className={`mt-0.5 flex-shrink-0 ${active ? "text-yellow-400" : ""}`}>✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* UPI QR */}
              {!polling ? (
                <motion.div
                  className="flex flex-col items-center gap-6 py-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <UPIQRCode upiString={upiString} amount={localTier.price} size={180} />

                  <motion.button
                    onClick={handleProceed}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-sm py-5 rounded-2xl bg-yellow-400 text-black font-semibold text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(250,204,21,0.3)]"
                  >
                    {t.scanUPI}
                  </motion.button>
                </motion.div>
              ) : (
                /* Waiting animation */
                <motion.div
                  className="flex flex-col items-center gap-8 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-yellow-400"
                        style={{ animation: "dot-bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s`, willChange: "transform, opacity" }}
                      />
                    ))}
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white text-lg font-light tracking-wide">{t.waitingPayment}</p>
                    <p className="text-white/30 text-sm">₹{localTier.price} · {fmt(countdown)}</p>
                  </div>

                  {/* Manual override (event staff) */}
                  <button
                    onClick={() => { setPolling(false); setPaymentStatus("success"); }}
                    className="text-white/15 text-xs tracking-widest border border-white/8 px-4 py-2 rounded-full hover:text-white/30"
                  >
                    {t.markPaid}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : paymentStatus === "timeout" ? (
            /* Timeout state */
            <motion.div
              key="timeout"
              className="flex flex-col items-center justify-center gap-8 py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-white text-xl font-light">{t.paymentTimeout}</p>
              <button
                onClick={() => { setPaymentStatus("idle"); setPolling(false); setCountdown(300); }}
                className="px-10 py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-sm tracking-widest uppercase"
              >
                {t.tryAgain}
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
