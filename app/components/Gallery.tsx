"use client";
/**
 * Gallery — production version
 *
 * "Tous" mode:
 *   • Two infinite rows, row1 → left, row2 → right
 *   • Full 30-item array in both rows — no gaps
 *   • RAF drives pixel-perfect continuous motion
 *   • Pause freezes in-place (no layout switch, no jump)
 *   • Hover enables drag; mouseleave resumes
 *
 * Specific filter mode (6 items per service):
 *   • 2×3 centered grid (3 cols, 2 rows)
 *   • Before/After logic for Débarras, Nettoyage, Aménagement:
 *     top row = 3 BEFORE photos, bottom row = 3 AFTER photos
 *     aligned by column so each AFTER is under its BEFORE
 *   • Menuiserie & Bricolage: simple 2×3 grid
 *   • AVANT / APRÈS labels on matching services
 *
 * Lightbox: dark modal, arrows, ESC closes, navigates current filtered set
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "../lib/LangContext";

// ── Gallery data — 30 real company photos (6 per service) ────────────────────
// cat index matches filter index: 1=Débarras, 2=Nettoyage, 3=Aménagement, 4=Menuiserie, 5=Bricolage
// pair: links avant/après by column (1,2,3 = col1,col2,col3)
interface GalleryItem {
  id: number;
  cat: number;
  img: string;
  isAvant?: boolean;
  isApres?: boolean;
  pair?: number; // column index for before/after alignment
  alt: string;
}

const ALL_ITEMS: GalleryItem[] = [
  // ── Débarras (cat 1) ─────────────────────────────────────────────────────
  { id: 1,  cat: 1, img: "/assets/galerie/debarras/debarras-box-avant.webp",             isAvant: true,  pair: 1, alt: "Débarras box - Avant" },
  { id: 2,  cat: 1, img: "/assets/galerie/debarras/debarras-chambre-avant.webp",         isAvant: true,  pair: 2, alt: "Débarras chambre - Avant" },
  { id: 3,  cat: 1, img: "/assets/galerie/debarras/debarras-espace-stockage-avant.webp", isAvant: true,  pair: 3, alt: "Débarras espace stockage - Avant" },
  { id: 4,  cat: 1, img: "/assets/galerie/debarras/debarras-box-apres.webp",             isApres: true,  pair: 1, alt: "Débarras box - Après" },
  { id: 5,  cat: 1, img: "/assets/galerie/debarras/debarras-chambre-apres.webp",         isApres: true,  pair: 2, alt: "Débarras chambre - Après" },
  { id: 6,  cat: 1, img: "/assets/galerie/debarras/debarras-espace-stockage-apres.webp", isApres: true,  pair: 3, alt: "Débarras espace stockage - Après" },

  // ── Nettoyage (cat 2) ─────────────────────────────────────────────────────
  { id: 7,  cat: 2, img: "/assets/galerie/nettoyage/nettoyage-cuisine-evier-avant.webp", isAvant: true,  pair: 1, alt: "Nettoyage cuisine évier - Avant" },
  { id: 8,  cat: 2, img: "/assets/galerie/nettoyage/nettoyage-four-avant.webp",          isAvant: true,  pair: 2, alt: "Nettoyage four - Avant" },
  { id: 9,  cat: 2, img: "/assets/galerie/nettoyage/nettoyage-salle-de-bain-avant.webp", isAvant: true,  pair: 3, alt: "Nettoyage salle de bain - Avant" },
  { id: 10, cat: 2, img: "/assets/galerie/nettoyage/nettoyage-cuisine-evier-apres.webp", isApres: true,  pair: 1, alt: "Nettoyage cuisine évier - Après" },
  { id: 11, cat: 2, img: "/assets/galerie/nettoyage/nettoyage-four-apres.webp",          isApres: true,  pair: 2, alt: "Nettoyage four - Après" },
  { id: 12, cat: 2, img: "/assets/galerie/nettoyage/nettoyage-salle-de-bain-apres.webp", isApres: true,  pair: 3, alt: "Nettoyage salle de bain - Après" },

  // ── Aménagement (cat 3) ───────────────────────────────────────────────────
  { id: 13, cat: 3, img: "/assets/galerie/amenagement/amenagement-balcon-avant.webp",    isAvant: true,  pair: 1, alt: "Aménagement balcon - Avant" },
  { id: 14, cat: 3, img: "/assets/galerie/amenagement/amenagement-garage-avant.webp",    isAvant: true,  pair: 2, alt: "Aménagement garage - Avant" },
  { id: 15, cat: 3, img: "/assets/galerie/amenagement/amenagement-salon-avant.webp",     isAvant: true,  pair: 3, alt: "Aménagement salon - Avant" },
  { id: 16, cat: 3, img: "/assets/galerie/amenagement/amenagement-balcon-apres.webp",    isApres: true,  pair: 1, alt: "Aménagement balcon - Après" },
  { id: 17, cat: 3, img: "/assets/galerie/amenagement/amenagement-garage-apres.webp",    isApres: true,  pair: 2, alt: "Aménagement garage - Après" },
  { id: 18, cat: 3, img: "/assets/galerie/amenagement/amenagement-salon-apres.webp",     isApres: true,  pair: 3, alt: "Aménagement salon - Après" },

  // ── Menuiserie (cat 4) ────────────────────────────────────────────────────
  { id: 19, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-cloison-bois-exterieure.webp", alt: "Menuiserie cloison bois extérieure" },
  { id: 20, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-montage-cuisine-01.webp",      alt: "Menuiserie montage cuisine" },
  { id: 21, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-montage-cuisine-02.webp",      alt: "Menuiserie montage cuisine" },
  { id: 22, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-mur-tasseaux.webp",            alt: "Menuiserie mur tasseaux" },
  { id: 23, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-pose-fenetre.webp",            alt: "Menuiserie pose fenêtre" },
  { id: 24, cat: 4, img: "/assets/galerie/menuiserie/menuiserie-pose-porte.webp",              alt: "Menuiserie pose porte" },

  // ── Bricolage (cat 5) ─────────────────────────────────────────────────────
  { id: 25, cat: 5, img: "/assets/galerie/bricolage/bricolage-fixation-porte-cuisine.webp",    alt: "Bricolage fixation porte cuisine" },
  { id: 26, cat: 5, img: "/assets/galerie/bricolage/bricolage-installation-prises.webp",       alt: "Bricolage installation prises" },
  { id: 27, cat: 5, img: "/assets/galerie/bricolage/bricolage-montage-lustre-spots.webp",      alt: "Bricolage montage lustre spots" },
  { id: 28, cat: 5, img: "/assets/galerie/bricolage/bricolage-montage-meuble-salle-de-bain.webp", alt: "Bricolage montage meuble salle de bain" },
  { id: 29, cat: 5, img: "/assets/galerie/bricolage/bricolage-reparation-fenetre.webp",        alt: "Bricolage réparation fenêtre" },
  { id: 30, cat: 5, img: "/assets/galerie/bricolage/bricolage-reparation-store-fenetre.webp",  alt: "Bricolage réparation store fenêtre" },
];

// Services with before/after pairs
const BEFORE_AFTER_CATS = new Set([1, 2, 3]);

const CARD_W = 300;
const GAP    = 14;
const SLOT   = CARD_W + GAP;
const SPEED  = 0.38; // px/frame

// ── Infinite Row Component ────────────────────────────────────────────────────
function InfiniteRow({
  items, direction, paused, onOpen,
}: {
  items: GalleryItem[];
  direction: 1 | -1;
  paused: boolean;
  onOpen: (idx: number) => void;
}) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const rafRef    = useRef<number>(0);
  const pausedRef = useRef(paused);
  const dragRef   = useRef<{ active: boolean; startX: number; startPos: number }>({
    active: false, startX: 0, startPos: 0,
  });

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const strip = useMemo(() => [...items, ...items, ...items], [items]);
  const oneW  = items.length * SLOT;

  useEffect(() => {
    posRef.current = oneW;

    function tick() {
      if (!pausedRef.current && !dragRef.current.active) {
        posRef.current += SPEED * direction;
        if (posRef.current > oneW * 2) posRef.current -= oneW;
        if (posRef.current < 0)        posRef.current += oneW;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [items, direction, oneW]);

  const startDrag = useCallback((clientX: number) => {
    dragRef.current = { active: true, startX: clientX, startPos: posRef.current };
  }, []);
  const moveDrag = useCallback((clientX: number) => {
    if (!dragRef.current.active) return;
    const dx = clientX - dragRef.current.startX;
    let next = dragRef.current.startPos - dx;
    if (next > oneW * 2) next -= oneW;
    if (next < 0)        next += oneW;
    posRef.current = next;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-next}px)`;
  }, [oneW]);
  const endDrag = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <div
      className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => { startDrag(e.touches[0].clientX); }}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: GAP, width: strip.length * SLOT }}
      >
        {strip.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex-shrink-0 relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            style={{ width: CARD_W, height: 210 }}
            onClick={() => onOpen(idx % items.length)}
          >
            <img
              src={item.img}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center z-10">
              <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100" />
            </div>
            {(item.isAvant || item.isApres) && (
              <div className={`absolute top-2.5 left-2.5 z-10 px-2 py-1 text-white text-[9px] font-bold tracking-widest uppercase rounded-md ${item.isAvant ? "bg-gray-800/80" : "bg-[#10B65A]"}`}>
                {item.isAvant ? "AVANT" : "APRÈS"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Before/After 2×3 Grid ─────────────────────────────────────────────────────
function BeforeAfterGrid({
  items, onOpen, avantLabel, apresLabel,
}: {
  items: GalleryItem[];
  onOpen: (idx: number) => void;
  avantLabel: string;
  apresLabel: string;
}) {
  // Sort into before row and after row, ordered by pair column
  const avantRow = [...items.filter(i => i.isAvant)].sort((a, b) => (a.pair ?? 0) - (b.pair ?? 0));
  const apresRow = [...items.filter(i => i.isApres)].sort((a, b) => (a.pair ?? 0) - (b.pair ?? 0));

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* AVANT label */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">{avantLabel}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {avantRow.map((item, idx) => (
          <GridCard key={item.id} item={item} idx={idx} onOpen={onOpen} label={avantLabel} labelColor="bg-gray-700/80" />
        ))}
      </div>

      {/* APRÈS label */}
      <div className="flex items-center gap-3 px-1 mt-5">
        <span className="text-xs font-bold tracking-[0.25em] text-[#10B65A] uppercase">{apresLabel}</span>
        <div className="flex-1 h-px bg-[#10B65A]/20" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {apresRow.map((item, idx) => (
          <GridCard key={item.id} item={item} idx={idx + 3} onOpen={onOpen} label={apresLabel} labelColor="bg-[#10B65A]" />
        ))}
      </div>
    </div>
  );
}

// ── Simple 2×3 Grid ────────────────────────────────────────────────────────────
function SimpleGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (idx: number) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
      {items.map((item, idx) => (
        <GridCard key={item.id} item={item} idx={idx} onOpen={onOpen} />
      ))}
    </div>
  );
}

// ── Shared grid card ───────────────────────────────────────────────────────────
function GridCard({
  item, idx, onOpen, label, labelColor,
}: {
  item: GalleryItem;
  idx: number;
  onOpen: (idx: number) => void;
  label?: string;
  labelColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.06 }}
      className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-shadow"
      style={{ height: 220 }}
      onClick={() => onOpen(idx)}
    >
      <img
        src={item.img}
        alt={item.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {label && (
        <div className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-1 text-white text-[9px] font-bold tracking-widest uppercase rounded-md ${labelColor ?? "bg-gray-700/80"}`}>
          {label}
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center z-10">
        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
      </div>
    </motion.div>
  );
}

// ── Main Gallery ──────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useLang();
  const [filter, setFilter]     = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [paused, setPaused]     = useState(false);

  const isTous   = filter === 0;
  const isPaused = paused || lightbox !== null || !isTous;

  // For filtered mode, get all 6 items for that service
  const filtered = useMemo(
    () => isTous ? ALL_ITEMS : ALL_ITEMS.filter(i => i.cat === filter),
    [filter, isTous]
  );

  // Lightbox navigates current filtered set
  const openLightbox  = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const lbPrev = useCallback(() => setLightbox(p => p !== null ? (p - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const lbNext = useCallback(() => setLightbox(p => p !== null ? (p + 1) % filtered.length : null), [filtered.length]);

  // ESC key closes lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, lbPrev, lbNext]);

  const isBeforeAfterCat = !isTous && BEFORE_AFTER_CATS.has(filter);

  return (
    <section id="galerie" className="section-y bg-[#f8f8f8]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader tag={t.gallery.tag} title={t.gallery.title} subtitle={t.gallery.subtitle} />

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {t.gallery.filters.map((label, i) => (
            <button
              key={label}
              onClick={() => { setFilter(i); setLightbox(null); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === i
                  ? "bg-[#10B65A] text-white shadow-lg shadow-[#10B65A]/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#10B65A]/30 hover:text-[#10B65A]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tous: two-row infinite carousel ── */}
        {isTous && (
          <div
            className="flex flex-col gap-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <InfiniteRow items={ALL_ITEMS} direction={1}  paused={isPaused} onOpen={openLightbox} />
            <InfiniteRow items={ALL_ITEMS} direction={-1} paused={isPaused} onOpen={openLightbox} />
          </div>
        )}

        {/* ── Filtered: before/after or simple 2×3 grid ── */}
        {!isTous && (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {isBeforeAfterCat ? (
                <BeforeAfterGrid
                  items={filtered}
                  onOpen={openLightbox}
                  avantLabel={t.gallery.labels.avant}
                  apresLabel={t.gallery.labels.apres}
                />
              ) : (
                <SimpleGrid items={filtered} onOpen={openLightbox} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/96 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="Fermer"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); lbPrev(); }}
              aria-label="Précédent"
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); lbNext(); }}
              aria-label="Suivant"
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28 }}
              src={filtered[lightbox % filtered.length].img}
              alt={filtered[lightbox % filtered.length].alt}
              className="max-w-[90vw] max-h-[86vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
              {(lightbox % filtered.length) + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
