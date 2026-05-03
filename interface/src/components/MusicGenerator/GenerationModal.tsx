import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface GenerationModalProps {
  isOpen: boolean;
  progress?: number;
  status?: string;
  onClose?: () => void;
}

/* ─── Phase info ─────────────────────────────────────────────────────────── */
function phase(p: number) {
  if (p < 8) return { n: '01', title: 'Initializing', sub: 'Preparing the generation pipeline' };
  if (p < 25) return { n: '02', title: 'Analyzing Prompt', sub: 'Interpreting your creative direction' };
  if (p < 55) return { n: '03', title: 'Generating Audio', sub: 'Composing in latent space' };
  if (p < 75) return { n: '04', title: 'Rendering Waveform', sub: 'Converting tokens to audio signal' };
  if (p < 90) return { n: '05', title: 'Processing', sub: 'Applying spatial encoding' };
  return { n: '06', title: 'Finalizing', sub: 'Polishing the output' };
}

/* ─── Waveform ─────────────────────────────────────────────────────────────── */
const Waveform: React.FC<{ progress: number }> = ({ progress }) => {
  const count = 24;
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        const lit = t * 100 <= progress;
        const h = 14 + Math.sin(t * Math.PI) * 20;
        const hue = 260 - t * 55;
        return (
          <motion.div
            key={i}
            className="rounded-full flex-shrink-0"
            style={{
              width: 2.5,
              background: lit ? `hsl(${hue},85%,70%)` : 'rgba(255,255,255,0.08)',
              boxShadow: lit ? `0 0 10px hsl(${hue},85%,70%)` : 'none',
            }}
            animate={lit
              ? { height: [`${h}%`, `${Math.min(92, h + 36)}%`, `${h}%`] }
              : { height: `${h * 0.22}%` }
            }
            transition={lit
              ? { duration: 0.6 + (i % 4) * 0.18, repeat: Infinity, ease: 'easeInOut', delay: i * 0.025 }
              : { duration: 0.4 }
            }
          />
        );
      })}
    </div>
  );
};

/* ─── Inline styles for gooey loader ────────────────────────────────────── */
const loaderStyles = `
  @keyframes gm-rotate {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes gm-dot-3-move {
    20% { transform: scale(1); }
    45% { transform: translateY(-18px) scale(0.45); }
    60% { transform: translateY(-90px) scale(0.45); }
    80% { transform: translateY(-90px) scale(0.45); }
    100% { transform: translateY(0px) scale(1); }
  }
  @keyframes gm-dot-2-move {
    20% { transform: scale(1); }
    45% { transform: translate(-16px, 12px) scale(0.45); }
    60% { transform: translate(-80px, 60px) scale(0.45); }
    80% { transform: translate(-80px, 60px) scale(0.45); }
    100% { transform: translateY(0px) scale(1); }
  }
  @keyframes gm-dot-1-move {
    20% { transform: scale(1); }
    45% { transform: translate(16px, 12px) scale(0.45); }
    60% { transform: translate(80px, 60px) scale(0.45); }
    80% { transform: translate(80px, 60px) scale(0.45); }
    100% { transform: translateY(0px) scale(1); }
  }
  @keyframes gm-rotate-move {
    55% { transform: rotate(0deg); }
    80% { transform: rotate(360deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes gm-index {
    0%, 100% { z-index: 3; }
    33.3% { z-index: 2; }
    66.6% { z-index: 1; }
  }
  @keyframes gm-outer-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes gm-pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.1); }
  }
`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export const GenerationModal: React.FC<GenerationModalProps> = ({
  isOpen,
  progress = 0,
  status = 'Initializing…',
  onClose,
}) => {
  const [dp, setDp] = useState(0);
  const [pct, setPct] = useState(0);
  const [mounted, setMounted] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const lastP = useRef(0);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    if (!isOpen) {
      setDp(0); setPct(0); last.current = 0; lastP.current = 0;
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    const tick = () => {
      const target = Math.max(0, Math.min(100, progress || 0));
      const curr = last.current;
      if (Math.abs(target - curr) > 0.01) {
        const next = curr + (target - curr) * 0.07;
        const final = Math.abs(target - curr) < 0.1 ? target : next;
        last.current = final;
        setDp(final);
        const p = Math.floor(final);
        if (p !== lastP.current) { lastP.current = p; setPct(p); }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (typeof document !== 'undefined') document.body.style.overflow = 'unset';
    };
  }, [isOpen, progress]);

  if (!isOpen || !mounted || typeof document === 'undefined' || !document.body) return null;

  const ph = phase(dp);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Injected keyframes */}
          <style>{loaderStyles}</style>

          {/* SVG filter for gooey dots */}
          <svg style={{ position: 'fixed', width: 0, height: 0 }}>
            <defs>
              <filter id="gm-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

          {/* ── Backdrop ── */}
          <motion.div
            key="gm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9990]"
            style={{
              backdropFilter: 'blur(36px) saturate(140%) brightness(0.6)',
              WebkitBackdropFilter: 'blur(36px) saturate(140%) brightness(0.6)',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(80,30,150,0.25) 0%, rgba(4,3,10,0.85) 70%)',
            }}
            onClick={onClose}
          />

          {/* ── Ambient colour blobs ── */}
          <div className="fixed inset-0 z-[9991] pointer-events-none overflow-hidden">
            <motion.div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.17) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div className="absolute -bottom-52 right-1/4 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.28, 1], opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>

          {/* ── Modal ── */}
          <motion.div
            key="gm-panel"
            className="fixed inset-0 z-[9992] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.80, y: 48 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 28 }}
            transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto w-full max-w-[420px] relative">

              {/* ── Outermost glow ring ── */}
              <motion.div
                className="absolute -inset-[2px] rounded-[46px] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg,rgba(168,85,247,0.5),rgba(34,211,238,0.35),rgba(129,140,248,0.4),rgba(168,85,247,0.5))',
                  filter: 'blur(2px)',
                  backgroundSize: '300% 300%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* ── Main glass card ── */}
              <div
                className="relative overflow-hidden rounded-[44px]"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.045) 100%)',
                  backdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
                  WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: [
                    'inset 0 1px 0 rgba(255,255,255,0.18)',
                    'inset 0 -1px 0 rgba(255,255,255,0.04)',
                    '0 40px 100px rgba(0,0,0,0.75)',
                    '0 0 0 1px rgba(168,85,247,0.06)',
                  ].join(', '),
                }}
              >
                {/* Glass surface reflection */}
                <div
                  className="absolute top-0 left-0 w-[65%] h-[30%] rounded-tl-[44px] pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.10), transparent 65%)',
                  }}
                />

                {/* Floating particles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const px = 10 + (i * 71 + 13) % 80;
                  const py = 8 + (i * 53 + 7) % 84;
                  const sz = 1 + (i % 3) * 0.6;
                  const h = 260 + (i * 23) % 80;
                  return (
                    <motion.div key={i} className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${px}%`, top: `${py}%`,
                        width: sz, height: sz,
                        background: `hsl(${h},80%,72%)`,
                        boxShadow: `0 0 ${sz * 4}px hsl(${h},80%,72%)`,
                      }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1.5, 0.4], y: [0, -14, 0] }}
                      transition={{ duration: 3.5 + (i % 4) * 1.2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                    />
                  );
                })}

                {/* ── Content ── */}
                <div className="relative z-10 px-9 pt-9 pb-8 flex flex-col items-center gap-5">

                  {/* Phase badge row */}
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20 select-none">
                        Generating
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/15 select-none">
                      {ph.n} / 06
                    </span>
                  </div>

                  {/* ── Central loader — Fused orb + gooey dots ── */}
                  <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>

                    {/* Rotating outer shadow ring (Ratinax style) */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        animation: 'gm-outer-rotate 3s linear infinite',
                        boxShadow: [
                          '0.5em 0.5em 3em rgba(139,92,246,0.6)',
                          '-0.5em 0.5em 3em rgba(99,102,241,0.5)',
                          '0.5em -0.5em 3em rgba(168,85,247,0.5)',
                          '-0.5em -0.5em 3em rgba(34,211,238,0.4)',
                        ].join(', '),
                      }}
                    />

                    {/* Pulsing glow halo */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
                        animation: 'gm-pulse-glow 2.5s ease-in-out infinite',
                      }}
                    />

                    {/* Gooey dots container (Sourcesketch style) */}
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        position: 'relative',
                        filter: 'url(#gm-goo)',
                        animation: 'gm-rotate-move 2s ease-in-out infinite',
                      }}
                    >
                      {/* Dot 3 — violet */}
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        backgroundColor: '#8b5cf6',
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        margin: 'auto',
                        animation: 'gm-dot-3-move 2s ease infinite, gm-index 6s ease infinite',
                        boxShadow: '0 0 20px rgba(139,92,246,0.6)',
                      }} />
                      {/* Dot 2 — indigo/blue */}
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        backgroundColor: '#6366f1',
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        margin: 'auto',
                        animation: 'gm-dot-2-move 2s ease infinite, gm-index 6s -4s ease infinite',
                        boxShadow: '0 0 20px rgba(99,102,241,0.6)',
                      }} />
                      {/* Dot 1 — cyan */}
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        backgroundColor: '#22d3ee',
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        margin: 'auto',
                        animation: 'gm-dot-1-move 2s ease infinite, gm-index 6s -2s ease infinite',
                        boxShadow: '0 0 20px rgba(34,211,238,0.6)',
                      }} />
                    </div>

                    {/* Percentage readout overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                      <motion.span
                        key={pct}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', damping: 16, stiffness: 320 }}
                        className="text-[32px] font-bold tabular-nums text-white leading-none"
                        style={{ textShadow: '0 0 24px rgba(200,180,255,0.7), 0 0 60px rgba(139,92,246,0.4)' }}
                      >
                        {pct}
                      </motion.span>
                      <span
                        className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35 mt-1"
                      >%</span>
                    </div>

                    {/* Outer dashed orbit ring */}
                    <motion.div
                      className="absolute rounded-full border border-dashed border-white/[0.06] pointer-events-none"
                      style={{ width: 194, height: 194 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>

                  {/* Phase label */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={ph.n}
                      initial={{ opacity: 0, filter: 'blur(6px)', y: 10 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, filter: 'blur(4px)', y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="text-center space-y-1"
                    >
                      <h2 className="text-base font-semibold text-white tracking-tight">
                        {ph.title}
                      </h2>
                      <p className="text-[11px] text-white/30 font-medium">
                        {ph.sub}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Waveform */}
                  <Waveform progress={dp} />

                  {/* ── Glass progress rail ── */}
                  <div className="w-full space-y-2.5">
                    <div
                      className="relative w-full h-[4px] rounded-full overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${dp}%`,
                          background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #22d3ee)',
                          boxShadow: '0 0 16px rgba(139,92,246,0.75)',
                          transition: 'width 0.1s ease',
                        }}
                      />
                      <motion.div
                        className="absolute inset-y-0 w-20 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
                        animate={{ x: ['-80px', '500px'] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
                      />
                      <div
                        className="absolute inset-x-0 top-0 h-px rounded-full"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                      />
                    </div>

                    {/* Status ticker */}
                    <div className="flex items-center justify-center gap-2.5">
                      <motion.div className="w-[3px] h-[3px] rounded-full bg-purple-400"
                        animate={{ opacity: [1, 0.15, 1], scale: [1, 1.8, 1] }}
                        transition={{ duration: 1.3, repeat: Infinity }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 select-none">
                        {(status && status !== 'Initializing generator...' && status !== 'Initializing…')
                          ? status : 'Synthesizing audio…'}
                      </span>
                      <motion.div className="w-[3px] h-[3px] rounded-full bg-cyan-400"
                        animate={{ opacity: [0.15, 1, 0.15], scale: [1.8, 1, 1.8] }}
                        transition={{ duration: 1.3, repeat: Infinity }}
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom glass edge */}
                <div
                  className="absolute bottom-0 inset-x-0 h-[40%] rounded-b-[44px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)',
                    borderTop: '1px solid rgba(255,255,255,0.03)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  try { return createPortal(modal, document.body); }
  catch { return modal; }
};
