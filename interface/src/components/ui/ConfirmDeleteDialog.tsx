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
                        <div className="pointer-events-auto w-full max-w-sm relative rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-[0_16px_60px_rgba(0,0,0,0.5)] p-7 overflow-hidden">

                            {/* Glow top */}
                            <div className="absolute top-0 inset-x-0 h-24 opacity-[0.06] pointer-events-none"
                                style={{ background: "radial-gradient(ellipse at top, white, transparent 70%)" }}
                            />

                            {/* Icon */}
                            <div className="flex items-center justify-center mb-5">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="text-center mb-6">
                                <h3 className="text-base font-semibold text-white mb-1.5">Delete Melody?</h3>
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
                                    className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                                >
                                    Cancel
                                </motion.button>

                                {/* Confirm Delete */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onConfirm}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-sm font-medium text-red-300 hover:bg-red-500/25 hover:border-red-500/50 transition-all duration-200"
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
