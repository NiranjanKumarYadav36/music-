import React from "react";
import { motion } from "framer-motion";
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

const bounceUp = {
    initial: { opacity: 0, y: 40, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { type: "spring", stiffness: 300, damping: 22, mass: 0.8 },
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } },
};

export const StudioGeneratePage: React.FC<StudioGeneratePageProps> = (props) => {
    return (
        <motion.div
            className="w-full flex flex-col items-center gap-10 py-6 px-2 h-full overflow-x-hidden"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {/* ── Hero Header (hidden once a track exists) ── */}
            {!props.currentMusic && (
                <motion.div
                    className="text-center space-y-5 max-w-3xl"
                    {...bounceUp}
                >

                    {/* Main title — serif, landing-page style */}
                    <h1
                        className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] text-[#ffe0e0] font-serif mix-blend-normal"
                        style={{ textShadow: "0 0 40px rgba(139,92,246,0.25)" }}
                    >
                        Create Your{" "}
                        <span className="italic font-light">Sound</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-500 text-base md:text-lg font-light max-w-lg mx-auto leading-relaxed">
                        Describe any musical concept and watch it come to life.
                    </p>
                </motion.div>
            )}

            {/* ── 3-Column Symmetric Layout ── */}
            <div className="w-full max-w-full flex flex-col lg:flex-row items-start justify-center gap-4 xl:gap-6 px-2">

                {/* Left Panel */}
                <motion.div
                    className="hidden lg:flex"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.1 }}
                >
                    <StudioLeftPanel
                        duration={props.duration}
                        onDurationChange={props.onDurationChange}
                        temperature={props.temperature}
                        onTemperatureChange={props.onTemperatureChange}
                        cfgCoef={props.cfgCoef}
                        onCfgCoefChange={props.onCfgCoefChange}
                    />
                </motion.div>

                {/* Center: Prompt + Chips + Generate */}
                <motion.div
                    className="min-w-0 flex-1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.15 }}
                >
                    <StudioPromptCenter
                        prompt={props.prompt}
                        onPromptChange={props.onPromptChange}
                        onGenerate={props.onGenerate}
                        isLoading={props.isLoading}
                        currentMusic={props.currentMusic}
                    />
                </motion.div>

                {/* Right Panel */}
                <motion.div
                    className="hidden lg:flex"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.1 }}
                >
                    <StudioRightPanel
                        topK={props.topK}
                        onTopKChange={props.onTopKChange}
                        topP={props.topP}
                        onTopPChange={props.onTopPChange}
                        useSampling={props.useSampling}
                        onUseSamplingChange={props.onUseSamplingChange}
                    />
                </motion.div>
            </div>

            {/* Mobile: Collapsible parameter row (shown below prompt on small screens) */}
            <motion.div
                className="lg:hidden w-full grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.2 }}
            >
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
            </motion.div>

            {/* ── Recent Generations ── */}
            <RecentGeneratedMelodies
                tracks={props.musicHistory.map(track => ({ ...track, id: track.id.toString() }))}
                activeTrackId={props.currentMusic?.id.toString()}
                onPlay={(id) => {
                    const track = props.musicHistory.find(t => t.id.toString() === id);
                    if (track) props.onPlay(track);
                }}
            />
        </motion.div>
    );
};
