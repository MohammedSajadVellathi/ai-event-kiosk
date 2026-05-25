import type { Tier } from "@/types";

export const TIERS: Tier[] = [
  {
    id: "digital",
    name: "Digital",
    nameHi: "डिजिटल",
    price: 99,
    features: [
      "High-res digital download",
      "Instant delivery via QR",
      "Share on WhatsApp & Email",
      "Valid for 24 hours",
    ],
  },
  {
    id: "print",
    name: "Digital + Print",
    nameHi: "डिजिटल + प्रिंट",
    price: 199,
    features: [
      "Everything in Digital",
      "4×6 premium print",
      "Ready in 2 minutes",
      "Collect at counter",
    ],
    badge: "Best Value",
  },
];

export function buildUPIString(amount: number, sessionId: string, tierName: string): string {
  const pa = "magicavatar@upi";
  const pn = "Magic Avatar";
  const tn = `Avatar-${tierName}-${sessionId}`;
  return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tn)}`;
}
