# Quick Fixes - Priority Actions

## 🔴 Critical Issues (Fix Immediately)

### 1. Hardcoded API URL
**File:** `src/components/MusicGenerator/MusicGeneratorUI.tsx:18`
```typescript
// Current:
const MUSIC_GEN_API_URL = "https://8000-01k3nz9wgydsgcb03rkyh82qdx.cloudspaces.litng.ai/predict";

// Fix: Use environment variable
const MUSIC_GEN_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/predict";
```

**Action:** Create `.env.local`:
```
VITE_API_URL=https://8000-01k3nz9wgydsgcb03rkyh82qdx.cloudspaces.litng.ai/predict
```

### 2. Memory Leak - Object URLs Not Cleaned Up
**File:** `src/components/MusicGenerator/MusicGeneratorUI.tsx`

**Fix:** Add cleanup effect:
```typescript
useEffect(() => {
  return () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };
}, [audioUrl]);
```

### 3. Using `any` Type
**File:** `src/components/MusicGenerator/MusicGeneratorUI.tsx:169`
```typescript
// Current:
const requestBody: any = { ... };

// Fix: Define proper interface
interface MusicGenerationRequest {
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
  };
}
```

### 4. No Error Feedback to Users
**File:** `src/components/MusicGenerator/MusicGeneratorUI.tsx:231-235`

**Fix:** Add toast notifications:
```bash
npm install sonner
```

```typescript
import { toast } from 'sonner';

// In catch block:
catch (err) {
  console.error("Error generating music:", err);
  toast.error("Failed to generate music. Please try again.");
}
```

## 🟡 High Priority (Fix Soon)

### 5. Missing Input Validation
**File:** `src/components/MusicGenerator/GenerationForm.tsx`

**Fix:** Add validation:
```typescript
const handleSubmit = () => {
  if (!parameters.prompt.trim()) {
    toast.error("Please enter a prompt");
    return;
  }
  if (parameters.prompt.length < 3) {
    toast.error("Prompt must be at least 3 characters");
    return;
  }
  // ... proceed
};
```

### 6. Import Path Inconsistency
**Files:** Multiple components

**Current:** `'../MusicGenerator/types'`
**Should be:** `'./types'` (when importing from same directory)

### 7. Extract Constants
**File:** Create `src/constants/index.ts`

```typescript
export const STORAGE_KEYS = {
  MUSIC_HISTORY: 'musicGenerationHistory',
} as const;

export const TIMEOUTS = {
  POST_PROCESSING_DELAY: 500, // ms
} as const;

export const LIMITS = {
  PROMPT_MAX_LENGTH: 500,
  PROMPT_MIN_LENGTH: 3,
  FILENAME_MAX_LENGTH: 20,
  HISTORY_MAX_ITEMS: 50,
} as const;
```

### 8. Remove Unused CSS
**File:** `src/App.css`

**Action:** Delete or move to appropriate component if needed.

## 🟢 Medium Priority (Improve Code Quality)

### 9. Create API Service Layer
**File:** Create `src/services/musicApi.ts`

### 10. Add Custom Hooks
**Files:** Create hooks directory
- `src/hooks/useMusicHistory.ts`
- `src/hooks/useAudioPlayer.ts`
- `src/hooks/useLocalStorage.ts`

### 11. Split Large Component
**File:** `src/components/MusicGenerator/MusicGeneratorUI.tsx` (432 lines)

**Action:** Extract logic to custom hooks and smaller components.

### 12. Add Error Boundary
**File:** Create `src/components/ErrorBoundary.tsx`

### 13. Remove Unused Types
**File:** `src/components/MusicGenerator/types.ts`

**Action:** Remove `AdvancedGenerationParameters` and `AudioEffectsParameters` if not used.

## 📝 Code Quality Improvements

### 14. Add Prettier
```bash
npm install -D prettier eslint-config-prettier
```

### 15. Update README
Replace template README with project-specific documentation.

### 16. Add Type Checking Script
**File:** `package.json`
```json
"scripts": {
  "type-check": "tsc --noEmit"
}
```

## 🧪 Testing (Future)

### 17. Add Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 18. Write Unit Tests
- Test custom hooks
- Test API service
- Test utility functions

## 🎨 UX Improvements

### 19. Add Loading States
- Separate loading states for different operations
- Show progress indicators

### 20. Add Success Feedback
- Toast notifications for success
- Visual feedback on completion

### 21. Improve Audio Player
- Add progress bar
- Add time display
- Add volume control
- Add seek functionality

---

## Implementation Order

1. **Week 1:** Critical issues (1-4)
2. **Week 2:** High priority (5-8)
3. **Week 3:** Medium priority (9-13)
4. **Week 4:** Code quality (14-16)
5. **Ongoing:** Testing and UX improvements

---

## Estimated Impact

- **Critical fixes:** Prevent crashes, memory leaks, and security issues
- **High priority:** Better user experience and code maintainability
- **Medium priority:** Improved architecture and scalability
- **Code quality:** Better developer experience and fewer bugs

