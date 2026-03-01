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
                        <div className="relative rounded-[40px] backdrop-blur-[30px] bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[0_30px_120px_rgba(0,0,0,0.7)] p-10 overflow-hidden max-h-[88vh] overflow-y-auto">

                            {/* Inner glow effect */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div
                                    className="absolute top-0 inset-x-0 h-48 opacity-[0.07]"
                                    style={{ background: "radial-gradient(ellipse at top center, white, transparent 70%)" }}
                                />
                            </div>

                            {/* Ambient accent blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

                            {/* === HEADER === */}
                            <div className="relative flex items-start justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white tracking-tight">
                                        Sculpt Your Sound Field
                                    </h2>
                                    <p className="text-sm text-white/40 mt-1">
                                        Adjust neural creativity and sonic texture.
                                    </p>
                                </div>

                                {/* Close button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-white/8 border border-white/15 text-white/50 hover:text-white transition-all duration-200 flex-shrink-0 ml-4"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* === NEURAL MODULATION SECTION === */}
                            <div className="relative mb-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                                            Neural Modulation
                                        </h3>
                                        <p className="text-[11px] text-white/25 mt-0.5">Generation parameter control deck · <span className="text-white/40">↑↓ drag dials to adjust</span></p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleResetNeural}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-200"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </motion.button>
                                </div>

                                {/* Parameter Nodes Grid */}
                                <motion.div
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center"
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
                                <div className="mt-8 flex items-center justify-between px-4 py-3 rounded-2xl backdrop-blur-md bg-white/[0.04] border border-white/8">
                                    <div>
                                        <p className="text-sm font-semibold text-white/80">Use Sampling</p>
                                        <p className="text-[11px] text-white/30 mt-0.5">Enable probabilistic sampling during generation</p>
                                    </div>

                                    {/* Glass capsule toggle */}
                                    <button
                                        onClick={() => onUseSamplingChange(!useSampling)}
                                        className={`relative w-14 h-7 rounded-full border transition-all duration-300 flex-shrink-0 ${useSampling
                                            ? "bg-[var(--accent)]/30 border-[var(--accent)]/60 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                                            : "bg-white/8 border-white/15"
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: useSampling ? 28 : 2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${useSampling
                                                ? "bg-[var(--accent)] shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                                                : "bg-white/40"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* === DIVIDER === */}
                            <div className="relative my-8">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent blur-sm" />
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
                                    className="mt-10 flex justify-center"
                                >
                                    <motion.button
                                        onClick={onApplyEdit}
                                        disabled={isLoading}
                                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.97 }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 20px rgba(168,85,247,0.3)",
                                                "0 0 40px rgba(168,85,247,0.5)",
                                                "0 0 20px rgba(168,85,247,0.3)",
                                            ],
                                        }}
                                        transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
                                        className={`
                      px-12 py-4 rounded-full backdrop-blur-lg
                      border border-[var(--accent)]/40
                      bg-gradient-to-r from-[var(--accent)]/20 to-cyan-500/20
                      text-base font-bold tracking-widest uppercase text-white
                      hover:border-[var(--accent)]/70
                      hover:from-[var(--accent)]/30 hover:to-cyan-500/30
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300
                    `}
                                    >
                                        {isLoading ? "Manifesting…" : "Manifest Studio Changes"}
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
