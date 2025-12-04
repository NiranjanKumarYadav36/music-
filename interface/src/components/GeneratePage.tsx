import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { MusicPlayer } from "./MusicPlayer";
import { SettingsPanel } from "./SettingsPanel";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "./MusicGenerator/types";
import { EditSettingsModal } from "./EditSettingsModal";

interface GeneratePageProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  duration: number;
  onDurationChange: (value: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  currentMusic: MusicTrack | null;
  onEditClick: () => void;
  showEditPanel: boolean;
  // Advanced Settings
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
  // Audio Effects
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
}

const quickPrompts = [
  "Upbeat electronic dance music with synthesizers",
  "Calm acoustic guitar melody for relaxation",
  "Epic orchestral soundtrack with drums",
  "Lo-fi hip hop beats for studying",
];

export function GeneratePage({
  prompt,
  onPromptChange,
  duration,
  onDurationChange,
  onGenerate,
  isLoading,
  currentMusic,
  onEditClick,
  showEditPanel,
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
}: GeneratePageProps) {

  return (
    <div className="flex-1 flex gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4 min-h-0">
        {/* Title Section - Only show when no music is generated */}
        {!currentMusic && (
          <div className="space-y-2 animate-in fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              MusicGen Studio
            </h1>
            <p className={cn("text-gray-400 dark:text-gray-400 text-gray-600")}>
              Turn your imagination into music ✨
            </p>
          </div>
        )}

        {/* Describe your music - Only show when no music or when reset */}
        {(!currentMusic || !showEditPanel) && (
          <div className={cn(
            "backdrop-blur-md rounded-2xl p-6 border shadow-xl transition-colors duration-300",
            "bg-white/5 dark:bg-white/5 bg-white/95 shadow-lg",
            "border-white/10 dark:border-white/10 border-gray-300",
            "animate-in fade-in slide-in-from-bottom-4"
          )}>
            <Label className={cn("flex items-center gap-2 mb-4 text-white dark:text-white text-gray-900")}>
              <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-400" />
              Describe your music
            </Label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="e.g., Upbeat electronic dance music with synthesizers and heavy bass."
              maxLength={500}
              className={cn(
                "w-full min-h-[120px] backdrop-blur-sm rounded-xl px-4 py-3 resize-none transition-all",
                "bg-black/30 dark:bg-black/30 bg-gray-50 border-2",
                "border border-white/10 dark:border-white/10 border-gray-300",
                "text-white dark:text-white text-gray-900",
                "placeholder:text-gray-500 dark:placeholder:text-gray-500 placeholder:text-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500/50 focus:border-purple-500"
              )}
            />
            <div className={cn("absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-400 text-gray-500")}>
              {prompt.length} / 500
            </div>
          </div>
        </div>
        )}

        {/* Duration - Only show when no music or when reset */}
        {(!currentMusic || !showEditPanel) && (
          <div className={cn(
            "backdrop-blur-md rounded-2xl p-6 border shadow-xl transition-colors duration-300",
            "bg-white/5 dark:bg-white/5 bg-white/95 shadow-lg",
            "border-white/10 dark:border-white/10 border-gray-300",
            "animate-in fade-in slide-in-from-bottom-4"
          )}>
            <Label className={cn("mb-4 block text-white dark:text-white text-gray-900")}>Duration</Label>
          <div className="space-y-4">
            <Slider
              value={[duration]}
              onValueChange={([value]) => onDurationChange(value)}
              min={5}
              max={60}
              step={1}
              className="[&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-purple-500 [&_[data-slot=slider-track]]:to-cyan-500 [&_[data-slot=slider-thumb]]:bg-blue-500 [&_[data-slot=slider-thumb]]:border-blue-400"
            />
            <div className={cn("flex justify-between text-sm text-gray-400 dark:text-gray-400 text-gray-600")}>
              <span>5s</span>
              <span className={cn("font-medium text-white dark:text-white text-gray-900")}>{duration}s</span>
              <span>60s</span>
            </div>
          </div>
        </div>
        )}

        {/* Generate Button - Always visible so users can generate again */}
        <Button
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-xl text-white",
            "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500",
            "hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200 shadow-lg shadow-purple-500/30",
            "flex items-center justify-center",
            "animate-in fade-in slide-in-from-bottom-4"
          )}
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isLoading
            ? "Generating..."
            : currentMusic
            ? "Generate New Music"
            : "Generate Music"}
        </Button>

        {/* Music Player - Shows when music is generated */}
        {currentMusic && (
          <div className="transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
            <MusicPlayer track={currentMusic} onEdit={onEditClick} />
          </div>
        )}

        {/* Quick Prompts - Only show when no music */}
        {!currentMusic && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400 text-gray-600")}>
              Quick Prompts
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickPrompts.map((quickPrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => onPromptChange(quickPrompt)}
                  className={cn(
                    "rounded-lg transition-colors duration-200",
                    "bg-white/5 dark:bg-white/5 bg-gray-100 border-2",
                    "border-white/10 dark:border-white/10 border-gray-300",
                    "text-white dark:text-white text-gray-800 font-medium",
                    "hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-100 hover:border-purple-400",
                    "hover:border-white/20 dark:hover:border-white/20 hover:shadow-md"
                  )}
                >
                  {quickPrompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Settings Modal - Glassmorphic popup */}
      <EditSettingsModal
        isOpen={!!currentMusic && showEditPanel}
        onClose={onEditClick}
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
        onApplyEdit={onApplyEdit}
        isLoading={isLoading}
      />
    </div>
  );
}

