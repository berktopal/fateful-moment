# AI Development Log — Fateful Moment

How the app was built with AI assistance: what each phase set out to do, what was found, what was decided, and how it was verified. Mistakes made by the AI (or by earlier phases) are kept and marked where they were corrected. They show how the process was controlled.

**Tools:** Antigravity (Gemini) for phase 1, Claude Code for phases 2–7, and the official Figma MCP server for reading design values. Scope, priorities and every deviation from Figma were the owner's decisions.

---

### 1. Baseline audit and theme foundation (Antigravity / Gemini)
- **Findings:** token drift from the Style Guide (e.g. accent `#F82C38` vs `#FB2C36`, border `#10293D` vs `#1D293D`); missing Style Guide pieces (cyan→red timer, status beacons, scanlines); screens importing dummy arrays directly; no theme architecture.
- **Decisions:** `ThemeContext` with a dark palette from the Style Guide and a derived light palette.
- **Later correction:** the light palette was described as WCAG AA compliant. Measured in phase 6, its cyan / amber / emerald text was only 3.2–3.8:1.

### 2. Figma gap audit from exported frames (Claude Code)
- **Findings:**
  - The icon set is Lucide, which Feather couldn't render.
  - Buttons were italic / uppercase with 4 variants; Figma has bold labels, solid / outline / link and a trailing arrow.
  - Scenario cards used solid CTAs; Figma uses mono HUD headers, italic titles and translucent "glass" Start buttons.
  - Bugs:
    - the fixed tab bar height hid the icons under the iPhone home indicator;
    - `userInterfaceStyle: "light"` stopped the System theme from ever turning dark;
    - 34 `react-hooks/refs` lint errors.
- **Decisions:**
  - Lucide behind a typed `Icon` wrapper with per-icon imports (Metro does not tree-shake).
  - `Button` rebuilt as variant × appearance × size.
  - `HudCard` added; the other components restyled.
  - `useAnimatedValue` instead of `useRef(new Animated.Value())`.
- **Verification:** tsc, lint, expo-doctor 21/21, Android bundle. Colours at this point were matched from screenshots, which phase 5 found partly wrong.

### 3. Playable app, persistence and tests (Claude Code)
- **Gaps:**
  - "Start" only opened an alert.
  - Nothing was persisted, and images depended on remote URLs.
  - Hard-coded colours remained in components.
  - There were no tests.
  - A clean `npm install` / EAS build failed on a peer-dependency conflict.
  - The README claimed "pixel-perfect".
- **Decisions:**
  - Pure simulation engine plus a phase reducer. The outcome screen recomputes the result from URL params, so results are reproducible; each run is recorded once through a stable `runId`.
  - Wall-clock countdown that pauses during review and in the background.
  - `AppStore` persisting preferences and history to AsyncStorage, sanitised field by field on load.
  - Bundled images through `expo-image`.
  - `.npmrc` with `legacy-peer-deps`.
  - A candidate photo of a real public figure was dropped.
- **Verification:** 41 tests, including an Expo Router test that plays a scenario end to end. On the Android emulator, found and fixed:
  - missing deep-link `scheme`;
  - white strip under the tab bar;
  - unreadable light-mode status bar;
  - briefing hero not full width.

### 4. UI/UX polish within the Figma spec (Claude Code)
- **Changes:**
  - Inter bundled per weight, with a `Text` wrapper that maps weight and style to the right file (Android ignores weights on custom fonts); ESLint blocks React Native's `Text`.
  - Auto-scroll to the consequence after locking a decision.
  - The countdown bar keeps the full Figma gradient and turns red as time runs out.
  - Staggered fade-ins and a score count-up, both respecting the OS "Reduce motion" setting.
- **Decision:** unchosen options fade back ("dimmed") instead of using Figma's Passive look, which kept the cyan gradient and read as a second selection.

### 5. Figma fidelity via Figma MCP (Claude Code)
- **Findings — screenshot guesses that were wrong:**
  - Option Card fills are translucent (`rgba(15,23,43,0.63)`, peaking at `rgba(0,211,243,0.63)`); they only looked grey on Figma's light canvas.
  - Locked cards are 35% opacity, not a white wash.
  - The grey / dark / light-cyan button columns are Disabled / Pressed / Glass states, not colour variants.
  - Card sizes, radii, the nav bar divider and the tab colours also differed.
- **Changes:** tokens mirror the Figma variables (names in comments); `Button`, cards, `OptionCard`, `NavBar`, `IconButton` and the tab bar updated to the exact values.
- **Wrong conclusion, corrected in phase 6:** "the file is a component library only". Only the 🧩Local Components page had been read; the 🛝Playground page, which the case link opens, has full screens.

### 6. Separate pre-submission audit (Claude Code)
- **Setup:** a fresh session reviewed the app as the evaluating team lead, without touching code, listing each finding with file:line and a proposed fix. Fixes followed in separate commits; the outcome is summarised in [`REVIEW.md`](../REVIEW.md). Rules for the session: stop if Figma is unreachable, and ask before any deviation or new package.
- **Findings:**
  - Playground screens (landscape flow, decision DNA, auth) not implemented. **The owner kept them out of scope;** the README lists them as a deviation.
  - A double tap on Start pushed two simulations. The hidden one kept its timer and back handler, so on the outcome screen the back button offered to abort a finished mission.
  - A double tap on "Lock In" skipped the consequence.
  - The countdown kept running behind the abort dialog.
  - The light theme failed AA (see phase 1).
  - Nav bar icons were announced by their icon names; several touch targets were under 44pt.
  - iOS clipped the card shadows; the outcome buttons didn't fit on 360dp screens.
- **Fixes:** each with a test where testable. The double-tap, timer-pause and contrast tests were confirmed to fail without their fix.
  - Button double-tap guard and `hitSlop`.
  - Type-enforced nav bar labels.
  - Timer pause during the abort dialog.
  - Darker light-theme tokens plus a contrast test.
  - Two-layer cards; stacked footer buttons.
- **AI mistakes caught in this phase:**
  - A test waiting in real time hung, because Expo Router's test renderer installs fake timers.
  - The new timer test revealed that every earlier simulation test ran with a paused countdown: Jest's `AppState` mock is never "active".
- **Limit hit:** the Figma MCP ran out of calls on the Starter plan. Components were compared against 20 frames the owner exported.

### 7. Option Card colours, gallery language, performance (Claude Code)
- **Option Card:** the owner found the dark theme didn't look like the Figma component; Selected and Passive looked alike. The Figma values are now composited onto the Figma canvas (`#F5F5F5`) and used as opaque colours. They were checked against pixels sampled from the owner's export (±3) and are re-derived in a test. The owner decided to leave out Figma's diagonal highlight streaks.
- **Gallery:** rendered in English through `I18nOverride`, so English labels no longer get Turkish "İ".
- **Performance:**
  - A render-count test showed the simulation screen re-rendering on every 100 ms tick (20 renders in 2 s). The countdown moved into a memoised `DecisionTimer`; the test now expects zero.
  - Scanlines draw only the lines that fit instead of 160 views.
  - The simulated 250 ms repository latency applies only in development.
- **Rejected after a device check:** a native-driven countdown bar passed the tests but lagged the readout on the emulator. Restarting a native animation every 100 ms starts it from a stale value. Reverted.

---

### Lessons that shaped the process
- **Screenshots mislead:** translucent fills and opacity look different on Figma's light canvas. Values come from Figma itself, or are derived from its variables when the MCP is unavailable.
- **Static checks are not enough:** safe-area, shadow, layout and animation bugs were found only on a device or emulator.
- **Tests can pass on a false premise:** the paused countdown in Jest. New tests are checked to fail without their fix.
- **The AI proposes, the owner decides:** scope (Playground screens), Figma fidelity (the Option Card border) and new dependencies were decided explicitly, and recorded in the README.
