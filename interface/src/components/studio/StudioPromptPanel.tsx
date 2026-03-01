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
                    <span className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-1">
                        Visual Seeds
                    </span>
                    {quickPrompts.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPromptChange(p)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                                "bg-zinc-800/40 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-white/10",
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
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase animate-pulse">
                        Neural pulse ready
                    </p>
                )}
            </div>

            {/* Success State Indicator */}
            {currentMusic && (
                <div className="w-full text-center space-y-2 animate-in fade-in zoom-in-95 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Generation Complete
                    </div>
                    <p className="text-zinc-500 text-xs">Your masterpiece is now live in the playback deck below.</p>
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
