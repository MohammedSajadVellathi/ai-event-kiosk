/**
 * Generates placeholder demo images for each template.
 * Uses sharp (bundled with Next.js) — no extra install needed.
 *
 * Run: npm run demo:gen-images
 */

import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/demo");
mkdirSync(OUT_DIR, { recursive: true });

const W = 600;
const H = 800;

const TEMPLATES = [
  {
    id: "sports",
    top: { r: 13, g: 45, b: 84 },
    bot: { r: 6, g: 15, b: 42 },
    accent: { r: 56, g: 189, b: 248 },
    label: "SPORTS",
  },
  {
    id: "corporate",
    top: { r: 26, g: 26, b: 46 },
    bot: { r: 15, g: 17, b: 34 },
    accent: { r: 148, g: 163, b: 184 },
    label: "CORPORATE",
  },
  {
    id: "festival",
    top: { r: 74, g: 18, b: 117 },
    bot: { r: 59, g: 6, b: 100 },
    accent: { r: 192, g: 132, b: 252 },
    label: "FESTIVAL",
  },
  {
    id: "custom",
    top: { r: 26, g: 8, b: 56 },
    bot: { r: 45, g: 10, b: 84 },
    accent: { r: 167, g: 139, b: 250 },
    label: "CUSTOM",
  },
];

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

async function generateImage(template) {
  const { top, bot, accent, label, id } = template;

  // Build raw RGB pixel buffer with gradient + accent shapes
  const pixels = new Uint8Array(W * H * 3);

  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    const r = lerp(top.r, bot.r, t);
    const g = lerp(top.g, bot.g, t);
    const b = lerp(top.b, bot.b, t);

    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3;

      // Face oval glow (centered horizontally, upper third)
      const cx = W / 2;
      const cy = H * 0.32;
      const rx = W * 0.28;
      const ry = H * 0.22;
      const inOval = ((x - cx) ** 2) / rx ** 2 + ((y - cy) ** 2) / ry ** 2;

      // Accent ring
      const onRing = inOval >= 0.88 && inOval <= 1.12;

      // Soft inner glow
      const glowStrength = Math.max(0, 1 - inOval) * 0.18;

      pixels[idx] = Math.min(255, r + (onRing ? accent.r * 0.5 : accent.r * glowStrength));
      pixels[idx + 1] = Math.min(255, g + (onRing ? accent.g * 0.5 : accent.g * glowStrength));
      pixels[idx + 2] = Math.min(255, b + (onRing ? accent.b * 0.5 : accent.b * glowStrength));
    }
  }

  const outPath = join(OUT_DIR, `${id}.jpg`);
  await sharp(Buffer.from(pixels.buffer), { raw: { width: W, height: H, channels: 3 } })
    .jpeg({ quality: 88 })
    .toFile(outPath);

  console.log(`✓  ${id}.jpg`);
}

console.log("Generating demo images…");
await Promise.all(TEMPLATES.map(generateImage));
console.log(`Done → frontend/public/demo/`);
