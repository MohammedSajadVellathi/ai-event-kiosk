import type { PaymentStatus } from "@/types";
import { mockCheckPaymentStatus } from "./mockApi";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function checkPaymentStatus(sessionId: string): Promise<PaymentStatus> {
  if (IS_DEMO) return mockCheckPaymentStatus();

  try {
    const res = await fetch(`/api/payment/status?session=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return "pending";
    const data = await res.json();
    return data.status as PaymentStatus;
  } catch {
    return "pending";
  }
}
