import React from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Target, Binary } from "lucide-react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

// ─── Shared liquid glass panel wrapper ────────────────────────────────────────
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <motion.div
        className={cn(
            "rounded-2xl p-4 space-y-4 transition-colors duration-300",
            className
        )}
        style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px) saturate(1.2)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
        whileHover={{
            scale: 1.02,
            y: -2,
            borderColor: "rgba(255,255,255,0.1)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
        {children}
    </motion.div>
);

const SectionLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-white/25">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{text}</span>
    </div>
);

// ─── Left Panel: Duration + Temperature + CFG ────────────────────────────────
interface LeftPanelProps {
    duration: number;
    onDurationChange: (v: number) => void;
    temperature: number;
    onTemperatureChange: (v: number) => void;
    cfgCoef: number;
    onCfgCoefChange: (v: number) => void;
}

export const StudioLeftPanel: React.FC<LeftPanelProps> = ({
    duration,
    onDurationChange,
    temperature,
    onTemperatureChange,
    cfgCoef,
    onCfgCoefChange,
}) => {
    return (
        <div className="w-56 xl:w-60 shrink-0 flex flex-col gap-3">
            {/* Duration */}
            <GlassCard>
                <SectionLabel icon={<Clock className="w-3.5 h-3.5 text-sky-400" />} text="Duration" />
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/35">Length</Label>
                        <motion.span
                            key={duration}
                            className="text-sm font-semibold tabular-nums text-sky-400"
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {duration}s
                        </motion.span>
                    </div>
                    <Slider
                        value={[duration]}
                        onValueChange={([v]) => onDurationChange(v)}
                        min={5} max={120} step={1}
                        className="[&_[data-slot=slider-range]]:bg-sky-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/12 font-medium">
                        <span>5s</span><span>1 min</span><span>2 min</span>
                    </div>
                </div>
            </GlassCard>

            {/* Temperature */}
            <GlassCard>
                <SectionLabel icon={<Flame className="w-3.5 h-3.5 text-amber-400" />} text="Creativity" />
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/35">Temperature</Label>
                        <motion.span
                            key={temperature.toFixed(1)}
                            className="text-sm font-semibold tabular-nums text-amber-400"
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {temperature.toFixed(1)}
                        </motion.span>
                    </div>
                    <Slider
                        value={[temperature]}
                        onValueChange={([v]) => onTemperatureChange(v)}
                        min={0.1} max={2.0} step={0.1}
                        className="[&_[data-slot=slider-range]]:bg-amber-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/12 font-medium">
                        <span>Precise</span><span>Experimental</span>
                    </div>
                </div>
            </GlassCard>

            {/* CFG Scale */}
            <GlassCard>
                <SectionLabel icon={<Target className="w-3.5 h-3.5 text-violet-400" />} text="Guidance" />
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/35">CFG Scale</Label>
                        <motion.span
                            key={cfgCoef.toFixed(1)}
                            className="text-sm font-semibold tabular-nums text-violet-400"
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {cfgCoef.toFixed(1)}
                        </motion.span>
                    </div>
                    <Slider
                        value={[cfgCoef]}
                        onValueChange={([v]) => onCfgCoefChange(v)}
                        min={1.0} max={20.0} step={0.5}
                        className="[&_[data-slot=slider-range]]:bg-violet-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/12 font-medium">
                        <span>Loose</span><span>Strict</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// ─── Right Panel: Sampling / Top-K / Top-P ────────────────────────────────────
interface RightPanelProps {
    topK: number;
    onTopKChange: (v: number) => void;
    topP: number;
    onTopPChange: (v: number) => void;
    useSampling: boolean;
    onUseSamplingChange: (v: boolean) => void;
}

export const StudioRightPanel: React.FC<RightPanelProps> = ({
    topK,
    onTopKChange,
    topP,
    onTopPChange,
    useSampling,
    onUseSamplingChange,
}) => {
    return (
        <div className="w-56 xl:w-60 shrink-0 flex flex-col gap-3">
            {/* Sampling toggle */}
            <GlassCard>
                <SectionLabel icon={<Binary className="w-3.5 h-3.5 text-emerald-400" />} text="Sampling" />
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-white/60">Use Sampling</p>
                        <p className="text-[10px] text-white/15 mt-0.5">Diversify output</p>
                    </div>
                    <Switch
                        checked={useSampling}
                        onCheckedChange={onUseSamplingChange}
                        className="data-[state=checked]:bg-emerald-500 flex-shrink-0"
                    />
                </div>
            </GlassCard>

            {/* Top-K */}
            <GlassCard className={cn(!useSampling && "opacity-30 pointer-events-none")}>
                <SectionLabel icon={<span className="text-xs font-bold text-rose-400">K</span>} text="Token Pool" />
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/35">Top-K</Label>
                        <motion.span
                            key={topK}
                            className="text-sm font-semibold tabular-nums text-rose-400"
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {topK}
                        </motion.span>
                    </div>
                    <Slider
                        value={[topK]}
                        onValueChange={([v]) => onTopKChange(v)}
                        min={0} max={500} step={10}
                        className="[&_[data-slot=slider-range]]:bg-rose-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/12 font-medium">
                        <span>Focused</span><span>Diverse</span>
                    </div>
                </div>
            </GlassCard>

            {/* Top-P */}
            <GlassCard className={cn(!useSampling && "opacity-30 pointer-events-none")}>
                <SectionLabel icon={<span className="text-xs font-bold text-sky-400">P</span>} text="Nucleus" />
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/35">Top-P</Label>
                        <motion.span
                            key={topP.toFixed(2)}
                            className="text-sm font-semibold tabular-nums text-sky-400"
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {topP.toFixed(2)}
                        </motion.span>
                    </div>
                    <Slider
                        value={[topP]}
                        onValueChange={([v]) => onTopPChange(v)}
                        min={0.0} max={1.0} step={0.05}
                        className="[&_[data-slot=slider-range]]:bg-sky-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/12 font-medium">
                        <span>Certain</span><span>Open</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
