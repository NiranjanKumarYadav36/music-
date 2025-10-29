// components/MusicGenerator/HistorySidebar.tsx
import React from 'react';
import { Button } from "../ui/button";
import { History, Trash2 } from "lucide-react";
import type { MusicTrack } from '../MusicGenerator/types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  musicHistory: MusicTrack[];
  selectedMusic: MusicTrack | null;
  onSelectMusic: (music: MusicTrack) => void;
  onDeleteMusic: (id: number) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  musicHistory,
  selectedMusic,
  onSelectMusic,
  onDeleteMusic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-zinc-800/90 backdrop-blur-md border-r border-zinc-700 flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Generation History
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ×
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {musicHistory.map((music) => (
          <HistoryItem
            key={music.id}
            music={music}
            isSelected={selectedMusic?.id === music.id}
            onSelect={onSelectMusic}
            onDelete={onDeleteMusic}
          />
        ))}
        {musicHistory.length === 0 && <EmptyHistoryState />}
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{
  music: MusicTrack;
  isSelected: boolean;
  onSelect: (music: MusicTrack) => void;
  onDelete: (id: number) => void;
}> = ({ music, isSelected, onSelect, onDelete }) => (
  <div
    onClick={() => onSelect(music)}
    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-zinc-700/50 ${
      isSelected 
        ? 'bg-blue-500/20 border-blue-500' 
        : 'bg-zinc-700/30 border-zinc-600'
    }`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{music.prompt}</p>
        <p className="text-xs text-zinc-400 mt-1">
          {music.duration} • {music.date} 
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(music.id);
        }}
        className="text-zinc-400 hover:text-red-400"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const EmptyHistoryState: React.FC = () => (
  <div className="text-center text-zinc-400 py-8">
    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
    <p>No generation history</p>
  </div>
);
