import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { GeneratePage } from "./components/GeneratePage";
import { HistoryPage } from "./components/HistoryPage";
import { GenerationModal } from "./components/MusicGenerator/GenerationModal";
import { cn } from "./lib/utils";
import type { MusicTrack, GenerationParameters, PostProcessingParameters } from "./components/MusicGenerator/types";

const HISTORY_STORAGE_KEY = "musicGenerationHistory";

// Base64 Audio Helpers
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to read blob as string."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Initial Parameters
const initialGenerationParams: GenerationParameters = {
  prompt: "",
  duration: 10,
};

const initialPostProcessingParams: PostProcessingParameters = {
  reverb: 0,
  bassBoost: 0,
  treble: 0,
  speed: 1.0,
  // Advanced defaults for the Edit / Post-processing section
  temperature: 1.0,
  cfgCoef: 8.0,
  topK: 250,
  topP: 0.7,
  useSampling: true,
};

function App() {
  const [currentPage, setCurrentPage] = useState<"generate" | "history">("generate");
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [generationParams, setGenerationParams] = useState<GenerationParameters>(initialGenerationParams);
  const [postProcessingParams, setPostProcessingParams] = useState<PostProcessingParameters>(initialPostProcessingParams);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<MusicTrack | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [musicHistory, setMusicHistory] = useState<MusicTrack[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedHistoryJson = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!storedHistoryJson) return [];
      const storedHistory: MusicTrack[] = JSON.parse(storedHistoryJson);
      return storedHistory.map((track) => {
        if (!track.base64Audio) {
          return { ...track, audioUrl: null };
        }
        try {
          const audioBlob = base64ToBlob(track.base64Audio, "audio/wav");
          track.audioUrl = URL.createObjectURL(audioBlob);
        } catch (e) {
          console.error(`Failed to restore audio for track ${track.id}:`, e);
          track.audioUrl = null;
        }
        return track;
      });
    } catch (error) {
      console.error("Could not load history from Local Storage.", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      }
      return [];
    }
  });

  // Helper function to clean up old history entries when storage is full
  const cleanupOldHistory = (history: MusicTrack[], maxItems: number = 50): MusicTrack[] => {
    if (history.length <= maxItems) return history;
    // Keep the most recent items
    return history.slice(0, maxItems);
  };

  // Save history to localStorage with quota management
  useEffect(() => {
    if (typeof window !== "undefined" && musicHistory.length > 0) {
      try {
        const historyForStorage = musicHistory.map((track) => {
          const { audioUrl, ...trackToStore } = track;
          return trackToStore;
        });
        
        // Try to save, if quota exceeded, clean up old entries
        try {
          const jsonString = JSON.stringify(historyForStorage);
          localStorage.setItem(HISTORY_STORAGE_KEY, jsonString);
        } catch (error: any) {
          if (error.name === 'QuotaExceededError' || error.code === 22) {
            // Clean up old entries (keep last 20 items to be safe)
            let cleanedHistory = cleanupOldHistory(historyForStorage, 20);
            try {
              const cleanedJson = JSON.stringify(cleanedHistory);
              localStorage.setItem(HISTORY_STORAGE_KEY, cleanedJson);
            } catch (retryError) {
              // If still failing, try with even fewer items
              cleanedHistory = cleanupOldHistory(cleanedHistory, 10);
              try {
                const minimalJson = JSON.stringify(cleanedHistory);
                localStorage.setItem(HISTORY_STORAGE_KEY, minimalJson);
              } catch (finalError) {
                // Last resort: clear and save only the most recent 5 items
                const emergencyHistory = cleanupOldHistory(cleanedHistory, 5);
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(emergencyHistory));
              }
            }
            // Only update state if we actually removed items to prevent loops
            if (cleanedHistory.length < historyForStorage.length) {
              const restoredHistory = cleanedHistory.map((track) => {
                if (!track.base64Audio) {
                  return { ...track, audioUrl: null };
                }
                try {
                  const audioBlob = base64ToBlob(track.base64Audio, "audio/wav");
                  return { ...track, audioUrl: URL.createObjectURL(audioBlob) };
                } catch (e) {
                  return { ...track, audioUrl: null };
                }
              });
              // Use requestAnimationFrame to break the update cycle
              requestAnimationFrame(() => {
                setMusicHistory(restoredHistory);
              });
            }
          }
        }
      } catch (error) {
        // Silently handle errors to avoid console spam
      }
    }
  }, [musicHistory]);

  const generateMusic = async () => {
    if (!generationParams.prompt.trim()) return;

    // Show modal immediately
    setShowGenerationModal(true);
    setGenerationProgress(0);
    setIsLoading(true);

    // Smooth linear progress simulation - gradually increase to 90%
    const startTime = Date.now();
    const estimatedDuration = 30000; // 30 seconds estimated
    const targetProgress = 90; // Stop at 90% until API completes
    let lastSetProgress = 0;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Linear progression: progress increases smoothly over time
      const calculatedProgress = Math.min((elapsed / estimatedDuration) * targetProgress, targetProgress);
      
      // Only update if progress has meaningfully changed (avoid micro-updates)
      if (Math.abs(calculatedProgress - lastSetProgress) >= 0.5 || calculatedProgress >= targetProgress) {
        const newProgress = Math.min(calculatedProgress, targetProgress);
        lastSetProgress = newProgress;
        setGenerationProgress(newProgress);
        
        if (newProgress >= targetProgress) {
          clearInterval(progressInterval);
        }
      }
    }, 200); // Update every 200ms - less frequent but still smooth

    try {
      const apiUrl = "https://8001-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai/generate";
      const requestBody = {
        prompt: generationParams.prompt,
        duration: generationParams.duration,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("API call failed with status: " + response.status);

      // Complete progress to 100%
      clearInterval(progressInterval);
      setGenerationProgress(100);

      const audioBlob = await response.blob();
      const base64Audio = await blobToBase64(audioBlob);
      const newAudioUrl = URL.createObjectURL(audioBlob);

      const newMusic: MusicTrack = {
        id: Date.now(),
        prompt: generationParams.prompt,
        duration: `${generationParams.duration}s`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        audioUrl: newAudioUrl,
        base64Audio: base64Audio,
      };

      setCurrentMusic(newMusic);
      setMusicHistory((prev) => [newMusic, ...prev]);
      setShowEditPanel(false); // Hide settings when new music is generated

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
      alert("Failed to generate music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectMusicFromHistory = (music: MusicTrack) => {
    let newAudioUrl = music.audioUrl;
    if (!newAudioUrl && music.base64Audio) {
      try {
        const audioBlob = base64ToBlob(music.base64Audio, "audio/wav");
        newAudioUrl = URL.createObjectURL(audioBlob);
        setMusicHistory((prev) =>
          prev.map((m) => (m.id === music.id ? { ...m, audioUrl: newAudioUrl } : m))
        );
      } catch (e) {
        console.error("Failed to restore audio from history:", e);
        newAudioUrl = null;
      }
    }
    setCurrentMusic({ ...music, audioUrl: newAudioUrl });
  };

  const handleEditMusic = async () => {
    if (!currentMusic) return;
    
    // Show modal for editing too
    setShowGenerationModal(true);
    setGenerationProgress(0);
    setIsLoading(true);

    // Smooth linear progress simulation for editing
    const startTime = Date.now();
    const estimatedDuration = 30000; // 30 seconds estimated
    const targetProgress = 90;
    let lastSetProgress = 0;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / estimatedDuration) * targetProgress, targetProgress);
      
      // Only update if progress has meaningfully changed
      if (Math.abs(calculatedProgress - lastSetProgress) >= 0.5 || calculatedProgress >= targetProgress) {
        const newProgress = Math.min(calculatedProgress, targetProgress);
        lastSetProgress = newProgress;
        setGenerationProgress(newProgress);
        
        if (newProgress >= targetProgress) {
          clearInterval(progressInterval);
        }
      }
    }, 200);

    try {
      // Use postprocess endpoint to refine the music with current settings
      const apiUrl = "https://8001-01k3t9ggdeegcaqcpmfwpc5a3k.cloudspaces.litng.ai/postprocess";
      const requestBody = {
        prompt: currentMusic.prompt,
        duration: parseInt(currentMusic.duration),
        advanced_params: {
          temperature: postProcessingParams.temperature,
          cfg_coef: postProcessingParams.cfgCoef,
          top_k: postProcessingParams.topK,
          top_p: postProcessingParams.topP,
          use_sampling: postProcessingParams.useSampling,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("API call failed with status: " + response.status);

      // Complete progress to 100%
      clearInterval(progressInterval);
      setGenerationProgress(100);

      const audioBlob = await response.blob();
      const base64Audio = await blobToBase64(audioBlob);
      const newAudioUrl = URL.createObjectURL(audioBlob);

      const updatedMusic: MusicTrack = {
        ...currentMusic,
        audioUrl: newAudioUrl,
        base64Audio: base64Audio,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setCurrentMusic(updatedMusic);
      setMusicHistory((prev) =>
        prev.map((m) => (m.id === currentMusic.id ? updatedMusic : m))
      );
      setShowEditPanel(false);

      // Close modal after a brief delay
      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
      }, 800);
    } catch (err) {
      console.error("Error editing music:", err);
      clearInterval(progressInterval);
      // Close modal on error
      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
      }, 500);
      alert("Failed to edit music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFromHistory = (id: number) => {
    setMusicHistory((prev) => prev.filter((music) => music.id !== id));
    if (currentMusic?.id === id) {
      setCurrentMusic(null);
    }
  };

  const handleLogoClick = () => {
    setCurrentPage("generate");
    setCurrentMusic(null);
    setShowEditPanel(false);
    setGenerationParams(initialGenerationParams);
  };

  const handleResetEffects = () => {
    setPostProcessingParams({
      ...postProcessingParams,
      reverb: 0,
      bassBoost: 0,
      treble: 0,
      speed: 1.0,
    });
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  return (
    <div className={cn("min-h-screen", isDark ? "dark" : "")}>
      <div className={cn(
        "min-h-screen relative overflow-hidden transition-colors duration-300",
        "bg-gradient-to-br from-black via-zinc-900 to-black",
        "dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-black",
        "bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200",
        "text-white dark:text-white text-gray-900"
      )}>
        {/* Background gradient overlay */}
        <div className={cn(
          "fixed inset-0 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20",
          "dark:bg-gradient-to-r dark:from-purple-900/20 dark:via-transparent dark:to-cyan-900/20",
          "bg-gradient-to-r from-purple-300/40 via-transparent to-cyan-300/40"
        )} />
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col h-screen overflow-hidden">
          <Navigation
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              if (page === "generate") {
                setShowEditPanel(false);
              }
            }}
            isDark={isDark}
            onThemeToggle={toggleTheme}
            onLogoClick={handleLogoClick}
          />

          {currentPage === "generate" && (
            <div className="flex-1 animate-in fade-in overflow-hidden min-h-0">
              <GeneratePage
              prompt={generationParams.prompt}
              onPromptChange={(value) => setGenerationParams({ ...generationParams, prompt: value })}
              duration={generationParams.duration}
              onDurationChange={(value) => setGenerationParams({ ...generationParams, duration: value })}
              onGenerate={generateMusic}
              isLoading={isLoading}
              currentMusic={currentMusic}
              onEditClick={() => setShowEditPanel(!showEditPanel)}
              showEditPanel={showEditPanel}
              temperature={postProcessingParams.temperature}
              onTemperatureChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, temperature: value })
              }
              cfgCoef={postProcessingParams.cfgCoef}
              onCfgCoefChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, cfgCoef: value })
              }
              topK={postProcessingParams.topK}
              onTopKChange={(value) => setPostProcessingParams({ ...postProcessingParams, topK: value })}
              topP={postProcessingParams.topP}
              onTopPChange={(value) => setPostProcessingParams({ ...postProcessingParams, topP: value })}
              useSampling={postProcessingParams.useSampling}
              onUseSamplingChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, useSampling: value })
              }
              reverb={postProcessingParams.reverb}
              onReverbChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, reverb: value })
              }
              bassBoost={postProcessingParams.bassBoost}
              onBassBoostChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, bassBoost: value })
              }
              treble={postProcessingParams.treble}
              onTrebleChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, treble: value })
              }
              speed={postProcessingParams.speed}
              onSpeedChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, speed: value })
              }
              onResetEffects={handleResetEffects}
              onApplyEdit={handleEditMusic}
              />
            </div>
          )}
          {currentPage === "history" && (
            <div className="flex-1 animate-in fade-in overflow-hidden min-h-0">
            <HistoryPage
              musicHistory={musicHistory}
              selectedMusic={currentMusic}
              onSelectMusic={selectMusicFromHistory}
              onDeleteMusic={deleteFromHistory}
              onEditClick={() => {}}
              temperature={postProcessingParams.temperature}
              onTemperatureChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, temperature: value })
              }
              cfgCoef={postProcessingParams.cfgCoef}
              onCfgCoefChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, cfgCoef: value })
              }
              topK={postProcessingParams.topK}
              onTopKChange={(value) => setPostProcessingParams({ ...postProcessingParams, topK: value })}
              topP={postProcessingParams.topP}
              onTopPChange={(value) => setPostProcessingParams({ ...postProcessingParams, topP: value })}
              useSampling={postProcessingParams.useSampling}
              onUseSamplingChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, useSampling: value })
              }
              reverb={postProcessingParams.reverb}
              onReverbChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, reverb: value })
              }
              bassBoost={postProcessingParams.bassBoost}
              onBassBoostChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, bassBoost: value })
              }
              treble={postProcessingParams.treble}
              onTrebleChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, treble: value })
              }
              speed={postProcessingParams.speed}
              onSpeedChange={(value) =>
                setPostProcessingParams({ ...postProcessingParams, speed: value })
              }
              onResetEffects={handleResetEffects}
              onApplyEdit={handleEditMusic}
              isLoading={isLoading}
            />
            </div>
          )}
        </div>
      </div>

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

export default App;
