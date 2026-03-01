import React from "react";
import { Clock, Flame, Target, Binary } from "lucide-react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

// ─── Shared glass panel wrapper ───────────────────────────────────────────────
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <div className={cn(
        "rounded-[24px] backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5 space-y-5 transition-all duration-300 hover:border-white/[0.12]",
        className
    )}>
        {children}
    </div>
);

const SectionLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-white/40">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{text}</span>
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
        <div className="w-56 xl:w-64 shrink-0 flex flex-col gap-4">
            {/* Duration */}
            <GlassCard>
                <SectionLabel icon={<Clock className="w-3.5 h-3.5 text-cyan-400" />} text="Duration" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/50">Length</Label>
                        <span className="text-sm font-bold tabular-nums text-cyan-400">{duration}s</span>
                    </div>
                    <Slider
                        value={[duration]}
                        onValueChange={([v]) => onDurationChange(v)}
                        min={5} max={120} step={1}
                        className="[&_[data-slot=slider-range]]:bg-cyan-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/20 font-medium">
                        <span>5s</span><span>1 min</span><span>2 min</span>
                    </div>
                </div>
            </GlassCard>

            {/* Temperature */}
            <GlassCard>
                <SectionLabel icon={<Flame className="w-3.5 h-3.5 text-orange-400" />} text="Creativity" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/50">Temperature</Label>
                        <span className="text-sm font-bold tabular-nums text-orange-400">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                        value={[temperature]}
                        onValueChange={([v]) => onTemperatureChange(v)}
                        min={0.1} max={2.0} step={0.1}
                        className="[&_[data-slot=slider-range]]:bg-orange-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/20 font-medium">
                        <span>Precise</span><span>Wild</span>
                    </div>
                </div>
            </GlassCard>

            {/* CFG Scale */}
            <GlassCard>
                <SectionLabel icon={<Target className="w-3.5 h-3.5 text-purple-400" />} text="Guidance" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/50">CFG Scale</Label>
                        <span className="text-sm font-bold tabular-nums text-purple-400">{cfgCoef.toFixed(1)}</span>
                    </div>
                    <Slider
                        value={[cfgCoef]}
                        onValueChange={([v]) => onCfgCoefChange(v)}
                        min={1.0} max={20.0} step={0.5}
                        className="[&_[data-slot=slider-range]]:bg-purple-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/20 font-medium">
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
        <div className="w-56 xl:w-64 shrink-0 flex flex-col gap-4">
            {/* Sampling toggle */}
            <GlassCard>
                <SectionLabel icon={<Binary className="w-3.5 h-3.5 text-emerald-400" />} text="Sampling" />
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-white/80">Use Sampling</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Diversify neural output</p>
                    </div>
                    <Switch
                        checked={useSampling}
                        onCheckedChange={onUseSamplingChange}
                        className="data-[state=checked]:bg-emerald-500 flex-shrink-0"
                    />
                </div>
            </GlassCard>

            {/* Top-K */}
            <GlassCard className={cn(!useSampling && "opacity-40 pointer-events-none")}>
                <SectionLabel icon={<span className="text-xs font-black text-pink-400">K</span>} text="Token Pool" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/50">Top-K</Label>
                        <span className="text-sm font-bold tabular-nums text-pink-400">{topK}</span>
                    </div>
                    <Slider
                        value={[topK]}
                        onValueChange={([v]) => onTopKChange(v)}
                        min={0} max={500} step={10}
                        className="[&_[data-slot=slider-range]]:bg-pink-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/20 font-medium">
                        <span>Focused</span><span>Diverse</span>
                    </div>
                </div>
            </GlassCard>

            {/* Top-P */}
            <GlassCard className={cn(!useSampling && "opacity-40 pointer-events-none")}>
                <SectionLabel icon={<span className="text-xs font-black text-sky-400">P</span>} text="Nucleus" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-white/50">Top-P</Label>
                        <span className="text-sm font-bold tabular-nums text-sky-400">{topP.toFixed(2)}</span>
                    </div>
                    <Slider
                        value={[topP]}
                        onValueChange={([v]) => onTopPChange(v)}
                        min={0.0} max={1.0} step={0.05}
                        className="[&_[data-slot=slider-range]]:bg-sky-500 [&_[data-slot=slider-thumb]]:bg-white"
                    />
                    <div className="flex justify-between text-[9px] text-white/20 font-medium">
                        <span>Certain</span><span>Open</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
