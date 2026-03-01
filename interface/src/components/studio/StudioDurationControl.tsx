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
                <label className="flex items-center gap-2.5 text-zinc-400 font-medium tracking-tight">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Generation Duration
                </label>
                <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold tabular-nums">
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
                    "[&_[data-slot=slider-thumb]]:shadow-[0_0_15px_rgba(168,85,247,0.4)]",
                    "[&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:h-5",
                    "[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-purple-500 [&_[data-slot=slider-range]]:to-cyan-500"
                )}
            />

            <div className="flex justify-between text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mt-2 px-1">
                <span>{min}s</span>
                <span>{max}s</span>
            </div>
        </div>
    );
};
