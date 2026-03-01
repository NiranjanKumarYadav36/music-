import { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Settings } from "lucide-react";
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
  const lastAutoPlayedUrl = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Setup Analyser Node
  useEffect(() => {
    if (!audioRef.current || audioContextRef.current) return;

    const initAudio = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaElementSource(audioRef.current!);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (err) {
        console.warn("AudioContext initialization failed:", err);
      }
    };

    initAudio();

    return () => {
      // Don't close context on every render, but clean up if needed
    };
  }, [track?.audioUrl]);

  // Draw Waveform Loop
  useEffect(() => {
    let animationId: number;

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Shared gradient for performance
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, "rgba(168,85,247,0.7)");
      gradient.addColorStop(0.5, "rgba(99,102,241,0.85)");
      gradient.addColorStop(1, "rgba(34,211,238,1)");

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = Math.max(3, (dataArray[i] / 255) * canvas.height);

        // Glow shadow
        ctx.shadowColor = "rgba(99,102,241,0.6)";
        ctx.shadowBlur = 6;

        ctx.fillStyle = gradient;

        // Rounded top cap
        const bw = barWidth - 2;
        const by = canvas.height - barHeight;
        ctx.beginPath();
        ctx.roundRect(x, by, bw, barHeight, [3, 3, 0, 0]);
        ctx.fill();

        x += barWidth;
      }

      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    if (track?.audioUrl && audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      // Only auto-play if the source URL has changed
      if (lastAutoPlayedUrl.current !== track.audioUrl) {
        lastAutoPlayedUrl.current = track.audioUrl;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
              }
            })
            .catch((error) => {
              console.warn("Auto-play prevented by browser policy.", error);
              setIsPlaying(false);
            });
        }
      }

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

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

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

  const currentTrack = track;
  const formattedTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);
  const togglePlay = handlePlayPause;
  const openAdvancedSettings = onEdit;
  const handlePrev = () => { }; // Placeholder for UI continuity
  const handleNext = () => { }; // Placeholder for UI continuity

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" crossOrigin="anonymous" />

      {/* WAVEFORM STRIP */}
      <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-inner">
        <canvas
          ref={canvasRef}
          width={800}
          height={112}
          className="w-full h-full"
        />
        {/* Subtle inner glow at bottom of waveform */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[rgba(168,85,247,0.08)] to-transparent pointer-events-none" />
        <div className="absolute top-2 left-3 text-[8px] font-bold uppercase tracking-[0.3em] text-white/20 pointer-events-none select-none">
          Neural Waveform
        </div>
      </div>

      {/* CONTROL ROW */}
      <div className="flex items-center justify-between gap-8">

        {/* LEFT - TRACK INFO */}
        <div className="flex flex-col min-w-[200px] gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight truncate drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              {currentTrack?.prompt || "No Track Selected"}
            </span>
            {currentTrack?.isEdited && (
              <span className="flex-shrink-0 text-[8px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-300/10 border border-cyan-300/30 rounded-full px-2 py-0.5">
                Refined
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tabular-nums text-primary drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]">
              {formattedTime}
            </span>
            <span className="text-xs text-white/30">/</span>
            <span className="text-xs font-semibold tabular-nums text-white/50">
              {formattedDuration}
            </span>
          </div>
        </div>

        {/* CENTER - CONTROLS */}
        <div className="flex items-center gap-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-lg bg-white/8 border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span className="text-sm">◀◀</span>
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full backdrop-blur-3xl bg-primary/30 border-2 border-primary/60 shadow-[0_0_40px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)] hover:scale-110 active:scale-90 transition-all duration-300 group"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white fill-white transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-1 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-lg bg-white/8 border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span className="text-sm">▶▶</span>
          </button>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/8 border border-white/25 text-[11px] font-bold uppercase tracking-widest text-white/75 hover:text-white hover:bg-white/15 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button
            onClick={openAdvancedSettings}
            className="p-2.5 rounded-full backdrop-blur-xl bg-white/8 border border-white/25 text-white/60 hover:text-white hover:bg-white/15 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
