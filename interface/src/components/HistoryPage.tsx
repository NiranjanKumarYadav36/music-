import { useState, useEffect } from "react";
import { Music, Trash2, Calendar, Timer, ListFilter, Check } from "lucide-react";
import { Button } from "./ui/button";
import { MusicPlayer } from "./MusicPlayer";
import { SettingsPanel } from "./SettingsPanel";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "./MusicGenerator/types";
import { GlassPanel } from "./ui/GlassPanel";

interface HistoryPageProps {
  musicHistory: MusicTrack[];
  selectedMusic: MusicTrack | null;
  onSelectMusic: (music: MusicTrack) => void;
  onDeleteMusic: (id: number) => void;
  onEditClick: () => void;
  // Settings props
  temperature: number;
  onTemperatureChange: (value: number) => void;
  cfgCoef: number;
  onCfgCoefChange: (value: number) => void;
  topK: number;
  onTopKChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
  useSampling: boolean;
  onUseSamplingChange: (value: boolean) => void;
  reverb: number;
  onReverbChange: (value: number) => void;
  bassBoost: number;
  onBassBoostChange: (value: number) => void;
  treble: number;
  onTrebleChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  onResetEffects: () => void;
  onApplyEdit: () => void;
  isLoading: boolean;
}

type SortOption = "most-recent" | "oldest-first" | "longest-duration";

export function HistoryPage({
  musicHistory,
  selectedMusic,
  onSelectMusic,
  onDeleteMusic,
  temperature,
  onTemperatureChange,
  cfgCoef,
  onCfgCoefChange,
  topK,
  onTopKChange,
  topP,
  onTopPChange,
  useSampling,
  onUseSamplingChange,
  reverb,
  onReverbChange,
  bassBoost,
  onBassBoostChange,
  treble,
  onTrebleChange,
  speed,
  onSpeedChange,
  onResetEffects,
  onApplyEdit,
  isLoading,
}: HistoryPageProps) {
  const [sortBy, setSortBy] = useState<SortOption>("most-recent");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);

  // Close edit panel when a different track is selected
  useEffect(() => {
    setShowEditPanel(false);
  }, [selectedMusic?.id]);

  const sortedHistory = [...musicHistory].sort((a, b) => {
    switch (sortBy) {
      case "oldest-first":
        return a.id - b.id;
      case "longest-duration":
        return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
      case "most-recent":
      default:
        return b.id - a.id;
    }
  });

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "most-recent", label: "Most Recent" },
    { value: "oldest-first", label: "Oldest First" },
    { value: "longest-duration", label: "Longest Duration" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-32 lg:px-12 scrollbar-none">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Gallery Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Storage / Active Library
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Vault of <span className="text-white/40">Creations</span>
            </h1>

            {/* Sort Controls */}
            <div className="relative pt-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                <ListFilter className="w-3 h-3 text-purple-400" />
                Sort: {sortOptions.find(o => o.value === sortBy)?.label}
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <GlassPanel className="p-1 flex flex-col">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowDropdown(false); }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between rounded-lg transition-colors",
                          sortBy === opt.value ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60 hover:bg-white/5"
                        )}
                      >
                        {opt.label}
                        {sortBy === opt.value && <Check className="w-3 h-3 text-purple-400" />}
                      </button>
                    ))}
                  </GlassPanel>
                </div>
              )}
            </div>
          </div>

          {/* Player for selected music */}
          {selectedMusic && (
            <div className="flex-1 max-w-xl animate-in fade-in slide-in-from-right duration-500">
              <MusicPlayer
                track={selectedMusic}
                onEdit={() => setShowEditPanel(!showEditPanel)}
                className="bg-white/5 border-white/10"
              />
            </div>
          )}
        </div>

        {/* Edit View Overlay (if active) */}
        {showEditPanel && selectedMusic && (
          <GlassPanel className="mx-4 p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Studio Refinement Portal</h2>
              <Button variant="ghost" onClick={() => setShowEditPanel(false)} className="h-8 text-white/40 hover:text-white">
                Cancel Edit
              </Button>
            </div>
            <SettingsPanel
              temperature={temperature}
              onTemperatureChange={onTemperatureChange}
              cfgCoef={cfgCoef}
              onCfgCoefChange={onCfgCoefChange}
              topK={topK}
              onTopKChange={onTopKChange}
              topP={topP}
              onTopPChange={onTopPChange}
              useSampling={useSampling}
              onUseSamplingChange={onUseSamplingChange}
              reverb={reverb}
              onReverbChange={onReverbChange}
              bassBoost={bassBoost}
              onBassBoostChange={onBassBoostChange}
              treble={treble}
              onTrebleChange={onTrebleChange}
              speed={speed}
              onSpeedChange={onSpeedChange}
              onResetEffects={onResetEffects}
              onApplyEdit={() => { onApplyEdit(); setShowEditPanel(false); }}
              isLoading={isLoading}
              compact={true}
            />
          </GlassPanel>
        )}

        {/* Music Grid */}
        {musicHistory.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6">
              <Music className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">Initialize your studio</h3>
            <p className="text-white/40 max-w-sm">No tracks detected in the vault. Generations will manifest here once initialized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-20">
            {sortedHistory.map((track) => (
              <GlassPanel
                key={track.id}
                className={cn(
                  "p-6 group cursor-pointer transition-all duration-500 border-white/5 hover:border-white/20",
                  selectedMusic?.id === track.id ? "bg-white/10 border-white/40 ring-2 ring-white/10" : ""
                )}
                onClick={() => onSelectMusic(track)}
              >
                <div className="space-y-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Music className="w-4 h-4 text-white" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm truncate uppercase tracking-widest">{track.prompt}</h3>
                    <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 leading-none">
                        <Calendar className="w-3 h-3" />
                        {track.date}
                      </div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <Timer className="w-3 h-3" />
                        {track.duration}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {track.isEdited && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase tracking-[0.1em]">
                        Studio Edit
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMusic(track.id);
                      }}
                      className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
