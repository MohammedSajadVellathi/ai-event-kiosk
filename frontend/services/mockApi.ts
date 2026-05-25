import type { GenerateResponse, Template } from "@/types";
import { TEMPLATES } from "@/constants/templates";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ── Stage-aware mock processing ────────────────────────────────────────────

const STAGE_DELAYS = [1200, 2000, 3200, 1200]; // mirrors ProcessingScreen stages

export async function mockGenerate(
  templateId?: string,
  onStage?: (index: number) => void
): Promise<GenerateResponse> {
  for (let i = 0; i < STAGE_DELAYS.length; i++) {
    onStage?.(i);
    await delay(STAGE_DELAYS[i]);
  }

  const id = templateId ?? "sports";
  const imageUrl = `/demo/${id}.jpg`;

  return { success: true, imageUrl };
}

// ── Templates ──────────────────────────────────────────────────────────────

export async function mockFetchTemplates(): Promise<Template[]> {
  await delay(200);
  return TEMPLATES;
}

// ── Payment ────────────────────────────────────────────────────────────────

let _demoPaymentStart: number | null = null;
const DEMO_PAYMENT_SUCCESS_AFTER_MS = 6_000;

export async function mockCheckPaymentStatus(): Promise<"pending" | "success"> {
  if (!_demoPaymentStart) _demoPaymentStart = Date.now();
  if (Date.now() - _demoPaymentStart >= DEMO_PAYMENT_SUCCESS_AFTER_MS) {
    _demoPaymentStart = null;
    return "success";
  }
  return "pending";
}

export function resetDemoPayment() {
  _demoPaymentStart = null;
}
