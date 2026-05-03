import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import NeuralParameterNode from "./NeuralParameterNode";
import SoundSculptSection from "./SoundSculptSection";

interface RefinementOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    // Neural Params
    temperature: number;
    onTemperatureChange: (v: number) => void;
    cfgCoef: number;
    onCfgCoefChange: (v: number) => void;
    topK: number;
    onTopKChange: (v: number) => void;
    topP: number;
    onTopPChange: (v: number) => void;
    useSampling: boolean;
    onUseSamplingChange: (v: boolean) => void;
    // Sound Sculpt
    reverb: number;
    onReverbChange: (v: number) => void;
    bassBoost: number;
    onBassBoostChange: (v: number) => void;
    treble: number;
    onTrebleChange: (v: number) => void;
    speed: number;
    onSpeedChange: (v: number) => void;
    onResetEffects: () => void;
    // Submit
    onApplyEdit?: () => void;
    isLoading?: boolean;
}

const RefinementOverlay: React.FC<RefinementOverlayProps> = ({
    isOpen,
    onClose,
    temperature, onTemperatureChange,
    cfgCoef, onCfgCoefChange,
    topK, onTopKChange,
    topP, onTopPChange,
    useSampling, onUseSamplingChange,
    reverb, onReverbChange,
    bassBoost, onBassBoostChange,
    treble, onTrebleChange,
    speed, onSpeedChange,
    onResetEffects,
    onApplyEdit,
    isLoading = false,
}) => {
    const handleResetNeural = () => {
        onTemperatureChange(1);
        onCfgCoefChange(8);
        onTopKChange(250);
        onTopPChange(0.7);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* === FULLSCREEN BACKDROP === */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 backdrop-blur-xl bg-black/50"
                    />

                    {/* === FLOATING GLASS PANEL === */}
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.97 }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                        className="fixed inset-x-0 top-[5vh] z-50 mx-auto max-w-3xl px-4"
                    >
                        <div className="relative rounded-3xl backdrop-blur-[30px] bg-white/[0.03] border border-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-8 overflow-hidden max-h-[88vh] overflow-y-auto">

                            {/* Inner glow effect */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div
                                    className="absolute top-0 inset-x-0 h-48 opacity-[0.07]"
                                    style={{ background: "radial-gradient(ellipse at top center, white, transparent 70%)" }}
                                />
                            </div>

                            {/* Ambient accent blobs */}
                            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-violet-500/[0.06] blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-indigo-500/[0.05] blur-3xl pointer-events-none" />

                            {/* === HEADER === */}
                            <div className="relative flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-white tracking-tight">
                                        Refine Parameters
                                    </h2>
                                    <p className="text-xs text-white/30 mt-1">
                                        Adjust generation and audio processing settings.
                                    </p>
                                </div>

                                {/* Close button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/[0.12] transition-all duration-200 flex-shrink-0 ml-4"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* === NEURAL MODULATION SECTION === */}
                            <div className="relative mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                                            Generation Parameters
                                        </h3>
                                        <p className="text-[10px] text-white/20 mt-0.5">Adjust model behavior</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleResetNeural}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium uppercase tracking-wider text-white/30 hover:text-white/60 hover:border-white/[0.1] transition-all duration-200"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </motion.button>
                                </div>

                                {/* Parameter Nodes Grid */}
                                <motion.div
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center"
                                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {[
                                        { label: "Temperature", value: temperature, min: 0.1, max: 2.0, step: 0.1, decimals: 1, hint: "Precise → Experimental", minLabel: "Precise", maxLabel: "Wild", onChange: onTemperatureChange },
                                        { label: "CFG Coef", value: cfgCoef, min: 1.0, max: 10.0, step: 0.1, decimals: 1, hint: "Loose → Strict", minLabel: "Loose", maxLabel: "Strict", onChange: onCfgCoefChange },
                                        { label: "Top-K", value: topK, min: 1, max: 500, step: 1, decimals: 0, hint: "Focused → Diverse", minLabel: "Focused", maxLabel: "Diverse", onChange: onTopKChange },
                                        { label: "Top-P", value: topP, min: 0, max: 1.0, step: 0.1, decimals: 2, hint: "Certain → Open", minLabel: "Certain", maxLabel: "Open", onChange: onTopPChange },
                                    ].map((node, i) => (
                                        <motion.div
                                            key={node.label}
                                            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                                            transition={{ delay: i * 0.06 }}
                                        >
                                            <NeuralParameterNode
                                                label={node.label}
                                                value={node.value}
                                                min={node.min}
                                                max={node.max}
                                                step={node.step}
                                                decimals={node.decimals}
                                                hint={node.hint}
                                                minLabel={node.minLabel}
                                                maxLabel={node.maxLabel}
                                                onChange={node.onChange}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Sampling Toggle */}
                                <div className="mt-6 flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">Use Sampling</p>
                                        <p className="text-[10px] text-white/20 mt-0.5">Enable probabilistic sampling during generation</p>
                                    </div>

                                    {/* Glass capsule toggle */}
                                    <button
                                        onClick={() => onUseSamplingChange(!useSampling)}
                                        className={`relative w-12 h-6 rounded-full border transition-all duration-200 flex-shrink-0 ${useSampling
                                            ? "bg-violet-500/30 border-violet-400/50"
                                            : "bg-white/[0.06] border-white/[0.1]"
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: useSampling ? 24 : 2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${useSampling
                                                ? "bg-violet-400"
                                                : "bg-white/40"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* === DIVIDER === */}
                            <div className="relative my-6">
                                <div className="h-px bg-white/[0.06]" />
                            </div>

                            {/* === SOUND SCULPT SECTION === */}
                            <SoundSculptSection
                                reverb={reverb}
                                onReverbChange={onReverbChange}
                                bassBoost={bassBoost}
                                onBassBoostChange={onBassBoostChange}
                                treble={treble}
                                onTrebleChange={onTrebleChange}
                                speed={speed}
                                onSpeedChange={onSpeedChange}
                                onResetEffects={onResetEffects}
                            />

                            {/* === MANIFEST BUTTON === */}
                            {onApplyEdit && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-8 flex justify-center"
                                >
                                    <motion.button
                                        onClick={onApplyEdit}
                                        disabled={isLoading}
                                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        className={`
                      px-10 py-3.5 rounded-2xl
                      border border-violet-400/30
                      bg-gradient-to-r from-violet-600/20 to-indigo-600/20
                      text-sm font-medium tracking-wide text-white
                      hover:border-violet-400/50
                      hover:from-violet-600/30 hover:to-indigo-600/30
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                    `}
                                    >
                                        {isLoading ? "Applying..." : "Apply Changes"}
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RefinementOverlay;
