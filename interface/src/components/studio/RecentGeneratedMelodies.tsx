import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NeuralCover } from "./NeuralCover";

interface Track {
    id: string;
    prompt: string;
}

interface Props {
    tracks: Track[];
    activeTrackId?: string;
    onPlay: (id: string) => void;
}

const SPEED = 36; // px/s — slow cinematic drift
const PAUSE = true;

// ── Single melody card ────────────────────────────────────────────────────────
const MelodyCard: React.FC<{
    track: Track;
    isActive: boolean;
    onPlay: () => void;
}> = ({ track, isActive, onPlay }) => (
    <motion.div
        onClick={onPlay}
        whileHover={{ scale: 1.06, y: -5, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative flex-shrink-0 w-44 h-44 rounded-2xl overflow-hidden cursor-pointer"
        style={{
            border: isActive
                ? "1px solid rgba(139,92,246,0.4)"
                : "1px solid rgba(255,255,255,0.04)",
            boxShadow: isActive
                ? "0 0 30px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 24px rgba(0,0,0,0.3)",
        }}
    >
        {/* Album art cover */}
        <div className="absolute inset-0 z-0">
            <NeuralCover prompt={track.prompt} />
        </div>

        {/* Active pulsing ring */}
        {isActive && (
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-30"
                style={{ border: "1.5px solid rgba(139,92,246,0.4)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
        )}

        {/* Hover overlay with play button */}
        <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(0,0,0,0.46)", backdropFilter: "blur(3px)" }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
        >
            <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    boxShadow: "0 0 16px rgba(139,92,246,0.3)",
                }}
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </motion.div>

        {/* Title + now-playing indicator */}
        <div
            className="absolute bottom-0 left-0 right-0 z-10 px-3 py-2.5"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88), transparent)" }}
        >
            <p className="text-[9px] font-medium uppercase tracking-wider text-white/80 truncate">
                {track.prompt}
            </p>
            {isActive && (
                <div className="flex items-center gap-1 mt-0.5">
                    {[1, 1.4, 0.8, 1.2, 1].map((h, i) => (
                        <motion.div
                            key={i}
                            className="w-[2px] rounded-full bg-violet-400"
                            animate={{ scaleY: [h, h * 1.8, h] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                            style={{ height: 7, transformOrigin: "bottom" }}
                        />
                    ))}
                    <span className="text-[8px] text-violet-400 font-medium ml-1 tracking-wider uppercase">Playing</span>
                </div>
            )}
        </div>
    </motion.div>
);

// ── One infinite scrolling row ─────────────────────────────────────────────────
interface StripProps {
    tracks: Track[];
    activeTrackId?: string;
    onPlay: (id: string) => void;
    reverse: boolean;
}

const MarqueeStrip: React.FC<StripProps> = ({ tracks, activeTrackId, onPlay, reverse }) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const pausedRef = useRef(false);

    const ITEM_W = 176 + 16; // w-44 (176px) + gap-4 (16px)
    const setLen = tracks.length * ITEM_W;

    // Triple the list for seamless infinite scroll
    const list = [...tracks, ...tracks, ...tracks];

    useEffect(() => {
        if (!innerRef.current || setLen === 0) return;

        xRef.current = reverse ? -setLen : 0;

        let last = performance.now();

        const tick = (now: number) => {
            const dt = (now - last) / 1000;
            last = now;

            if (!pausedRef.current) {
                xRef.current += reverse ? SPEED * dt : -SPEED * dt;
                // Reset to create infinite loop
                if (!reverse && xRef.current <= -setLen) xRef.current += setLen;
                if (reverse && xRef.current >= 0) xRef.current -= setLen;

                if (innerRef.current) {
                    innerRef.current.style.transform = `translateX(${xRef.current}px)`;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [setLen, reverse]);

    return (
        <div
            className="overflow-hidden marquee-outer"
            onMouseEnter={() => { pausedRef.current = PAUSE; }}
            onMouseLeave={() => { pausedRef.current = false; }}
        >
            <div
                ref={innerRef}
                className="flex gap-4 will-change-transform"
                style={{ width: `${list.length * ITEM_W}px` }}
            >
                {list.map((track, idx) => (
                    <MelodyCard
                        key={`${track.id}-${idx}`}
                        track={track}
                        isActive={track.id === activeTrackId}
                        onPlay={() => onPlay(track.id)}
                    />
                ))}
            </div>
        </div>
    );
};

// ── Root ───────────────────────────────────────────────────────────────────────
const RecentGeneratedMelodies: React.FC<Props> = ({ tracks, activeTrackId, onPlay }) => {
    if (!tracks?.length) return null;

    // Pad to at least 8 items so the scroll looks full
    const filled = tracks.length < 5
        ? [...tracks, ...tracks, ...tracks, ...tracks].slice(0, 12)
        : tracks;

    return (
        <div className="w-full mt-10 space-y-3">

            {/* Header */}
            <div className="flex items-center gap-3 px-1 mb-5">
                <div className="w-0.5 h-4 rounded-full bg-violet-400/60" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 select-none">
                    Recent Generations
                </span>
                <div className="flex-1 h-px bg-white/[0.04]" />
                <span className="text-[10px] text-white/15 tracking-wide">
                    {tracks.length} track{tracks.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Row 1 — drifts left → */}
            <MarqueeStrip
                tracks={filled}
                activeTrackId={activeTrackId}
                onPlay={onPlay}
                reverse={false}
            />

            {/* Row 2 — drifts right ← (counter-direction, reversed order) */}
            {filled.length >= 4 && (
                <MarqueeStrip
                    tracks={[...filled].reverse()}
                    activeTrackId={activeTrackId}
                    onPlay={onPlay}
                    reverse={true}
                />
            )}

            {/* Fade edges via CSS mask */}
            <style>{`
                .marquee-outer {
                    -webkit-mask-image: linear-gradient(90deg, transparent 0px, black 80px, black calc(100% - 80px), transparent 100%);
                    mask-image: linear-gradient(90deg, transparent 0px, black 80px, black calc(100% - 80px), transparent 100%);
                }
            `}</style>
        </div>
    );
};

export default RecentGeneratedMelodies;
