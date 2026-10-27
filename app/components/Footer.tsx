"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useLang } from "../lib/LangContext";

const navIds = ["#accueil","#apropos","#services","#galerie","#process","#faq","#contact"];

export default function Footer() {
  const { t } = useLang();
  const navLabels = Object.values(t.nav) as string[];
  const serviceLabels = t.services.items.map((s) => s.label);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[#0a0a0a] text-white/45">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative w-32 h-16 flex-shrink-0">
                <Image
                  src="/assets/logo/logo-les-trois-coins-footer.webp"
                  alt="Les Trois Coins SARL"
                  fill
                  className="object-contain object-left"
                  sizes="128px"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5">{t.footer.desc}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B65A] animate-pulse" />
              <span>Disponible 7j/7</span>
            </div>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">{t.footer.nav}</h4>
            <ul className="flex flex-col gap-3">
              {navLabels.map((label, i) => (
                <li key={label}>
                  <button onClick={() => scrollTo(navIds[i])}
                    className="text-sm hover:text-[#10B65A] transition-colors text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">{t.footer.services}</h4>
            <ul className="flex flex-col gap-3">
              {serviceLabels.map((label) => (
                <li key={label}>
                  <button onClick={() => scrollTo("#services")}
                    className="text-sm hover:text-[#10B65A] transition-colors text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">{t.footer.contact}</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-[#10B65A] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+41768238910" className="text-sm text-white/65 hover:text-[#10B65A] transition-colors">{t.footer.phone}</a>
                  <p className="text-xs mt-0.5">Appel & WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-[#10B65A] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="mailto:Lestroiscoins@gmail.com" className="text-sm text-white/65 hover:text-[#10B65A] transition-colors">{t.footer.emailAddr}</a>
                  <p className="text-xs mt-0.5">Réponse rapide</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#10B65A] mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="https://maps.google.com/?q=Avenue+de+la+Chablière+21,+1004+Lausanne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/65 hover:text-[#10B65A] transition-colors"
                  >{t.footer.location}</a>
                  <p className="text-xs mt-0.5">{t.footer.coverage}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Les Trois Coins SARL — {t.footer.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#10B65A] transition-colors">{t.footer.legal}</a>
            <a href="#" className="hover:text-[#10B65A] transition-colors">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
