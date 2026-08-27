/**
 * Re-encodes the site's photography to WebP with an adaptive contrast lift.
 *
 * Two problems this fixes:
 *   1. Size. The gallery shipped ~27MB of JPEG — img4 alone was 10.3MB at
 *      4096px, for a tile that renders under 600px wide.
 *   2. Flatness. Several sources measure a luminance stdev in the low 40s,
 *      which is what "washed out" looks like numerically.
 *
 * The lift is adaptive rather than a fixed curve: an image that is already
 * contrasty gets sharpening and a touch of saturation, while a flat one gets
 * full auto-levels. Applying the same aggressive curve to everything would
 * blow out the images that were fine.
 *
 * Run: node scripts/optimise-images.mjs
 */
import sharp from "sharp";
import { statSync, existsSync } from "node:fs";

const PUBLIC = new URL("../public/", import.meta.url).pathname;
const SOURCE = new URL("../source-images/", import.meta.url).pathname;

// maxWidth is chosen from how large the image actually renders, not its source.
const JOBS = [
  // Impact bento + hero backdrops
  { src: "bg4.webp", out: "agriculture.webp", maxWidth: 1600 },
  { src: "img9.jpg", out: "community.webp", maxWidth: 1600 },
  { src: "bg3.webp", out: "municipal.webp", maxWidth: 1600 },
  { src: "img4.jpg", out: "industrial.webp", maxWidth: 1600 },
  { src: "bg-1.webp", out: "hero-bg.webp", maxWidth: 1600 },
  // Gallery
  ...["img1", "img2", "img3", "img5", "img6", "img7", "img8", "img9"].map((n) => ({
    src: `${n}.jpg`,
    out: `gallery-${n}.webp`,
    maxWidth: 2000,
  })),
  { src: "img4.jpg", out: "gallery-img4.webp", maxWidth: 2000 },
  // Award shot, already resized once — re-encode as WebP
  { src: "img8-award.jpg", out: "award.webp", maxWidth: 1800 },
];

const contrastOf = (stats) =>
  stats.channels.slice(0, 3).reduce((a, c) => a + c.stdev, 0) / 3;

let beforeTotal = 0;
let afterTotal = 0;
console.log(
  "source".padEnd(18) + "→ output".padEnd(24) + "KB".padStart(14) + "contrast".padStart(16)
);

for (const job of JOBS) {
  const from = SOURCE + job.src;
  if (!existsSync(from)) {
    console.log(`${job.src.padEnd(18)}  MISSING`);
    continue;
  }

  const before = await sharp(from).stats();
  const sd = contrastOf(before);

  // Adaptive strength. Below ~50 the image is genuinely flat and wants full
  // auto-levels; above ~64 it only needs sharpening after the downscale.
  const flat = sd < 50;
  const mid = sd >= 50 && sd < 64;

  let pipe = sharp(from).resize({
    width: job.maxWidth,
    withoutEnlargement: true,
    fit: "inside",
  });

  if (flat) {
    pipe = pipe.normalise({ lower: 1, upper: 99 }).linear(1.08, -8).modulate({ saturation: 1.16 });
  } else if (mid) {
    pipe = pipe.normalise({ lower: 2, upper: 98 }).linear(1.04, -4).modulate({ saturation: 1.09 });
  } else {
    pipe = pipe.modulate({ saturation: 1.05 });
  }

  await pipe.sharpen({ sigma: 0.7 }).webp({ quality: 82, effort: 5 }).toFile(PUBLIC + job.out);

  const after = await sharp(PUBLIC + job.out).stats();
  const kbBefore = statSync(from).size / 1024;
  const kbAfter = statSync(PUBLIC + job.out).size / 1024;
  beforeTotal += kbBefore;
  afterTotal += kbAfter;

  console.log(
    job.src.padEnd(18) +
      `→ ${job.out}`.padEnd(24) +
      `${Math.round(kbBefore)}→${Math.round(kbAfter)}`.padStart(14) +
      `${sd.toFixed(1)}→${contrastOf(after).toFixed(1)}`.padStart(16)
  );
}

console.log(
  `\ntotal: ${(beforeTotal / 1024).toFixed(1)}MB → ${(afterTotal / 1024).toFixed(1)}MB ` +
    `(${(100 - (afterTotal / beforeTotal) * 100).toFixed(0)}% smaller)`
);
