import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import MasonryLibrary from "./MasonryLibrary";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { Toast } from "@/components/ui/Toast";
import type { ToastData } from "@/components/ui/Toast";

interface Track {
    id: string;
    prompt: string;
}

interface Props {
    tracks: Track[];
    onPlay: (id: string) => void;
    onDelete: (id: string) => void;
    activeTrackId?: string;
}

const LibraryLayout: React.FC<Props> = ({
    tracks,
    onPlay,
    onDelete,
    activeTrackId,
}) => {
    // ── Confirm dialog state ──────────────────────────────────────────────────
    const [pendingDelete, setPendingDelete] = useState<{ id: string; prompt: string } | null>(null);

    // ── Toast state ───────────────────────────────────────────────────────────
    const [toast, setToast] = useState<ToastData | null>(null);

    const requestDelete = useCallback((id: string, prompt: string) => {
        setPendingDelete({ id, prompt });
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (!pendingDelete) return;
        onDelete(pendingDelete.id);
        setToast({
            id: `deleted-${pendingDelete.id}-${Date.now()}`,
            message: `"${pendingDelete.prompt.length > 40
                ? pendingDelete.prompt.slice(0, 40) + "…"
                : pendingDelete.prompt}" has been deleted.`,
            type: "deleted",
            duration: 3500,
        });
        setPendingDelete(null);
    }, [pendingDelete, onDelete]);

    const handleCancelDelete = useCallback(() => {
        setPendingDelete(null);
    }, []);

    return (
        <div className="mt-16">
            {/* ── Header ── */}
            <motion.div
                className="mb-12 text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 22 }}
            >
                <h1
                    className="text-4xl md:text-5xl font-medium mb-3 font-serif text-[#ffe0e0]"
                    style={{ textShadow: "0 0 30px rgba(139,92,246,0.2)" }}
                >
                    Your Melodies
                </h1>
                <p className="text-gray-500 font-light text-lg">
                    An evolving collection of your AI-generated soundscapes.
                </p>
                <motion.p
                    className="text-xs text-white/20 mt-2 inline-flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="w-1 h-1 rounded-full bg-violet-400/50" />
                    {tracks.length} {tracks.length === 1 ? "melody" : "melodies"}
                </motion.p>
            </motion.div>

            {/* ── Masonry Gallery ── */}
            <MasonryLibrary
                tracks={tracks}
                onPlay={onPlay}
                onDelete={(id) => {
                    const track = tracks.find((t) => t.id === id);
                    if (track) requestDelete(track.id, track.prompt);
                }}
                activeTrackId={activeTrackId}
            />

            {/* Empty state */}
            {tracks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    className="flex flex-col items-center justify-center gap-4 py-32 text-center"
                >
                    <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            backdropFilter: "blur(12px)",
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                    </motion.div>
                    <p className="text-white/25 text-sm font-medium">Your library is empty</p>
                    <p className="text-white/12 text-xs">Generate your first melody in the Studio tab.</p>
                </motion.div>
            )}

            {/* ── Confirm Delete Dialog ── */}
            <ConfirmDeleteDialog
                isOpen={!!pendingDelete}
                trackName={pendingDelete?.prompt ?? ""}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* ── Toast ── */}
            <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
    );
};

export default LibraryLayout;
