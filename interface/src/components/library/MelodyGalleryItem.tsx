import { useRef } from "react";
import { motion } from "framer-motion";
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
                relative aspect-square w-full rounded-[28px] overflow-hidden backdrop-blur-xl
                bg-[var(--glass-bg)]
                border
                ${isActive ? "border-[var(--accent)] shadow-[0_0_40px_var(--accent)]" : "border-[var(--glass-border)]"}
                shadow-xl cursor-pointer
                transition-transform duration-300 will-change-transform
            `}
        >
            <div className="absolute inset-0 z-0">
                <NeuralCover prompt={prompt} showTitle={true} />
            </div>

            {/* Glass hover effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 backdrop-blur-md bg-black/20 flex items-center justify-center gap-4 z-20">
                <button
                    onClick={onPlay}
                    className={`w-14 h-14 rounded-full backdrop-blur-lg border border-[var(--accent)]/40 shadow-[0_0_20px_var(--accent)] transition ${isActive ? "bg-[var(--accent)]/30" : "bg-[var(--accent)]/20"
                        }`}
                >
                    ▶
                </button>

                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition text-white text-xs font-bold"
                    >
                        Delete
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MelodyGalleryItem;
