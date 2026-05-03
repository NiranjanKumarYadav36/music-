import React from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioGenerateButton } from "./StudioGenerateButton";

interface StudioPromptInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    className?: string;
    onGenerate?: () => void;
    isLoading?: boolean;
}

export const StudioPromptInput: React.FC<StudioPromptInputProps> = ({
    value,
    onChange,
    placeholder = "Describe the music you want to create...",
    maxLength = 500,
    className,
    onGenerate,
    isLoading,
}) => {
    return (
        <motion.div
            className={cn("relative w-full group", className)}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
            {/* Radiant gradient wrapper — the rotating border lives here */}
            <div className="radiant-prompt-wrapper relative rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]">

                {/* Animated gradient border (mask technique) */}
                <div className="radiant-prompt-border rounded-2xl" />

                {/* Inner card — liquid glass */}
                <motion.div
                    className="relative z-10 rounded-2xl p-6"
                    style={{
                        background: "rgba(10,10,10,0.7)",
                        backdropFilter: "blur(20px) saturate(1.3)",
                        border: "1px solid rgba(255,255,255,0.04)",
                    }}
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    {/* Header label */}
                    <div className="flex items-center gap-2.5 mb-4">
                        <motion.div
                            className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/15"
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                        >
                            <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                        </motion.div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">
                            Prompt
                        </h3>
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className={cn(
                            "w-full min-h-[120px] bg-transparent resize-none outline-none",
                            "text-base font-normal leading-relaxed text-white/90 placeholder:text-white/12",
                            "selection:bg-violet-500/20"
                        )}
                    />

                    {/* Bottom row: char count + generate button */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-medium tabular-nums text-white/12">
                            {value.length} / {maxLength}
                        </span>

                        {onGenerate && (
                            <StudioGenerateButton
                                onClick={onGenerate}
                                disabled={!value.trim()}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
