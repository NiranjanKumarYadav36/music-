import React from "react";
import { Music, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioGenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    isNewTrack?: boolean;
}

export const StudioGenerateButton: React.FC<StudioGenerateButtonProps> = ({
    onClick,
    disabled,
    isLoading,
    className,
    isNewTrack = true,
}) => {
    return (
        <div className={cn("relative group w-full max-w-sm mx-auto", className)}>
            {/* Moving Glow Background Layer */}
            <div className={cn(
                "absolute -inset-1.5 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-40",
                "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500",
                disabled ? "opacity-0" : "group-hover:opacity-100 group-hover:blur-3xl"
            )} />

            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className={cn(
                    "relative w-full h-16 flex items-center justify-center p-[2px] rounded-full transition-all duration-500",
                    isLoading ? "cursor-wait scale-[0.98]" : "cursor-pointer active:scale-95 hover:scale-[1.02]",
                    "bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_10px_40px_rgba(168,85,247,0.3)]",
                    "disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:scale-100",
                    "overflow-hidden"
                )}
            >
                {/* Animated Inner Highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {/* Button Content Surface */}
                <div className={cn(
                    "w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r transition-all duration-500",
                    "from-[#a855f7] via-[#ec4899] to-[#06b6d4]",
                    "shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.25)]",
                    "px-8"
                )}>
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Wand2 className="w-5 h-5 text-white drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.2)]" />
                        )}

                        <span className="text-lg font-bold tracking-tight text-white drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.2)] font-[Poppins]">
                            {isLoading
                                ? "Synthesizing..."
                                : isNewTrack
                                    ? "Generate New Track"
                                    : "Regenerate Sound"}
                        </span>
                    </div>
                </div>
            </button>

            {/* Under-shadow for depth */}
            {!disabled && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-purple-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            )}
        </div>
    );
};
