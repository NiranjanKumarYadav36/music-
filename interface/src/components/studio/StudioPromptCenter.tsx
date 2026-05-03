import React from "react";
import { motion } from "framer-motion";
import { StudioPromptInput } from "./StudioPromptInput";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "../MusicGenerator/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type ChipPair = [string[], string[]];

// ─── Chip data (each category split into 2 rows, no emojis) ───────────────────

const GENRE: ChipPair = [
    [
        "Lo-fi", "Orchestral", "Jazz", "Ambient", "Cinematic",
        "Electronic", "Hip-hop", "Folk", "Classical", "R&B", "Pop", "Rock",
    ],
    [
        "Metal", "Blues", "Reggae", "Country", "Soul", "Funk",
        "Drum & Bass", "Chillwave", "Synthwave", "Bossa Nova",
        "Trap", "House", "Techno", "Gospel",
    ],
];

const MOOD: ChipPair = [
    [
        "Dreamy", "Energetic", "Melancholic", "Uplifting", "Tense",
        "Peaceful", "Euphoric", "Nostalgic", "Dark", "Romantic",
    ],
    [
        "Mysterious", "Epic", "Playful", "Haunting", "Warm",
        "Introspective", "Hypnotic", "Aggressive", "Serene",
        "Whimsical", "Triumphant", "Lonely", "Joyful", "Spiritual",
    ],
];

const INSTRUMENTS: ChipPair = [
    [
        "Piano", "Guitar", "Synth", "Drums", "Bass",
        "Violin", "Flute", "Trumpet", "Saxophone", "Cello", "Harp", "Organ",
    ],
    [
        "Ukulele", "Banjo", "Sitar", "Choir", "Strings", "Brass",
        "Percussion", "808s", "Pads", "Arp", "Bells", "Marimba",
        "Theremin", "Mandolin", "Dulcimer",
    ],
];

const ERA: ChipPair = [
    [
        "1960s", "1970s", "1980s", "1990s", "2000s", "Baroque", "Retro",
    ],
    [
        "Futuristic", "Vintage", "Medieval", "Asian", "Celtic",
        "Afrobeats", "Latin", "Nordic", "Tribal", "Psychedelic",
    ],
];

const PRODUCTION: ChipPair = [
    [
        "Reverb", "Distorted", "Heavy bass", "Minimalist",
        "Layered", "Raw", "Polished",
    ],
    [
        "Acoustic", "8-bit", "Orchestrated", "A cappella",
        "Studio", "Live feel", "Glitchy", "Spacious",
    ],
];

// Per-category colour config (subtle, refined palette)
const CATEGORY_COLORS = {
    genre: { dot: '#A78BFA', activeBg: 'rgba(167,139,250,0.12)', activeBorder: 'rgba(167,139,250,0.35)', label: '#A78BFA' },
    mood: { dot: '#38BDF8', activeBg: 'rgba(56,189,248,0.10)', activeBorder: 'rgba(56,189,248,0.30)', label: '#38BDF8' },
    instrument: { dot: '#F472B6', activeBg: 'rgba(244,114,182,0.10)', activeBorder: 'rgba(244,114,182,0.30)', label: '#F472B6' },
    era: { dot: '#FB923C', activeBg: 'rgba(251,146,60,0.10)', activeBorder: 'rgba(251,146,60,0.30)', label: '#FB923C' },
    production: { dot: '#34D399', activeBg: 'rgba(52,211,153,0.10)', activeBorder: 'rgba(52,211,153,0.30)', label: '#34D399' },
} as const;

type ColorKey = keyof typeof CATEGORY_COLORS;

// ─── ScrollRow ─────────────────────────────────────────────────────────────────
const ScrollRow: React.FC<{
    chips: string[];
    prompt: string;
    color: (typeof CATEGORY_COLORS)[ColorKey];
    onAppend: (c: string) => void;
}> = ({ chips, prompt, color, onAppend }) => (
    <div
        className="flex items-center gap-1.5 overflow-x-auto py-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
        {chips.map((chip) => {
            const active = prompt.toLowerCase().includes(chip.toLowerCase());
            return (
                <motion.button
                    key={chip}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onAppend(chip)}
                    className="rounded-full text-[12px] font-medium cursor-pointer select-none flex-shrink-0"
                    style={{
                        padding: '5px 14px',
                        background: active ? color.activeBg : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${active ? color.activeBorder : 'rgba(255,255,255,0.04)'}`,
                        color: active ? '#ffffff' : 'rgba(255,255,255,0.35)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: active ? `0 0 12px ${color.activeBg}` : 'none',
                        transition: 'background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                >
                    {chip}
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
        <div className="flex flex-col gap-1.5">
            {/* Section label */}
            <div className="flex items-center gap-2">
                <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: color.dot }}
                />
                <span
                    className="text-[10px] uppercase tracking-[0.2em] font-semibold select-none"
                    style={{ color: color.label, opacity: 0.7 }}
                >
                    {label}
                </span>
            </div>
            <ScrollRow chips={rows[0]} prompt={prompt} color={color} onAppend={append} />
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

            {/* Prompt textarea — generate button is now inside */}
            <StudioPromptInput
                value={prompt}
                onChange={onPromptChange}
                placeholder="Describe the music you want to create..."
                onGenerate={onGenerate}
                isLoading={isLoading}
            />

            {/* Keyword sections */}
            <div className="w-full flex flex-col gap-4">
                <ChipSection label="Genre" colorKey="genre" rows={GENRE} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Mood" colorKey="mood" rows={MOOD} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Instrument" colorKey="instrument" rows={INSTRUMENTS} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Era / Style" colorKey="era" rows={ERA} prompt={prompt} onPromptChange={onPromptChange} />
                <ChipSection label="Production" colorKey="production" rows={PRODUCTION} prompt={prompt} onPromptChange={onPromptChange} />
            </div>

            {/* Status badges */}
            <div className="flex flex-col items-center gap-3 mt-3">
                {prompt.trim().length > 0 && !isLoading && !currentMusic && (
                    <motion.p
                        className="text-[10px] font-medium tracking-[0.2em] text-white/15 uppercase"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        Ready to generate
                    </motion.p>
                )}
                {currentMusic && (
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Generation complete
                    </motion.div>
                )}
            </div>
        </div>
    );
};
