import { motion } from "framer-motion";
import { Play } from "lucide-react";
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
            whileHover={{ scale: 1.03 }}
            className={`
        relative w-48 h-48 rounded-2xl overflow-hidden
        bg-white/[0.03] border 
        ${isActive ? "border-violet-500/50 shadow-[0_0_24px_rgba(139,92,246,0.2)]" : "border-white/[0.06]"}
        cursor-pointer transition-all duration-200
      `}
        >
            <div className="absolute inset-0 z-0">
                <NeuralCover prompt={title} />
            </div>

            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                <button
                    onClick={onPlay}
                    className={`w-12 h-12 rounded-full border border-violet-400/40 shadow-[0_0_16px_rgba(139,92,246,0.3)] transition flex items-center justify-center ${isActive ? "bg-violet-500/30" : "bg-violet-500/20"
                        }`}
                >
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </button>
            </div>

            {/* Title bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10">
                <h3 className="text-[9px] font-medium uppercase tracking-wider text-white/80 truncate">
                    {title}
                </h3>
            </div>
        </motion.div>
    );
};

export default MelodyTile;
