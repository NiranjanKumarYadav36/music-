import { useState, useEffect } from "react";
import { Music, Sparkles, ChevronDown, Check } from "lucide-react";
import { Button } from "./ui/button";
import { MusicPlayer } from "./MusicPlayer";
import { SettingsPanel } from "./SettingsPanel";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "./MusicGenerator/types";

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
  onEditClick,
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
        const aDuration = parseInt(a.duration);
        const bDuration = parseInt(b.duration);
        return bDuration - aDuration;
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
    <div className="flex-1 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto w-full p-6 pb-8">
        {/* Main Container */}
        <div className={cn(
          "backdrop-blur-md rounded-3xl p-8 border shadow-2xl transition-colors duration-300",
          "bg-gradient-to-br from-white/10 via-purple-500/10 to-cyan-500/10",
          "dark:bg-gradient-to-br dark:from-white/10 dark:via-purple-500/10 dark:to-cyan-500/10",
          "bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 shadow-xl",
          "border-white/20 dark:border-white/20 border-gray-300"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-purple-400 dark:text-purple-400">Your</span>{" "}
                <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Creations
                </span>
                <Sparkles className="w-5 h-5 inline-block ml-2 text-purple-400 dark:text-purple-400" />
              </h1>
              <p className={cn("text-gray-400 dark:text-gray-400 text-gray-600")}>
                {musicHistory.length} track{musicHistory.length !== 1 ? "s" : ""} in your library
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className={cn(
                  "min-w-[150px] justify-between transition-colors duration-200 border-2",
                  "bg-white/5 dark:bg-white/5 bg-gray-100",
                  "border-white/20 dark:border-white/20 border-gray-300",
                  "text-white dark:text-white text-gray-800 font-medium",
                  "hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-100 hover:border-purple-400 hover:shadow-md"
                )}
              >
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className={cn(
                    "absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl border shadow-xl z-20 border-2",
                    "bg-black/90 dark:bg-black/90 bg-white shadow-lg",
                    "border-white/20 dark:border-white/20 border-gray-300"
                  )}>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between",
                          sortBy === option.value
                            ? "bg-pink-500/30 dark:bg-pink-500/30 bg-pink-100 text-white dark:text-white text-gray-900"
                            : "text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100"
                        )}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <Check className="w-4 h-4 text-pink-400 dark:text-pink-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Selected Music Player */}
          {selectedMusic && (
            <div className="mb-6 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-top-4">
              <MusicPlayer
                track={selectedMusic}
                onEdit={() => setShowEditPanel(!showEditPanel)}
              />
            </div>
          )}

          {/* Settings Panel - Shows inline when edit is clicked */}
          {showEditPanel && selectedMusic && (
            <div className="mb-6 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4">
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
                onApplyEdit={() => {
                  onApplyEdit();
                  setShowEditPanel(false);
                }}
                isLoading={isLoading}
                compact={true}
              />
            </div>
          )}

          {/* Content */}
          {musicHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className={cn(
                  "w-32 h-32 rounded-full backdrop-blur-md flex items-center justify-center border",
                  "bg-gradient-to-br from-purple-500/20 to-cyan-500/20",
                  "dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-cyan-500/20",
                  "bg-gradient-to-br from-purple-100/50 to-cyan-100/50",
                  "border-white/20 dark:border-white/20 border-gray-200"
                )}>
                  <Music className="w-16 h-16 text-purple-400 dark:text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Your library is empty
              </h2>
              <p className={cn("text-center max-w-md text-gray-400 dark:text-gray-400 text-gray-600")}>
                Start creating amazing tracks and they'll appear here
                <Sparkles className="w-4 h-4 inline-block ml-1 text-yellow-400 dark:text-yellow-400" />
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {sortedHistory.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "backdrop-blur-md rounded-xl p-4 border transition-all cursor-pointer group border-2",
                    "bg-white/5 dark:bg-white/5 bg-white shadow-md",
                    selectedMusic?.id === track.id
                      ? "border-purple-500 dark:border-purple-500/50 border-purple-500 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 bg-purple-50"
                      : "border-white/10 dark:border-white/10 border-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:shadow-lg"
                  )}
                  onClick={() => onSelectMusic(track)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-semibold truncate mb-1 text-white dark:text-white text-gray-900")}>
                        {track.prompt}
                      </h3>
                      <p className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600 flex items-center")}>
                        {track.date}
                        {track.isEdited && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            Refined <Sparkles className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={cn("text-xs ml-2 text-purple-400 dark:text-purple-400")}>
                      {track.duration}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMusic(track.id);
                    }}
                    className={cn(
                      "mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                      "text-red-400 dark:text-red-400 hover:text-red-300 dark:hover:text-red-300",
                      "hover:bg-red-500/10 dark:hover:bg-red-500/10"
                    )}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

