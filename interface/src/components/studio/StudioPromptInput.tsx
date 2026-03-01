import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioPromptInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    className?: string;
}

export const StudioPromptInput: React.FC<StudioPromptInputProps> = ({
    value,
    onChange,
    placeholder = "Describe the music you want to create...",
    maxLength = 500,
    className,
}) => {
    return (
        <div className={cn("relative w-full group", className)}>
            {/* Soft Spatial Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[var(--radius-2xl)] blur-2xl transition-all duration-700 group-focus-within:opacity-100 opacity-0" />

            <div className="relative backdrop-blur-3xl bg-white/[0.03] border border-white/[0.08] rounded-[var(--radius-2xl)] p-8 shadow-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-white/[0.05]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500/80">
                        Neural Input
                    </h3>
                </div>

                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={cn(
                        "w-full min-h-[160px] bg-transparent resize-none outline-none",
                        "text-xl font-normal tracking-tight text-white placeholder:text-zinc-700",
                        "selection:bg-primary/20"
                    )}
                />

                <div className="absolute bottom-6 right-8 flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums text-zinc-600">
                        {value.length} <span className="mx-1 opacity-40">/</span> {maxLength}
                    </span>
                </div>
            </div>
        </div>
    );
};
