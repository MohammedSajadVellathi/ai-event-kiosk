import { create } from "zustand";
import type {
  SessionStep,
  Language,
  Template,
  Tier,
  PaymentStatus,
  DeliveryMethod,
} from "@/types";

function genSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

interface SessionStore {
  sessionId: string | null;
  step: SessionStep;
  language: Language;
  selectedTemplate: Template | null;
  capturedImage: string | null;
  generatedImage: string | null;
  selectedTier: Tier | null;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod | null;
  consent: boolean;
  lastActivity: number;

  startSession: () => void;
  setLanguage: (lang: Language) => void;
  setTemplate: (template: Template) => void;
  captureImage: (dataUrl: string) => void;
  setGeneratedImage: (url: string) => void;
  goTo: (step: SessionStep) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setSelectedTier: (tier: Tier) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setConsent: (v: boolean) => void;
  resetSession: () => void;
  markActivity: () => void;
}

const fresh = () => ({
  sessionId: null as string | null,
  step: "attract" as SessionStep,
  language: "en" as Language,
  selectedTemplate: null as Template | null,
  capturedImage: null as string | null,
  generatedImage: null as string | null,
  selectedTier: null as Tier | null,
  paymentStatus: "idle" as PaymentStatus,
  deliveryMethod: null as DeliveryMethod | null,
  consent: false,
  lastActivity: Date.now(),
});

export const useSessionStore = create<SessionStore>((set) => ({
  ...fresh(),

  startSession: () =>
    set({ sessionId: genSessionId(), step: "language", lastActivity: Date.now() }),

  setLanguage: (language) =>
    set({ language, step: "template", lastActivity: Date.now() }),

  setTemplate: (selectedTemplate) =>
    set({ selectedTemplate, step: "camera", lastActivity: Date.now() }),

  captureImage: (capturedImage) =>
    set({ capturedImage, step: "processing", lastActivity: Date.now() }),

  setGeneratedImage: (generatedImage) =>
    set({ generatedImage, step: "result", lastActivity: Date.now() }),

  goTo: (step) =>
    set({ step, lastActivity: Date.now() }),

  setPaymentStatus: (paymentStatus) =>
    set((state) => ({
      paymentStatus,
      ...(paymentStatus === "success" ? { step: "delivery" as SessionStep } : {}),
      lastActivity: Date.now(),
    })),

  setSelectedTier: (selectedTier) =>
    set({ selectedTier, lastActivity: Date.now() }),

  setDeliveryMethod: (deliveryMethod) =>
    set({ deliveryMethod, lastActivity: Date.now() }),

  setConsent: (consent) =>
    set({ consent, lastActivity: Date.now() }),

  resetSession: () =>
    set({ ...fresh(), lastActivity: Date.now() }),

  markActivity: () =>
    set({ lastActivity: Date.now() }),
}));
