/**
 * MasonryLibrary - A GSAP-powered Masonry layout for the music library.
 * Adapts the MasonryGallery pattern to display NeuralCover tiles for tracks.
 */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Play, Trash2 } from "lucide-react";
import { NeuralCover } from "@/components/studio/NeuralCover";

// ── Hooks ─────────────────────────────────────────────────────────────────────

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === "undefined") return defaultValue;
    const match = queries.findIndex((q) => window.matchMedia(q).matches);
    return values[match] !== undefined ? values[match] : defaultValue;
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    const mediaLists = queries.map((q) => window.matchMedia(q));
    mediaLists.forEach((ml) => ml.addEventListener("change", handler));
    return () => mediaLists.forEach((ml) => ml.removeEventListener("change", handler));
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface MasonryTrack {
  id: string;
  prompt: string;
}

interface GridItem extends MasonryTrack {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryLibraryProps {
  tracks: MasonryTrack[];
  onPlay: (id: string) => void;
  onDelete: (id: string) => void;
  activeTrackId?: string;
}

// ── Deterministic height from prompt ──────────────────────────────────────────

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getCardHeight(prompt: string): number {
  // Gives a pseudo-random height between 200 and 420 based on prompt
  const heights = [220, 260, 300, 340, 380, 420];
  return heights[hashCode(prompt) % heights.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

const MasonryLibrary: React.FC<MasonryLibraryProps> = ({
  tracks,
  onPlay,
  onDelete,
  activeTrackId,
}) => {
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)", "(min-width: 400px)"],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const hasMounted = useRef(false);

  // ── Layout calculation ────────────────────────────────────────────────────
  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], containerHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const gap = 20;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    const gridItems: GridItem[] = tracks.map((track) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const rawHeight = getCardHeight(track.prompt);
      const h = (rawHeight / 400) * columnWidth;
      const y = colHeights[col];
      colHeights[col] += h + gap;
      return { ...track, x, y, w: columnWidth, h };
    });

    return { grid: gridItems, containerHeight: Math.max(...colHeights, 0) };
  }, [columns, tracks, width]);

  // ── GSAP animations ──────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!grid.length) return;

    grid.forEach((item, index) => {
      const element = document.querySelector(`[data-masonry-id="${item.id}"]`);
      if (!element) return;

      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        // Initial entrance: slide up from below with blur
        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: item.x,
            y: window.innerHeight + 200,
            width: item.w,
            height: item.h,
            filter: "blur(20px)",
          },
          {
            opacity: 1,
            ...animProps,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            delay: index * 0.05,
          }
        );
      } else {
        gsap.to(element, {
          ...animProps,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });

    if (grid.length > 0) hasMounted.current = true;
  }, [grid]);

  // ── Hover handlers — bouncy liquid feel ────────────────────────────────────
  const handleMouseEnter = useCallback((element: HTMLElement) => {
    gsap.to(element, { scale: 1.04, y: "-=6", duration: 0.5, ease: "elastic.out(1, 0.5)" });
  }, []);

  const handleMouseLeave = useCallback((element: HTMLElement) => {
    gsap.to(element, { scale: 1, y: "+=6", duration: 0.4, ease: "power2.out" });
  }, []);

  if (tracks.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight, minHeight: "400px" }}
    >
      {grid.map((item) => {
        const isActive = item.id === activeTrackId;
        return (
          <div
            key={item.id}
            data-masonry-id={item.id}
            className={`absolute overflow-hidden cursor-pointer rounded-2xl border ${
              isActive
                ? "border-violet-500/40"
                : "border-white/[0.04]"
            }`}
            style={{
              willChange: "transform, width, height, opacity, filter",
              boxShadow: isActive
                ? "0 0 30px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
          >
            {/* Neural cover background */}
            <div className="absolute inset-0 z-0">
              <NeuralCover prompt={item.prompt} showTitle={true} />
            </div>

            {/* Hover overlay with play/delete */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
              <button
                onClick={() => onPlay(item.id)}
                className={`w-12 h-12 rounded-full border border-violet-400/40 shadow-[0_0_16px_rgba(139,92,246,0.3)] transition flex items-center justify-center ${
                  isActive ? "bg-violet-500/30" : "bg-violet-500/20"
                }`}
              >
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-red-500/20 hover:border-red-400/30 transition flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasonryLibrary;
