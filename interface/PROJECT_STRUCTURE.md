# Project Structure Analysis

## Directory Layout

```
interface/
├── public/
│   └── vite.svg                    # Vite logo (unused)
├── src/
│   ├── assets/
│   │   └── react.svg               # React logo (unused)
│   ├── components/
│   │   ├── MusicGenerator/
│   │   │   ├── AudioPlayer.tsx     # Audio playback component
│   │   │   ├── GenerationForm.tsx  # Music generation form
│   │   │   ├── HistorySidebar.tsx  # History management sidebar
│   │   │   ├── MusicGeneratorUI.tsx # Main container component (432 lines)
│   │   │   ├── PostProcessingSidebar.tsx # Post-processing controls
│   │   │   └── types.ts            # TypeScript type definitions
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── slider.tsx
│   │       └── switch.tsx
│   ├── lib/
│   │   └── utils.ts                # Utility functions (cn helper)
│   ├── App.tsx                     # Root app component (simple wrapper)
│   ├── App.css                     # Unused CSS (template leftovers)
│   ├── index.css                   # Tailwind CSS configuration
│   └── main.tsx                    # Application entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config (base)
├── tsconfig.app.json               # TypeScript config (app)
├── tsconfig.node.json              # TypeScript config (node)
├── vite.config.ts                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── components.json                 # shadcn/ui configuration
└── README.md                        # Template README (needs update)
```

## Component Hierarchy

```
App
└── MusicGeneratorUI (Main Container)
    ├── HistorySidebar (Conditional)
    ├── GenerationForm
    ├── AudioPlayer (Conditional)
    └── PostProcessingSidebar (Conditional)
```

## Data Flow

```
User Input → GenerationForm
    ↓
MusicGeneratorUI (State Management)
    ↓
API Call → Music Generation API
    ↓
Response (Blob) → Audio URL Creation
    ↓
History Storage (localStorage)
    ↓
AudioPlayer (Playback)
```

## State Management

**Current Approach:** React useState hooks

**State Variables:**
- `generationParams` - Generation parameters
- `postProcessingParams` - Post-processing parameters
- `isLoading` - Loading state
- `audioUrl` - Current audio URL
- `currentAudio` - HTMLAudioElement instance
- `isPlaying` - Playback state
- `showHistory` - History sidebar visibility
- `showPostProcessing` - Post-processing sidebar visibility
- `selectedMusic` - Currently selected track
- `musicHistory` - Array of generated tracks

## Dependencies

### Core
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7

### UI Libraries
- Tailwind CSS 4.1.16
- Radix UI (Label, Slider, Switch, Slot)
- Lucide React (Icons)
- shadcn/ui components

### Utilities
- clsx (class name utility)
- tailwind-merge (Tailwind class merging)
- class-variance-authority (component variants)

## API Integration

**Endpoint:** `https://8000-01k3nz9wgydsgcb03rkyh82qdx.cloudspaces.litng.ai/predict`

**Method:** POST

**Request Body:**
```typescript
{
  prompt: string;
  duration: number;
  advanced_params: {
    temperature: number;
    cfg_coef: number;
    top_k: number;
    top_p: number;
    use_sampling: boolean;
    reverb: number;
    bass_boost: number;
    treble: number;
    speed: number;
  }
}
```

**Response:** Audio blob (WAV format)

## Storage

**localStorage Key:** `musicGenerationHistory`

**Stored Data:**
- Track metadata (id, prompt, duration, date)
- Base64-encoded audio data
- Excludes transient `audioUrl` (recreated on load)

## Key Features

1. ✅ Music generation from text prompts
2. ✅ Adjustable duration (5-60 seconds)
3. ✅ Post-processing effects (reverb, bass boost, treble, speed)
4. ✅ Advanced generation parameters (temperature, CFG, top-k, top-p)
5. ✅ Generation history with localStorage persistence
6. ✅ Audio playback controls
7. ✅ Download functionality
8. ✅ Refinement/regeneration with new parameters

## Missing Features

1. ❌ Error handling UI
2. ❌ Input validation
3. ❌ Loading states per operation
4. ❌ Success/error notifications
5. ❌ Audio visualization
6. ❌ Progress indicators
7. ❌ Keyboard shortcuts
8. ❌ Responsive design testing
9. ❌ Accessibility features
10. ❌ Unit tests

