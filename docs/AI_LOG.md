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

---

### Phase 6: Senior-Level Completion (Claude Code)
* **User Request:** Take the project to a finished, senior-quality state.
* **Gaps found:** "Start" only opened an `Alert` (no actual simulation), theme preference was not persisted, imagery depended on remote Unsplash URLs, components still contained hard-coded `isDark ? '#…' : '#…'` colours, a duplicate `src/constants/` layer, no tests, a fresh `npm install` / EAS build would fail on a peer-dependency conflict, and the README over-claimed ("pixel-perfect").
* **Decisions:**
  - **Simulation flow** (`scenario/[id]` → `play` → `outcome`): a pure engine (`evaluateRun`, `ratingFor`, clamped metrics, timeout penalty) plus a phase reducer; the outcome screen recomputes from URL params so results are reproducible. Runs are recorded once via a stable `runId`.
  - **Timer:** wall-clock `useCountdown` that pauses on review and when the app is backgrounded; a highlighted option is committed on timeout.
  - **State:** `AppStoreProvider` persisting preferences + mission history to AsyncStorage with field-level sanitising; splash screen held until hydrated.
  - **Tokens:** semantic palette (`primaryTint`, `surfaceHud`, `inverseSurface`, `MEDIA_COLORS`, `OPTION_GRADIENTS`, …); removed all hex literals from components and deleted `src/constants/`.
  - **Assets:** bundled local images rendered with `expo-image` (offline, cached, fade-in); dropped a candidate photo of a real public figure.
  - **Shared UI:** `ScreenContainer` (loading / error / retry), `SectionHeader`, `MetricBar`, `useAsyncData`, `useHaptics`, `useAppActive`.
  - **Tooling:** `.npmrc` with `legacy-peer-deps`, Jest (`jest-expo`) with a CJS mapping for Lucide, `"types": ["jest"]` for TypeScript 6.
* **Tests:** 41 tests — engine, reducer, countdown (fake timers), storage sanitising/round-trip, `Button`, `ScenarioCard`, and an Expo Router integration test that plays Operation Midnight end-to-end and asserts the persisted history.
* **Device verification:** Ran the app on an Android 14 emulator via Expo Go and inspected screenshots. Bugs found only this way and fixed: missing deep-link `scheme` warning, white window strip under the tab bar (`expo-system-ui`), unreadable status bar icons in light mode, briefing hero not full width, NavBar title offset when no icons, low-contrast map label.
* **Verification:** `tsc --noEmit`, `expo lint`, `jest` (41/41), `expo-doctor` (21/21), iOS + Android `expo export`.

---

### Phase 7: UI/UX Polish within the Figma Spec (Claude Code)
* **User Request:** Keep to Figma, apply only the proposed UX improvements.
* **Changes:**
  - **Inter** (Figma face) bundled per weight via `expo-font`; a `Text` wrapper maps `fontWeight`/`fontStyle` to the right Inter file (Android ignores weights on custom fonts). An ESLint rule blocks importing React Native's `Text` directly. Splash stays up until fonts load. Found and added the missing `expo-asset` peer while doing this.
  - **Decision review:** unchosen options now fade back (`dimmed`) instead of using Figma's pale passive gradient, which read brighter than the chosen card on dark surfaces.
  - **Auto-scroll** to the consequence card after locking in; each new step starts at the top.
  - **Countdown timer:** gradient pinned to the full track and anchored to the fill's right edge — identical to the Figma timer when full, turning red as time runs out.
  - **Motion:** staggered `FadeIn` per step and on the outcome screen, score count-up; both respect the OS "Reduce motion" setting.
  - **Light theme fix:** content on imagery (HUD labels, glass buttons) always uses Figma cyan; the darker light-theme cyan was low-contrast on photos.
* **Verification:** tsc, lint, 41/41 tests, expo-doctor 21/21, and on-device review on the Android emulator.

---

### Phase 8: Figma Fidelity Pass via Figma MCP (Claude Code)
* **Trigger:** A Figma MCP connection became available, replacing screenshot-based estimates with the file's real values.
* **Findings (screenshot guesses that were wrong):**
  - The file is a component library only (Style Guide, Buttons, Cards, Option Card, Scenario Card/Container, Nav Bar, Tabbar, Icons, App Icon) — no full screens.
  - **Option Card** fills are translucent (`rgba(15,23,43,0.63)`, selected gradient to `rgba(0,211,243,0.63)`, `#F8FAFC` border 1/2px); "Passive" is the selected look at 48% opacity. It only looked grey/pale on Figma's light canvas.
  - **Buttons:** the grey/dark/light-cyan columns are Primary *Disabled / Pressed / Glass* states, not colour variants. Real set: Primary · Secondary (cyan outline) · Ghost · Link, radius 16, 24px horizontal padding, 24/20/16 icons.
  - **Inactive cards** are 35% opacity (not a white wash). **Start buttons** are `rgba(0,184,219,0.14)`, borderless, Inter Black.
  - **Scenario Container** radius 24 with a bottom-up scrim; **Card** is 220×176 (5:4), not 1:1; **Nav Bar** has a `#314158` divider; inactive tab icons `#62748E`; active tile `rgba(0,184,219,0.1)` radius 12.
* **Changes:** tokens now mirror the Figma variables (with names in comments), `TYPE_SCALE` from the `typhography/*` styles; `Button` rebuilt on Figma's hierarchy × state × size model; `OptionCard`, `ScenarioCard`, `SquareCard`, `NavBar`, `IconButton` and the tab bar updated to the exact values; removed a leftover hard-coded tab tint.
* **Kept deliberately:** the "dimmed" state for unchosen options (Figma Default at the Passive 48% opacity), since Figma's Passive keeps the cyan gradient and would read as a second selection.
* **Verification:** tsc, lint, 41/41 tests, expo-doctor 21/21; visual check on the Android emulator (Home, list and locked cards, simulation, Gallery button matrix, System grid). Found and fixed on-device: list card width with `aspectRatio`, Secondary button invisible on Slate 900 surfaces.
