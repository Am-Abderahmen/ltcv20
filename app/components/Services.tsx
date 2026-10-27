"use client";

/**
 * SERVICES SECTION — GSAP ScrollTrigger pinned scroll
 *
 * • Outer div height = window.innerHeight × VH_PER_SERVICE × N px
 * • ScrollTrigger pins the inner panel for the full scroll distance
 *   → pin: true, scrub: 1, anticipatePin: 1, snap per service
 * • onUpdate maps progress [0→1] → activeIndex via equal (1/(N-1)) steps
 * • Image crossfades driven by gsap.to (GPU only) — no React state on images
 * • React state only updates text panel (cheap, infrequent)
 * • Mobile: ScrollTrigger disabled → horizontal tab cards
 */

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLang } from "../lib/LangContext";

// Each service gets this many viewport-heights of scroll distance
const VH_PER_SERVICE = 120;

export default function Services() {
  const { t } = useLang();
  const services = t.services.items;
  const N = services.length; // 5

  const outerRef  = useRef<HTMLDivElement>(null);
  const panelRef  = useRef<HTMLDivElement>(null);
  const imgRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const [active,  setActive]  = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  // ── Responsive detection ─────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── GSAP ScrollTrigger (desktop only) ───────────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return;
    if (!outerRef.current || !panelRef.current) return;

    let st: { kill(): void } | null = null;
    let resizeCleanup: (() => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = (gsapMod as any).default ?? gsapMod;
      gsap.registerPlugin(ScrollTrigger);

      const outerEl = outerRef.current!;
      const panelEl = panelRef.current!;

      const computeHeight = () =>
        Math.round((window.innerHeight * VH_PER_SERVICE * N) / 100);

      // Set outer section height so ScrollTrigger has scroll space
      outerEl.style.height = `${computeHeight()}px`;

      // Initialise all image layers
      imgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          scale:   i === 0 ? 1 : 1.06,
        });
      });

      let lastIdx = 0;

      st = ScrollTrigger.create({
        trigger:       outerEl,
        start:         "top top",
        // scroll distance = outer height minus one viewport (last frame = panel fills screen)
        end:           () => `+=${computeHeight() - window.innerHeight}`,
        pin:           panelEl,
        pinSpacing:    false,   // outer already provides the height
        scrub:         1,       // smooth 1-second lag
        anticipatePin: 1,       // no jump when entering
        snap: {
          snapTo:   1 / (N - 1),
          duration: { min: 0.3, max: 0.55 },
          ease:     "power2.inOut",
          delay:    0.04,
        },

        onUpdate(self) {
          // Equal segments: 0/(N-1) … (N-1)/(N-1)
          const raw = self.progress * (N - 1);
          const idx = Math.min(Math.round(raw), N - 1);

          if (idx !== lastIdx) {
            const prev = lastIdx;
            lastIdx    = idx;

            // Image crossfade — pure GSAP, zero React render
            gsap.to(imgRefs.current[prev], {
              opacity:  0,
              scale:    1.06,
              duration: 0.85,
              ease:     "power2.inOut",
              overwrite: true,
            });
            gsap.to(imgRefs.current[idx], {
              opacity:  1,
              scale:    1,
              duration: 0.95,
              ease:     "power2.inOut",
              overwrite: true,
            });

            // Only text panel needs React re-render
            setActive(idx);
          }
        },
      });

      // Recalculate on resize
      const onResize = () => {
        outerEl.style.height = `${computeHeight()}px`;
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      resizeCleanup = () => window.removeEventListener("resize", onResize);
    })();

    return () => {
      st?.kill();
      resizeCleanup?.();
    };
  }, [mounted, isMobile, N]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  // ── MOBILE — tabs + cards ────────────────────────────────────────────────
  if (!mounted || isMobile) {
    return (
      <section id="services" className="bg-[#0a0a0a] py-16">
        <div className="px-5 mb-8 text-center">
          <span className="text-[#10B65A] text-xs font-semibold tracking-[0.25em] uppercase">
            {t.services.tag}
          </span>
          <h2 className="font-display text-3xl text-white mt-3 mb-2 font-light">
            {t.services.title}
          </h2>
          <p className="text-white/40 text-sm">{t.services.subtitle}</p>
        </div>

        <div className="flex overflow-x-auto gap-2 px-5 pb-4 no-select">
          {services.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 ${
                active === i
                  ? "bg-[#10B65A] text-white border-[#10B65A] shadow-lg shadow-[#10B65A]/25"
                  : "bg-white/5 text-white/55 border-white/10 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="px-5 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="rounded-2xl overflow-hidden border border-white/8"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={services[active].image}
                  alt={services[active].title}
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[#10B65A] text-xs font-semibold tracking-widest uppercase">
                    0{active + 1} / 0{N}
                  </span>
                </div>
              </div>
              <div className="bg-[#141414] p-6">
                <h3 className="font-display text-2xl text-white mb-3 font-light">
                  {services[active].title}
                </h3>
                <p className="text-sm leading-relaxed mb-5 font-light" style={{ color: "rgba(255,255,255,0.88)" }}>
                  {services[active].desc}
                </p>
                <button onClick={() => scrollTo("#contact")} className="btn-primary text-sm">
                  {t.services.cta}
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // ── DESKTOP — GSAP pinned section ────────────────────────────────────────
  // outerRef height is set in px by useEffect — gives GSAP its scroll space.
  // panelRef is what GSAP pins (stays fixed while outer scrolls past).
  return (
    <div id="services" ref={outerRef} className="relative">

      {/* Panel that GSAP pins ─────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className="h-screen w-full overflow-hidden relative"
        style={{ willChange: "transform" }}
      >

        {/* ── Background images (z-0) ── */}
        {services.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => { imgRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{
              backgroundImage:    `url(${s.image})`,
              backgroundSize:     "cover",
              backgroundPosition: "center",
              willChange:         "opacity, transform",
              opacity:            i === 0 ? 1 : 0,
              transform:          i === 0 ? "scale(1)" : "scale(1.06)",
            }}
          />
        ))}

        {/* Dark overlays (z-10) — strong enough for all service photo tones */}
        <div className="absolute inset-0 z-10 bg-black/72 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/92 via-black/60 to-black/20 pointer-events-none" />

        {/* ── UI layer (z-20) ── */}
        <div className="relative z-20 h-full flex items-center px-10 xl:px-20">

          {/* Top-left label */}
          <div className="absolute top-10 left-10 xl:left-20 max-w-lg">
            <span className="text-[#10B65A] text-xs font-semibold tracking-[0.3em] uppercase">
              {t.services.tag}
            </span>
            <h2 className="font-display text-xl lg:text-2xl xl:text-3xl text-white/75 font-light mt-2 leading-snug">
              {t.services.title}
            </h2>
          </div>

          {/* Content row */}
          <div className="flex items-center w-full gap-16 xl:gap-24 mt-16">

            {/* Left — cylinder list */}
            <div
              className="flex flex-col items-start select-none"
              style={{ width: "clamp(170px, 18vw, 260px)" }}
            >
              {services.map((s, i) => {
                const dist     = i - active;
                const isActive = dist === 0;
                const scaleVal   = isActive ? 1    : Math.max(0.62, 1 - Math.abs(dist) * 0.11);
                const opacityVal = isActive ? 1    : Math.max(0.15, 1 - Math.abs(dist) * 0.26);
                const yVal       = dist * 56;

                return (
                  <motion.button
                    key={s.id}
                    animate={{ y: yVal, scale: scaleVal, opacity: opacityVal }}
                    transition={{ type: "spring", stiffness: 130, damping: 22 }}
                    onClick={() => setActive(i)}
                    className="w-full text-left py-1.5 px-1 focus:outline-none"
                    style={{ originX: 0, transformOrigin: "left center" }}
                  >
                    <span
                      className="font-display leading-none block"
                      style={{
                        fontSize:   isActive ? "clamp(2rem, 3.8vw, 3.3rem)" : "clamp(1rem, 1.8vw, 1.6rem)",
                        color:      isActive ? "#10B65A" : "rgba(255,255,255,0.4)",
                        fontWeight: isActive ? 600 : 300,
                        transition: "font-size 0.55s cubic-bezier(0.4,0,0.2,1), color 0.4s ease",
                      }}
                    >
                      {s.label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="svcBar"
                        className="h-0.5 bg-[#10B65A] rounded-full mt-2"
                        style={{ width: "52%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 28 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right — text detail */}
            <div className="flex-1 max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`svc-${active}`}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                  exit={{   opacity: 0, y: -14, filter: "blur(4px)" }}
                  transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
                  className="rounded-2xl p-7 xl:p-8"
                  style={{
                    background: "rgba(0,0,0,0.28)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <p className="text-[#10B65A] text-xs font-semibold tracking-[0.3em] uppercase mb-5">
                    0{active + 1} — 0{N}
                  </p>
                  <h3
                    className="font-display text-white font-light leading-tight mb-5"
                    style={{
                      fontSize: "clamp(2rem, 3.4vw, 2.9rem)",
                      textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {services[active].title}
                  </h3>
                  <p
                    className="leading-[1.9] mb-9 font-light"
                    style={{
                      fontSize: "clamp(0.875rem, 1.05vw, 1rem)",
                      color: "rgba(255,255,255,0.92)",
                      textShadow: "0 1px 6px rgba(0,0,0,0.30)",
                    }}
                  >
                    {services[active].desc}
                  </p>
                  <button onClick={() => scrollTo("#contact")} className="btn-primary">
                    {t.services.cta}
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right-edge progress pills */}
          <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Service ${i + 1}`}
                className="flex items-center justify-center w-5 h-5"
              >
                <motion.div
                  animate={
                    i === active
                      ? { height: 28, width: 3, backgroundColor: "#10B65A" }
                      : { height: 5,  width: 3, backgroundColor: "rgba(255,255,255,0.22)" }
                  }
                  transition={{ duration: 0.38, ease: "easeInOut" }}
                  className="rounded-full"
                />
              </button>
            ))}
          </div>

          {/* Scroll hint */}
          <AnimatePresence>
            {active < N - 1 && (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
              >
                <span className="text-white/22 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight size={13} className="rotate-90 text-white/22" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
