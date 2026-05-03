import React from "react";
import { StudioPromptInput } from "./StudioPromptInput";
import { StudioGenerateButton } from "./StudioGenerateButton";
// import { MusicPlayer } from "../MusicPlayer"; // Removed redundant import here as it's fixed bottom in App
import { EditSettingsModal } from "../EditSettingsModal";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "../MusicGenerator/types";

interface StudioPromptPanelProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    currentMusic: MusicTrack | null;
    onEditClick: () => void;
    showEditPanel: boolean;
    // (Passing parameters and effect handlers for the modal)
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
    reverb: number;
    onReverbChange: (value: number) => void;
    bassBoost: number;
    onBassBoostChange: (value: number) => void;
    treble: number;
    onTrebleChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    onResetEffects: () => void;
    onApplyEdit: () => void;
    className?: string;
}

const quickPrompts = [
    "Upbeat electronic dance music with synthesizers",
    "Calm acoustic guitar melody for relaxation",
    "Epic orchestral soundtrack with drums",
    "Lo-fi hip hop beats for studying",
];

export const StudioPromptPanel: React.FC<StudioPromptPanelProps> = ({
    prompt,
    onPromptChange,
    onGenerate,
    isLoading,
    currentMusic,
    onEditClick,
    showEditPanel,
    // Modal handlers
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
    reverb,
    onReverbChange,
    bassBoost,
    onBassBoostChange,
    treble,
    onTrebleChange,
    speed,
    onSpeedChange,
    onResetEffects,
    onApplyEdit,
    className,
}) => {
    return (
        <div className={cn(
            "flex-1 flex flex-col gap-10 animate-in slide-in-from-right-8 duration-700 pb-32",
            className
        )}>
            {/* Prompt Input Area */}
            <StudioPromptInput
                value={prompt}
                onChange={onPromptChange}
            />

            {/* Quick Seeds */}
            {!currentMusic && (
                <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center gap-3 px-6 -mt-4 animate-in fade-in duration-500 delay-200">
                    <span className="w-full text-center text-[10px] uppercase tracking-[0.15em] text-white/20 font-medium mb-1">
                        Quick Prompts
                    </span>
                    {quickPrompts.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPromptChange(p)}
                            className={cn(
                                "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                                "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.1]",
                                "cursor-pointer active:scale-95"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Generate Action */}
            <div className="flex flex-col items-center gap-6 mt-4">
                <StudioGenerateButton
                    onClick={onGenerate}
                    isLoading={isLoading}
                    disabled={!prompt.trim()}
                />
                {prompt.trim().length > 0 && !isLoading && !currentMusic && (
                    <p className="text-[10px] font-medium tracking-[0.15em] text-white/20 uppercase">
                        Ready to generate
                    </p>
                )}
            </div>

            {/* Success State Indicator */}
            {currentMusic && (
                <div className="w-full text-center space-y-2 animate-in fade-in zoom-in-95 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Generation Complete
                    </div>
                    <p className="text-white/25 text-xs">Your track is ready in the player below.</p>
                </div>
            )}

            {/* Modal - Hidden by default, controlled via onEditClick */}
            <EditSettingsModal
                isOpen={!!currentMusic && showEditPanel}
                onClose={onEditClick}
                temperature={temperature}
                onTemperatureChange={onTemperatureChange}
                cfgCoef={cfgCoef}
                onCfgCoefChange={onCfgCoefChange}
                topK={topK}
                onTopKChange={onTopKChange}
                topP={topP}
                onTopPChange={onTopPChange}
                useSampling={useSampling}
                onUseSamplingChange={onUseSamplingChange}
                reverb={reverb}
                onReverbChange={onReverbChange}
                bassBoost={bassBoost}
                onBassBoostChange={onBassBoostChange}
                treble={treble}
                onTrebleChange={onTrebleChange}
                speed={speed}
                onSpeedChange={onSpeedChange}
                onResetEffects={onResetEffects}
                onApplyEdit={onApplyEdit}
                isLoading={isLoading}
            />
        </div>
    );
};
