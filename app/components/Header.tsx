"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLang } from "../lib/LangContext";
import { Lang } from "../lib/translations";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: t.nav.home, id: "#accueil" },
    { label: t.nav.about, id: "#apropos" },
    { label: t.nav.services, id: "#services" },
    { label: t.nav.gallery, id: "#galerie" },
    { label: t.nav.reviews, id: "#process" },
    { label: t.nav.faq, id: "#faq" },
    { label: t.nav.contact, id: "#contact" },
  ];

  const langs: Lang[] = ["FR", "DE"];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-black/5 py-3" : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-4">
          {/* Logo — transparent PNG, no text beside it */}
          <button
            onClick={() => scrollTo("#accueil")}
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B65A] rounded"
            aria-label="Les Trois Coins SARL — retour en haut"
          >
            <Image
              src="/assets/logo/logo-les-trois-coins-transparent.png"
              alt="Les Trois Coins SARL"
              width={120}
              height={55}
              className="object-contain w-[95px] h-auto md:w-[120px] max-h-[55px]"
              priority
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all hover:text-[#10B65A] ${
                  scrolled ? "text-gray-600" : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Globe size={15} />
                {lang}
                <ChevronDown size={13} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {langs.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all ${
                          lang === l ? "text-[#10B65A] bg-[#10B65A]/5" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {l === "FR" ? "🇫🇷 Français" : "🇩🇪 Deutsch"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollTo("#contact")}
              className="btn-primary text-sm"
            >
              {t.cta}
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Mobile */}
          <div className="flex xl:hidden items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="px-4 py-2 bg-[#10B65A] text-white text-sm font-semibold rounded-xl"
            >
              {t.cta}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg ${scrolled ? "text-gray-800" : "text-white"}`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-6 bg-white shadow-2xl rounded-b-3xl"
          >
            <nav className="flex flex-col px-6 gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-800 font-medium hover:bg-gray-50 hover:text-[#10B65A] transition-all text-left"
                >
                  {item.label}
                  <ChevronRight size={15} className="text-gray-300" />
                </button>
              ))}
              <div className="flex gap-2 px-4 mt-3">
                {langs.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      lang === l ? "bg-[#10B65A] text-white border-[#10B65A]" : "text-gray-600 border-gray-200"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
