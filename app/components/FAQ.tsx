"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "../lib/LangContext";

export default function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-y bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader tag={t.faq.tag} title={t.faq.title} subtitle={t.faq.subtitle} />

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {t.faq.items.map(({ q, a }, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                open === i
                  ? "border-[#10B65A]/30 shadow-lg shadow-[#10B65A]/5 bg-white"
                  : "border-gray-100 bg-white shadow-sm hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
              >
                <span className={`font-medium text-base transition-colors ${open === i ? "text-[#10B65A]" : "text-gray-800"}`}>
                  {q}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  open === i ? "bg-[#10B65A] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {open === i ? <Minus size={15} /> : <Plus size={15} />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="px-7 pb-6 text-gray-500 text-sm leading-[1.9] font-light">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
