"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useLang } from "../lib/LangContext";
import AboutOrbitVisual from "./AboutOrbitVisual";

export default function About() {
  const { t } = useLang();
  const forces = t.about.forces.items;
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="apropos" className="section-y bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader tag={t.about.tag} title={t.about.title} />

        <div ref={sectionRef} className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── LEFT — text ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gray-600 text-lg leading-[1.9] mb-5 font-light">
              {t.about.body1}
            </p>
            <p className="text-gray-600 text-lg leading-[1.9] mb-10 font-light">
              {t.about.body2}
            </p>
            {/* Mini stats */}
            <div className="flex gap-10 pt-6 border-t border-gray-100">
              {[
                { val: "100+",  label: t.whyus.stats[0].label },
                { val: "500+", label: t.whyus.stats[1].label },
                { val: "4",    label: t.whyus.stats[2].label },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-semibold text-[#10B65A]">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT — animated orbital visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <AboutOrbitVisual
              labels={[forces[0].label, forces[1].label, forces[2].label]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
