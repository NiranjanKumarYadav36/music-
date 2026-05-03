import { AnimatePresence, motion } from "framer-motion";
import GooeyGradientBackground from "./GooeyGradientBackground";

interface AmbientGradientBackgroundProps {
    activeTab?: "studio" | "library";
}

const AmbientGradientBackground: React.FC<AmbientGradientBackgroundProps> = ({ activeTab = "studio" }) => {
    return (
        <>
            {/* Base dark layer */}
            <div className="fixed inset-0 -z-10 bg-[#050505]" />

            {/* Tab-specific background effects */}
            <AnimatePresence mode="wait">
                {activeTab === "studio" ? (
                    <motion.div
                        key="studio-bg"
                        className="fixed inset-0 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        {/* Looping abstract video background */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: 0.3, filter: "saturate(1.4) hue-rotate(-10deg) brightness(0.7)" }}
                        >
                            <source
                                src="https://assets.mixkit.co/videos/4623/4623-720.mp4"
                                type="video/mp4"
                            />
                        </video>
                        {/* Radial vignette */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "radial-gradient(ellipse at center, transparent 20%, #050505 80%)",
                            }}
                        />
                        {/* Bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
                        {/* Top fade for navbar */}
                        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#050505]/90 to-transparent" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="library-bg"
                        className="fixed inset-0 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        {/* GooeyGradient — organic flowing liquid */}
                        <div className="absolute inset-0 opacity-40">
                            <GooeyGradientBackground />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Noise grain overlay — matches landing page */}
            <div
                className="fixed inset-0 z-50 pointer-events-none opacity-[0.035] mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />
        </>
    );
};

export default AmbientGradientBackground;
