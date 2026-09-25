# AI Decision & Engineering Log - Fateful Moment

## Overview
This log documents the iterative engineering decisions, design-fidelity corrections, and architectural upgrades made during the refinement of the **Fateful Moment** React Native application.

---

### Phase 0: Audit & Baseline Analysis
* **User Request:** Initial review of project against Figma exports, asking for senior-level polish and critique.
* **Findings:**
  - Token inconsistencies (e.g. `accent: #F82C38` vs Figma `#FB2C36`, `border: #10293D` vs Figma `#1D293D`).
  - Missing design components: Cyan→Red Timer Bar, Status Beacons (pulsing indicators), Scanline CRT overlay.
  - Direct import of static dummy arrays rather than asynchronous repository services.
  - Absence of a semantic, dual-theme architecture (Dark as primary/pixel-perfect, Light as derived AA-compliant).
* **Decisions:**
  - Strict adherence to conventional commits on `feat/design-polish`.
  - Maintain 100% Expo Go native compatibility by leveraging React Native's high-performance native-driven `Animated` API and `expo-linear-gradient`.

---

### Phase 1: Theming Foundation & Semantic Tokens
* **Objective:** Establish `ThemeContext`, dual semantic palettes (Dark & Light), and upgrade design tokens.
* **Dark Palette:** Grounded strictly in Style Guide tokens (`#00D3F3`, `#0F172A`, `#FB2C36`, `#020617`, `#1D293D`, `#F1F5F9`).
* **Light Palette:** Carefully derived with WCAG AA compliance (using dark cyan `#0891B2` for readable text/icons on light surfaces, `#F8FAFC` background, and clean slate borders). Cinematic hero cards retain tactical dark contrast.


---
### Phase 5: Figma Gap Audit & Fixes (Claude Code)
* **User Request:** Compare every component against the Figma exports (Buttons board, Scenario cards, Card, Nav Bar, Tabbar, Icons, Style Guide) and fix the gaps.
* **Findings:**
  - Figma's icon set is Lucide (`alarm-clock`, `dna`, `fingerprint`, `shield-alert`, `atom`, the brand squiggle); Feather couldn't render most of it.
  - Buttons were italic/uppercase and only had 4 variants; Figma uses non-italic bold labels, solid/outline/link appearances and a trailing arrow.
  - Scenario cards used solid CTAs and uppercase titles; Figma uses mono HUD headers, Title Case italic titles, translucent "glass" Start buttons and a frosted passive state.
  - Style-guide pieces drifted: filled cyan selection, thin borderless timer, real scanlines, missing "Standard Card Layout".
  - Bugs: fixed tab bar `height` dropped the bottom safe-area inset (icons under the iPhone home indicator); `userInterfaceStyle: "light"` pinned `useColorScheme()` so the System theme never went dark; 34 `react-hooks/refs` lint errors; non-square icon assets and an unused `@expo/vector-icons` failing `expo-doctor`.
* **Decisions:**
  - Added `lucide-react-native` + `react-native-svg` behind a typed `Icon` wrapper using per-icon deep imports (Metro does not tree-shake).
  - Rebuilt `Button` as variant × appearance × size; added `HudCard`; restyled `ScenarioCard`, `SquareCard`, `OptionCard`, `NavBar`, `InteractiveSelection`, `TimerBar`, `ScanlineOverlay`.
  - Added `MONO_FONT` and tighter display/heading tracking to tokens.
  - Replaced `useRef(new Animated.Value()).current` with React Native's `useAnimatedValue`.
  - Configured `expo-splash-screen` (dark background + app icon), cropped icons to 1024×1024, set adaptive icon background to `#020617`.
* **Verification:** `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` (21/21) and an Android `expo export` bundle all pass. Colours were matched from screenshots, not Figma inspect values.
