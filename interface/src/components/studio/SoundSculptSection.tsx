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
        <div className="flex items-center gap-5">
            {/* Label */}
            <span className="w-28 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 flex-shrink-0">
                {label}
            </span>

            {/* Rail */}
            <div className="relative flex-1 h-2.5 group">
                {/* Background track */}
                <div className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.06]" />
                {/* Fill track */}
                <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                    style={{
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, rgba(129,140,248,0.7), rgba(167,139,250,0.8))",
                        boxShadow: `0 0 ${6 + percent * 0.15}px rgba(139,92,246,0.3)`,
                    }}
                />
                {/* Thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/90 border border-violet-400/50 shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all duration-150"
                    style={{ left: `calc(${percent}% - 8px)` }}
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
                className="w-12 text-right text-xs font-semibold tabular-nums text-violet-300"
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
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                        Audio Effects
                    </h3>
                    <p className="text-[10px] text-white/20 mt-0.5">Shape the sonic texture</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onResetEffects}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium uppercase tracking-wider text-white/30 hover:text-white/60 hover:border-white/[0.1] transition-all duration-200"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </motion.button>
            </div>

            <div className="space-y-5">
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
