"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Shield, Clock, Users } from "lucide-react";
import { useLang } from "../lib/LangContext";

// Real company slider images — one per service (same order as t.hero.slides)
const IMAGES = [
  "/assets/slider/debarras.webp",
  "/assets/slider/nettoyage.webp",
  "/assets/slider/amenagement.webp",
  "/assets/slider/menuiserie.webp",
  "/assets/slider/bricolage.webp",
];
const BADGE_ICONS = [Clock, Users, Shield];

export default function Hero() {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);

  const go = useCallback((idx: number) => setCurrent(idx), []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % IMAGES.length), 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="accueil" className="relative h-screen min-h-[640px] overflow-hidden flex flex-col">
      {/* Background images */}
      {IMAGES.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.04)",
            transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1), transform 8s ease",
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex-1 flex items-center px-6 lg:px-16 xl:px-24 pt-24">
        <div className="max-w-2xl">
          {/* Brand name — hierarchy rule: "Les Trois Coins" large, "SARL" small */}
          <div className="mb-6">
            <h1 className="font-display font-light text-white leading-[1.05]"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
              Les Trois Coins
            </h1>
            <p className="text-[#10B65A] font-body font-light tracking-[0.3em] uppercase text-sm mt-1">
              SARL
            </p>
          </div>

          {/* Subtitle */}
          <p className="font-display italic text-white/90 font-light mb-3"
             style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
            {t.hero.subtitle}
          </p>
          <p className="text-white/60 font-light leading-relaxed mb-10"
             style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}>
            {t.hero.body}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <a href="tel:+41768238910" className="btn-primary">
              <Phone size={17} />
              {t.hero.call}
            </a>
            <a href="mailto:Lestroiscoins@gmail.com" className="btn-ghost">
              <Mail size={17} />
              {t.hero.email}
            </a>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5">
            {t.hero.badges.map((badge, i) => {
              const Icon = BADGE_ICONS[i];
              return (
                <div key={badge} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm">
                  <Icon size={13} className="text-[#10B65A]" />
                  <span className="text-white/80 text-xs font-medium">{badge}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom navigation — centered, no duplicate label at top */}
      <div className="relative z-20 pb-8 px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {t.hero.slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${
                i === current
                  ? "bg-[#10B65A] text-white border-[#10B65A] shadow-lg shadow-[#10B65A]/25"
                  : "bg-white/8 text-white/75 border-white/15 hover:bg-white/15"
              }`}
            >
              {slide}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 right-8 z-20 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
            animate={{ y: ["0%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
}
