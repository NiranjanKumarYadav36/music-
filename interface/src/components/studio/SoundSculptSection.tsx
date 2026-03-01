import React from "react";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface SoundSculptSectionProps {
    reverb: number;
    onReverbChange: (v: number) => void;
    bassBoost: number;
    onBassBoostChange: (v: number) => void;
    treble: number;
    onTrebleChange: (v: number) => void;
    speed: number;
    onSpeedChange: (v: number) => void;
    onResetEffects: () => void;
}

interface GlassSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    display: string;
    onChange: (v: number) => void;
}

const GlassSlider: React.FC<GlassSliderProps> = ({ label, value, min, max, step = 1, display, onChange }) => {
    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex items-center gap-6">
            {/* Label */}
            <span className="w-32 text-xs font-bold uppercase tracking-[0.15em] text-white/40 flex-shrink-0">
                {label}
            </span>

            {/* Rail */}
            <div className="relative flex-1 h-3 group">
                {/* Background track */}
                <div className="absolute inset-0 rounded-full bg-white/8 backdrop-blur-sm border border-white/10" />
                {/* Fill track */}
                <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                    style={{
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, rgba(168,85,247,0.8), rgba(34,211,238,0.9))",
                        boxShadow: `0 0 ${8 + percent * 0.2}px rgba(168,85,247,0.5)`,
                    }}
                />
                {/* Thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full backdrop-blur-lg bg-white/90 border-2 border-[var(--accent)] shadow-[0_0_10px_rgba(168,85,247,0.6)] transition-all duration-150"
                    style={{ left: `calc(${percent}% - 10px)` }}
                />
                {/* Invisible input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
            </div>

            {/* Value */}
            <span
                className="w-14 text-right text-sm font-bold tabular-nums"
                style={{ color: `hsl(${270 - percent * 0.7}, 80%, 75%)` }}
            >
                {display}
            </span>
        </div>
    );
};

const SoundSculptSection: React.FC<SoundSculptSectionProps> = ({
    reverb, onReverbChange,
    bassBoost, onBassBoostChange,
    treble, onTrebleChange,
    speed, onSpeedChange,
    onResetEffects,
}) => {
    return (
        <div className="space-y-1">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                        Sound Sculpt
                    </h3>
                    <p className="text-[11px] text-white/25 mt-0.5">Shape the sonic texture</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onResetEffects}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-200"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </motion.button>
            </div>

            <div className="space-y-7">
                <GlassSlider
                    label="Reverb"
                    value={reverb}
                    min={0}
                    max={100}
                    display={`${reverb}%`}
                    onChange={onReverbChange}
                />
                <GlassSlider
                    label="Bass Boost"
                    value={bassBoost}
                    min={0}
                    max={100}
                    display={`${bassBoost}%`}
                    onChange={onBassBoostChange}
                />
                <GlassSlider
                    label="Treble"
                    value={treble}
                    min={0}
                    max={100}
                    display={`${treble}%`}
                    onChange={onTrebleChange}
                />
                <GlassSlider
                    label="Playback Rate"
                    value={speed}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    display={`${speed.toFixed(1)}x`}
                    onChange={onSpeedChange}
                />
            </div>
        </div>
    );
};

export default SoundSculptSection;
