import { useState, useEffect } from "react";
import { Button } from "../ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Loader2, Music, History, Sparkles, Settings } from "lucide-react"; // Settings added

// Components
import { HistorySidebar } from './HistorySidebar';
import { PostProcessingSidebar } from './PostProcessingSidebar';
import { AudioPlayer } from './AudioPlayer';
import { GenerationForm } from './GenerationForm';
import { GenerationModal } from './GenerationModal';

// Types (Assumes MusicTrack now has base64Audio?: string; field)
import type { MusicTrack, GenerationParameters, PostProcessingParameters } from '../MusicGenerator/types';

// --- Configuration ---
const HISTORY_STORAGE_KEY = 'musicGenerationHistory';
// Ensure this URL is correct and the server is running
// const MUSIC_GEN_API_URL = "https://8001-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai/predict"; 

// --- Base64 Audio Helpers ---

/** Converts Blob to Base64 string for localStorage persistence. */
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URI prefix (e.g., "data:audio/wav;base64,")
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error("Failed to read blob as string."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/** Converts Base64 string back to Blob for recreating the Object URL. */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
    // Note: atob can fail if the string is not valid Base64
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};

// --- Initial Parameters ---
const initialGenerationParams: GenerationParameters = {
  prompt: "",
  duration: 20,
};

const initialPostProcessingParams: PostProcessingParameters = {
  reverb: 0,
  bassBoost: 0,
  treble: 0,
  speed: 1.0,
  temperature: 1.0, 
  cfgCoef: 8.0,     
  topK: 250,        
  topP: 0.0,
  useSampling: true,
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
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);

  // 1. Initialize musicHistory from Local Storage
  const [musicHistory, setMusicHistory] = useState<MusicTrack[]>(() => {
    if (typeof window === 'undefined') {
      return []; 
    }
    try {
      const storedHistoryJson = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!storedHistoryJson) return [];
      
      const storedHistory: MusicTrack[] = JSON.parse(storedHistoryJson);
      
      // 💡 Defensive Loading: Recreate Object URLs and handle potential Base64 errors
      return storedHistory.map(track => {
        if (!track.base64Audio) {
            // If data is old or corrupted, ensure audioUrl is null to prevent crashes
            return { ...track, audioUrl: null }; 
        }
        
        try {
            const audioBlob = base64ToBlob(track.base64Audio, 'audio/wav');
            // Recreate temporary URL for this session
            track.audioUrl = URL.createObjectURL(audioBlob); 
        } catch (e) {
            console.error(`Failed to restore audio for track ${track.id}:`, e);
            // On failure, nullify the audioUrl
            track.audioUrl = null; 
        }
        return track;
      });
    } catch (error) {
      console.error("Could not load history from Local Storage. Clearing history.", error);
      // If JSON parsing fails entirely, clear local storage to prevent future crashes
      if (typeof window !== 'undefined') {
          localStorage.removeItem(HISTORY_STORAGE_KEY);
      }
      return []; 
    }
  });


  // Effects
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);
  
  // 2. Effect to save musicHistory to Local Storage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Prepare data for storage by EXCLUDING the transient audioUrl
        const historyForStorage = musicHistory.map(track => {
            // Destructure audioUrl but keep base64Audio
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { audioUrl, ...trackToStore } = track; 
            return trackToStore;
        });
        
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyForStorage));
      } catch (error) {
        console.error("Could not save history to Local Storage", error);
      }
    }
  }, [musicHistory]); 

  // Event Handlers
  const generateMusic = async (isRefining: boolean = false) => {
    if (!generationParams.prompt) return;
  
    // Show modal immediately - before any async operations
    console.log('Opening generation modal...');
    setShowGenerationModal(true);
    setGenerationProgress(0);
    setIsLoading(true);
    
    if (!isRefining) {
        setAudioUrl(null);
        setShowPostProcessing(false);
    }
    
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
    }

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Don't go to 100% until API call completes
        }
        return prev + Math.random() * 15; // Increment by 0-15%
      });
    }, 500);

    try {
      // Choose the right endpoint
      const apiUrl = isRefining 
        ? "https://8001-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai/postprocess"
        : "https://8001-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai/generate";

      const requestBody: any = {
        prompt: generationParams.prompt,
        duration: generationParams.duration,
      };

      // Only include advanced params for postprocess endpoint
      if (isRefining) {
        requestBody.advanced_params = {
            temperature: postProcessingParams.temperature,
            cfg_coef: postProcessingParams.cfgCoef,
            top_k: postProcessingParams.topK,
            top_p: postProcessingParams.topP,
            use_sampling: postProcessingParams.useSampling,
            // Remove these as they're not supported by MusicGen backend:
            // reverb: postProcessingParams.reverb,
            // bass_boost: postProcessingParams.bassBoost, 
            // treble: postProcessingParams.treble,
            // speed: postProcessingParams.speed,
        };
      }
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("API call failed with status: " + response.status);

      // Complete progress to 100%
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Rest of your code remains the same...
      const audioBlob = await response.blob();
      const base64Audio = await blobToBase64(audioBlob);
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);

      const newMusic: MusicTrack = {
        id: Date.now(),
        prompt: generationParams.prompt,
        duration: `${generationParams.duration}s`, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        audioUrl: newAudioUrl,
        base64Audio: base64Audio
      };
      
      if (isRefining && selectedMusic) {
          setMusicHistory(prev => prev.map(m => m.id === selectedMusic.id ? newMusic : m));
      } else {
          setMusicHistory(prev => [newMusic, ...prev]);
      }
      
      setSelectedMusic(newMusic);

      if (!isRefining) {
        setTimeout(() => setShowPostProcessing(true), 500);
      }
      
      // Close modal after a brief delay to show 100% completion
      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
      }, 800);
      
    } catch (err) {
      console.error("Error generating music:", err);
      clearInterval(progressInterval);
      // Close modal on error
      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  }

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
    const fileName = selectedMusic?.prompt.replace(/\s/g, '_').substring(0, 20) || 'generated-music';
    link.download = `${fileName}-${Date.now()}.wav`; // Assuming WAV based on API
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyPostProcessing = async () => {
    if (!generationParams.prompt) {
      console.error("Please generate music first before applying post-processing.");
      return;
    }

    setIsLoading(true);
    try {
      // Regenerate/Refine music with post-processing parameters
      await generateMusic(true);
    } catch (err) {
      console.error("Error in post-processing:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectMusicFromHistory = (music: MusicTrack) => {
    // 💡 Defensive Selection: Recreate the object URL if not present (after a reload)
    let newAudioUrl = music.audioUrl;

    if (!newAudioUrl && music.base64Audio) {
        try {
            const audioBlob = base64ToBlob(music.base64Audio, 'audio/wav');
            newAudioUrl = URL.createObjectURL(audioBlob);
            
            // Update the music object in state with the new transient URL for future selections
            setMusicHistory(prev => prev.map(m => m.id === music.id ? { ...m, audioUrl: newAudioUrl } : m));
        } catch (e) {
            console.error("Failed to restore audio from history on selection:", e);
            newAudioUrl = null;
        }
    }
    
    // Set the new URL for immediate playback
    setSelectedMusic({ ...music, audioUrl: newAudioUrl });
    setAudioUrl(newAudioUrl);
    
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
                  onClick={() => generateMusic()}
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

                {audioUrl && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPostProcessing(true)}
                    className="w-full text-md py-4 border-purple-500 text-purple-400 hover:bg-purple-900/50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Refine Music & Advanced Settings
                  </Button>
                )}

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

      {/* Generation Modal */}
      <GenerationModal
        isOpen={showGenerationModal}
        progress={generationProgress}
        onClose={() => {
          // Only allow manual close if not actively loading
          if (!isLoading) {
            setShowGenerationModal(false);
            setGenerationProgress(0);
          }
        }}
      />
    </div>
  );
}
