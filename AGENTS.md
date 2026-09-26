This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Project: Fateful Moment

Case study app (Jr. Frontend case): Figma-faithful, runs on iOS + Android, dummy data only, no backend.
Figma file: `eUdNecur3gJN2n8mCp6H2K`, two pages:
- **🧩Local Components** (`62:662`) — the component library this app implements (Style Guide, Buttons, Cards, Option Card, Scenario Card/Container, Nav Bar, Tabbar, Icons, App Icon).
- **🛝Playground** (`0:1`, the page the case link opens) — full screens: a landscape (812×375) "Flow v01" with a side rail, Scenarios list, briefing hero, video pages, 2×2+1 decision grid and a "Karar DNAsı" result, plus portrait auth flows. **Out of scope by the owner's decision (2026-09-26)**; the README lists it as a deviation. Don't start implementing it without asking.
- The Figma MCP runs on a Starter plan and hits its call limit quickly: batch calls and cache results.

### Structure

```text
src/app/                  Expo Router routes only
  (tabs)/                 index (War Room), explore, vitals, profile, system, settings
  scenario/[id]/          index (briefing) → play (timed decisions) → outcome (report)
  gallery.tsx             design-system showcase (Settings → Design System Gallery)
src/components/           design-system components (+ __tests__)
src/features/simulation/  pure engine, phase reducer, useCountdown (+ __tests__)
src/store/                AppStore context + AsyncStorage persistence (+ __tests__)
src/hooks/                useAsyncData, useHaptics, useAppActive, useReducedMotion, useCountUp
src/repositories/         async data access (screens never import src/data directly)
src/data/mockData.ts      scenarios, steps, bundled images
src/theme/                tokens.ts, fonts.ts, ThemeContext
src/i18n/                 languages, strings/{en,tr}.ts, I18nContext (useI18n), toUpper
```

### Design rules

- **Figma is the source of truth.** When a value is unclear, read it from the Figma file (Figma MCP: `get_design_context` / `get_variable_defs`) instead of estimating from screenshots — Figma's light canvas misleads (translucent fills look grey, 35% opacity looks like a white wash).
- **No raw colours in components.** Everything comes from `src/theme/tokens.ts`: `theme.colors.*` for themed UI, `MEDIA_COLORS` for anything drawn on photography (identical in both themes — imagery is always dark), `OPTION_CARD` for option cards. Tokens mirror Figma variable names in comments.
- **Typography:** always import `Text` from `src/components/Text` (ESLint blocks React Native's `Text`). It maps `fontWeight`/`fontStyle` to the bundled Inter files. Use `TYPE_SCALE` sizes (caption02 11/16, caption01 12/16, subhead 14/20, body 16/24, title01 28/34). HUD text uses `MONO_FONT` (Menlo; Android falls back to monospace).
- **Icons:** Lucide via `src/components/Icon` only (typed `IconName`, per-icon deep imports — Metro does not tree-shake). Add new glyphs to the `ICONS` map.
- **Buttons** follow Figma's model: `primary` / `secondary` (cyan outline) / `ghost` / `link` with Default·Pressed·Disabled and lg·md·sm; `glass` (Start buttons, pass `onMedia` on imagery), `dark`, `danger`. Radius 16, 24px horizontal padding.
- **Dual theme:** dark is the Figma baseline; light is derived for AA contrast (cyan 700 `#0E7490` on light surfaces; `src/theme/__tests__/contrast.test.ts` guards it). Check both themes for every UI change.
- **Motion:** use `FadeIn` / `useCountUp`; both respect OS Reduce Motion. Native driver wherever possible.
- **Language:** Turkish is the default, English the alternative (Settings → Language, persisted as `preferences.language`). No hard-coded copy in screens or components: UI text goes in `src/i18n/strings/en.ts` + `tr.ts` (the type checker enforces matching keys) and is read via `useI18n().t`. Data copy is authored as `{ tr, en }` in `mockData.ts` and resolved by repositories (`findScenario(id, language)` etc.). Upper-case with `upper()` / `toUpper()` — never `.toUpperCase()` — so Turkish gets İ/I right; `Text` already does this for `textTransform: 'uppercase'`. The design-system gallery stays English (it mirrors Figma labels).
- **Accessibility:** interactive elements need a role and label (`button`, `radio`, `progressbar`, `header`).
- `aspectRatio` alone can let Yoga derive width from height — pair it with `width: '100%'` on full-width cards.

### Engineering rules

- Game logic stays pure in `features/simulation` (no React Native imports); the outcome screen recomputes results from URL params (`choices`, `runId`).
- Persisted state goes through `AppStore` / `storage.ts` (sanitised on load, versioned key `fateful-moment/state/v1`).
- `npm test` must stay green (Jest + RNTL v14, async `render`/`fireEvent`). Add tests for new logic.
- `.npmrc` sets `legacy-peer-deps=true` (Expo's optional `react-dom` peer conflicts with `react@19.2.3`); keep it — fresh installs and EAS builds depend on it.
- Default branch is `master`. Commit with conventional messages; push only when asked.
- Before declaring UI work done, also verify on a device/emulator (Android AVD `fm_pixel` exists locally); static checks miss layout bugs.
