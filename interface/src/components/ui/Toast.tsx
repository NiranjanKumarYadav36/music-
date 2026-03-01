import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trash2, X, WifiOff, ServerCrash, Info } from "lucide-react";

export interface ToastData {
    id: string;
    message: string;
    type?: "success" | "deleted" | "error" | "warning" | "info";
    detail?: string;
    duration?: number;
}

interface ToastProps {
    toast: ToastData | null;
    onDismiss: () => void;
}

// Per-type visual config
const THEME = {
    success: {
        icon: CheckCircle,
        iconColor: "#34d399",
        glow: "rgba(52,211,153,0.20)",
        bar: "#34d399",
        accent: "rgba(52,211,153,0.15)",
        border: "rgba(52,211,153,0.25)",
    },
    deleted: {
        icon: Trash2,
        iconColor: "#f87171",
        glow: "rgba(248,113,113,0.20)",
        bar: "#f87171",
        accent: "rgba(248,113,113,0.12)",
        border: "rgba(248,113,113,0.28)",
    },
    error: {
        icon: ServerCrash,
        iconColor: "#f87171",
        glow: "rgba(248,113,113,0.25)",
        bar: "#f87171",
        accent: "rgba(248,113,113,0.12)",
        border: "rgba(248,113,113,0.35)",
    },
    warning: {
        icon: WifiOff,
        iconColor: "#fb923c",
        glow: "rgba(251,146,60,0.22)",
        bar: "#fb923c",
        accent: "rgba(251,146,60,0.12)",
        border: "rgba(251,146,60,0.28)",
    },
    info: {
        icon: Info,
        iconColor: "#38bdf8",
        glow: "rgba(56,189,248,0.20)",
        bar: "#38bdf8",
        accent: "rgba(56,189,248,0.12)",
        border: "rgba(56,189,248,0.25)",
    },
} as const;

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!toast) return;
        timerRef.current = setTimeout(onDismiss, toast.duration ?? 5500);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [toast, onDismiss]);

    const type = (toast?.type ?? "info") as keyof typeof THEME;
    const theme = THEME[type];
    const Icon = theme.icon;
    const dur = (toast?.duration ?? 5500) / 1000;

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: -40, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.93 }}
                    transition={{ type: "spring", damping: 24, stiffness: 300 }}
                    className="fixed top-5 left-1/2 -translate-x-1/2 z-[500]"
                    style={{ width: "min(520px, 92vw)" }}
                >
                    {/* Outer glow halo */}
                    <div
                        className="absolute inset-0 rounded-[22px] pointer-events-none"
                        style={{
                            boxShadow: `0 0 40px 6px ${theme.glow}`,
                            opacity: 0.7,
                        }}
                    />

                    {/* Glass panel */}
                    <div
                        className="relative overflow-hidden rounded-[22px]"
                        style={{
                            background: "rgba(12, 10, 18, 0.72)",
                            backdropFilter: "blur(32px) saturate(180%)",
                            WebkitBackdropFilter: "blur(32px) saturate(180%)",
                            border: `1px solid ${theme.border}`,
                        }}
                    >
                        {/* Subtle inner tint strip */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${theme.iconColor}55, transparent)` }}
                        />

                        {/* Left accent bar */}
                        <div
                            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                            style={{ background: `linear-gradient(180deg, ${theme.iconColor}, ${theme.iconColor}44)` }}
                        />

                        {/* Content */}
                        <div className="flex items-start gap-4 px-5 py-4 pl-6">
                            {/* Icon with ambient glow backing */}
                            <div className="relative mt-0.5 flex-shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full blur-md"
                                    style={{ background: theme.accent, transform: "scale(2)" }}
                                />
                                <Icon
                                    className="relative w-[18px] h-[18px]"
                                    style={{ color: theme.iconColor }}
                                    strokeWidth={2.2}
                                />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[13.5px] font-semibold text-white leading-snug tracking-tight">
                                    {toast.message}
                                </p>
                                {toast.detail && (
                                    <p className="text-[11.5px] text-white/40 mt-1 leading-relaxed font-normal">
                                        {toast.detail}
                                    </p>
                                )}
                            </div>

                            {/* Dismiss button */}
                            <motion.button
                                onClick={onDismiss}
                                whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.12)" }}
                                whileTap={{ scale: 0.9 }}
                                className="mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 transition-colors duration-150"
                            >
                                <X className="w-3 h-3" />
                            </motion.button>
                        </div>

                        {/* Auto-dismiss countdown rail */}
                        <div className="h-[2px] w-full bg-white/[0.04]">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${theme.iconColor}cc, ${theme.iconColor}55)`,
                                    boxShadow: `0 0 6px ${theme.iconColor}66`,
                                    transformOrigin: "left",
                                }}
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: dur, ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
