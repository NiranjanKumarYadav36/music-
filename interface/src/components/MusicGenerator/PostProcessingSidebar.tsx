// components/MusicGenerator/PostProcessingSidebar.tsx
import React from 'react';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
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

  return (
    <div className="w-80 bg-zinc-800/90 backdrop-blur-md border-l border-zinc-700 flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-green-400" />
            Post Processing
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
        <SliderControl
          label={`Reverb: ${parameters.reverb}%`}
          value={parameters.reverb}
          min={0}
          max={100}
          step={5}
          onChange={handleSliderChange('reverb')}
        />
        
        <SliderControl
          label={`Bass Boost: ${parameters.bassBoost}%`}
          value={parameters.bassBoost}
          min={0}
          max={100}
          step={5}
          onChange={handleSliderChange('bassBoost')}
        />
        
        <SliderControl
          label={`Treble: ${parameters.treble}%`}
          value={parameters.treble}
          min={0}
          max={100}
          step={5}
          onChange={handleSliderChange('treble')}
        />
        
        <SliderControl
          label={`Speed: ${parameters.speed.toFixed(1)}x`}
          value={parameters.speed}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={handleSliderChange('speed')}
        />

        <Button
          onClick={onApply}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Apply Post-Processing
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number[]) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div>
    <Label className="text-sm font-medium text-zinc-200 mb-2 block">
      {label}
    </Label>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={onChange}
      className="mt-2"
    />
  </div>
);