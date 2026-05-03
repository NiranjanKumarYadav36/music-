import React from "react";
import { Clock } from "lucide-react";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";

interface StudioDurationControlProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

export const StudioDurationControl: React.FC<StudioDurationControlProps> = ({
    value,
    onChange,
    min = 5,
    max = 120,
    step = 1,
    className,
}) => {
    return (
        <div className={cn("relative w-full max-w-2xl mx-auto mt-8 px-6", className)}>
            <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-white/30 font-medium tracking-tight">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Duration</span>
                </label>
                <div className="px-3 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white font-semibold text-sm tabular-nums">
                    {value}s
                </div>
            </div>

            <Slider
                value={[value]}
                onValueChange={([val]) => onChange(val)}
                min={min}
                max={max}
                step={step}
                className={cn(
                    "relative flex items-center select-none touch-none w-full h-8",
                    // Radix slider specific overrides for the new look
                    "[&_[data-slot=slider-track]]:bg-zinc-800",
                    "[&_[data-slot=slider-track]]:h-1",
                    "[&_[data-slot=slider-thumb]]:bg-gradient-to-br [&_[data-slot=slider-thumb]]:from-white [&_[data-slot=slider-thumb]]:to-zinc-300",
                    "[&_[data-slot=slider-thumb]]:border-none",
                    "[&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(139,92,246,0.3)]",
                    "[&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:h-4",
                    "[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-indigo-500 [&_[data-slot=slider-range]]:to-violet-500"
                )}
            />

            <div className="flex justify-between text-[9px] font-medium tracking-wider text-white/15 uppercase mt-2 px-1">
                <span>{min}s</span>
                <span>{max}s</span>
            </div>
        </div>
    );
};
