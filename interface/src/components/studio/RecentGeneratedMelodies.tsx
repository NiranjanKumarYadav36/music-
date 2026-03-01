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
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex-shrink-0 w-44 h-44 rounded-[26px] overflow-hidden cursor-pointer"
        style={{
            border: isActive
                ? "1px solid rgba(168,85,247,0.7)"
                : "1px solid rgba(255,255,255,0.08)",
            boxShadow: isActive
                ? "0 0 32px rgba(168,85,247,0.35), 0 8px 32px rgba(0,0,0,0.5)"
                : "0 4px 24px rgba(0,0,0,0.4)",
        }}
    >
        {/* Album art cover */}
        <div className="absolute inset-0 z-0">
            <NeuralCover prompt={track.prompt} />
        </div>

        {/* Active pulsing ring */}
        {isActive && (
            <motion.div
                className="absolute inset-0 rounded-[26px] pointer-events-none z-30"
                style={{ border: "2px solid rgba(168,85,247,0.5)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                    background: "rgba(168,85,247,0.28)",
                    border: "1px solid rgba(168,85,247,0.55)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.5)",
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
            <p className="text-[9.5px] font-bold uppercase tracking-widest text-white/90 truncate">
                {track.prompt}
            </p>
            {isActive && (
                <div className="flex items-center gap-1 mt-0.5">
                    {[1, 1.4, 0.8, 1.2, 1].map((h, i) => (
                        <motion.div
                            key={i}
                            className="w-[2px] rounded-full bg-purple-400"
                            animate={{ scaleY: [h, h * 1.8, h] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                            style={{ height: 8, transformOrigin: "bottom" }}
                        />
                    ))}
                    <span className="text-[8px] text-purple-400 font-bold ml-1 tracking-widest uppercase">Now</span>
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
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-purple-400/20" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 select-none">
                    Your Library
                </span>
                <div className="flex-1 h-px bg-white/[0.04]" />
                <span className="text-[10px] text-white/20 tracking-widest">
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
