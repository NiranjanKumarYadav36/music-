import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { GeneratePage } from "./components/GeneratePage";
import { HistoryPage } from "./components/HistoryPage";
import { GenerationModal } from "./components/MusicGenerator/GenerationModal";
import { cn } from "./lib/utils";
import type { MusicTrack, GenerationParameters, PostProcessingParameters } from "./components/MusicGenerator/types";
import { addTrack, getAllTracks, deleteTrack } from "./lib/db";
import { API_CONFIG } from "./config";

const HISTORY_STORAGE_KEY = "musicGenerationHistory";



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
  topP: 0.0,
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
  const [musicHistory, setMusicHistory] = useState<MusicTrack[]>([]);

  // Load History from IndexedDB (with migration support)
  useEffect(() => {
    const loadHistory = async () => {
      try {
        // 1. Check for legacy localStorage data to migrate
        const storedHistoryJson = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistoryJson) {
          console.log("Migrating legacy history to IndexedDB...");
          try {
            const legacyHistory: MusicTrack[] = JSON.parse(storedHistoryJson);
            for (const track of legacyHistory) {
              if (track.base64Audio) {
                const blob = base64ToBlob(track.base64Audio, "audio/wav");
                await addTrack({
                  id: track.id,
                  prompt: track.prompt,
                  duration: track.duration,
                  date: track.date,
                  audioBlob: blob,
                  advancedSettings: track.advancedSettings
                });
              }
            }
            // Clear legacy storage after successful migration
            localStorage.removeItem(HISTORY_STORAGE_KEY);
            console.log("Migration complete.");
          } catch (e) {
            console.error("Migration failed:", e);
          }
        }

        // 2. Load from IndexedDB
        const dbTracks = await getAllTracks();

        // Convert DB tracks to App tracks (create Object URLs)
        const appTracks: MusicTrack[] = dbTracks.map(t => ({
          id: t.id,
          prompt: t.prompt,
          duration: t.duration,
          date: t.date,
          audioUrl: URL.createObjectURL(t.audioBlob),
          advancedSettings: t.advancedSettings,
          isEdited: t.isEdited,
        }));

        setMusicHistory(appTracks);

      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    loadHistory();
  }, []);

  const [generationStatus, setGenerationStatus] = useState("Preparing engine...");

  const generateMusic = async () => {
    if (!generationParams.prompt.trim()) return;

    setShowGenerationModal(true);
    setGenerationProgress(0);
    setGenerationStatus("Initializing generator...");
    setIsLoading(true);

    const startTime = Date.now();
    const requestedDuration = generationParams.duration;
    // Estimated generation time: ~1.2s per output second + 10s overhead
    const estimatedGenTime = (requestedDuration * 1200) + 10000;
    let lastSetProgress = 0;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let calculatedProgress = 0;

      if (elapsed < 2000) {
        // Phase 1: Rapid initialization (0-15%)
        calculatedProgress = (elapsed / 2000) * 15;
        setGenerationStatus("Setting up environment...");
      } else if (elapsed < estimatedGenTime) {
        // Phase 2: Generation (15-75%)
        const genElapsed = elapsed - 2000;
        const genTotal = estimatedGenTime - 2000;
        calculatedProgress = 15 + (genElapsed / genTotal) * 60;
        setGenerationStatus(`Composing your track (${Math.floor(calculatedProgress)}%)...`);
      } else {
        // Phase 3: Processing Crawl (75-98%)
        const processElapsed = elapsed - estimatedGenTime;
        // Asymptotic crawl towards 98%
        calculatedProgress = 75 + (23 * (1 - Math.exp(-processElapsed / 15000)));
        setGenerationStatus("Refining audio results...");
      }

      if (Math.abs(calculatedProgress - lastSetProgress) >= 0.1) {
        lastSetProgress = calculatedProgress;
        setGenerationProgress(calculatedProgress);
      }
    }, 100);

    try {
      const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`;
      const requestBody = {
        prompt: generationParams.prompt,
        duration: generationParams.duration,
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

      setGenerationStatus("Finalizing playback...");
      clearInterval(progressInterval);
      setGenerationProgress(100);

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      const newId = Date.now();

      await addTrack({
        id: newId,
        prompt: generationParams.prompt,
        duration: `${generationParams.duration}s`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        audioBlob: audioBlob,
        advancedSettings: { ...postProcessingParams },
      });

      const newMusic: MusicTrack = {
        id: newId,
        prompt: generationParams.prompt,
        duration: `${generationParams.duration}s`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        audioUrl: newAudioUrl,
        advancedSettings: { ...postProcessingParams },
      };

      setCurrentMusic(newMusic);
      setMusicHistory((prev) => [newMusic, ...prev]);
      setShowEditPanel(false);

      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
        setGenerationStatus("Preparing engine...");
      }, 800);
    } catch (err) {
      console.error("Error generating music:", err);
      clearInterval(progressInterval);
      setGenerationStatus("Generation failed");
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
    // Audio URL is already managed by the DB loader
    setCurrentMusic(music);

    // Restore generation parameters if available, otherwise reset to defaults
    if (music.advancedSettings) {
      setPostProcessingParams(music.advancedSettings);
    } else {
      setPostProcessingParams(initialPostProcessingParams);
    }
  };

  const handleEditMusic = async () => {
    if (!currentMusic) return;

    setShowGenerationModal(true);
    setGenerationProgress(0);
    setGenerationStatus("Preparing refinement...");
    setIsLoading(true);

    const startTime = Date.now();
    const currentDuration = parseInt(currentMusic.duration) || 60;
    const estimatedGenTime = (currentDuration * 1200) + 10000;
    let lastSetProgress = 0;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let calculatedProgress = 0;

      if (elapsed < 2000) {
        calculatedProgress = (elapsed / 2000) * 15;
        setGenerationStatus("Analyzing current track...");
      } else if (elapsed < estimatedGenTime) {
        const genElapsed = elapsed - 2000;
        const genTotal = estimatedGenTime - 2000;
        calculatedProgress = 15 + (genElapsed / genTotal) * 60;
        setGenerationStatus(`Refining audio (${Math.floor(calculatedProgress)}%)...`);
      } else {
        const processElapsed = elapsed - estimatedGenTime;
        calculatedProgress = 75 + (23 * (1 - Math.exp(-processElapsed / 15000)));
        setGenerationStatus("Finalizing effects...");
      }

      if (Math.abs(calculatedProgress - lastSetProgress) >= 0.1) {
        lastSetProgress = calculatedProgress;
        setGenerationProgress(calculatedProgress);
      }
    }, 100);

    try {
      const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST_PROCESS}`;
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

      setGenerationStatus("Applying final touch...");
      clearInterval(progressInterval);
      setGenerationProgress(100);

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);

      await addTrack({
        id: currentMusic.id,
        prompt: currentMusic.prompt,
        duration: currentMusic.duration,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        audioBlob: audioBlob,
        advancedSettings: { ...postProcessingParams },
        isEdited: true,
      });

      const updatedMusic: MusicTrack = {
        ...currentMusic,
        audioUrl: newAudioUrl,
        advancedSettings: { ...postProcessingParams },
        isEdited: true,
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

      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
        setGenerationStatus("Preparing engine...");
      }, 800);
    } catch (err) {
      console.error("Error editing music:", err);
      clearInterval(progressInterval);
      setGenerationStatus("Refinement failed");
      setTimeout(() => {
        setShowGenerationModal(false);
        setGenerationProgress(0);
      }, 500);
      alert("Failed to edit music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFromHistory = async (id: number) => {
    try {
      await deleteTrack(id);
      setMusicHistory((prev) => prev.filter((music) => music.id !== id));
      if (currentMusic?.id === id) {
        setCurrentMusic(null);
      }
    } catch (error) {
      console.error("Failed to delete track:", error);
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
                onEditClick={() => { }}
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
        status={generationStatus}
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
