import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
    activeTab: "studio" | "library";
    onTabChange: (tab: "studio" | "library") => void;
}

const tabs = [
    { id: "studio", label: "Studio" },
    { id: "library", label: "Library" },
] as const;

const LiquidGlassTopNav: React.FC<Props> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-40">
            <div className="py-4 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.04]">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Brand — bouncy hover */}
                    <motion.span
                        className="text-2xl font-bold tracking-tighter font-serif text-white cursor-default"
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        SoundSculpt.
                    </motion.span>

                    {/* Tab switcher — liquid pill */}
                    <div className="relative flex items-center gap-0.5 px-1 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-md">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className="relative px-6 py-2.5 rounded-full text-sm font-medium cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="liquid-pill"
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.15))",
                                            border: "1px solid rgba(139,92,246,0.25)",
                                            boxShadow: "0 0 20px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                                        }}
                                        transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
                                    />
                                )}

                                <span
                                    className={clsx(
                                        "relative z-10 transition-colors duration-300",
                                        activeTab === tab.id
                                            ? "text-white"
                                            : "text-white/35 hover:text-white/60"
                                    )}
                                >
                                    {tab.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right spacer */}
                    <div className="w-[140px]" />
                </div>
            </div>
        </div>
    );
};

export default LiquidGlassTopNav;
