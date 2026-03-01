import React from "react";
import { motion } from "framer-motion";
import { StudioPromptInput } from "./StudioPromptInput";
import { StudioGenerateButton } from "./StudioGenerateButton";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "../MusicGenerator/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type ChipItem = { label: string; emoji: string };
type ChipPair = [ChipItem[], ChipItem[]];

// ─── Chip data (each category split into 2 rows) ─────────────────────────────

const GENRE: ChipPair = [
    [
        { label: "Lo-fi", emoji: "🌙" },
        { label: "Orchestral", emoji: "🎻" },
        { label: "Jazz", emoji: "🎺" },
        { label: "Ambient", emoji: "🌊" },
        { label: "Cinematic", emoji: "🎬" },
        { label: "Electronic", emoji: "⚡" },
        { label: "Hip-hop", emoji: "🔥" },
        { label: "Folk", emoji: "🌿" },
        { label: "Classical", emoji: "🎼" },
        { label: "R&B", emoji: "💜" },
        { label: "Pop", emoji: "🎵" },
        { label: "Rock", emoji: "🎸" },
    ],
    [
        { label: "Metal", emoji: "⚙️" },
        { label: "Blues", emoji: "🟦" },
        { label: "Reggae", emoji: "🌴" },
        { label: "Country", emoji: "🤠" },
        { label: "Soul", emoji: "🕊️" },
        { label: "Funk", emoji: "🕺" },
        { label: "Drum & Bass", emoji: "💣" },
        { label: "Chillwave", emoji: "🌅" },
        { label: "Synthwave", emoji: "🌆" },
        { label: "Bossa Nova", emoji: "🌺" },
        { label: "Trap", emoji: "🏙️" },
        { label: "House", emoji: "🏠" },
        { label: "Techno", emoji: "🤖" },
        { label: "Gospel", emoji: "✝️" },
    ],
];

const MOOD: ChipPair = [
    [
        { label: "Dreamy", emoji: "✨" },
        { label: "Energetic", emoji: "💥" },
        { label: "Melancholic", emoji: "🌧️" },
        { label: "Uplifting", emoji: "☀️" },
        { label: "Tense", emoji: "😤" },
        { label: "Peaceful", emoji: "🕊️" },
        { label: "Euphoric", emoji: "🎉" },
        { label: "Nostalgic", emoji: "📻" },
        { label: "Dark", emoji: "🌑" },
        { label: "Romantic", emoji: "❤️" },
    ],
    [
        { label: "Mysterious", emoji: "🌫️" },
        { label: "Epic", emoji: "🏔️" },
        { label: "Playful", emoji: "🎈" },
        { label: "Haunting", emoji: "👻" },
        { label: "Warm", emoji: "🔆" },
        { label: "Introspective", emoji: "🔍" },
        { label: "Hypnotic", emoji: "🌀" },
        { label: "Aggressive", emoji: "🔥" },
        { label: "Serene", emoji: "🍃" },
        { label: "Whimsical", emoji: "🦋" },
        { label: "Triumphant", emoji: "🏆" },
        { label: "Lonely", emoji: "🌃" },
        { label: "Joyful", emoji: "😄" },
        { label: "Spiritual", emoji: "🙏" },
    ],
];

const INSTRUMENTS: ChipPair = [
    [
        { label: "Piano", emoji: "🎹" },
        { label: "Guitar", emoji: "🎸" },
        { label: "Synth", emoji: "🎛️" },
        { label: "Drums", emoji: "🥁" },
        { label: "Bass", emoji: "🎵" },
        { label: "Violin", emoji: "🎻" },
        { label: "Flute", emoji: "🪈" },
        { label: "Trumpet", emoji: "🎺" },
        { label: "Saxophone", emoji: "🎷" },
        { label: "Cello", emoji: "🎻" },
        { label: "Harp", emoji: "🪗" },
        { label: "Organ", emoji: "🎹" },
    ],
    [
        { label: "Ukulele", emoji: "🎸" },
        { label: "Banjo", emoji: "🪕" },
        { label: "Sitar", emoji: "🪕" },
        { label: "Choir", emoji: "👥" },
        { label: "Strings", emoji: "🎻" },
        { label: "Brass", emoji: "🎺" },
        { label: "Percussion", emoji: "🥁" },
        { label: "808s", emoji: "💣" },
        { label: "Pads", emoji: "🌊" },
        { label: "Arp", emoji: "⚡" },
        { label: "Bells", emoji: "🔔" },
        { label: "Marimba", emoji: "🎼" },
        { label: "Theremin", emoji: "🔭" },
        { label: "Mandolin", emoji: "🪕" },
        { label: "Dulcimer", emoji: "🎵" },
    ],
];

const ERA: ChipPair = [
    [
        { label: "1960s", emoji: "🌸" },
        { label: "1970s", emoji: "🕺" },
        { label: "1980s", emoji: "📼" },
        { label: "1990s", emoji: "💿" },
        { label: "2000s", emoji: "📀" },
        { label: "Baroque", emoji: "🏛️" },
        { label: "Retro", emoji: "📺" },
    ],
    [
        { label: "Futuristic", emoji: "🚀" },
        { label: "Vintage", emoji: "🎞️" },
        { label: "Medieval", emoji: "⚔️" },
        { label: "Asian", emoji: "🏯" },
        { label: "Celtic", emoji: "☘️" },
        { label: "Afrobeats", emoji: "🌍" },
        { label: "Latin", emoji: "💃" },
        { label: "Nordic", emoji: "❄️" },
        { label: "Tribal", emoji: "🥁" },
        { label: "Psychedelic", emoji: "🌈" },
    ],
];

const PRODUCTION: ChipPair = [
    [
        { label: "Reverb", emoji: "🌌" },
        { label: "Distorted", emoji: "📻" },
        { label: "Heavy bass", emoji: "💥" },
        { label: "Minimalist", emoji: "◻️" },
        { label: "Layered", emoji: "📚" },
        { label: "Raw", emoji: "🪨" },
        { label: "Polished", emoji: "💎" },
    ],
    [
        { label: "Acoustic", emoji: "🌲" },
        { label: "8-bit", emoji: "👾" },
        { label: "Orchestrated", emoji: "🎼" },
        { label: "A cappella", emoji: "🗣️" },
        { label: "Studio", emoji: "🎙️" },
        { label: "Live feel", emoji: "🎤" },
        { label: "Glitchy", emoji: "🤖" },
        { label: "Spacious", emoji: "🌌" },
    ],
];

// Per-category colour config
const CATEGORY_COLORS = {
    genre: { dot: '#a855f7', activeBg: 'rgba(168,85,247,0.18)', activeBorder: 'rgba(168,85,247,0.55)', activeGlow: 'rgba(168,85,247,0.4)', hoverBg: 'rgba(168,85,247,0.10)', label: '#c084fc' },
    mood: { dot: '#22d3ee', activeBg: 'rgba(34,211,238,0.15)', activeBorder: 'rgba(34,211,238,0.50)', activeGlow: 'rgba(34,211,238,0.35)', hoverBg: 'rgba(34,211,238,0.08)', label: '#67e8f9' },
    instrument: { dot: '#f472b6', activeBg: 'rgba(244,114,182,0.16)', activeBorder: 'rgba(244,114,182,0.50)', activeGlow: 'rgba(244,114,182,0.38)', hoverBg: 'rgba(244,114,182,0.08)', label: '#f9a8d4' },
    era: { dot: '#fb923c', activeBg: 'rgba(251,146,60,0.16)', activeBorder: 'rgba(251,146,60,0.50)', activeGlow: 'rgba(251,146,60,0.38)', hoverBg: 'rgba(251,146,60,0.08)', label: '#fdba74' },
    production: { dot: '#34d399', activeBg: 'rgba(52,211,153,0.15)', activeBorder: 'rgba(52,211,153,0.50)', activeGlow: 'rgba(52,211,153,0.35)', hoverBg: 'rgba(52,211,153,0.08)', label: '#6ee7b7' },
} as const;

type ColorKey = keyof typeof CATEGORY_COLORS;

// ─── ScrollRow ─────────────────────────────────────────────────────────────────
const ScrollRow: React.FC<{
    chips: ChipItem[];
    prompt: string;
    color: (typeof CATEGORY_COLORS)[ColorKey];
    onAppend: (c: string) => void;
}> = ({ chips, prompt, color, onAppend }) => (
    <div
        className="flex items-center gap-2 overflow-x-auto py-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
        {chips.map((chip) => {
            const active = prompt.toLowerCase().includes(chip.label.toLowerCase());
            return (
                <motion.button
                    key={chip.label}
                    whileHover={{ scale: 1.08, y: -1 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onAppend(chip.label)}
                    className="flex items-center gap-2 rounded-full text-[12.5px] font-semibold transition-colors duration-200 cursor-pointer select-none flex-shrink-0"
                    style={{
                        padding: '6px 14px',
                        background: active ? color.activeBg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? color.activeBorder : 'rgba(255,255,255,0.10)'}`,
                        color: active ? '#ffffff' : 'rgba(255,255,255,0.58)',
                        boxShadow: active ? `0 0 16px ${color.activeGlow}, inset 0 1px 0 rgba(255,255,255,0.12)` : 'none',
                    }}
                >
                    <span style={{ fontSize: 14, lineHeight: 1 }}>{chip.emoji}</span>
                    {chip.label}
                </motion.button>
            );
        })}
    </div>
);

// ─── ChipSection ───────────────────────────────────────────────────────────────
const ChipSection: React.FC<{
    label: string;
    colorKey: ColorKey;
    rows: ChipPair;
    prompt: string;
    onPromptChange: (v: string) => void;
}> = ({ label, colorKey, rows, prompt, onPromptChange }) => {
    const color = CATEGORY_COLORS[colorKey];

    const append = (chip: string) => {
        const t = prompt.trim();
        if (t.toLowerCase().includes(chip.toLowerCase())) return;
        onPromptChange(t ? `${t}, ${chip}` : chip);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Section label */}
            <div className="flex items-center gap-2.5">
                <motion.div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color.dot, boxShadow: `0 0 8px ${color.dot}` }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span
                    className="text-[11px] uppercase tracking-[0.3em] font-black select-none"
                    style={{ color: color.label }}
                >
                    {label}
                </span>
            </div>
            {/* Row A */}
            <ScrollRow chips={rows[0]} prompt={prompt} color={color} onAppend={append} />
            {/* Row B */}
            <ScrollRow chips={rows[1]} prompt={prompt} color={color} onAppend={append} />
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
interface StudioPromptCenterProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    currentMusic: MusicTrack | null;
    className?: string;
}

export const StudioPromptCenter: React.FC<StudioPromptCenterProps> = ({
    prompt,
    onPromptChange,
    onGenerate,
    isLoading,
    currentMusic,
    className,
}) => {
    return (
        <div className={cn("flex-1 flex flex-col gap-5 min-w-0", className)}>

            {/* Prompt textarea */}
            <StudioPromptInput
                value={prompt}
                onChange={onPromptChange}
                placeholder="Describe the music you want to create…"
            />

            {/* Keyword sections */}
            <div className="w-full flex flex-col gap-5">
                <ChipSection label="Genre" colorKey="genre" rows={GENRE} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Mood" colorKey="mood" rows={MOOD} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Instrument" colorKey="instrument" rows={INSTRUMENTS} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Era / Style" colorKey="era" rows={ERA} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Production" colorKey="production" rows={PRODUCTION} prompt={prompt} onPromptChange={onPromptChange} />
            </div>

            {/* Generate action */}
            <div className="flex flex-col items-center gap-4 mt-2">
                <StudioGenerateButton
                    onClick={onGenerate}
                    isLoading={isLoading}
                    disabled={!prompt.trim()}
                />
                {prompt.trim().length > 0 && !isLoading && !currentMusic && (
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase animate-pulse">
                        Neural pulse ready
                    </p>
                )}
                {currentMusic && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Generation Complete — playback deck active
                    </div>
                )}
            </div>
        </div>
    );
};
