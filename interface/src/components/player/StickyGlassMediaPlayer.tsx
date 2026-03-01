import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
    children: React.ReactNode;
    onClose?: () => void;
}

const StickyGlassMediaPlayer: React.FC<Props> = ({ children, onClose }) => {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="relative mx-auto mb-6 w-[95%] md:w-[85%] lg:w-[70%] rounded-[32px] backdrop-blur-xl bg-[var(--glass-bg)] border border-white/10 shadow-2xl p-6"
        >
            {children}

            {/* Close button */}
            {onClose && (
                <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.12, boxShadow: "0 0 16px rgba(168,85,247,0.4)" }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-lg bg-[var(--glass-bg)] border border-white/20 text-white/50 hover:text-white shadow-lg transition-colors duration-200 z-30"
                    title="Dismiss player"
                >
                    <X className="w-3.5 h-3.5" />
                </motion.button>
            )}
        </motion.div>
    );
};

export default StickyGlassMediaPlayer;
