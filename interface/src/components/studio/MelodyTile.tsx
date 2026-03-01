import { motion } from "framer-motion";
import { NeuralCover } from "./NeuralCover";

interface MelodyTileProps {
    title: string;
    onPlay: () => void;
    isActive: boolean;
}

const MelodyTile: React.FC<MelodyTileProps> = ({
    title,
    onPlay,
    isActive,
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`
        relative w-48 h-48 rounded-[28px] overflow-hidden backdrop-blur-xl 
        bg-[var(--glass-bg)] border 
        ${isActive ? "border-[var(--accent)] shadow-[0_0_40px_rgba(168,85,247,0.3)]" : "border-white/10"}
        cursor-pointer
      `}
        >
            <div className="absolute inset-0 z-0">
                <NeuralCover prompt={title} />
            </div>

            <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 hover:opacity-100 flex items-center justify-center z-20">
                <button
                    onClick={onPlay}
                    className={`w-14 h-14 rounded-full backdrop-blur-lg border border-[var(--accent)]/40 shadow-[0_0_20px_var(--accent)] transition ${isActive ? "bg-[var(--accent)]/30" : "bg-[var(--accent)]/20"
                        }`}
                >
                    ▶
                </button>
            </div>

            {/* Title bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/90 truncate">
                    {title}
                </h3>
            </div>
        </motion.div>
    );
};

export default MelodyTile;
