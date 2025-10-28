// components/MusicGenerator/GenerationForm.tsx
import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
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
    value: string | number | boolean
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <SliderControl
            label={`Duration: ${parameters.duration}s`}
            value={parameters.duration}
            min={5}
            max={60}
            step={1}
            onChange={handleSliderChange('duration')}
            disabled={isLoading}
          />

          <SliderControl
            label={`Temperature: ${parameters.temperature.toFixed(1)}`}
            value={parameters.temperature}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={handleSliderChange('temperature')}
            disabled={isLoading}
          />

          <SliderControl
            label={`CFG Coefficient: ${parameters.cfgCoef.toFixed(1)}`}
            value={parameters.cfgCoef}
            min={1.0}
            max={10.0}
            step={0.1}
            onChange={handleSliderChange('cfgCoef')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <SliderControl
            label={`Top K: ${parameters.topK}`}
            value={parameters.topK}
            min={50}
            max={500}
            step={10}
            onChange={handleSliderChange('topK')}
            disabled={isLoading}
          />

          <SliderControl
            label={`Top P: ${parameters.topP.toFixed(1)}`}
            value={parameters.topP}
            min={0.0}
            max={1.0}
            step={0.1}
            onChange={handleSliderChange('topP')}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-lg border border-zinc-700">
            <Label className="text-sm font-medium text-zinc-200">
              Use Sampling
            </Label>
            <Switch 
              checked={parameters.useSampling} 
              onCheckedChange={handleInputChange('useSampling')}
              disabled={isLoading}
            />
          </div>
        </div>
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