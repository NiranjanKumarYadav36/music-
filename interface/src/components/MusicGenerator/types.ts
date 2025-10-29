export interface MusicTrack {
  id: number;
  prompt: string;
  duration: string;
  date: string;
  audioUrl: string;
  base64Audio?: string;
}

export interface GenerationParameters {
  prompt: string;
  duration: number;
}

export interface PostProcessingParameters {
  reverb: number;
  bassBoost: number;
  treble: number;
  speed: number;
  // Advanced Generation Params (moved here for post-processing/refinement)
  temperature: number;
  cfgCoef: number;
  topK: number;
  topP: number;
  useSampling: boolean;
}

export interface AdvancedGenerationParameters {
  temperature: number;
  cfgCoef: number;
  topK: number;
  topP: number;
  useSampling: boolean;
}

export interface AudioEffectsParameters {
  reverb: number;
  bassBoost: number;
  treble: number;
  speed: number;
}
