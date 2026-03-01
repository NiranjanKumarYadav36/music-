import type { CSSProperties } from 'react';

// ─── Deterministic hash ───────────────────────────────────────────────────────
export function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Seeded pseudo-random helpers
function seededRand(seed: number, idx: number) {
  return Math.abs(Math.sin(seed * 9301 + idx * 49297 + 233) * 1000) % 1;
}
function sr(seed: number, i: number, min: number, max: number) {
  return min + seededRand(seed, i) * (max - min);
}
function si(seed: number, i: number, min: number, max: number) {
  return Math.floor(sr(seed, i, min, max));
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type CoverData = {
  background: string;
  animation?: string;
  shapes: Array<{
    type: string;
    style: CSSProperties;
    opacity: number;
  }>;
};

// ─── Style generators ─────────────────────────────────────────────────────────

/**
 * 1. GEOMETRIC TILE — inspired by uploaded image 1
 * Dark navy grid, overlapping circles, pastel pink/blue fills
 */
function geoTile(seed: number, h: number): CoverData {
  const navy = `hsl(${220 + si(seed, 0, 0, 20)}, 28%, ${20 + si(seed, 1, 0, 6)}%)`;
  const accent = `hsl(${h}, 55%, 75%)`;
  const shapes: CoverData['shapes'] = [];

  // 3×3 background grid tiles
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      const useFill = seededRand(seed, idx + 50) > 0.45;
      shapes.push({
        type: 'rect', opacity: 1, style: {
          position: 'absolute',
          left: `${c * 33.33}%`, top: `${r * 33.33}%`,
          width: '33.33%', height: '33.33%',
          background: useFill
            ? `hsl(${(h + idx * 33) % 360}, ${40 + si(seed, idx, 10, 30)}%, ${60 + si(seed, idx + 9, 0, 20)}%)`
            : navy,
        }
      });
    }
  }

  // Large overlapping white circle
  shapes.push({
    type: 'circle', opacity: 0.92, style: {
      position: 'absolute',
      width: '72%', height: '72%',
      left: '-4%', top: '14%',
      borderRadius: '50%',
      background: 'white',
      mixBlendMode: 'luminosity' as any,
    }
  });

  // Accent circle quarter
  shapes.push({
    type: 'circle', opacity: 0.85, style: {
      position: 'absolute',
      width: '50%', height: '50%',
      right: '-8%', bottom: '-8%',
      borderRadius: '50%',
      background: `hsl(${(h + 50) % 360}, 60%, 72%)`,
      mixBlendMode: 'multiply' as any,
    }
  });

  return { background: navy, shapes };
}

/**
 * 2. BOLD BAUHAUS — inspired by image 2
 * Black background, primary blob shapes
 */
function boldBauhaus(seed: number, h: number): CoverData {
  const bolds = [
    `hsl(${h % 360}, 90%, 48%)`,
    `hsl(${(h + 80) % 360}, 95%, 50%)`,
    `hsl(${(h + 160) % 360}, 85%, 46%)`,
    `hsl(${(h + 220) % 360}, 92%, 52%)`,
  ];
  const shapes: CoverData['shapes'] = [];

  // 3 column-bands
  for (let c = 0; c < 3; c++) {
    shapes.push({
      type: 'rect', opacity: 0.95, style: {
        position: 'absolute',
        left: `${c * 33}%`, top: 0,
        width: '34%', height: '55%',
        background: bolds[(c + si(seed, c, 0, 4)) % bolds.length],
      }
    });
    shapes.push({
      type: 'rect', opacity: 0.9, style: {
        position: 'absolute',
        left: `${c * 33}%`, top: '52%',
        width: '34%', height: '50%',
        background: bolds[(c + si(seed, c + 6, 1, 5)) % bolds.length],
      }
    });
  }
  // Organic squiggle blobs on top
  for (let i = 0; i < 4; i++) {
    shapes.push({
      type: 'circle', opacity: 0.9, style: {
        position: 'absolute',
        width: `${30 + si(seed, i + 10, 0, 25)}%`,
        height: `${30 + si(seed, i + 14, 0, 25)}%`,
        left: `${si(seed, i + 20, 5, 65)}%`,
        top: `${si(seed, i + 24, 5, 55)}%`,
        background: bolds[(i + si(seed, i + 30, 0, 4)) % bolds.length],
        borderRadius: `${40 + si(seed, i + 35, 0, 35)}% ${60 - si(seed, i + 36, 0, 20)}% ${55 + si(seed, i + 37, 0, 20)}% ${45 - si(seed, i + 38, 0, 10)}%`,
        mixBlendMode: 'multiply' as any,
      }
    });
  }

  return { background: '#0a0a0a', shapes };
}

/**
 * 3. SUNBURST — inspired by image 3
 * Cream bg, bold single-color radiating rays
 */
function sunburst(seed: number, h: number): CoverData {
  const orange = `hsl(${25 + si(seed, 0, 0, 60)}, 85%, ${48 + si(seed, 1, 0, 10)}%)`;
  const cream = `hsl(${40 + si(seed, 2, 0, 20)}, 30%, ${92 + si(seed, 3, 0, 6)}%)`;
  const shapes: CoverData['shapes'] = [];
  const rayCount = 10 + si(seed, 10, 0, 8);

  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * 360;
    shapes.push({
      type: 'rect', opacity: 0.85, style: {
        position: 'absolute',
        width: '14%', height: '55%',
        left: '43%', top: '0%',
        transformOrigin: '50% 100%',
        transform: `rotate(${angle}deg)`,
        background: orange,
        borderRadius: '8px 8px 0 0',
      }
    });
  }
  // Center medallion
  shapes.push({
    type: 'circle', opacity: 1, style: {
      position: 'absolute',
      width: '24%', height: '24%',
      left: '38%', top: '38%',
      borderRadius: '50%',
      background: cream,
      zIndex: 2,
      boxShadow: `0 0 0 4px ${orange}`,
    }
  });
  // Inner ring lines
  for (let i = 0; i < 5; i++) {
    shapes.push({
      type: 'rect', opacity: 0.55, style: {
        position: 'absolute',
        width: `${(i + 1) * 12 + 10}%`,
        height: `${(i + 1) * 12 + 10}%`,
        left: `${50 - ((i + 1) * 6 + 5)}%`,
        top: `${50 - ((i + 1) * 6 + 5)}%`,
        borderRadius: '50%',
        border: `2px solid ${orange}`,
        background: 'transparent',
      }
    });
  }

  return { background: cream, shapes };
}

/**
 * 4. ORGANIC BLOB GRID — inspired by image 4
 * Lime/green palette, rounded pill organic grid
 */
function organicGrid(seed: number, h: number): CoverData {
  const bg = `hsl(${80 + si(seed, 0, 0, 40)}, 75%, ${80 + si(seed, 1, 0, 10)}%)`;
  const dark = `hsl(${150 + si(seed, 2, 0, 30)}, 60%, ${28 + si(seed, 3, 0, 14)}%)`;
  const shapes: CoverData['shapes'] = [];
  const cols = 3, rows = 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const isStripe = seededRand(seed, idx + 70) > 0.55;
      const br = `${30 + si(seed, idx + 80, 0, 50)}%`;
      shapes.push({
        type: 'pill', opacity: 0.92, style: {
          position: 'absolute',
          width: `${26 + si(seed, idx + 90, 0, 6)}%`,
          height: `${26 + si(seed, idx + 91, 0, 6)}%`,
          left: `${c * 33 + 1.5}%`,
          top: `${r * 25}%`,
          background: isStripe
            ? `repeating-linear-gradient(-45deg, ${dark}, ${dark} 3px, ${bg} 3px, ${bg} 9px)`
            : dark,
          borderRadius: br,
        }
      });
    }
  }

  return { background: bg, shapes };
}

/**
 * 5. RETRO WAVE — inspired by image 5
 * Deep orange, concentric S-wave layers
 */
function retroWave(seed: number, h: number): CoverData {
  const base = `hsl(${22 + si(seed, 0, 0, 20)}, 90%, ${35 + si(seed, 1, 0, 8)}%)`;
  const light = `hsl(${35 + si(seed, 2, 0, 20)}, 95%, ${62 + si(seed, 3, 0, 10)}%)`;
  const dark = `hsl(${15 + si(seed, 4, 0, 15)}, 75%, ${18 + si(seed, 5, 0, 8)}%)`;
  const shapes: CoverData['shapes'] = [];
  const waveN = 7 + si(seed, 10, 0, 5);

  for (let i = 0; i < waveN; i++) {
    const t = i / waveN;
    const hue = 22 + t * 20;
    const lit = 22 + t * 45;
    shapes.push({
      type: 'wave', opacity: 1, style: {
        position: 'absolute',
        width: '200%',
        height: '90%',
        left: '-50%',
        top: `${-20 + i * (140 / waveN)}%`,
        background: `hsl(${hue}, 88%, ${lit}%)`,
        borderRadius: '42%',
        transform: `rotate(${si(seed, i + 20, 8, 22)}deg) scaleX(${0.9 + seededRand(seed, i + 30) * 0.3})`,
      }
    });
  }

  return { background: base, shapes };
}

/**
 * 6. GRADIENT MOSAIC — pastel gradient tiles (existing grid, enhanced)
 */
function gradientMosaic(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const idx = i * 4 + j;
      shapes.push({
        type: 'grid', opacity: 0.75, style: {
          position: 'absolute',
          width: '23%', height: '23%',
          left: `${i * 25 + 1}%`, top: `${j * 25 + 1}%`,
          background: `radial-gradient(circle at ${40 + si(seed, idx, 0, 30)}% ${30 + si(seed, idx + 16, 0, 40)}%,
          hsl(${(h + idx * 17) % 360}, 70%, 75%),
          hsl(${(h + idx * 27 + 90) % 360}, 55%, 62%))`,
          borderRadius: `${si(seed, idx + 32, 10, 50)}%`,
        }
      });
    }
  }
  const bg = `linear-gradient(${si(seed, 99, 0, 360)}deg,
    hsl(${h},60%,85%), hsl(${(h + 40) % 360},55%,78%))`;
  return { background: bg, shapes };
}

/**
 * 7. NEON DARK — dark bg, neon glow circles
 */
function neonDark(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  for (let i = 0; i < 5; i++) {
    const hue = (h + i * 55) % 360;
    const size = 30 + si(seed, i, 0, 40);
    shapes.push({
      type: 'circle', opacity: 0.5 + seededRand(seed, i + 20) * 0.4, style: {
        position: 'absolute',
        width: `${size}%`, height: `${size}%`,
        left: `${si(seed, i + 10, 5, 70)}%`, top: `${si(seed, i + 15, 5, 70)}%`,
        borderRadius: '50%',
        background: `radial-gradient(circle, hsl(${hue}, 95%, 65%), transparent 70%)`,
        filter: `blur(${si(seed, i + 25, 2, 8)}px)`,
        mixBlendMode: 'screen' as any,
      }
    });
  }
  return { background: `hsl(${230 + si(seed, 0, 0, 30)}, 25%, 8%)`, shapes };
}

/**
 * 8. HALFTONE — cream/paper bg, colored dot grid
 */
function halftone(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  const cols = 8, rows = 8;
  const accent = `hsl(${h}, 80%, 52%)`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const size = 4 + seededRand(seed, idx) * 8;
      shapes.push({
        type: 'circle', opacity: 0.65 + seededRand(seed, idx + 64) * 0.35, style: {
          position: 'absolute',
          width: `${size}%`, height: `${size}%`,
          left: `${c * 12 + 2}%`, top: `${r * 12 + 2}%`,
          borderRadius: '50%',
          background: seededRand(seed, idx + 128) > 0.4 ? accent
            : `hsl(${(h + 180) % 360}, 70%, 58%)`,
        }
      });
    }
  }
  return { background: `hsl(${40 + si(seed, 0, 0, 20)}, 25%, 92%)`, shapes };
}

/**
 * 9. SPLIT DIAGONAL — bold diagonal split two-tone
 */
function splitDiagonal(seed: number, h: number): CoverData {
  const c1 = `hsl(${h}, 75%, 52%)`;
  const c2 = `hsl(${(h + 155) % 360}, 70%, 46%)`;
  const c3 = `hsl(${(h + 80) % 360}, 85%, 60%)`;
  const shapes: CoverData['shapes'] = [
    {
      type: 'rect', opacity: 1, style: {
        position: 'absolute', inset: 0,
        background: c2,
        clipPath: `polygon(0 0, 100% 0, 100% ${40 + si(seed, 0, 0, 20)}%, 0 ${60 + si(seed, 1, 0, 20)}%)`,
      }
    },
    {
      type: 'circle', opacity: 0.8, style: {
        position: 'absolute',
        width: '55%', height: '55%',
        left: '22%', top: '22%',
        borderRadius: '50%',
        background: c3,
        mixBlendMode: 'overlay' as any,
      }
    },
    {
      type: 'rect', opacity: 0.6, style: {
        position: 'absolute',
        width: '30%', height: '30%',
        right: '8%', bottom: '8%',
        background: '#fff',
        borderRadius: `${si(seed, 5, 10, 50)}%`,
        mixBlendMode: 'overlay' as any,
      }
    },
  ];
  return { background: c1, shapes };
}

/**
 * 10. OP-ART VORTEX — inspired by image 1 (red/black spiral tunnel)
 * Nested rotated rectangles converging inward, alternating two colours
 */
function opArtVortex(seed: number, h: number): CoverData {
  const col1 = `hsl(${(h + si(seed, 0, 0, 40)) % 360}, 88%, ${42 + si(seed, 1, 0, 14)}%)`;
  const col2 = '#0a0808';
  const layers = 10 + si(seed, 5, 0, 6);
  const shapes: CoverData['shapes'] = [];

  for (let i = 0; i < layers; i++) {
    const t = i / layers;
    const size = 100 - t * 88;
    const rot = si(seed, i + 20, 4, 10) * (i % 2 === 0 ? 1 : -1) + t * 45;
    shapes.push({
      type: 'rect', opacity: 1, style: {
        position: 'absolute',
        width: `${size}%`,
        height: `${size}%`,
        left: `${(100 - size) / 2}%`,
        top: `${(100 - size) / 2}%`,
        background: i % 2 === 0 ? col1 : col2,
        transform: `rotate(${rot}deg)`,
        transformOrigin: 'center center',
      }
    });
  }
  return { background: col2, shapes };
}

/**
 * 11. ACID GLITCH GRID — inspired by image 2 (lime dot-matrix halftone)
 * Black bg, grid of tiny acid-green dots at random scales — stipple/glitch feel
 */
function acidGlitchGrid(seed: number, h: number): CoverData {
  const lime = `hsl(${75 + si(seed, 0, 0, 30)}, 95%, ${52 + si(seed, 1, 0, 14)}%)`;
  const shapes: CoverData['shapes'] = [];
  const cols = 12, rows = 16;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const prob = seededRand(seed, idx + 200);
      if (prob < 0.18) continue; // random gaps = glitch feel
      const sz = 1.5 + seededRand(seed, idx + 300) * 4.5;
      const blur = seededRand(seed, idx + 400) > 0.85 ? 1 : 0;
      shapes.push({
        type: 'circle', opacity: 0.4 + seededRand(seed, idx + 500) * 0.6, style: {
          position: 'absolute',
          width: `${sz}%`,
          height: `${sz}%`,
          left: `${c * (100 / cols) + seededRand(seed, idx + 600) * 1.2}%`,
          top: `${r * (100 / rows) + seededRand(seed, idx + 700) * 1.2}%`,
          borderRadius: '50%',
          background: seededRand(seed, idx + 800) > 0.92 ? '#fff' : lime,
          filter: blur ? 'blur(1px)' : 'none',
        }
      });
    }
  }
  // Scanline overlay bands
  for (let b = 0; b < 6; b++) {
    shapes.push({
      type: 'rect', opacity: 0.04 + seededRand(seed, b + 900) * 0.06, style: {
        position: 'absolute',
        left: 0, width: '100%',
        height: `${1 + seededRand(seed, b + 910) * 2}%`,
        top: `${si(seed, b + 920, 5, 95)}%`,
        background: lime,
      }
    });
  }
  return { background: '#060606', shapes };
}

/**
 * 12. DREAMY ROOM — inspired by image 3 (pink room, cloud reflections)
 * Soft pink/lavender panels framing a pastel cloud sky
 */
function dreamyRoom(seed: number, h: number): CoverData {
  const pink = `hsl(${310 + si(seed, 0, 0, 30)}, 60%, ${78 + si(seed, 1, 0, 10)}%)`;
  const cloud = `hsl(${200 + si(seed, 2, 0, 40)}, 55%, ${82 + si(seed, 3, 0, 8)}%)`;
  const shapes: CoverData['shapes'] = [];

  // Sky gradient fill (centre)
  shapes.push({
    type: 'rect', opacity: 1, style: {
      position: 'absolute',
      left: '12%', top: '5%',
      width: '76%', height: '72%',
      background: `linear-gradient(180deg, ${cloud}, hsl(300,50%,88%) 100%)`,
      borderRadius: '4px',
    }
  });
  // Left/right wall panels
  for (const side of ['left', 'right'] as const) {
    shapes.push({
      type: 'rect', opacity: 0.88, style: {
        position: 'absolute',
        [side]: 0, top: 0,
        width: '13%', height: '100%',
        background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'
          }, ${pink}, ${pink}88)`,
      }
    });
  }
  // Floor reflection
  shapes.push({
    type: 'rect', opacity: 0.7, style: {
      position: 'absolute',
      left: 0, bottom: 0,
      width: '100%', height: '30%',
      background: `linear-gradient(to bottom, ${pink}44, ${pink}cc)`,
      backdropFilter: 'blur(2px)',
    }
  });
  // Cloud puffs
  for (let i = 0; i < 6; i++) {
    shapes.push({
      type: 'circle', opacity: 0.55 + seededRand(seed, i + 40) * 0.35, style: {
        position: 'absolute',
        width: `${20 + si(seed, i + 50, 0, 28)}%`,
        height: `${10 + si(seed, i + 60, 0, 14)}%`,
        left: `${si(seed, i + 70, 8, 68)}%`,
        top: `${si(seed, i + 80, 6, 52)}%`,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.82)',
        filter: `blur(${si(seed, i + 90, 4, 10)}px)`,
      }
    });
  }
  return { background: pink, shapes };
}

/**
 * 13. IRIDESCENT OIL — inspired by image 4 (holographic blobs on black)
 * Near-black, screen-blend iridescent colour pools: cyan/magenta/orange/teal
 */
function iridescentOil(seed: number, h: number): CoverData {
  const palette = [
    `hsl(${175 + si(seed, 0, 0, 40)}, 95%, 58%)`,  // cyan/teal
    `hsl(${300 + si(seed, 1, 0, 40)}, 90%, 60%)`,  // magenta/pink
    `hsl(${30 + si(seed, 2, 0, 30)}, 95%, 58%)`,  // orange
    `hsl(${140 + si(seed, 3, 0, 40)}, 80%, 52%)`,  // green
    `hsl(${240 + si(seed, 4, 0, 40)}, 85%, 62%)`,  // indigo/blue
  ];
  const shapes: CoverData['shapes'] = [];

  for (let i = 0; i < 8; i++) {
    const col = palette[i % palette.length];
    const size = 28 + si(seed, i + 10, 0, 40);
    const br = `${30 + si(seed, i + 20, 0, 40)}% ${60 - si(seed, i + 21, 0, 20)}% ${45 + si(seed, i + 22, 0, 30)}% ${55 - si(seed, i + 23, 0, 20)}%`;
    shapes.push({
      type: 'circle', opacity: 0.55 + seededRand(seed, i + 30) * 0.35, style: {
        position: 'absolute',
        width: `${size}%`,
        height: `${size * (0.5 + seededRand(seed, i + 40) * 0.7)}%`,
        left: `${si(seed, i + 50, -5, 70)}%`,
        top: `${si(seed, i + 60, -5, 70)}%`,
        background: `radial-gradient(ellipse, ${col}, transparent 75%)`,
        borderRadius: br,
        filter: `blur(${si(seed, i + 70, 6, 18)}px)`,
        mixBlendMode: 'screen' as any,
        transform: `rotate(${si(seed, i + 80, 0, 360)}deg)`,
      }
    });
  }
  // Grain noise overlay
  shapes.push({
    type: 'rect', opacity: 0.12, style: {
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      mixBlendMode: 'overlay' as any,
    }
  });

  return { background: `hsl(${240 + si(seed, 99, 0, 30)}, 20%, 5%)`, shapes };
}

/**
 * 14. SOFT ATMOSPHERIC — inspired by image 5 (blue-grey + peach soft clouds)
 * Muted blue-grey and warm peach large blurred shapes, painterly and soft
 */
function softAtmospheric(seed: number, h: number): CoverData {
  const peach = `hsl(${28 + si(seed, 0, 0, 25)}, ${65 + si(seed, 1, 0, 20)}%, ${75 + si(seed, 2, 0, 12)}%)`;
  const slate = `hsl(${200 + si(seed, 3, 0, 40)}, ${30 + si(seed, 4, 0, 20)}%, ${58 + si(seed, 5, 0, 14)}%)`;
  const shapes: CoverData['shapes'] = [];

  // Large background blobs — blurred heavy
  const blobData = [
    { col: peach, w: 80, h: 65, l: 10, t: -10 },
    { col: slate, w: 75, h: 60, l: 20, t: 30 },
    { col: peach, w: 60, h: 50, l: -5, t: 50 },
    { col: slate, w: 70, h: 65, l: 40, t: 5 },
    { col: '#f0e8de', w: 50, h: 45, l: 30, t: 45 },
  ];
  blobData.forEach((b, i) => {
    const jitter = (n: number) => n + si(seed, i * 10 + i, -8, 8);
    shapes.push({
      type: 'circle', opacity: 0.72 + seededRand(seed, i) * 0.25, style: {
        position: 'absolute',
        width: `${jitter(b.w)}%`,
        height: `${jitter(b.h)}%`,
        left: `${jitter(b.l)}%`,
        top: `${jitter(b.t)}%`,
        background: b.col,
        borderRadius: `${40 + si(seed, i + 50, 0, 40)}% ${60 - si(seed, i + 51, 0, 20)}% ${50 + si(seed, i + 52, 0, 25)}% ${55 - si(seed, i + 53, 0, 20)}%`,
        filter: `blur(${28 + si(seed, i + 60, 0, 24)}px)`,
        transform: `rotate(${si(seed, i + 70, -25, 25)}deg)`,
      }
    });
  });
  // Fine grain for the papery texture
  shapes.push({
    type: 'rect', opacity: 0.07, style: {
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      mixBlendMode: 'multiply' as any,
    }
  });

  const bgH = (h + si(seed, 99, 20, 60)) % 360;
  return {
    background: `linear-gradient(135deg, ${peach}, ${slate})`,
    shapes,
  };
}

/**
 * 15. GRADIENT CAPSULE — inspired by uploaded image 1
 * Black background, large central pill shape split into vibrant gradient sections.
 */
function gradientCapsule(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  
  const pillWidth = 55;
  const pillHeight = 85;

  // Base pill wrapper background
  shapes.push({
    type: 'rect', opacity: 1, style: {
      position: 'absolute',
      width: `${pillWidth}%`,
      height: `${pillHeight}%`,
      left: `${(100 - pillWidth) / 2}%`,
      top: `${(100 - pillHeight) / 2}%`,
      backgroundColor: '#f5f5fa',
      borderRadius: '200px',
      overflow: 'hidden'
    }
  });

  // Top half: light to blue / pink gradient
  shapes.push({
    type: 'rect', opacity: 1, style: {
      position: 'absolute',
      width: `${pillWidth}%`,
      height: `${pillHeight * 0.5}%`,
      left: `${(100 - pillWidth) / 2}%`,
      top: `${(100 - pillHeight) / 2}%`,
      background: `conic-gradient(from 90deg at 50% 100%, #dcdcdc, #ab9ed2, #cc2c74)`,
      borderTopLeftRadius: '200px',
      borderTopRightRadius: '200px',
    }
  });

  // Bottom half: blue to orange/pink gradient
  shapes.push({
    type: 'rect', opacity: 1, style: {
      position: 'absolute',
      width: `${pillWidth}%`,
      height: `${pillHeight * 0.5}%`,
      left: `${(100 - pillWidth) / 2}%`,
      top: '50%',
      background: `conic-gradient(from -90deg at 50% 0%, #3037ab, #256bd5, #ffb347, #ff9bb2)`,
      borderBottomLeftRadius: '200px',
      borderBottomRightRadius: '200px',
    }
  });

  // Top overlapping semicircle overlay for the 'folded' look
  shapes.push({
    type: 'circle', opacity: 0.9, style: {
      position: 'absolute',
      width: `${pillWidth}%`,
      height: `${pillWidth * 1.3}%`, // keep circular
      left: `${(100 - pillWidth) / 2}%`,
      top: `${(100 - pillHeight) / 2}%`,
      background: `linear-gradient(135deg, #ffffff 10%, transparent 60%)`,
      borderRadius: '50%',
      mixBlendMode: 'overlay' as any,
    }
  });

  return { background: '#121212', shapes };
}

/**
 * 16. CRUSHING WAVE — inspired by uploaded image 2
 * Vibrant blues, teals, layers of overlapping waves and splash dots.
 */
function crushingWave(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  const skyBlue = `#38bdf8`;
  const oceanBlue = `#0ea5e9`;
  const deepBlue = `#0369a1`;

  // Waves
  const numWaves = 6 + si(seed, 1, 0, 4);
  for (let i = 0; i < numWaves; i++) {
    const isPeak = i === numWaves - 1;
    shapes.push({
      type: 'circle', opacity: 0.8 + seededRand(seed, i) * 0.2, style: {
        position: 'absolute',
        width: `${120 + si(seed, i + 10, 0, 60)}%`,
        height: `${120 + si(seed, i + 20, 0, 60)}%`,
        left: `${-30 + si(seed, i + 30, -20, 40)}%`,
        top: `${isPeak ? 25 : 45 + i * 12}%`,
        background: `radial-gradient(ellipse at 50% 0%, ${i % 2 === 0 ? oceanBlue : deepBlue}, transparent)`,
        backgroundColor: deepBlue,
        borderRadius: isPeak ? '10% 80% 40% 50%' : '50%',
        transform: `rotate(${si(seed, i + 40, -25, 10)}deg)`,
        boxShadow: `inset 0 10px 20px rgba(255,255,255,0.3)`
      }
    });

    // Splashes for the peak
    if (isPeak) {
      for (let j = 0; j < 25; j++) {
        shapes.push({
          type: 'circle', opacity: 0.5 + seededRand(seed, j + 50) * 0.5, style: {
            position: 'absolute',
            width: `${1 + si(seed, j + 60, 0, 5)}%`,
            height: `${1 + si(seed, j + 70, 0, 5)}%`,
            left: `${30 + si(seed, j + 80, -20, 40)}%`,
            top: `${15 + si(seed, j + 90, -5, 25)}%`,
            background: 'white',
            boxShadow: '0 0 6px white'
          }
        });
      }
    }
  }

  return { background: skyBlue, shapes };
}

/**
 * 17. INTERLOCKING LINES — inspired by uploaded image 3
 * Off-white background, dense network of red rounded lines.
 */
function interlockingLines(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  const cream = '#fdfaf5';
  const red = '#e53e31';

  const numLoops = 5 + si(seed, 0, 0, 3);
  
  for (let i = 0; i < numLoops; i++) {
    const rx = 5 + si(seed, i * 4 + 1, 0, 50);
    const ry = 5 + si(seed, i * 4 + 2, 0, 30);
    
    // Nested borders
    for (let j = 0; j < 5; j++) {
      shapes.push({
        type: 'rect', opacity: 1, style: {
          position: 'absolute',
          width: `${50 + si(seed, i, -10, 20) - j * 8}%`,
          height: `${70 + si(seed, i+1, -10, 20) - j * 8}%`,
          left: `${rx + j * 4}%`,
          top: `${ry + j * 4}%`,
          border: `5px solid ${red}`,
          borderRadius: '40px',
          background: 'transparent',
        }
      });
    }
  }

  return { background: cream, shapes };
}

/**
 * 18. WATERCOLOR BLOBS — inspired by uploaded image 4
 * Soft painterly organic shapes with overlapping multiply effects.
 */
function watercolorBlobs(seed: number, h: number): CoverData {
  const shapes: CoverData['shapes'] = [];
  const bg = '#f4f1eb';
  const crimson = '#da252b';
  const pink = '#f18ebd';
  const navy = '#1a3b68';

  // Base texture
  shapes.push({
    type: 'rect', opacity: 0.15, style: {
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      mixBlendMode: 'multiply' as any,
    }
  });

  const generateWatercolorEdge = (col: string, l: number, t: number, w: number, h2: number, rad: string, opacityBase: number, z: number) => {
     // Main blob
     shapes.push({
       type: 'circle', opacity: opacityBase, style: {
         position: 'absolute',
         width: `${w}%`, height: `${h2}%`,
         left: `${l}%`, top: `${t}%`,
         background: col,
         borderRadius: rad,
         mixBlendMode: 'multiply' as any,
         zIndex: z,
       }
     });

     // Water fringes
     for (let k = 0; k < 3; k++) {
       shapes.push({
         type: 'circle', opacity: opacityBase * 0.2, style: {
           position: 'absolute',
           width: `${w + k * 3}%`, height: `${h2 + k * 3}%`,
           left: `${l - k * 1.5}%`, top: `${t - k * 1.5}%`,
           background: col,
           borderRadius: rad,
           mixBlendMode: 'multiply' as any,
           filter: `blur(${1 + k * 2}px)`,
           zIndex: z,
         }
       });
     }
  };

  // Center Pink
  generateWatercolorEdge(pink, 10, 25, 75, 65, '50% 55% 45% 60%', 0.85, 2);
  
  // Top Left Crimson
  generateWatercolorEdge(crimson, 5, 5, 45, 45, '60% 40% 50% 50%', 0.95, 3);
  
  // Bottom Right Navy
  generateWatercolorEdge(navy, 65, 75, 22, 18, '40% 50% 60% 45%', 0.9, 1);

  return { background: bg, shapes };
}

// ─── Style registry ───────────────────────────────────────────────────────────
const STYLE_FNS = [
  geoTile,
  boldBauhaus,
  sunburst,
  organicGrid,
  retroWave,
  gradientMosaic,
  neonDark,
  halftone,
  splitDiagonal,
  opArtVortex,
  acidGlitchGrid,
  dreamyRoom,
  iridescentOil,
  softAtmospheric,
  gradientCapsule,
  crushingWave,
  interlockingLines,
  watercolorBlobs,
];

// ─── Main export ──────────────────────────────────────────────────────────────
export function generateCoverData(prompt: string): CoverData {
  const hash = hashString(prompt);
  const seed = Math.abs(hash);
  const h = seed % 360;
  const fn = STYLE_FNS[seed % STYLE_FNS.length];
  return fn(seed, h);
}
