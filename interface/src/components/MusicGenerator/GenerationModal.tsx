import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useTime, useTransform } from 'framer-motion';

interface GenerationModalProps {
  isOpen: boolean;
  progress?: number;
  status?: string;
  onClose?: () => void;
}

/* ─── SVG liquid distortion filter ──────────────────────────────────────────
   Creates the actual "wet glass" light-bending effect on the backdrop */
const LiquidDistortionFilter = () => (
  <svg className="absolute w-0 h-0" style={{ position: 'fixed' }}>
    <defs>
      <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.018"
          numOctaves="3"
          seed="42"
          result="noise"
        >
          <animate
            attributeName="baseFrequency"
            values="0.010 0.014;0.016 0.022;0.010 0.014"
            dur="14s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="seed"
            values="42;67;42"
            dur="20s"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="22"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation="0.6" result="blurred" />
        <feComposite in="blurred" in2="SourceGraphic" operator="in" />
      </filter>

      {/* Glass sphere specular gradient */}
      <radialGradient id="orb-glass" cx="38%" cy="30%" r="58%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
        <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="70%" stopColor="rgba(120,60,200,0.12)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
      </radialGradient>

      {/* Rim light on orb */}
      <radialGradient id="orb-rim" cx="62%" cy="75%" r="60%">
        <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>

      {/* Panel glass gradient */}
      <linearGradient id="panel-glass" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.13)" />
        <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
      </linearGradient>

      {/* Iridescent caustic gradient */}
      <linearGradient id="caustic" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(168,85,247,0.0)" />
        <stop offset="30%" stopColor="rgba(168,85,247,0.25)" />
        <stop offset="60%" stopColor="rgba(34,211,238,0.20)" />
        <stop offset="100%" stopColor="rgba(168,85,247,0.0)" />
      </linearGradient>

      <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
      <filter id="ring-glow">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  </svg>
);

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

/* ─── Progress ring ────────────────────────────────────────────────────────── */
const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = (progress / 100) * circ;
  const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
  const lx = 64 + r * Math.cos(angle);
  const ly = 64 + r * Math.sin(angle);

  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
      {/* Track */}
      <circle cx="64" cy="64" r={r} fill="none"
        stroke="rgba(255,255,255,0.045)" strokeWidth="5.5" />
      {/* Fill */}
      <circle cx="64" cy="64" r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`}
        filter="url(#ring-glow)"
        style={{ transition: 'stroke-dasharray 0.1s ease' }}
      />
      {/* Leading dot */}
      {progress > 3 && (
        <motion.circle
          cx={lx} cy={ly} r={4}
          fill="white"
          filter="url(#ring-glow)"
          animate={{ r: [3.5, 5, 3.5], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  );
};

/* ─── Floating caustic light patches ─────────────────────────────────────── */
const Caustics: React.FC = () => (
  <>
    {[
      { x: '15%', y: '18%', w: 180, h: 60, dur: 7, delay: 0 },
      { x: '55%', y: '72%', w: 140, h: 45, dur: 9, delay: 2 },
      { x: '70%', y: '25%', w: 100, h: 35, dur: 6, delay: 1 },
    ].map((c, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: c.x, top: c.y,
          width: c.w, height: c.h,
          background: 'url(#caustic)',
          backgroundImage: 'linear-gradient(90deg,rgba(168,85,247,0),rgba(168,85,247,0.18),rgba(34,211,238,0.14),rgba(168,85,247,0))',
          filter: 'blur(12px)',
          transform: 'rotate(-20deg)',
        }}
        animate={{
          opacity: [0, 0.7, 0],
          scaleX: [0.8, 1.2, 0.8],
          y: [0, -10, 0],
        }}
        transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
      />
    ))}
  </>
);

/* ─── Phase info ─────────────────────────────────────────────────────────── */
function phase(p: number) {
  if (p < 8) return { n: '01', title: 'Igniting Engine', sub: 'Warming up the neural synthesizer' };
  if (p < 25) return { n: '02', title: 'Parsing Intent', sub: 'Decoding your creative prompt' };
  if (p < 55) return { n: '03', title: 'Neural Synthesis', sub: 'Composing tokens in latent space' };
  if (p < 75) return { n: '04', title: 'Signal Rendering', sub: 'Translating tokens to waveform' };
  if (p < 90) return { n: '05', title: 'Spatial Encoding', sub: 'Shaping the stereo soundscape' };
  return { n: '06', title: 'Finishing Masterpiece', sub: 'Polishing the final output' };
}

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

  /* Rotating iridescent hue for the orb border */
  const time = useTime();
  const hue = useTransform(time, t => `hsl(${(t * 0.04) % 360}, 70%, 65%)`);

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
          {/* SVG filter defs — rendered once */}
          <LiquidDistortionFilter />

          {/* ── Backdrop ── */}
          <motion.div
            key="gm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9990]"
            style={{
              backdropFilter: 'blur(36px) saturate(140%) brightness(0.7)',
              WebkitBackdropFilter: 'blur(36px) saturate(140%) brightness(0.7)',
              background: 'radial-gradient(ellipse at 50% 20%, rgba(100,40,180,0.22) 0%, rgba(4,3,10,0.78) 70%)',
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
            <motion.div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.10) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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
            <div className="pointer-events-auto w-full max-w-[400px] relative">

              {/* ── Outermost glow ring (iridescent, rotating hue) ── */}
              <motion.div
                className="absolute -inset-[2px] rounded-[46px] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg,rgba(168,85,247,0.6),rgba(34,211,238,0.4),rgba(129,140,248,0.5),rgba(168,85,247,0.6))',
                  filter: 'blur(2px)',
                  backgroundSize: '300% 300%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* ── Outer frosted rim ── */}
              <div
                className="absolute -inset-[1px] rounded-[45px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)',
                }}
              />

              {/* ── Main glass card ── */}
              <div
                className="relative overflow-hidden rounded-[44px]"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.095) 0%, rgba(255,255,255,0.028) 45%, rgba(255,255,255,0.055) 100%)',
                  backdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
                  WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: [
                    'inset 0 1px 0 rgba(255,255,255,0.22)',     // top highlight
                    'inset 0 -1px 0 rgba(255,255,255,0.06)',    // bottom edge
                    'inset 1px 0 0 rgba(255,255,255,0.10)',     // left edge
                    '0 40px 100px rgba(0,0,0,0.70)',            // drop shadow
                    '0 0 0 1px rgba(168,85,247,0.08)',          // subtle purple ring
                  ].join(', '),
                }}
              >
                {/* ── Glass surface reflection (top-left specular) ── */}
                <div
                  className="absolute top-0 left-0 w-[70%] h-[35%] rounded-tl-[44px] pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.14), transparent 65%)',
                  }}
                />

                {/* ── Caustic light patches ── */}
                <Caustics />

                {/* ── Animating micro-particle field ── */}
                {Array.from({ length: 18 }).map((_, i) => {
                  const px = 8 + (i * 71 + 13) % 84;
                  const py = 5 + (i * 53 + 7) % 88;
                  const sz = 1 + (i % 3) * 0.7;
                  const h = 260 + (i * 23) % 80;
                  return (
                    <motion.div key={i} className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${px}%`, top: `${py}%`,
                        width: sz, height: sz,
                        background: `hsl(${h},80%,72%)`,
                        boxShadow: `0 0 ${sz * 4}px hsl(${h},80%,72%)`,
                      }}
                      animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.6, 0.4], y: [0, -16, 0] }}
                      transition={{ duration: 3.5 + (i % 4) * 1.2, repeat: Infinity, delay: i * 0.28, ease: 'easeInOut' }}
                    />
                  );
                })}

                {/* ── Content ── */}
                <div className="relative z-10 px-9 pt-9 pb-8 flex flex-col items-center gap-6">

                  {/* Phase badge row */}
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 select-none">
                        Neural Synthesis
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 select-none">
                      {ph.n} / 06
                    </span>
                  </div>

                  {/* ── Orb system ── */}
                  <div className="relative w-[152px] h-[152px]">
                    {/* Outer halo rings */}
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-dashed border-white/[0.07]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute -inset-6 rounded-full border border-dotted border-white/[0.035]"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Orb glow aura */}
                    <motion.div
                      className="absolute inset-1 rounded-full blur-xl"
                      style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.28), transparent 70%)' }}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* progress ring */}
                    <ProgressRing progress={dp} />

                    {/* ── Glass sphere orb ── */}
                    <div
                      className="absolute inset-5 rounded-full overflow-hidden"
                      style={{
                        background: 'radial-gradient(circle at 38% 28%, rgba(200,180,255,0.22) 0%, rgba(80,40,140,0.28) 45%, rgba(10,6,22,0.55) 100%)',
                        backdropFilter: 'blur(18px)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        boxShadow: [
                          'inset 0 2px 0 rgba(255,255,255,0.28)',
                          'inset 0 -2px 0 rgba(34,211,238,0.15)',
                          'inset 2px 0 0 rgba(255,255,255,0.08)',
                          '0 0 30px rgba(168,85,247,0.22)',
                        ].join(', '),
                      }}
                    >
                      {/* Specular highlight blob */}
                      <div
                        className="absolute top-[10%] left-[16%] w-[45%] h-[30%] rounded-full"
                        style={{
                          background: 'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)',
                          filter: 'blur(4px)',
                          transform: 'rotate(-20deg)',
                        }}
                      />
                      {/* Rim light (bottom-right) */}
                      <div
                        className="absolute bottom-[8%] right-[10%] w-[40%] h-[25%] rounded-full"
                        style={{
                          background: 'radial-gradient(ellipse, rgba(34,211,238,0.35), transparent 70%)',
                          filter: 'blur(5px)',
                        }}
                      />

                      {/* Center value */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          key={pct}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', damping: 16, stiffness: 320 }}
                          className="text-[30px] font-black tabular-nums text-white leading-none"
                          style={{ textShadow: '0 0 24px rgba(220,190,255,0.9), 0 2px 6px rgba(0,0,0,0.5)' }}
                        >
                          {pct}
                        </motion.span>
                        <span className="text-[8px] font-black uppercase tracking-[0.22em] text-white/35 mt-0.5">%</span>
                      </div>
                    </div>
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
                      <h2
                        className="text-[18px] font-bold text-white tracking-tight"
                        style={{ textShadow: '0 0 30px rgba(168,85,247,0.4)' }}
                      >
                        {ph.title}
                      </h2>
                      <p className="text-[11.5px] text-white/35 font-medium">
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
                      {/* Filled portion */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${dp}%`,
                          background: 'linear-gradient(90deg, #a855f7, #818cf8, #22d3ee)',
                          boxShadow: '0 0 16px rgba(168,85,247,0.75)',
                          transition: 'width 0.1s ease',
                        }}
                      />
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-y-0 w-20 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
                        animate={{ x: ['-80px', '500px'] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
                      />
                      {/* Track top shine */}
                      <div
                        className="absolute inset-x-0 top-0 h-px rounded-full"
                        style={{ background: 'rgba(255,255,255,0.18)' }}
                      />
                    </div>

                    {/* Status ticker */}
                    <div className="flex items-center justify-center gap-2.5">
                      <motion.div className="w-[3px] h-[3px] rounded-full bg-purple-400"
                        animate={{ opacity: [1, 0.15, 1], scale: [1, 1.8, 1] }}
                        transition={{ duration: 1.3, repeat: Infinity }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-white/20 select-none">
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

                {/* ── Bottom glass edge reflection ── */}
                <div
                  className="absolute bottom-0 inset-x-0 h-[40%] rounded-b-[44px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.025), transparent)',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
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
