import { useState } from "react";
import { Info, RotateCcw, Sliders, AudioWaveform } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
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
  onApplyEdit?: () => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function SettingsPanel({
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
  isLoading = false,
  compact = false,
}: SettingsPanelProps) {
  return (
    <div className={cn("space-y-12", compact ? "" : "p-6")}>

      {/* Generation Parameters Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Neural Parameters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onTemperatureChange(1);
              onCfgCoefChange(8);
              onTopKChange(250);
              onTopPChange(0);
            }}
            className="h-8 text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <DetailControl
            label="Temperature"
            value={temperature}
            onChange={onTemperatureChange}
            min={0.1} max={2.0} step={0.1}
            desc="Controls randomness in generation. Higher values are more creative but less coherent."
          />
          <DetailControl
            label="CFG Coefficient"
            value={cfgCoef}
            onChange={onCfgCoefChange}
            min={1.0} max={10.0} step={0.1}
            desc="How closely the engine follows your prompt. Higher is stricter."
          />
          <DetailControl
            label="Top-K"
            value={topK}
            onChange={onTopKChange}
            min={1} max={500} step={1}
            desc="Limited vocabulary selection for better structural integrity."
          />
          <DetailControl
            label="Top-P"
            value={topP}
            onChange={onTopPChange}
            min={0} max={1.0} step={0.05}
            desc="Cumulative probability threshold for token sampling."
          />
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between transition-all hover:bg-white/10">
          <div className="space-y-1">
            <Label className="text-sm font-bold text-white uppercase tracking-wider">Neural Sampling</Label>
            <p className="text-[10px] text-white/40 font-medium max-w-xs">Enable advanced probabilistic analysis for natural sonic transitions.</p>
          </div>
          <Switch
            checked={useSampling}
            onCheckedChange={onUseSamplingChange}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
      </section>

      {/* Audio Processing Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <AudioWaveform className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Digital Signal Processing</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetEffects}
            className="h-8 text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <SliderControl label="Reverb Intensity" value={reverb} onChange={onReverbChange} unit="%" />
          <SliderControl label="Bass Amplification" value={bassBoost} onChange={onBassBoostChange} unit="%" />
          <SliderControl label="Treble Presence" value={treble} onChange={onTrebleChange} unit="%" />
          <SliderControl label="Playback Rate" value={speed} onChange={onSpeedChange} min={0.5} max={2.0} step={0.1} unit="x" />
        </div>
      </section>

      {/* Persistence Controls */}
      {onApplyEdit && (
        <div className="pt-8 border-t border-white/5">
          <Button
            onClick={onApplyEdit}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-white/90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {isLoading ? "Synchronizing Engine..." : "Manifest Studio changes"}
          </Button>
        </div>
      )}
    </div>
  );
}

function DetailControl({
  label, value, onChange, min, max, step, desc
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; desc: string;
}) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-end justify-between">
        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60 group-hover:text-white transition-colors">{label}</Label>
        <div className="text-xs font-mono text-purple-400 font-bold">{value.toFixed(1)}</div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min} max={max} step={step}
        className="[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/5 [&_[data-slot=slider-range]]:bg-purple-500/50 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:bg-purple-500 [&_[data-slot=slider-thumb]]:border-none"
      />
      <p className="text-[9px] text-white/20 font-medium uppercase tracking-wider transition-opacity group-hover:opacity-100 opacity-60 leading-relaxed">{desc}</p>
    </div>
  );
}

function SliderControl({
  label, value, onChange, min = 0, max = 100, step = 1, unit
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string;
}) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-end justify-between">
        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60 group-hover:text-white transition-colors">{label}</Label>
        <div className="text-xs font-mono text-cyan-400 font-bold">{value.toFixed(1)}{unit}</div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min} max={max} step={step}
        className="[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/5 [&_[data-slot=slider-range]]:bg-cyan-500/50 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:bg-cyan-500 [&_[data-slot=slider-thumb]]:border-none"
      />
    </div>
  );
}
