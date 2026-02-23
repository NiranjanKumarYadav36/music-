// components/MusicGenerator/GenerationForm.tsx
import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import type { GenerationParameters } from '../MusicGenerator/types';

interface GenerationFormProps {
  parameters: GenerationParameters;
  onParametersChange: (params: GenerationParameters) => void;
  isLoading: boolean;
}

export const GenerationForm: React.FC<GenerationFormProps> = ({
  parameters,
  onParametersChange,
  isLoading,
}) => {
  const handleInputChange = (key: keyof GenerationParameters) => (
    value: string | number
  ) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  const handleSliderChange = (key: keyof GenerationParameters) => (value: number[]) => {
    onParametersChange({ ...parameters, [key]: value[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-zinc-200">Creative Prompt</Label>
        <Input
          value={parameters.prompt}
          onChange={(e) => handleInputChange('prompt')(e.target.value)}
          placeholder="e.g., lofi chill beats with piano and rain sounds..."
          className="mt-2 bg-zinc-900/50 border-zinc-600 text-white placeholder-zinc-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
      </div>

      <div>
        <SliderControl
          label={`Duration: ${parameters.duration}s`}
          value={parameters.duration}
          min={5}
          max={120}
          step={1}
          onChange={handleSliderChange('duration')}
          disabled={isLoading}
        />
      </div>

      {/* Advanced generation parameters have been removed from here and moved to PostProcessingSidebar */}
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
  disabled?: boolean;
}> = ({ label, value, min, max, step, onChange, disabled }) => (
  <div>
    <Label className="text-sm font-medium text-zinc-200">
      {label}
    </Label>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={onChange}
      disabled={disabled}
      className="mt-2"
    />
  </div>
);
