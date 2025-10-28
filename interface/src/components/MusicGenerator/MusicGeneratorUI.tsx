// components/MusicGenerator/MusicGeneratorUI.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Loader2, Music, History, Sparkles } from "lucide-react";

// Components
import { HistorySidebar } from './HistorySidebar';
import { PostProcessingSidebar } from './PostProcessingSidebar';
import { AudioPlayer } from './AudioPlayer';
import { GenerationForm } from './GenerationForm';

// Types
import type { MusicTrack, GenerationParameters, PostProcessingParameters } from '../MusicGenerator/types';

// Mock data
const initialMusicHistory: MusicTrack[] = [
  { id: 1, prompt: "lofi chill beats with piano", duration: 20, date: "2024-01-15", audioUrl: "/api/placeholder/audio/1" },
  { id: 2, prompt: "epic orchestral soundtrack", duration: 30, date: "2024-01-14", audioUrl: "/api/placeholder/audio/2" },
  { id: 3, prompt: "jazz fusion with saxophone", duration: 25, date: "2024-01-13", audioUrl: "/api/placeholder/audio/3" },
];

const initialGenerationParams: GenerationParameters = {
  prompt: "",
  duration: 20,
  temperature: 1.0,
  cfgCoef: 3.0,
  topK: 250,
  topP: 0.0,
  useSampling: true,
};

const initialPostProcessingParams: PostProcessingParameters = {
  reverb: 0,
  bassBoost: 0,
  treble: 0,
  speed: 1.0,
};

export default function MusicGeneratorUI() {
  // State
  const [generationParams, setGenerationParams] = useState<GenerationParameters>(initialGenerationParams);
  const [postProcessingParams, setPostProcessingParams] = useState<PostProcessingParameters>(initialPostProcessingParams);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPostProcessing, setShowPostProcessing] = useState(false);
  const [musicHistory, setMusicHistory] = useState<MusicTrack[]>(initialMusicHistory);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);

  // Effects
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  // Event Handlers
  const generateMusic = async () => {
    if (!generationParams.prompt) return;
    
    setIsLoading(true);
    setAudioUrl(null);
    setShowPostProcessing(false);

    // Stop currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }

    try {
      const response = await fetch("https://8000-01k3nz9wgydsgcb03rkyh82qdx.cloudspaces.litng.ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generationParams.prompt,
          duration: generationParams.duration,
          temperature: generationParams.temperature,
          cfg_coef: generationParams.cfgCoef,
          top_k: generationParams.topK,
          top_p: generationParams.topP,
          use_sampling: generationParams.useSampling,
        }),
      });

      if (!response.ok) throw new Error("API call failed");

      const result = await response.json();
      const newAudioUrl = result.audio_url || "/api/placeholder/audio/new";
      setAudioUrl(newAudioUrl);
      
      // Add to history
      const newMusic: MusicTrack = {
        id: Date.now(),
        prompt: generationParams.prompt,
        duration: generationParams.duration,
        date: new Date().toISOString().split('T')[0],
        audioUrl: newAudioUrl
      };
      setMusicHistory(prev => [newMusic, ...prev]);
      setSelectedMusic(newMusic);
      
      // Show post-processing sidebar
      setTimeout(() => setShowPostProcessing(true), 500);
      
    } catch (err) {
      console.error("Error generating music:", err);
      alert("Something went wrong while generating music.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (!currentAudio) {
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } else {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `generated-music-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyPostProcessing = async () => {
    if (!audioUrl) return;
    
    setIsLoading(true);
    try {
      // Simulate post-processing API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Post-processing applied successfully!");
    } catch (err) {
      console.error("Error in post-processing:", err);
      alert("Failed to apply post-processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectMusicFromHistory = (music: MusicTrack) => {
    setSelectedMusic(music);
    setAudioUrl(music.audioUrl);
    setShowHistory(false);
    
    // Stop current audio
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const deleteFromHistory = (id: number) => {
    setMusicHistory(prev => prev.filter(music => music.id !== id));
    if (selectedMusic?.id === id) {
      setSelectedMusic(null);
      setAudioUrl(null);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white">
      {/* History Sidebar */}
      <HistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        musicHistory={musicHistory}
        selectedMusic={selectedMusic}
        onSelectMusic={selectMusicFromHistory}
        onDeleteMusic={deleteFromHistory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-zinc-800/70 backdrop-blur-md border-zinc-700 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Music className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        AI Music Generator
                      </h1>
                      <p className="text-sm text-zinc-400">
                        Transform your ideas into unique music compositions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowHistory(!showHistory)}
                    className="border-zinc-600 hover:bg-zinc-700"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <GenerationForm
                  parameters={generationParams}
                  onParametersChange={setGenerationParams}
                  isLoading={isLoading}
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button
                  disabled={isLoading || !generationParams.prompt}
                  onClick={generateMusic}
                  className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      Generating Music...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Music
                    </>
                  )}
                </Button>

                <AudioPlayer
                  audioUrl={audioUrl}
                  currentTrack={selectedMusic}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onDownload={handleDownload}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Post-processing Sidebar */}
      <PostProcessingSidebar
        isOpen={showPostProcessing}
        onClose={() => setShowPostProcessing(false)}
        parameters={postProcessingParams}
        onParametersChange={setPostProcessingParams}
        onApply={applyPostProcessing}
        isLoading={isLoading}
      />
    </div>
  );
}