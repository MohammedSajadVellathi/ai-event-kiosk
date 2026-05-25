"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { TEMPLATES as STATIC_TEMPLATES } from "@/constants/templates";
import { fetchTemplates } from "@/services/api";
import { LABELS } from "@/types";
import { BackButton } from "@/components/ui/BackButton";
import type { Template } from "@/types";

export function TemplateGallery() {
  const { language, selectedTemplate, setTemplate, goTo } = useSessionStore();
  const t = LABELS[language];

  const [templates, setTemplates] = useState<Template[]>(STATIC_TEMPLATES);
  const [localSelected, setLocalSelected] = useState<string | null>(
    selectedTemplate?.id ?? null
  );

  // Fetch live template data from backend — gets correct imageUrl regardless of build env
  useEffect(() => {
    fetchTemplates()
      .then((apiTemplates) => {
        // Merge API imageUrl with static visual data (colors, accentColor)
        const merged = apiTemplates.map((apiT) => {
          const staticT = STATIC_TEMPLATES.find((s) => s.id === apiT.id);
          return { ...staticT, ...apiT } as Template;
        });
        setTemplates(merged);
      })
      .catch(() => {}); // keep static fallback on error
  }, []);

  const chosen = templates.find((tp) => tp.id === localSelected) ?? null;

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-safe pt-10 pb-5 flex-shrink-0">
        <BackButton onClick={() => goTo("language")} label={t.back} />
        <div className="text-center">
          <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase">Step 2 of 5</p>
          <h2 className="text-white text-xl font-thin tracking-wider mt-0.5">{t.chooseTemplate}</h2>
        </div>
        <div className="w-14" />
      </div>

      {/* 2×2 grid */}
      <div className="flex-1 px-5 pb-4 grid grid-cols-2 gap-4 min-h-0">
        {templates.map((template, i) => (
          <motion.button
            key={template.id}
            onClick={() => setLocalSelected(template.id)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 w-full h-full ${
              localSelected === template.id
                ? "border-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.2)]"
                : "border-white/8"
            }`}
          >
            <TemplateCardContent template={template} selected={localSelected === template.id} />
          </motion.button>
        ))}
      </div>

      {/* Proceed button */}
      <div className="flex-shrink-0 px-5 pb-safe pb-8 pt-4 border-t border-white/5">
        <motion.button
          onClick={() => chosen && setTemplate(chosen)}
          disabled={!localSelected}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-5 rounded-2xl font-semibold text-sm tracking-[0.2em] uppercase transition-all duration-200 ${
            localSelected
              ? "bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.3)]"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          {t.confirmProceed}
          {chosen && (
            <span className="ml-2 font-light opacity-60">· {chosen.title}</span>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function TemplateCardContent({
  template,
  selected,
}: {
  template: Template;
  selected: boolean;
}) {
  return (
    <>
      {/* Template image — fills card */}
      {template.imageUrl ? (
        <img
          src={template.imageUrl}
          alt={template.title}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${template.colors[0]}, ${template.colors[1]})` }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Accent top line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${template.accentColor}, transparent)` }}
      />

      {/* Bottom label */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <p className="text-white font-semibold tracking-wide text-sm sm:text-base leading-tight">
          {template.title}
        </p>
      </div>

      {template.premium && (
        <div className="absolute top-3 right-3 bg-yellow-400/90 text-black text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
          PRO
        </div>
      )}

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </>
  );
}
