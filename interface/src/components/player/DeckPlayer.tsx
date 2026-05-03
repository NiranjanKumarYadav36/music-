import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DeckCard from "./DeckCard";
import type { MusicTrack } from "../MusicGenerator/types";

interface DeckPlayerProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack;
  onSelectTrack: (track: MusicTrack) => void;
  onClose: () => void;
  onEdit: () => void;
}

const swipeVariants = {
  enter: (_direction: number) => ({
    scale: 0.92,
    y: -40,
    opacity: 0.4,
    zIndex: 2,
    x: 0,
  }),
  center: {
    zIndex: 3,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 22,
      mass: 0.8,
    },
  },
  exit: (direction: number) => ({
    zIndex: 3,
    x: direction > 0 ? 380 : -380,
    opacity: 0,
    scale: 0.95,
    rotate: direction > 0 ? 10 : -10,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
};

export default function DeckPlayer({
  tracks,
  currentTrack,
  onSelectTrack,
  onClose,
  onEdit,
}: DeckPlayerProps) {
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAutoPlayedUrl = useRef<string | null>(null);

  const currentIndex = Math.max(
    0,
    tracks.findIndex((t) => t.id === currentTrack.id)
  );
  const activeSong = tracks[currentIndex] || currentTrack;
  const nextSong =
    tracks.length > 1 ? tracks[(currentIndex + 1) % tracks.length] : null;
  const nextNextSong =
    tracks.length > 2 ? tracks[(currentIndex + 2) % tracks.length] : null;

  // ── Audio playback ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!activeSong?.audioUrl || !audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    if (lastAutoPlayedUrl.current !== activeSong.audioUrl) {
      lastAutoPlayedUrl.current = activeSong.audioUrl;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [activeSong?.audioUrl]);

  const handleNext = () => {
    if (tracks.length <= 1) return;
    setDirection(1);
    onSelectTrack(tracks[(currentIndex + 1) % tracks.length]);
  };

  const handlePrev = () => {
    if (tracks.length <= 1) return;
    setDirection(-1);
    onSelectTrack(
      tracks[(currentIndex - 1 + tracks.length) % tracks.length]
    );
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !activeSong?.audioUrl) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!activeSong?.audioUrl) return;
    const a = document.createElement("a");
    a.href = activeSong.audioUrl;
    a.download = `${(activeSong.prompt || "track")
      .replace(/\s/g, "_")
      .substring(0, 20)}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fmt = (s: number) => {
    if (isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ y: 120, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 120, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
      className="flex justify-center pb-6"
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={activeSong.audioUrl || undefined}
        preload="metadata"
      />

      {/* Deck container */}
      <div className="relative w-full max-w-[420px] h-[400px] mx-4">
        {/* Close */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute -top-3 -right-3 z-50 w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          title="Dismiss player"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>

        {/* Background Stack 2 */}
        {nextNextSong && (
          <motion.div
            key={`bg2-${nextNextSong.id}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 0.85, y: -60, opacity: 0 }}
            animate={{ scale: 0.9, y: -55, opacity: 0.35 }}
            transition={{ duration: 0.4 }}
          >
            <DeckCard
              track={nextNextSong}
              isPlaying={false}
              onTogglePlay={() => {}}
              onNext={() => {}}
              onPrev={() => {}}
              isBackground
            />
          </motion.div>
        )}

        {/* Background Stack 1 */}
        {nextSong && (
          <motion.div
            key={`bg1-${nextSong.id}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 0.9, y: -30, opacity: 0.3 }}
            animate={{ scale: 0.95, y: -28, opacity: 0.6 }}
            transition={{ duration: 0.4 }}
          >
            <DeckCard
              track={nextSong}
              isPlaying={false}
              onTogglePlay={() => {}}
              onNext={() => {}}
              onPrev={() => {}}
              isBackground
            />
          </motion.div>
        )}

        {/* Active Card */}
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={activeSong.id}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 z-30"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_e, { offset }) => {
              if (offset.x < -100) handleNext();
              else if (offset.x > 100) handlePrev();
            }}
          >
            <DeckCard
              track={activeSong}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onPrev={handlePrev}
              onDownload={handleDownload}
              onEdit={onEdit}
              currentTime={fmt(currentTime)}
              totalDuration={fmt(duration)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
