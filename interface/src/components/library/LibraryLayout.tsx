import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MelodyGalleryItem from "./MelodyGalleryItem";
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
            <div className="mb-10 text-left">
                <h1 className="text-3xl font-semibold mb-2">Your Melodies</h1>
                <p className="text-white/50">
                    An evolving collection of your AI-generated soundscapes.
                </p>
                <p className="text-xs text-white/25 mt-1">
                    {tracks.length} {tracks.length === 1 ? "melody" : "melodies"}
                </p>
            </div>

            {/* ── Grid with smooth reflow ── */}
            <motion.div
                layout
                className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    gap-5
                "
            >
                <AnimatePresence mode="popLayout">
                    {tracks.map((track) => (
                        <motion.div
                            key={track.id}
                            layout
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.22 } }}
                            transition={{ type: "spring", damping: 22, stiffness: 280 }}
                        >
                            <MelodyGalleryItem
                                id={track.id}
                                prompt={track.prompt}
                                onPlay={() => onPlay(track.id)}
                                onDelete={() => requestDelete(track.id, track.prompt)}
                                isActive={track.id === activeTrackId}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {tracks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center gap-4 py-32 text-center"
                >
                    <div className="text-5xl opacity-20">🎵</div>
                    <p className="text-white/30 text-base font-medium">Your library is empty.</p>
                    <p className="text-white/20 text-sm">Generate your first melody in the Studio tab.</p>
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
