# Les Trois Coins SARL — Site Web

Site vitrine bilingue FR/DE pour **Les Trois Coins SARL**, entreprise de services à domicile basée à Lausanne.

- **Stack** : Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger
- **URL de production** : https://lestroiscoins.ch

---

## Démarrage rapide

```bash
cp .env.example .env.local   # renseigner NEXT_PUBLIC_SITE_URL
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de production
```

---

## Structure des fichiers clés

```
app/
  layout.tsx          ← metadata SEO, Open Graph, JSON-LD LocalBusiness
  page.tsx            ← assemblage des sections
  sitemap.ts          ← /sitemap.xml (Next.js App Router)
  robots.ts           ← /robots.txt  (Next.js App Router)
  lib/
    translations.ts   ← toutes les chaînes FR / DE
    LangContext.tsx   ← fournisseur de langue + hook useLang()
  components/
    Hero.tsx          ← slider 5 images, CTAs appel/email
    Services.tsx      ← section GSAP ScrollTrigger (desktop) / tabs (mobile)
    Gallery.tsx       ← carrousel infini "Tous" + grille avant/après par service
    ContactCTA.tsx    ← boutons appel, WhatsApp, email
    FloatingButtons   ← barre fixe mobile + bulles desktop
    Header.tsx        ← navigation fixe + logo + sélecteur de langue
    Footer.tsx        ← liens, infos de contact, logo
    Process.tsx       ← 4 étapes du processus
    WhyUs.tsx         ← 3 arguments + compteurs stats
    About.tsx         ← présentation de l'entreprise
    FAQ.tsx           ← accordéon FAQ
public/
  assets/
    logo/             ← logo-les-trois-coins.png
    slider/           ← 5 × .webp (une par service) — fond du Hero
    services/         ← 5 × .webp — section Services GSAP
    galerie/
      debarras/       ← 6 photos (3 avant + 3 après)
      nettoyage/      ← 6 photos (3 avant + 3 après)
      amenagement/    ← 6 photos (3 avant + 3 après)
      menuiserie/     ← 6 photos (sans avant/après)
      bricolage/      ← 6 photos (sans avant/après)
next.config.mjs       ← headers de sécurité (CSP, HSTS, …)
.env.example          ← variables d'environnement à copier
```

---

## Mettre à jour les informations de contact

Toutes les coordonnées sont centralisées dans **`app/lib/translations.ts`**, section `footer` :

```ts
footer: {
  phone:    "+41 76 823 89 10",
  emailAddr:"Lestroiscoins@gmail.com",
  location: "Avenue de la Chablière 21, 1004 Lausanne",
  // …
}
```

Les liens `href` dans les composants suivants **doivent être mis à jour manuellement** si le numéro change :
- `app/components/Hero.tsx` — `href="tel:+41768238910"`
- `app/components/ContactCTA.tsx` — tel + WhatsApp + email
- `app/components/FloatingButtons.tsx` — tel + WhatsApp
- `app/components/Footer.tsx` — tel + email + maps
- `app/layout.tsx` — JSON-LD `telephone` + `email`

---

## Ajouter ou modifier les services

1. **Traductions** (`app/lib/translations.ts`) :
   - Modifier `services.items` (FR et DE) — 5 entrées, dans l'ordre.
   - Mettre à jour `hero.slides` (labels des boutons du Hero).
   - Mettre à jour `gallery.filters` (boutons de filtre de la galerie).

2. **Images services** : déposer dans `public/assets/services/<nom>.webp` et pointer le champ `image` dans `services.items`.

3. **Images slider** : déposer dans `public/assets/slider/<nom>.webp` et mettre à jour le tableau `IMAGES` dans `Hero.tsx`.

---

## Ajouter ou modifier des photos de galerie

- Déposer les fichiers dans `public/assets/galerie/<service>/`.
- Mettre à jour le tableau `ALL_ITEMS` dans `app/components/Gallery.tsx`.
- Conventions de nommage : `<service>-<sujet>-avant.webp` / `<service>-<sujet>-apres.webp`.
- **Services avant/après** (Débarras, Nettoyage, Aménagement) : les items doivent avoir `isAvant`/`isApres` et un `pair` (1–3) pour l'alignement en colonnes.
- **Services simples** (Menuiserie, Bricolage) : pas de `isAvant`/`isApres`.

---

## Traductions (FR / DE)

Tout le texte visible est dans `app/lib/translations.ts`.  
Modifier les deux objets `FR` et `DE` en parallèle pour maintenir la cohérence.

---

## Déploiement

Le site est un site statique/SSR Next.js standard — compatible Vercel, Netlify, ou tout hébergeur Node.js.

```bash
npm run build   # génère .next/
npm start       # démarre le serveur de production
```

Variable d'environnement **requise en production** :
```
NEXT_PUBLIC_SITE_URL=https://lestroiscoins.ch
```
