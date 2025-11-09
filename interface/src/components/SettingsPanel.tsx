import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
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
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [showAudioEffects, setShowAudioEffects] = useState(true);

  return (
    <div className={cn(
      "backdrop-blur-md rounded-2xl border shadow-xl transition-all duration-300 ease-in-out",
      "bg-white/5 dark:bg-white/5 bg-white/95 shadow-lg",
      "border-white/10 dark:border-white/10 border-gray-300",
      compact && "p-4"
    )}>
      {/* Advanced Settings */}
      <div className={cn(!compact && "mb-4")}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "w-full p-4 flex items-center justify-between rounded-t-2xl transition-colors",
            "text-white dark:text-white text-gray-900",
            "hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100",
            compact && "p-3 rounded-xl"
          )}
        >
          <span className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            Advanced Settings
          </span>
          <span className={cn("text-gray-400 dark:text-gray-400 text-gray-600")}>
            {showAdvanced ? "▲" : "▼"}
          </span>
        </button>
        {showAdvanced && (
          <div className={cn("p-4 pt-0 space-y-4", compact && "p-3 pt-0")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onTemperatureChange(1);
                onCfgCoefChange(3);
                onTopKChange(250);
                onTopPChange(0);
              }}
              className={cn(
                "text-xs mb-2",
                "text-gray-400 dark:text-gray-400 text-gray-600",
                "hover:text-white dark:hover:text-white hover:text-gray-900"
              )}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset to defaults
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600")}>Temperature</Label>
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className={cn(
                    "mt-1 border-2",
                    "bg-black/30 dark:bg-black/30 bg-gray-50",
                    "border-white/10 dark:border-white/10 border-gray-300",
                    "text-white dark:text-white text-gray-900",
                    "focus:border-purple-500 focus:ring-purple-500/20"
                  )}
                />
                <p className={cn("text-xs mt-1 text-gray-500 dark:text-gray-500 text-gray-400")}>0.1 - 2.0</p>
              </div>
              <div>
                <Label className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600")}>CFG Coefficient</Label>
                <Input
                  type="number"
                  value={cfgCoef}
                  onChange={(e) => onCfgCoefChange(parseFloat(e.target.value))}
                  min={1.0}
                  max={10.0}
                  step={0.1}
                  className={cn(
                    "mt-1 border-2",
                    "bg-black/30 dark:bg-black/30 bg-gray-50",
                    "border-white/10 dark:border-white/10 border-gray-300",
                    "text-white dark:text-white text-gray-900",
                    "focus:border-purple-500 focus:ring-purple-500/20"
                  )}
                />
                <p className={cn("text-xs mt-1 text-gray-500 dark:text-gray-500 text-gray-400")}>1.0 - 10.0</p>
              </div>
              <div>
                <Label className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600")}>Top-K</Label>
                <Input
                  type="number"
                  value={topK}
                  onChange={(e) => onTopKChange(parseInt(e.target.value))}
                  min={1}
                  max={500}
                  className={cn(
                    "mt-1 border-2",
                    "bg-black/30 dark:bg-black/30 bg-gray-50",
                    "border-white/10 dark:border-white/10 border-gray-300",
                    "text-white dark:text-white text-gray-900",
                    "focus:border-purple-500 focus:ring-purple-500/20"
                  )}
                />
                <p className={cn("text-xs mt-1 text-gray-500 dark:text-gray-500 text-gray-400")}>1 - 500</p>
              </div>
              <div>
                <Label className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600")}>Top-P</Label>
                <Input
                  type="number"
                  value={topP}
                  onChange={(e) => onTopPChange(parseFloat(e.target.value))}
                  min={0}
                  max={1.0}
                  step={0.1}
                  className={cn(
                    "mt-1 border-2",
                    "bg-black/30 dark:bg-black/30 bg-gray-50",
                    "border-white/10 dark:border-white/10 border-gray-300",
                    "text-white dark:text-white text-gray-900",
                    "focus:border-purple-500 focus:ring-purple-500/20"
                  )}
                />
                <p className={cn("text-xs mt-1 text-gray-500 dark:text-gray-500 text-gray-400")}>0.0 - 1.0</p>
              </div>
            </div>
            <div className={cn("pt-2 border-t border-white/10 dark:border-white/10 border-gray-200")}>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={cn("text-sm text-white dark:text-white text-gray-900")}>Use Sampling</Label>
                  <p className={cn("text-xs text-gray-400 dark:text-gray-400 text-gray-600")}>
                    Enable probabilistic sampling during generation
                  </p>
                </div>
                <Switch
                  checked={useSampling}
                  onCheckedChange={onUseSamplingChange}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Effects */}
      <div>
        <div className={cn("p-4 flex items-center justify-between", compact && "p-3")}>
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold text-white dark:text-white text-gray-900")}>Audio Effects</span>
            <Info className={cn("w-4 h-4 text-gray-400 dark:text-gray-400 text-gray-600")} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetEffects}
            className={cn(
              "text-xs",
              "text-gray-400 dark:text-gray-400 text-gray-600",
              "hover:text-white dark:hover:text-white hover:text-gray-900"
            )}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
        <button
          onClick={() => setShowAudioEffects(!showAudioEffects)}
          className={cn(
            "w-full px-4 pb-2 flex items-center justify-end text-xs",
            "text-gray-400 dark:text-gray-400 text-gray-600",
            compact && "px-3"
          )}
        >
          {showAudioEffects ? "▲" : "▼"}
        </button>
        {showAudioEffects && (
          <div className={cn("p-4 pt-0 space-y-4", compact && "p-3 pt-0")}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className={cn("text-sm text-white dark:text-white text-gray-900")}>Reverb</Label>
                <span className={cn("text-sm text-white dark:text-white text-gray-900")}>{reverb}%</span>
              </div>
              <Slider
                value={[reverb]}
                onValueChange={([value]) => onReverbChange(value)}
                min={0}
                max={100}
                className="[&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-purple-500 [&_[data-slot=slider-track]]:to-cyan-500 [&_[data-slot=slider-thumb]]:bg-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className={cn("text-sm text-white dark:text-white text-gray-900")}>Bass Boost</Label>
                <span className={cn("text-sm text-white dark:text-white text-gray-900")}>{bassBoost}%</span>
              </div>
              <Slider
                value={[bassBoost]}
                onValueChange={([value]) => onBassBoostChange(value)}
                min={0}
                max={100}
                className="[&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-purple-500 [&_[data-slot=slider-track]]:to-cyan-500 [&_[data-slot=slider-thumb]]:bg-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className={cn("text-sm text-white dark:text-white text-gray-900")}>Treble</Label>
                <span className={cn("text-sm text-white dark:text-white text-gray-900")}>{treble}%</span>
              </div>
              <Slider
                value={[treble]}
                onValueChange={([value]) => onTrebleChange(value)}
                min={0}
                max={100}
                className="[&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-purple-500 [&_[data-slot=slider-track]]:to-cyan-500 [&_[data-slot=slider-thumb]]:bg-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className={cn("text-sm text-white dark:text-white text-gray-900")}>Speed</Label>
                <span className={cn("text-sm text-white dark:text-white text-gray-900")}>{speed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([value]) => onSpeedChange(value)}
                min={0.5}
                max={2.0}
                step={0.1}
                className="[&_[data-slot=slider-track]]:bg-gradient-to-r [&_[data-slot=slider-track]]:from-purple-500 [&_[data-slot=slider-track]]:to-cyan-500 [&_[data-slot=slider-thumb]]:bg-blue-500"
              />
              <div className={cn("flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-500 text-gray-400")}>
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Edit Button - Only show if onApplyEdit is provided */}
      {onApplyEdit && (
        <div className={cn("mt-4 pt-4 border-t border-white/10 dark:border-white/10 border-gray-200", compact && "mt-3 pt-3")}>
          <Button
            onClick={onApplyEdit}
            disabled={isLoading}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl text-white",
              "bg-gradient-to-r from-purple-500 to-cyan-500",
              "hover:from-purple-600 hover:to-cyan-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 shadow-lg shadow-purple-500/30"
            )}
          >
            {isLoading ? "Applying Changes..." : "Apply Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}

