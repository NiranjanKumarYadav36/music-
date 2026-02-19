import { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Settings, Music } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "./MusicGenerator/types";

interface MusicPlayerProps {
  track: MusicTrack | null;
  onEdit?: () => void;
}

export function MusicPlayer({ track, onEdit }: MusicPlayerProps) {
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
    <div
      className={cn(
        "backdrop-blur-md rounded-2xl p-6 border shadow-xl",
        "transition-all duration-500 ease-in-out",
        "animate-in fade-in slide-in-from-bottom-4",
        "bg-white/5 dark:bg-white/5 bg-white/95 shadow-lg",
        "border-white/10 dark:border-white/10 border-gray-300"
      )}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg">
          <Music className="w-5 h-5 text-purple-400 dark:text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn("text-lg font-semibold truncate text-white dark:text-white text-gray-900")}>
            {track.prompt}
          </h3>
          <p className={cn("text-sm text-gray-400 dark:text-gray-400 text-gray-600")}>
            {track.duration} • {track.date}
            {track.isEdited && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Refined ✨
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className={cn("w-full h-1.5 rounded-full overflow-hidden bg-white/10 dark:bg-white/10 bg-gray-200")}>
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300"
            style={{
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
        </div>
        <div className={cn("flex justify-between text-xs mt-2 text-gray-400 dark:text-gray-400 text-gray-600")}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePlayPause}
          className={cn(
            "flex-1 h-12 rounded-xl font-semibold text-white",
            "bg-gradient-to-r from-purple-500 to-cyan-500",
            "hover:from-purple-600 hover:to-cyan-600",
            "transition-all duration-200 shadow-lg shadow-purple-500/30"
          )}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Play
            </>
          )}
        </Button>

        <Button
          onClick={handleDownload}
          variant="outline"
          className={cn(
            "h-12 px-6 rounded-xl transition-all duration-200 border-2",
            "border-white/20 dark:border-white/20 border-gray-300",
            "bg-white/5 dark:bg-white/5 bg-gray-100",
            "hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-100 hover:border-purple-400",
            "text-white dark:text-white text-gray-800 font-medium hover:shadow-md"
          )}
        >
          <Download className="w-5 h-5 mr-2" />
          Download
        </Button>

        {onEdit && (
          <Button
            onClick={onEdit}
            variant="outline"
            className={cn(
              "h-12 px-6 rounded-xl transition-all duration-200 border-2",
              "border-white/20 dark:border-white/20 border-gray-300",
              "bg-white/5 dark:bg-white/5 bg-gray-100",
              "hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-100 hover:border-purple-400",
              "text-white dark:text-white text-gray-800 font-medium hover:shadow-md"
            )}
          >
            <Settings className="w-5 h-5 mr-2" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

