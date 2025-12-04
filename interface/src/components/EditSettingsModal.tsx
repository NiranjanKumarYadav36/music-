import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { SettingsPanel } from "./SettingsPanel";

interface EditSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Advanced settings
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
  // Audio effects
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
  isLoading?: boolean;
}

export const EditSettingsModal: React.FC<EditSettingsModalProps> = ({
  isOpen,
  onClose,
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
}) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/20 bg-white/80 dark:bg-zinc-900/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-zinc-800/70 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-cyan-500/20">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Refine your music
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tweak generation settings and audio effects to perfect your track.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/60 text-gray-700 shadow-sm transition hover:bg-white hover:text-gray-900 dark:bg-zinc-800/80 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-purple-500/70 scrollbar-track-transparent">
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
            onApplyEdit={onApplyEdit}
            isLoading={isLoading}
            compact
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined" || !document.body) return content;

  return createPortal(content, document.body);
};


