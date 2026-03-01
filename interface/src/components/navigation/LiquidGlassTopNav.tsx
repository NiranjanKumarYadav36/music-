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
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30">
            <div className="relative flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-xl bg-[var(--glass-bg)] border border-white/10 shadow-xl">

                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="liquid-pill"
                                className="absolute inset-0 rounded-full bg-[var(--accent)]/20 backdrop-blur-lg border border-[var(--accent)]/40 shadow-[0_0_20px_var(--accent)]"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}

                        <span
                            className={clsx(
                                "relative z-10",
                                activeTab === tab.id
                                    ? "text-[var(--accent)]"
                                    : "text-white/70 hover:text-white"
                            )}
                        >
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LiquidGlassTopNav;
