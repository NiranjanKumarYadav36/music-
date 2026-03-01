import { Play, Pause, Download, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "./MusicGenerator/types";
import { GlassPanel } from "./ui/GlassPanel";

interface MusicPlayerProps {
  track: MusicTrack | null;
  onEdit?: () => void;
  className?: string;
}

export function MusicPlayer({ track, onEdit, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track?.audioUrl && audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [track?.audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current || !track?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!track?.audioUrl) return;

    const link = document.createElement("a");
    link.href = track.audioUrl;
    const fileName = track.prompt.replace(/\s/g, "_").substring(0, 20) || "generated-music";
    link.download = `${fileName}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!track || !track.audioUrl) return null;

  return (
    <GlassPanel className={cn(
      "p-3 pr-6 relative group border-white/20 transition-all duration-500",
      className
    )}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      <div className="flex items-center gap-6">
        {/* Vinyl-style Disc Icon */}
        <div className="relative overflow-visible">
          <div className={cn(
            "w-14 h-14 rounded-full bg-zinc-900 border-2 border-white/5 flex items-center justify-center transition-transform duration-[2000ms] ring-1 ring-white/10",
            isPlaying ? "animate-spin" : ""
          )}>
            <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
          {/* Disc Glow */}
          <div className={cn(
            "absolute inset-0 bg-purple-500/20 blur-2xl rounded-full transition-opacity duration-1000",
            isPlaying ? "opacity-100" : "opacity-0"
          )} />
        </div>

        {/* Info & Duration */}
        <div className="flex-1 min-w-0 pr-6 border-r border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-bold truncate text-white uppercase tracking-wider">
              {track.prompt}
            </h3>
            {track.isEdited && (
              <span className="text-[10px] uppercase tracking-widest font-black text-purple-400">
                Studio Edit
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1 max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
              />
            </div>
            <div className="text-[10px] font-mono text-white/40 min-w-[60px] text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
          >
            {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
          </button>

          <button
            onClick={handleDownload}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          {onEdit && (
            <button
              onClick={onEdit}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all ml-1"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
