import type { GenerateResponse, Template } from "@/types";
import { mockGenerate, mockFetchTemplates } from "./mockApi";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TIMEOUT_MS = 120_000; // fallback when no external signal is provided

// ── Public API ─────────────────────────────────────────────────────────────

export async function health(): Promise<{ status: string }> {
  if (IS_DEMO) return { status: "ok (demo)" };
  const url = API_BASE ? `${API_BASE}/health` : "/api/health";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchTemplates(): Promise<Template[]> {
  if (IS_DEMO) return mockFetchTemplates();
  const url = API_BASE ? `${API_BASE}/templates` : "/api/templates";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function generatePortrait(
  imageDataUrl: string,
  templateId?: string,
  signal?: AbortSignal
): Promise<GenerateResponse> {
  if (IS_DEMO) return mockGenerate(templateId);
  const url = API_BASE ? `${API_BASE}/generate` : "/api/generate";
  console.log("[api] generatePortrait → POST", url, "template:", templateId);
  return callRealApi(imageDataUrl, templateId, url, signal);
}

// ── Internal ───────────────────────────────────────────────────────────────

async function callRealApi(
  imageDataUrl: string,
  templateId: string | undefined,
  url: string,
  externalSignal?: AbortSignal
): Promise<GenerateResponse> {
  const blob = dataUrlToBlob(imageDataUrl);
  const form = new FormData();
  form.append("image", blob, "capture.jpg");
  if (templateId) form.append("template_id", templateId);

  // ProcessingScreen owns the abort signal (watchdog + unmount cleanup).
  // Only create an internal timer when no signal is provided.
  let signal: AbortSignal;
  let timer: ReturnType<typeof setTimeout> | undefined;
  if (externalSignal) {
    signal = externalSignal;
  } else {
    const controller = new AbortController();
    timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    signal = controller.signal;
  }

  try {
    const res = await fetch(url, { method: "POST", body: form, signal });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data: GenerateResponse = await res.json();
    if (!data.success || !data.imageUrl) throw new Error(data.error ?? "Invalid response");
    return data;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
