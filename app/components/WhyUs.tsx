"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Star, EyeOff, Shield } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "../lib/LangContext";

const VALUE_ICONS = [Zap, Star, EyeOff, Shield];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function WhyUs() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-y bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10B65A]/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <SectionHeader tag={t.whyus.tag} title={t.whyus.title} subtitle={t.whyus.subtitle} />

        {/* Values grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
          {t.whyus.values.map(({ label, desc }, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="group relative p-7 lg:p-9 rounded-2xl bg-white border border-gray-100 hover:border-[#10B65A]/20 shadow-sm hover:shadow-xl hover:shadow-[#10B65A]/5 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#10B65A]/8 flex items-center justify-center mb-5 group-hover:bg-[#10B65A] transition-colors">
                  <Icon size={22} className="text-[#10B65A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1.5">{label}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{desc}</p>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#10B65A]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] px-10 py-14 lg:px-16"
        >
          {/* Green glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#10B65A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#10B65A]/8 rounded-full blur-3xl pointer-events-none" />

          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {t.whyus.stats.map(({ value, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <p className="font-display text-5xl lg:text-6xl font-light text-[#10B65A] mb-2">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="text-white/40 text-sm uppercase tracking-widest font-light">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
