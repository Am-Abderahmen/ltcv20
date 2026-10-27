"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  tag: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeader({ tag, title, subtitle, light = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="text-center mb-16 lg:mb-20"
    >
      <motion.div style={{ y }} className="inline-block">
        {/* Tag pill */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 ${
          light ? "bg-white/10 border border-white/15" : "bg-[#10B65A]/10"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B65A]" />
          <span className="text-[#10B65A] text-xs font-semibold tracking-[0.2em] uppercase">{tag}</span>
        </div>

        {/* Title */}
        <h2 className={`font-display font-light leading-tight mb-4 ${
          light ? "text-white" : "text-gray-900"
        } text-4xl sm:text-5xl lg:text-6xl`}>
          {title}
        </h2>

        {subtitle && (
          <p className={`text-lg font-light max-w-xl mx-auto leading-relaxed ${
            light ? "text-white/60" : "text-gray-500"
          }`}>
            {subtitle}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
