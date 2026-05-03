import React from "react";
import { Settings2, Thermometer, Target, Binary } from "lucide-react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

interface StudioParameterPanelProps {
    duration: number;
    onDurationChange: (value: number) => void;
    temperature: number;
    onTemperatureChange: (value: number) => void;
    cfgCoef: number;
    onCfgCoefChange: (value: number) => void;
    topK: number;
    onTopKChange: (value: number) => void;
    topP: number;
    onTopPChange: (value: number) => void;
    useSampling: boolean;
    onUseSamplingChange: (value: boolean) => void;
    className?: string;
}

export const StudioParameterPanel: React.FC<StudioParameterPanelProps> = ({
    duration,
    onDurationChange,
    temperature,
    onTemperatureChange,
    cfgCoef,
    onCfgCoefChange,
    topK,
    onTopKChange,
    topP,
    onTopPChange,
    useSampling,
    onUseSamplingChange,
    className,
}) => {
    return (
        <div className={cn(
            "w-full lg:w-[320px] shrink-0 space-y-6 animate-in slide-in-from-left-8 duration-700",
            className
        )}>
            {/* Engine Controls Section */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-white/[0.09]">
                <div className="flex items-center gap-2 mb-5 text-white/30">
                    <Settings2 className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Parameters</span>
                </div>

                <div className="space-y-8">
                    {/* Duration */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-zinc-300">Duration</Label>
                            <span className="text-xs font-bold tabular-nums text-primary">{duration}s</span>
                        </div>
                        <Slider
                            value={[duration]}
                            onValueChange={([v]) => onDurationChange(v)}
                            min={5}
                            max={120}
                            step={1}
                            className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-white"
                        />
                    </div>

                    {/* Temperature */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Thermometer className="w-3 h-3" />
                                <Label className="text-sm font-medium text-zinc-300">Temperature</Label>
                            </div>
                            <span className="text-xs font-bold tabular-nums text-primary">{temperature.toFixed(1)}</span>
                        </div>
                        <Slider
                            value={[temperature]}
                            onValueChange={([v]) => onTemperatureChange(v)}
                            min={0.1}
                            max={2.0}
                            step={0.1}
                            className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-white"
                        />
                    </div>

                    {/* CFG Coef */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Target className="w-3 h-3" />
                                <Label className="text-sm font-medium text-zinc-300">CFG Scale</Label>
                            </div>
                            <span className="text-xs font-bold tabular-nums text-secondary">{cfgCoef.toFixed(1)}</span>
                        </div>
                        <Slider
                            value={[cfgCoef]}
                            onValueChange={([v]) => onCfgCoefChange(v)}
                            min={1.0}
                            max={20.0}
                            step={0.5}
                            className="[&_[data-slot=slider-range]]:bg-secondary [&_[data-slot=slider-thumb]]:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Sampling Section */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-white/[0.09]">
                <div className="flex items-center gap-2 mb-5 text-white/30">
                    <Binary className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Sampling</span>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-zinc-200">Use Sampling</Label>
                            <p className="text-[10px] text-white/20">Diversify output</p>
                        </div>
                        <Switch
                            checked={useSampling}
                            onCheckedChange={onUseSamplingChange}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>

                    {useSampling && (
                        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs text-zinc-500">Top-K</Label>
                                    <span className="text-xs font-bold tabular-nums text-zinc-300">{topK}</span>
                                </div>
                                <Slider
                                    value={[topK]}
                                    onValueChange={([v]) => onTopKChange(v)}
                                    min={0}
                                    max={500}
                                    step={10}
                                    className="[&_[data-slot=slider-range]]:bg-zinc-700 [&_[data-slot=slider-thumb]]:bg-white"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs text-zinc-500">Top-P</Label>
                                    <span className="text-xs font-bold tabular-nums text-zinc-300">{topP.toFixed(2)}</span>
                                </div>
                                <Slider
                                    value={[topP]}
                                    onValueChange={([v]) => onTopPChange(v)}
                                    min={0.0}
                                    max={1.0}
                                    step={0.05}
                                    className="[&_[data-slot=slider-range]]:bg-zinc-700 [&_[data-slot=slider-thumb]]:bg-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
