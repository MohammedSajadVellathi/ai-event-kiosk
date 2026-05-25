"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { AttractScreen } from "@/components/screens/AttractScreen";
import { LanguageScreen } from "@/components/screens/LanguageScreen";
import { TemplateGallery } from "@/components/screens/TemplateGallery";
import { CameraScreen } from "@/components/screens/CameraScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { PaymentScreen } from "@/components/screens/PaymentScreen";
import { DeliveryScreen } from "@/components/screens/DeliveryScreen";
import type { SessionStep } from "@/types";

const SCREENS: Record<SessionStep, React.ComponentType> = {
  attract: AttractScreen,
  language: LanguageScreen,
  template: TemplateGallery,
  camera: CameraScreen,
  processing: ProcessingScreen,
  result: ResultScreen,
  payment: PaymentScreen,
  delivery: DeliveryScreen,
};

export function ScreenRouter() {
  const step = useSessionStore((s) => s.step);
  const Screen = SCREENS[step];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.005 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
