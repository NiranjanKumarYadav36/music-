import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { NeuralCover } from "../studio/NeuralCover";
import PlayerWaveform from "./PlayerWaveform";
import type { MusicTrack } from "../MusicGenerator/types";

interface DeckCardProps {
  track: MusicTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  isBackground?: boolean;
  currentTime?: string;
  totalDuration?: string;
}

export default function DeckCard({
  track,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onDownload,
  onEdit,
  isBackground = false,
  currentTime = "0:00",
  totalDuration = "0:00",
}: DeckCardProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        borderRadius: "28px",
        background: isBackground ? "rgba(8,8,8,0.9)" : "rgba(10,10,10,0.7)",
        backdropFilter: isBackground ? "none" : "blur(24px) saturate(1.4)",
        border: isBackground
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isBackground
          ? "none"
          : "0 16px 64px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        filter: isBackground ? "brightness(0.5) saturate(0.4)" : "none",
      }}
    >
      {/* ── NeuralCover Hero ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <NeuralCover prompt={track.prompt} className="absolute inset-0" />

        {/* Fade overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

        {/* Subtle inner glow for active card */}
        {!isBackground && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              borderRadius: "28px",
              boxShadow: "inset 0 0 40px rgba(139,92,246,0.08)",
            }}
          />
        )}

        {/* Track info overlaid at bottom of hero */}
        <div className="absolute bottom-5 left-6 right-6 z-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 mb-1.5">
            {track.date} · {track.duration}
          </p>
          <h2
            className="text-lg font-serif font-medium text-[#ffe0e0]/90 leading-snug line-clamp-2"
            style={{ textShadow: "0 0 20px rgba(139,92,246,0.2)" }}
          >
            {track.prompt}
          </h2>
          {track.isEdited && (
            <span className="inline-block mt-2 text-[8px] font-semibold uppercase tracking-wider text-violet-300 bg-violet-400/10 border border-violet-400/20 rounded-full px-2 py-0.5">
              Refined
            </span>
          )}
        </div>
      </div>

      {/* ── Player Section ── */}
      <div className="p-4 pt-3">
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mini Cover */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/8">
            <NeuralCover prompt={track.prompt} />
          </div>

          {/* Info + Controls + Waveform */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h3 className="text-white text-sm font-medium truncate pr-2">
                  {track.prompt.length > 28
                    ? track.prompt.substring(0, 28) + "…"
                    : track.prompt}
                </h3>
              </div>

              {/* Transport Controls — bouncy */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={onPrev}
                  className="text-white/25 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <SkipBack size={15} fill="currentColor" />
                </motion.button>
                <motion.button
                  onClick={onTogglePlay}
                  className="text-white cursor-pointer"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "50%",
                    padding: "6px",
                    boxShadow: "0 0 16px rgba(139,92,246,0.2)",
                  }}
                  whileHover={{ scale: 1.15, boxShadow: "0 0 24px rgba(139,92,246,0.35)" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {isPlaying ? (
                    <Pause size={15} fill="currentColor" />
                  ) : (
                    <Play size={15} fill="currentColor" className="ml-0.5" />
                  )}
                </motion.button>
                <motion.button
                  onClick={onNext}
                  className="text-white/25 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <SkipForward size={15} fill="currentColor" />
                </motion.button>
              </div>
            </div>

            {/* Waveform & Time */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 flex items-center">
                <PlayerWaveform isPlaying={isPlaying} />
              </div>
              <span className="text-[10px] font-mono text-white/20 shrink-0">
                {currentTime} / {totalDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons — only on active card */}
        {!isBackground && (
          <div className="flex items-center justify-end gap-2 mt-3 px-1">
            {onDownload && (
              <motion.button
                onClick={onDownload}
                className="px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider text-white/30 flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Download className="w-3 h-3" />
                Export
              </motion.button>
            )}
            {onEdit && (
              <motion.button
                onClick={onEdit}
                className="px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider text-white/30 flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Settings className="w-3 h-3" />
                Refine
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
