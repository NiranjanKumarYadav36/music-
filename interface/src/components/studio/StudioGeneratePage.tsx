import React from "react";
import { StudioPromptCenter } from "./StudioPromptCenter";
import { StudioLeftPanel, StudioRightPanel } from "./StudioSidePanels";
import RecentGeneratedMelodies from "./RecentGeneratedMelodies";
import type { MusicTrack } from "../MusicGenerator/types";

interface StudioGeneratePageProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    duration: number;
    onDurationChange: (value: number) => void;
    onGenerate: () => void;
    isLoading: boolean;
    currentMusic: MusicTrack | null;
    onEditClick: () => void;
    showEditPanel: boolean;
    // Neural params
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
    // Audio effects (kept for API compatibility, passed through to RefinementOverlay via App)
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
    // Recent generations
    musicHistory: MusicTrack[];
    onPlay: (track: MusicTrack) => void;
}

export const StudioGeneratePage: React.FC<StudioGeneratePageProps> = (props) => {
    return (
        <div className="w-full flex flex-col items-center gap-12 py-8 px-2 h-full">

            {/* ── Hero Header (hidden once a track exists) ── */}
            {!props.currentMusic && (
                <div className="text-center space-y-5 max-w-2xl animate-in fade-in zoom-in-95 duration-1000">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm shadow-xl">
                        <span className="text-base leading-none">🔥</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.38em] text-zinc-400">
                            Banger Engine, No Cap
                        </span>
                    </div>

                    {/* Main title */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.88] text-white font-[Outfit]"
                        style={{ textShadow: '0 0 60px rgba(168,85,247,0.25)' }}>
                        COOK UP A{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #a855f7, #818cf8, #22d3ee, #a855f7)',
                                backgroundSize: '250% 100%',
                                animation: 'titleShift 4s ease-in-out infinite',
                                filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))',
                            }}
                        >
                            BANGER.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-zinc-500 text-sm md:text-base font-normal max-w-sm mx-auto leading-relaxed">
                        type a <span className="text-zinc-300 font-medium">vibe</span> →
                        we make it <span className="text-zinc-300 font-medium">hit</span>.
                        no music degree needed fr.
                    </p>

                    <style>{`
                      @keyframes titleShift {
                        0%,100% { background-position: 0% 50%; }
                        50%      { background-position: 100% 50%; }
                      }
                    `}</style>
                </div>
            )}

            {/* ── 3-Column Symmetric Layout ── */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-6 xl:gap-8">

                {/* Left Panel */}
                <div className="hidden lg:flex animate-in slide-in-from-left-8 duration-700">
                    <StudioLeftPanel
                        duration={props.duration}
                        onDurationChange={props.onDurationChange}
                        temperature={props.temperature}
                        onTemperatureChange={props.onTemperatureChange}
                        cfgCoef={props.cfgCoef}
                        onCfgCoefChange={props.onCfgCoefChange}
                    />
                </div>

                {/* Center: Prompt + Chips + Generate */}
                <StudioPromptCenter
                    prompt={props.prompt}
                    onPromptChange={props.onPromptChange}
                    onGenerate={props.onGenerate}
                    isLoading={props.isLoading}
                    currentMusic={props.currentMusic}
                    className="animate-in slide-in-from-bottom-6 duration-700"
                />

                {/* Right Panel */}
                <div className="hidden lg:flex animate-in slide-in-from-right-8 duration-700">
                    <StudioRightPanel
                        topK={props.topK}
                        onTopKChange={props.onTopKChange}
                        topP={props.topP}
                        onTopPChange={props.onTopPChange}
                        useSampling={props.useSampling}
                        onUseSamplingChange={props.onUseSamplingChange}
                    />
                </div>
            </div>

            {/* Mobile: Collapsible parameter row (shown below prompt on small screens) */}
            <div className="lg:hidden w-full grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                <StudioLeftPanel
                    duration={props.duration}
                    onDurationChange={props.onDurationChange}
                    temperature={props.temperature}
                    onTemperatureChange={props.onTemperatureChange}
                    cfgCoef={props.cfgCoef}
                    onCfgCoefChange={props.onCfgCoefChange}
                />
                <StudioRightPanel
                    topK={props.topK}
                    onTopKChange={props.onTopKChange}
                    topP={props.topP}
                    onTopPChange={props.onTopPChange}
                    useSampling={props.useSampling}
                    onUseSamplingChange={props.onUseSamplingChange}
                />
            </div>

            {/* ── Recent Generations ── */}
            <RecentGeneratedMelodies
                tracks={props.musicHistory.map(track => ({ ...track, id: track.id.toString() }))}
                activeTrackId={props.currentMusic?.id.toString()}
                onPlay={(id) => {
                    const track = props.musicHistory.find(t => t.id.toString() === id);
                    if (track) props.onPlay(track);
                }}
            />
        </div>
    );
};
