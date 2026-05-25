"use client";

import { motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { LABELS } from "@/types";
import type { Language } from "@/types";
import { BackButton } from "@/components/ui/BackButton";

const LANGS: { id: Language; label: string; native: string; flag: string }[] = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
];

export function LanguageScreen() {
  const { setLanguage, language, goTo } = useSessionStore();
  const t = LABELS[language];

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 pt-safe pt-10 pb-6">
        <BackButton onClick={() => goTo("attract")} label={t.back} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase">Step 1 of 5</p>
          <h2 className="text-white text-3xl sm:text-4xl font-thin tracking-wider">
            {t.chooseLanguage}
          </h2>
        </motion.div>

        {/* Language cards */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {LANGS.map((lang, i) => (
            <motion.button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-6 p-8 rounded-3xl border-2 transition-all duration-200 text-left ${
                language === lang.id
                  ? "border-yellow-400 bg-yellow-400/8 shadow-[0_0_30px_rgba(250,204,21,0.15)]"
                  : "border-white/10 bg-white/3 hover:border-white/20"
              }`}
            >
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <p className={`text-xl font-light tracking-wide ${language === lang.id ? "text-white" : "text-white/70"}`}>
                  {lang.label}
                </p>
                <p className="text-white/30 text-base mt-0.5">{lang.native}</p>
              </div>
              {language === lang.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
