import LibraryLayout from "@/components/library/LibraryLayout";
import type { MusicTrack } from "./MusicGenerator/types";

interface HistoryPageProps {
  musicHistory: MusicTrack[];
  selectedMusic: MusicTrack | null;
  onSelectMusic: (music: MusicTrack) => void;
  onDeleteMusic: (id: number) => void;
  onEditClick: () => void;
  // Settings props
  temperature: number;
  onTemperatureChange: (value: number) => void;
  cfgCoef: number;
  onCfgCoefChange: (value: number) => void;
  topK: number;
  onTopKChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
  useSampling: boolean;
  onUseSamplingChange: (value: boolean) => void;
  reverb: number;
  onReverbChange: (value: number) => void;
  bassBoost: number;
  onBassBoostChange: (value: number) => void;
  treble: number;
  onTrebleChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  onResetEffects: () => void;
  onApplyEdit: () => void;
  isLoading: boolean;
}

export function HistoryPage({
  musicHistory,
  selectedMusic,
  onSelectMusic,
  onDeleteMusic,
}: HistoryPageProps) {
  return (
    <div className="flex-1 overflow-y-auto h-full custom-scrollbar">
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <LibraryLayout
          tracks={musicHistory.map(track => ({ ...track, id: track.id.toString() }))}
          onPlay={(id) => {
            const track = musicHistory.find(t => t.id.toString() === id);
            if (track) onSelectMusic(track);
          }}
          onDelete={(id) => onDeleteMusic(Number(id))}
          activeTrackId={selectedMusic?.id.toString()}
        />
      </div>
    </div>
  );
}
