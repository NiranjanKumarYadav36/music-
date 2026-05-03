import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, Trash2 } from "lucide-react";
import { NeuralCover } from "@/components/studio/NeuralCover";

interface Props {
    id: string;
    prompt: string;
    onPlay: () => void;
    onDelete?: () => void;
    isActive?: boolean;
}

const MelodyGalleryItem: React.FC<Props> = ({
    prompt,
    onPlay,
    onDelete,
    isActive,
}) => {
    const itemRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = itemRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -12;
        const rotateY = ((x / rect.width) - 0.5) * 12;

        el.style.transform = `
            perspective(800px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.04)
        `;
    };

    const handleMouseLeave = () => {
        const el = itemRef.current;
        if (!el) return;

        el.style.transform = `
            perspective(800px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;
    };

    return (
        <motion.div
            ref={itemRef}
            layout
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
                relative aspect-square w-full rounded-2xl overflow-hidden
                bg-white/[0.03]
                border
                ${isActive ? "border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]" : "border-white/[0.06]"}
                shadow-lg cursor-pointer
                transition-transform duration-200 will-change-transform
            `}
        >
            <div className="absolute inset-0 z-0">
                <NeuralCover prompt={prompt} showTitle={true} />
            </div>

            {/* Glass hover effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-200 bg-black/30 flex items-center justify-center gap-3 z-20">
                <button
                    onClick={onPlay}
                    className={`w-12 h-12 rounded-full border border-violet-400/40 shadow-[0_0_16px_rgba(139,92,246,0.3)] transition flex items-center justify-center ${isActive ? "bg-violet-500/30" : "bg-violet-500/20"
                        }`}
                >
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </button>

                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-red-500/20 hover:border-red-400/30 transition flex items-center justify-center"
                    >
                        <Trash2 className="w-4 h-4 text-white/60" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MelodyGalleryItem;
