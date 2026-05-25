"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSessionStore } from "@/store/useSessionStore";
import { LABELS } from "@/types";
import QRCode from "qrcode";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";

const AUTO_RESET_S = 30;

interface EmailForm {
  email: string;
}

export function DeliveryScreen() {
  const { language, generatedImage, selectedTier, resetSession } = useSessionStore();
  const t = LABELS[language];

  const [countdown, setCountdown] = useState(AUTO_RESET_S);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printDone, setPrintDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EmailForm>();

  useEffect(() => {
    if (!generatedImage) return;
    QRCode.toDataURL(generatedImage, {
      width: 180, margin: 1,
      color: { dark: "#ffffff", light: "#000000" },
    }).then(setQrDataUrl).catch(() => {});
  }, [generatedImage]);

  // Auto reset countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(tick); resetSession(); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [resetSession]);

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "magic-avatar.jpg"; a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(generatedImage, "_blank");
    }
  };

  const handleWhatsApp = () => {
    const msg = `Here's my AI avatar! Download: ${generatedImage ?? ""}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => { setPrinting(false); setPrintDone(true); }, 3000);
  };

  const onEmailSubmit = (data: EmailForm) => {
    console.log("Send to:", data.email, generatedImage);
    setEmailSent(true);
    setShowEmail(false);
  };

  if (!generatedImage) return null;

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      <AnimatedGrid />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-6 py-10">
        {/* Success animation */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-yellow-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <motion.svg
            width="32" height="32" viewBox="0 0 32 32" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.path
              d="M6 16L13 23L26 10"
              stroke="#FACC15"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-2xl font-thin tracking-wider">{t.deliveryTitle}</h2>
          <p className="text-white/30 text-sm tracking-widest">
            {t.autoReset} <span className="text-yellow-400/70">{countdown}s</span>
          </p>
        </motion.div>

        {/* Image preview + QR */}
        <motion.div
          className="flex gap-6 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative w-28 h-36 sm:w-36 sm:h-48 rounded-xl overflow-hidden border border-white/10">
            <img src={generatedImage} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center gap-2">
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg" />}
            <p className="text-white/30 text-[10px] tracking-widest uppercase">{t.scanDownload}</p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActionButton icon="⬇" label={t.download} onClick={handleDownload} />
          <ActionButton icon="💬" label={t.shareWhatsApp} onClick={handleWhatsApp} color="green" />
          <ActionButton
            icon={emailSent ? "✓" : "✉"}
            label={t.shareEmail}
            onClick={() => setShowEmail(!showEmail)}
            color={emailSent ? "green" : undefined}
          />
          {selectedTier?.id === "print" && (
            <ActionButton
              icon={printDone ? "✓" : printing ? "…" : "🖨"}
              label={printDone ? "Printed!" : printing ? "Printing" : t.sharePrint}
              onClick={handlePrint}
              color={printDone ? "green" : undefined}
              disabled={printDone || printing}
            />
          )}
        </motion.div>

        {/* Email input (react-hook-form) */}
        {showEmail && !emailSent && (
          <motion.form
            onSubmit={handleSubmit(onEmailSubmit)}
            className="w-full max-w-md flex flex-col gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <input
              {...register("email", {
                required: "Email required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
              placeholder={t.emailPlaceholder}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-yellow-400/50 placeholder:text-white/30"
              type="email"
            />
            {errors.email && <p className="text-red-400/70 text-xs px-1">{errors.email.message}</p>}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-sm tracking-widest uppercase"
            >
              {t.sendEmail}
            </button>
          </motion.form>
        )}

        {/* Done button */}
        <motion.button
          onClick={resetSession}
          whileTap={{ scale: 0.97 }}
          className="px-16 py-4 rounded-2xl border border-white/15 bg-white/3 text-white/50 text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t.done}
        </motion.button>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  color?: "green";
  disabled?: boolean;
}

function ActionButton({ icon, label, onClick, color, disabled }: ActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
        color === "green"
          ? "border-green-500/30 bg-green-500/8 text-green-400"
          : "border-white/10 bg-white/5 text-white/60"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/20"}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[11px] tracking-widest uppercase">{label}</span>
    </motion.button>
  );
}
