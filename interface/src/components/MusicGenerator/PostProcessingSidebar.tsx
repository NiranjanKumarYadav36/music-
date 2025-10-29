// components/MusicGenerator/PostProcessingSidebar.tsx
import React from 'react';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Loader2, Settings, Edit3 } from "lucide-react";
import type { PostProcessingParameters } from '../MusicGenerator/types';

interface PostProcessingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: PostProcessingParameters;
  onParametersChange: (params: PostProcessingParameters) => void;
  onApply: () => void;
  isLoading: boolean;
}

export const PostProcessingSidebar: React.FC<PostProcessingSidebarProps> = ({
  isOpen,
  onClose,
  parameters,
  onParametersChange,
  onApply,
  isLoading,
}) => {
  if (!isOpen) return null;

  const handleSliderChange = (key: keyof PostProcessingParameters) => (value: number[]) => {
    onParametersChange({ ...parameters, [key]: value[0] });
  };
  
  const handleSwitchChange = (key: keyof PostProcessingParameters) => (value: boolean) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  const SliderControl: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number[]) => void;
    unit?: string;
  }> = ({ label, value, min, max, step, onChange, unit = '' }) => (
    <div>
      <Label className="text-sm font-medium text-zinc-200 mb-2 block">
        {label}: {value.toFixed(unit === 'x' ? 1 : 0)}{unit}
      </Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={onChange}
        disabled={isLoading}
        className="mt-2"
      />
    </div>
  );

  return (
    <div className="w-80 bg-zinc-800/90 backdrop-blur-md border-l border-zinc-700 flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-green-400" />
            Refine & Advanced Settings
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* --- 1. Post Processing Parameters --- */}
        <h3 className="text-base font-semibold text-zinc-300 border-b border-zinc-700/50 pb-2">Audio Effects</h3>
        <SliderControl label="Reverb" value={parameters.reverb} min={0} max={100} step={5} onChange={handleSliderChange('reverb')} unit="%" />
        <SliderControl label="Bass Boost" value={parameters.bassBoost} min={0} max={100} step={5} onChange={handleSliderChange('bassBoost')} unit="%" />
        <SliderControl label="Treble" value={parameters.treble} min={0} max={100} step={5} onChange={handleSliderChange('treble')} unit="%" />
        <SliderControl label="Speed" value={parameters.speed} min={0.5} max={2.0} step={0.1} onChange={handleSliderChange('speed')} unit="x" />

        {/* --- 2. Advanced Generation Parameters (Moved) --- */}
        <h3 className="text-base font-semibold text-zinc-300 border-b border-zinc-700/50 pb-2 pt-4">Advanced Generation</h3>
        <SliderControl label="Temperature (Creativity)" value={parameters.temperature} min={0.1} max={2.0} step={0.1} onChange={handleSliderChange('temperature')} />
        <SliderControl label="CFG Coefficient (Adherence to Prompt)" value={parameters.cfgCoef} min={1.0} max={10.0} step={0.1} onChange={handleSliderChange('cfgCoef')} />
        <SliderControl label="Top K" value={parameters.topK} min={50} max={500} step={10} onChange={handleSliderChange('topK')} />
        <SliderControl label="Top P" value={parameters.topP} min={0.0} max={1.0} step={0.1} onChange={handleSliderChange('topP')} />

        <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-lg border border-zinc-700">
          <Label className="text-sm font-medium text-zinc-200">
            Use Sampling
          </Label>
          <Switch 
            checked={parameters.useSampling} 
            onCheckedChange={handleSwitchChange('useSampling')}
            disabled={isLoading}
          />
        </div>
        
        <Button
          onClick={onApply}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying & Regenerating...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Apply & Regenerate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
