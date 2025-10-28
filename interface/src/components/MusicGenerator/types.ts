// components/MusicGenerator/types.ts
export interface MusicTrack {
  id: number;
  prompt: string;
  duration: number;
  date: string;
  audioUrl: string;
}

export interface GenerationParameters {
  prompt: string;
  duration: number;
  temperature: number;
  cfgCoef: number;
  topK: number;
  topP: number;
  useSampling: boolean;
}

export interface PostProcessingParameters {
  reverb: number;
  bassBoost: number;
  treble: number;
  speed: number;
}