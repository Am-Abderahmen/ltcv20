"use client";
/**
 * TrustedBy — "Ils nous font confiance"
 *
 * Left  : fixed text block (title + subtitle)
 * Right : two infinite marquee rows running in opposite directions
 *
 * Animation: pure CSS keyframes via inline <style> — zero extra deps,
 * GPU-only (translateX), no layout recalcs.
 *
 * Accessibility: respects prefers-reduced-motion (animation paused / very slow).
 * Loop technique: each strip holds the list × 3 so there is always
 * content visible while the first copy wraps around.
 */

import { useEffect, useRef, useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const ROW_1 = [
  "SCTP",
  "GEROFINANCE – RÉGIE DU RHÔNE",
  "APLEONA SUISSE",
  "COMPTOIR IMMOBILIER",
  "ANGELS RÉNOVATIONS",
];

const ROW_2 = [
  "DEXOM",
  "FONDATION LES OLIVIERS",
  "ROOM SERVICE",
  "MIXAGE IMMO CONCEPT",
  "B&B SWISS IMPORT",
];

// Visual separator between names
const SEP = "·";

// ── Marquee strip ─────────────────────────────────────────────────────────────
function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: string[];
  direction: "left" | "right";
  duration: number; // seconds
}) {
  // Triple the list so there is always content while the first copy wraps
  const strip = [...items, ...items, ...items];

  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      {/* Fade masks — left & right edges */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #f8f8f8 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 w-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, #f8f8f8 0%, transparent 100%)",
        }}
      />

      {/* Scrolling track */}
      <div
        className="flex items-center gap-0 whitespace-nowrap will-change-transform"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
        }}
      >
        {strip.map((name, idx) => (
          <span key={idx} className="inline-flex items-center">
            <span
              className="
                px-6 py-1 text-sm font-semibold tracking-widest uppercase
                text-gray-400/70
                transition-all duration-300 cursor-default select-none
                hover:text-[#10B65A] hover:opacity-100
                hover:[text-shadow:0_0_18px_rgba(16,182,90,0.35)]
              "
              style={{ letterSpacing: "0.12em" }}
            >
              {name}
            </span>
            {/* Separator dot */}
            <span className="text-gray-300/50 text-xs mx-1 select-none">
              {SEP}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrustedBy() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Reduced-motion: drastically slow the animation
  const dur1 = reducedMotion ? 90 : 28;
  const dur2 = reducedMotion ? 110 : 34;

  return (
    <section
      id="confiance"
      className="section-y bg-[#f8f8f8] overflow-hidden"
      aria-label="Ils nous font confiance"
    >
      {/* CSS keyframes injected once — no style file needed */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* ── Layout: left text / right marquees ── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* LEFT — fixed text block */}
          <div className="lg:w-[28%] xl:w-[26%] flex-shrink-0">
            {/* Eyebrow tag */}
            <span className="inline-block text-[#10B65A] text-xs font-semibold tracking-[0.28em] uppercase mb-4">
              Partenaires & clients
            </span>

            {/* Title */}
            <h2
              className="font-display font-light text-gray-900 leading-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.6rem)" }}
            >
              Ils nous font{" "}
              <span className="text-[#10B65A]">confiance</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-500 text-[15px] leading-relaxed font-light max-w-xs">
              Particuliers, bureaux, hôtels et entreprises nous confient leurs
              besoins au quotidien.
            </p>

            {/* Decorative accent line */}
            <div className="mt-7 w-10 h-0.5 bg-[#10B65A] rounded-full" />
          </div>

          {/* RIGHT — two marquee rows */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* Subtle top separator */}
            <div className="h-px bg-gray-200/70" />

            <MarqueeRow items={ROW_1} direction="left"  duration={dur1} />

            {/* Middle separator */}
            <div className="h-px bg-gray-200/70" />

            <MarqueeRow items={ROW_2} direction="right" duration={dur2} />

            {/* Bottom separator */}
            <div className="h-px bg-gray-200/70" />

          </div>
        </div>
      </div>
    </section>
  );
}
