"use client";
/**
 * AboutOrbitVisual v14
 * Reference: white-bg, glossy 3D glass spheres, gradient rims,
 * thin lines, dotted orbital ellipses, small floating orb particles.
 */

import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface Props { labels?: [string, string, string]; tagLine?: string; }

/* ── Layout ────────────────────────────────────────────────── */
const VW = 560, VH = 540;
const CC = { x: 280, y: 288 };   // center nucleus
const CR = 80;                     // center radius

const NODES = [
  { x: 280, y:  90, r: 52, label: "RAPIDITÉ",  icon: "timer",     rim: ["#10B65A","#34D399"], iconColor: "#10B65A", textColor: "#065f46" },
  { x:  88, y: 412, r: 52, label: "QUALITÉ",   icon: "shield",    rim: ["#06b6d4","#0ea5e9"], iconColor: "#0891b2", textColor: "#164e63" },
  { x: 472, y: 412, r: 52, label: "CONFIANCE", icon: "handshake", rim: ["#6366f1","#1B4ED8"], iconColor: "#1B4ED8", textColor: "#1e3a8a" },
];

/* Seed-stable orbital particles (small glowing balls) */
const ORBS = [
  { x: 138, y: 168, r: 6,   color: "#06b6d4", op: 0.9 },
  { x:  52, y: 310, r: 7.5, color: "#06b6d4", op: 0.85 },
  { x: 148, y: 458, r: 5,   color: "#10B65A", op: 0.8 },
  { x: 400, y: 475, r: 5,   color: "#10B65A", op: 0.75 },
  { x: 490, y: 248, r: 6,   color: "#6366f1", op: 0.8 },
  { x: 418, y: 120, r: 5,   color: "#10B65A", op: 0.7 },
  { x: 320, y:  48, r: 4,   color: "#10B65A", op: 0.65 },
  { x: 510, y: 360, r: 4.5, color: "#6366f1", op: 0.7 },
  { x:  68, y: 418, r: 4,   color: "#06b6d4", op: 0.65 },
];

/* Small dot particles */
const DOTS = [
  { x: 200, y: 128, r: 2.5, color: "#10B65A" },
  { x: 458, y: 168, r: 2,   color: "#0ea5e9" },
  { x: 500, y: 310, r: 2.5, color: "#6366f1" },
  { x: 310, y: 505, r: 2.5, color: "#10B65A" },
  { x:  90, y: 240, r: 2,   color: "#06b6d4" },
  { x: 388, y:  70, r: 2,   color: "#34D399" },
];

/* ── Icon SVG paths ──────────────────────────────────────────── */
function TimerIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={cx} cy={cy + 2} r="12"/>
      <path d={`M${cx} ${cy - 4}v6l4 4`}/>
      <path d={`M${cx - 5} ${cy - 15}h10M${cx} ${cy - 15}v3`}/>
    </g>
  );
}
function ShieldIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx} ${cy - 14}l11 4v7c0 6-11 10-11 10s-11-4-11-10v-7z`}/>
      <path d={`M${cx - 4} ${cy + 1}l3.5 3.5 7-7`}/>
    </g>
  );
}
function HandshakeIcon({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx - 13} ${cy - 2}c0 0 3.5-6 9-6 4 0 6.5 3 6.5 3l5-1.5c2.5 0 4.5 2.5 3.5 5l-9 9c-2 2-5.5 1.5-7.5-1`}/>
      <path d={`M${cx - 4} ${cy + 5}l-7 7`}/>
      <path d={`M${cx + 2} ${cy - 1}l3.5-3.5`}/>
    </g>
  );
}

/* ── Glossy sphere definition helper ──────────────────────────── */
function SphereGradients({
  id, rimA, rimB, isCenter,
}: { id: string; rimA: string; rimB: string; isCenter?: boolean }) {
  return (
    <>
      {/* Main fill — white with subtle color tint */}
      <radialGradient id={`${id}-fill`} cx="35%" cy="28%" r="72%">
        <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
        <stop offset="55%"  stopColor={isCenter ? "#f0f9ff" : "#f8fffe"} stopOpacity="0.98"/>
        <stop offset="100%" stopColor={isCenter ? "#dbeafe" : "#ecfdf5"} stopOpacity="0.92"/>
      </radialGradient>
      {/* Glossy highlight */}
      <radialGradient id={`${id}-gloss`} cx="32%" cy="22%" r="48%">
        <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
      </radialGradient>
      {/* Rim gradient */}
      <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor={rimA} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={rimB} stopOpacity="0.7"/>
      </linearGradient>
      {/* Drop shadow / glow */}
      <radialGradient id={`${id}-shadow`} cx="50%" cy="90%" r="50%">
        <stop offset="0%"   stopColor={rimA} stopOpacity="0.22"/>
        <stop offset="100%" stopColor={rimA} stopOpacity="0"/>
      </radialGradient>
    </>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export default function AboutOrbitVisual({ labels }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({
      x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
    });
  }, []);
  const onLeave = useCallback(() => setMouse({ x: 0, y: 0 }), []);

  /* Per-element parallax */
  const para = (fx: number, fy: number) => ({ x: mouse.x * fx, y: mouse.y * fy });

  /* Node positions with parallax */
  const nodePx = [
    { ...para(-7, -9) },
    { ...para( 9,  5) },
    { ...para(-5,  8) },
  ];
  const centerPx = para(-3, -4);

  /* Triangle path */
  const pts = NODES.map((n, i) => ({
    x: n.x + nodePx[i].x,
    y: n.y + nodePx[i].y,
  }));
  const triPath = `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y} L${pts[2].x},${pts[2].y} Z`;

  const nodeLabels: [string, string, string] = labels ?? ["RAPIDITÉ", "QUALITÉ", "CONFIANCE"];

  /* Label positioning (outside circle) */
  const labelCfg = [
    { dx:  0,           dy: -NODES[0].r - 16, anchor: "middle" as const },
    { dx: -NODES[1].r - 72, dy:  6,           anchor: "middle" as const },
    { dx:  NODES[2].r + 72, dy:  6,           anchor: "middle" as const },
  ];

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center justify-center select-none"
      style={{ minHeight: 500 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="relative w-full" style={{ maxWidth: 580 }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Sphere gradients */}
            <SphereGradients id="ctr" rimA="#10B65A" rimB="#1B4ED8" isCenter/>
            {NODES.map((n, i) => (
              <SphereGradients key={i} id={`n${i}`} rimA={n.rim[0]} rimB={n.rim[1]}/>
            ))}

            {/* Global soft shadow filter */}
            <filter id="v14-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12"/>
            </filter>

            {/* Glow filter for lines */}
            <filter id="v14-lineglow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Orb glow */}
            <filter id="v14-orbglow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Rim gradient for center: green-top → blue-bottom */}
            <linearGradient id="ctr-rim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#10B65A" stopOpacity="0.95"/>
              <stop offset="50%"  stopColor="#06b6d4" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#1B4ED8" stopOpacity="0.9"/>
            </linearGradient>
          </defs>

          {/* ── Orbital dotted ellipses ── */}
          {[
            { rx: 250, ry: 90,  rot: -10, color: "#06b6d4", dash: "4 10", dur: 55 },
            { rx: 228, ry: 110, rot:  22, color: "#10B65A", dash: "3 12", dur: 70 },
            { rx: 205, ry: 70,  rot: -30, color: "#6366f1", dash: "3 13", dur: 88 },
          ].map((el, i) => (
            <motion.ellipse
              key={`el${i}`}
              cx={CC.x} cy={CC.y}
              rx={el.rx} ry={el.ry}
              fill="none"
              stroke={el.color}
              strokeWidth="1"
              strokeOpacity="0.28"
              strokeDasharray={el.dash}
              style={{ transformOrigin: `${CC.x}px ${CC.y}px` }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1, rotate: [0, 360] } : {}}
              transition={{
                opacity: { duration: 1, delay: 0.4 + i * 0.2 },
                rotate:  { duration: el.dur, repeat: Infinity, ease: "linear" },
              }}
              transform={`rotate(${el.rot} ${CC.x} ${CC.y})`}
            />
          ))}

          {/* ── Floating orb particles ── */}
          {ORBS.map((orb, i) => (
            <motion.g key={`orb${i}`}>
              {/* Glow behind orb */}
              <motion.circle
                cx={orb.x} cy={orb.y} r={orb.r + 4}
                fill={orb.color}
                opacity={orb.op * 0.25}
                filter="url(#v14-orbglow)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [0, orb.op * 0.25, 0] } : {}}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              />
              {/* Orb */}
              <motion.circle
                cx={orb.x} cy={orb.y} r={orb.r}
                fill={orb.color}
                opacity={orb.op}
                initial={{ opacity: 0, y: 0 }}
                animate={inView ? {
                  opacity: orb.op,
                  y: [0, -6, 0, 4, 0],
                  x: [0, 3, -2, 1, 0],
                } : {}}
                transition={{
                  opacity: { duration: 0.6, delay: 0.5 + i * 0.12 },
                  y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 },
                  x: { duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                }}
              />
              {/* Specular dot on orb */}
              <motion.circle
                cx={orb.x - orb.r * 0.3} cy={orb.y - orb.r * 0.3} r={orb.r * 0.28}
                fill="white" opacity="0.6"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.6 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
              />
            </motion.g>
          ))}

          {/* ── Small dot particles ── */}
          {DOTS.map((d, i) => (
            <motion.circle
              key={`dot${i}`}
              cx={d.x} cy={d.y} r={d.r}
              fill={d.color}
              opacity="0.55"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: [0, 0.55, 0.2, 0.55] } : {}}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}

          {/* ── Triangle connection lines ── */}
          {/* Soft glow */}
          <motion.path
            d={triPath} fill="none"
            stroke="url(#ctr-rim)"
            strokeWidth="8" strokeOpacity="0.1"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
          />
          {/* Crisp line */}
          <motion.path
            d={triPath} fill="none"
            stroke="url(#ctr-rim)"
            strokeWidth="1.4" strokeOpacity="0.75"
            filter="url(#v14-lineglow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.8, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* ── Centre nucleus ── */}
          {(() => {
            const cx = CC.x + centerPx.x;
            const cy = CC.y + centerPx.y;
            return (
              <motion.g
                initial={{ scale: 0.75, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: `${CC.x}px ${CC.y}px` }}
              >
                {/* Drop shadow */}
                <ellipse cx={cx} cy={cy + CR + 10} rx={CR * 0.75} ry={12}
                  fill="url(#ctr-shadow)" opacity="0.4"/>

                {/* Outer breathing rim */}
                <motion.circle cx={cx} cy={cy} r={CR + 8}
                  fill="none" stroke="url(#ctr-rim)" strokeWidth="2" strokeOpacity="0.3"
                  animate={{ r: [CR + 7, CR + 16, CR + 7], strokeOpacity: [0.3, 0.06, 0.3] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Main sphere body */}
                <circle cx={cx} cy={cy} r={CR}
                  fill="url(#ctr-fill)"
                  filter="url(#v14-shadow)"
                />

                {/* Rim ring */}
                <circle cx={cx} cy={cy} r={CR}
                  fill="none" stroke="url(#ctr-rim)" strokeWidth="2.5" strokeOpacity="0.85"
                />

                {/* Inner rim detail */}
                <circle cx={cx} cy={cy} r={CR - 8}
                  fill="none" stroke="url(#ctr-rim)" strokeWidth="0.7" strokeOpacity="0.25"
                />

                {/* Gloss highlight */}
                <ellipse cx={cx - CR * 0.22} cy={cy - CR * 0.28}
                  rx={CR * 0.42} ry={CR * 0.24}
                  fill="url(#ctr-gloss)" opacity="0.7"
                />

                {/* Brand text */}
                <text x={cx} y={cy - 22} textAnchor="middle"
                  fill="#1e3a8a" fontSize="17" fontFamily="'Outfit',sans-serif"
                  fontWeight="800" letterSpacing="3">LES</text>
                <text x={cx} y={cy + 3} textAnchor="middle"
                  fill="#1e3a8a" fontSize="17" fontFamily="'Outfit',sans-serif"
                  fontWeight="800" letterSpacing="3">TROIS</text>
                <text x={cx} y={cy + 28} textAnchor="middle"
                  fill="#1e3a8a" fontSize="17" fontFamily="'Outfit',sans-serif"
                  fontWeight="800" letterSpacing="3">COINS</text>
                <text x={cx} y={cy + 50} textAnchor="middle"
                  fill="#10B65A" fontSize="8.5" fontFamily="'Outfit',sans-serif"
                  fontWeight="400" letterSpacing="5">SARL</text>
              </motion.g>
            );
          })()}

          {/* ── Outer nuclei ── */}
          {NODES.map((node, i) => {
            const px = nodePx[i];
            const nx = node.x + px.x;
            const ny = node.y + px.y;
            const r  = node.r;
            const lc = labelCfg[i];

            return (
              <motion.g
                key={node.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: 0.65 + i * 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Drop shadow */}
                <ellipse cx={nx} cy={ny + r + 6} rx={r * 0.7} ry={8}
                  fill={node.rim[0]} opacity="0.18"/>

                {/* Outer breathing ring */}
                <motion.circle cx={nx} cy={ny} r={r + 7}
                  fill="none" stroke={node.rim[0]} strokeWidth="1.2" strokeOpacity="0.25"
                  animate={{ r: [r + 6, r + 15, r + 6], strokeOpacity: [0.25, 0.04, 0.25] }}
                  transition={{ duration: 2.8 + i * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                />

                {/* Sphere body */}
                <circle cx={nx} cy={ny} r={r}
                  fill={`url(#n${i}-fill)`}
                  filter="url(#v14-shadow)"
                />

                {/* Rim */}
                <circle cx={nx} cy={ny} r={r}
                  fill="none"
                  stroke={`url(#n${i}-rim)`}
                  strokeWidth="2.2"
                  strokeOpacity="0.88"
                />

                {/* Inner rim detail */}
                <circle cx={nx} cy={ny} r={r - 7}
                  fill="none"
                  stroke={node.rim[0]}
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                />

                {/* Gloss highlight */}
                <ellipse
                  cx={nx - r * 0.22} cy={ny - r * 0.28}
                  rx={r * 0.42} ry={r * 0.24}
                  fill={`url(#n${i}-gloss)`} opacity="0.75"
                />

                {/* Icon */}
                <g>
                  {node.icon === "timer"     && <TimerIcon     cx={nx} cy={ny - 6} color={node.iconColor}/>}
                  {node.icon === "shield"    && <ShieldIcon    cx={nx} cy={ny - 4} color={node.iconColor}/>}
                  {node.icon === "handshake" && <HandshakeIcon cx={nx} cy={ny - 4} color={node.iconColor}/>}
                </g>

                {/* Label inside circle, below icon */}
                <text x={nx} y={ny + r - 14} textAnchor="middle"
                  fill={node.textColor}
                  fontSize="9.5"
                  fontFamily="'Outfit',sans-serif"
                  fontWeight="700"
                  letterSpacing="1.5"
                  opacity="0.9">
                  {nodeLabels[i]}
                </text>
              </motion.g>
            );
          })}

        </svg>
      </div>
    </div>
  );
}
