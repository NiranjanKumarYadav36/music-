# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** LiquidGlassAIStudio
**Generated:** 2026-03-01 23:52:01
**Category:** Music Streaming

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| Secondary | `#27272A` | `--color-secondary` |
| CTA/Accent | `#F8FAFC` | `--color-cta` |
| Background | `#FAFAFA` | `--color-background` |
| Text | `#09090B` | `--color-text` |

**Color Notes:** Gallery black + white space

TYPOGRAPHY:

Primary: Inter
Display Accent: Satoshi or SF Pro-like system font
Backup: Poppins (light weights only)

Mood:
Clean, modern, technical, creative, refined.

Avoid:
Overly decorative display fonts.
Festival-style typography.

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Righteous&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F8FAFC;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #18181B;
  border: 2px solid #18181B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAFAFA;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #18181B;
  outline: none;
  box-shadow: 0 0 0 3px #18181B20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

COLORS:

Dark Theme:
Primary:    #0B0F18 (Deep Indigo Black)
Accent:     #A855F7 (Electric Purple)
Secondary:  #22D3EE (Soft Cyan)
Background: #070A12
Text:       #F8FAFC

Light Theme:
Primary:    #F6F7FB
Accent:     #EC4899 (Soft Pink)
Secondary:  #6366F1 (Indigo)
Background: #FFFFFF
Text:       #1E293B

Notes:
No green CTA.
Accent must glow softly.
No harsh neon.


---



### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile


ANTI-PATTERNS (STRICT):
- SaaS dashboard grids
- Sidebar navigation
- KPI analytics panels
- Admin UI structure
- Card-heavy boxed stacking
- Business dashboard layout


PATTERN: Immersive Studio Experience

Conversion Strategy:
Emotion-driven creative immersion.
No onboarding tour.
Instant creative access.

Structure:
1. Liquid glass top navigation
2. Full-screen studio canvas
3. Parameter + Prompt composition zone
4. Generated melodies strip
5. Sticky dock-style media player

STYLE: Glassmorphism + AI-Native Minimal

Keywords:
Liquid glass, layered depth, soft blur, subtle glow,
controlled motion, premium, spatial UI, dock-style interface

Best For:
AI tools, music platforms, creative studios, immersive applications

Performance:
Excellent if blur optimized

Accessibility:
WCAG AA required
prefers-reduced-motion respected

KEY EFFECTS:

- Glass surfaces (backdrop-blur)
- Gradient border glow
- Subtle hover scale (1.02)
- Dock slide-in animation (250ms)
- Tab sliding with spring motion
- Waveform glow animation (soft pulse)

Avoid:
Heavy parallax
Long scroll reveals
Flashy entrance animations