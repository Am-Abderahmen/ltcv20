"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, ClipboardList, Wrench, ThumbsUp } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "../lib/LangContext";

const STEP_ICONS = [MessageCircle, ClipboardList, Wrench, ThumbsUp];

export default function Process() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="process" className="section-y bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#10B65A]/4 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <SectionHeader tag={t.process.tag} title={t.process.title} subtitle={t.process.subtitle} light />

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.process.steps.map(({ num, label, desc, quote }, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                className="group relative"
              >
                {/* Connector line desktop */}
                {i < t.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-full h-px bg-gradient-to-r from-[#10B65A]/25 to-transparent z-10" />
                )}
                <div className="relative p-7 rounded-2xl bg-white/4 border border-white/8 hover:border-[#10B65A]/30 hover:bg-white/6 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <span className="font-display text-5xl font-light leading-none"
                      style={{ color: "rgba(16,182,90,0.28)" }}>{num}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#10B65A]/15 flex items-center justify-center group-hover:bg-[#10B65A] transition-colors">
                      <Icon size={18} className="text-[#10B65A] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-3">{label}</h3>
                  <p className="text-white/45 text-sm leading-[1.85] font-light flex-1 mb-5">{desc}</p>
                  <div className="pt-4 border-t border-white/8">
                    <p className="text-[#D1D5DB]/80 text-xs italic font-light leading-relaxed">{quote}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B65A]/0 via-[#10B65A]/45 to-[#10B65A]/0 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
