import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    trackName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    isOpen,
    trackName,
    onConfirm,
    onCancel,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="confirm-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onCancel}
                        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-md"
                    />

                    {/* Dialog */}
                    <motion.div
                        key="confirm-dialog"
                        initial={{ opacity: 0, scale: 0.88, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 320 }}
                        className="fixed inset-0 z-[91] flex items-center justify-center px-6 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-sm relative rounded-[28px] backdrop-blur-2xl bg-white/[0.07] border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-8 overflow-hidden">

                            {/* Glow top */}
                            <div className="absolute top-0 inset-x-0 h-24 opacity-[0.06] pointer-events-none"
                                style={{ background: "radial-gradient(ellipse at top, white, transparent 70%)" }}
                            />

                            {/* Icon */}
                            <div className="flex items-center justify-center mb-5">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-lg bg-red-500/15 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="text-center mb-7">
                                <h3 className="text-lg font-bold text-white mb-2">Delete Melody?</h3>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    <span className="text-white/70 font-medium italic">
                                        "{trackName.length > 48 ? trackName.slice(0, 48) + "…" : trackName}"
                                    </span>
                                    {" "}will be permanently removed from your library.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {/* Cancel */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onCancel}
                                    className="flex-1 py-3 rounded-2xl backdrop-blur-lg bg-white/8 border border-white/15 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/12 transition-all duration-200"
                                >
                                    Keep It
                                </motion.button>

                                {/* Confirm Delete */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onConfirm}
                                    className="flex-1 py-3 rounded-2xl backdrop-blur-lg bg-red-500/20 border border-red-500/40 text-sm font-bold text-red-300 hover:bg-red-500/30 hover:border-red-500/60 hover:text-red-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-200"
                                >
                                    Delete
                                </motion.button>
                            </div>

                            {/* Dismiss X */}
                            <button
                                onClick={onCancel}
                                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-all duration-200"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteDialog;
