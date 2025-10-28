// components/MusicGenerator/AudioPlayer.tsx
import React from 'react';
import { Button } from "../ui/button";
import { Play, Pause, Download } from "lucide-react";
import type { MusicTrack } from '../MusicGenerator/types';

interface AudioPlayerProps {
  audioUrl: string | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  currentTrack,
  isPlaying,
  onPlayPause,
  onDownload,
}) => {
  if (!audioUrl) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
        <Button
          onClick={onPlayPause}
          size="sm"
          variant="outline"
          className="border-zinc-600 hover:bg-zinc-700"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-200">
            {currentTrack?.prompt || "Generated Music"}
          </p>
          <p className="text-xs text-zinc-400">
            {currentTrack?.duration || 0} seconds • {currentTrack?.date || "Just now"}
          </p>
        </div>
        <Button
          onClick={onDownload}
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
      <audio controls src={audioUrl} className="w-full rounded-lg" />
    </div>
  );
};