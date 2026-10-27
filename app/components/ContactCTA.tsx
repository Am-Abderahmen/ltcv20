"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, Zap, Shield, Users } from "lucide-react";
import { useLang } from "../lib/LangContext";

function WhatsApp() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const BADGE_ICONS = [Zap, Shield, Users];

export default function ContactCTA() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="section-y bg-[#f8f8f8]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] px-8 py-14 lg:px-16 lg:py-20"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B65A]/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#10B65A]/6 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left */}
            <div className="max-w-lg text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#10B65A]/15 rounded-full mb-6 border border-[#10B65A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B65A] animate-pulse" />
                <span className="text-[#10B65A] text-xs font-semibold tracking-widest uppercase">{t.contact.tag}</span>
              </div>
              <h2 className="font-display font-light text-white leading-tight mb-5"
                  style={{ fontSize:"clamp(2rem,4vw,3.5rem)" }}>
                {t.contact.title}
              </h2>
              <p className="text-white/50 text-lg font-light leading-relaxed mb-8">{t.contact.body}</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {t.contact.badges.map((badge, i) => {
                  const Icon = BADGE_ICONS[i];
                  return (
                    <div key={badge} className="flex items-center gap-2 px-4 py-2 bg-white/6 rounded-full border border-white/8">
                      <Icon size={13} className="text-[#10B65A]" />
                      <span className="text-white/60 text-xs font-medium">{badge}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — CTAs */}
            <div className="flex flex-col gap-4 w-full max-w-xs lg:max-w-sm">
              <a href="tel:+41768238910"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#10B65A] text-white font-semibold rounded-2xl shadow-2xl shadow-[#10B65A]/25 hover:bg-[#0a9248] hover:-translate-y-0.5 transition-all text-base">
                <Phone size={19} />{t.contact.call}
              </a>
              <a href="https://wa.me/41768238910" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/8 text-white font-semibold rounded-2xl border border-white/12 hover:bg-white/14 hover:-translate-y-0.5 transition-all text-base">
                <WhatsApp />{t.contact.whatsapp}
              </a>
              <a href="mailto:Lestroiscoins@gmail.com"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/8 text-white font-semibold rounded-2xl border border-white/12 hover:bg-white/14 hover:-translate-y-0.5 transition-all text-base">
                <Mail size={19} />{t.contact.email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
