import { Sparkles, Wand2, Timer, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import type { MusicTrack } from "./MusicGenerator/types";
import { EditSettingsModal } from "./EditSettingsModal";
import { GlassPanel } from "./ui/GlassPanel";

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
  "Cyberpunk industrial techno",
  "Ambient ethereal space pads",
  "Lofi chillhop study beats",
  "Cinematic orchestral epic",
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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 flex flex-col gap-8">
        {/* Header Hero Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400">
            <Sparkles className="w-3 h-3" />
            AI Music Synthesis Engine v2.0
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Create Masterpieces.
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Transform text into high-fidelity neural audio. High-precision
            composition tailored to your creative vision.
          </p>
        </div>

        {/* Central Composition Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

          {/* Main Input Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <GlassPanel className="p-1 group transition-all duration-500 focus-within:ring-2 focus-within:ring-purple-500/30">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder="Describe your soundscape..."
                  className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-xl p-6 placeholder:text-white/20 resize-none text-white leading-relaxed"
                />

                {/* Textarea deco */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                    {prompt.length} / 500
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={onGenerate}
                disabled={isLoading || !prompt.trim()}
                className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-bold group transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  )}
                  {isLoading ? "Synthesizing..." : "Initialize Generation"}
                </div>
              </Button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => onPromptChange(p)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-xs text-white/60 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Side Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassPanel className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                  <Timer className="w-3 h-3" />
                  Duration
                </div>
                <div className="text-sm font-mono text-purple-400">
                  {duration}s
                </div>
              </div>

              <Slider
                value={[duration]}
                onValueChange={([value]) => onDurationChange(value)}
                min={5}
                max={120}
                step={1}
                className="[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-purple-500 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-purple-500"
              />

              <div className="pt-4 border-t border-white/5">
                <Button
                  variant="ghost"
                  onClick={onEditClick}
                  className="w-full justify-start gap-2 h-10 text-white/60 hover:text-white hover:bg-white/5"
                >
                  <Settings2 className="w-4 h-4" />
                  Advanced Parameters
                </Button>
              </div>
            </GlassPanel>

            <div className="space-y-4 px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Studio Status</h3>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-xs text-white/40">Engine Standby</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Settings Modal */}
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
