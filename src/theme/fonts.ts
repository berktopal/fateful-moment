import type { TextStyle } from 'react-native';

/**
 * Inter — the Figma UI face. Only the cuts the app actually renders are bundled
 * (deep imports; the package index would pull in all 18 files).
 */
export const FONT_ASSETS = {
  'Inter-400': require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  'Inter-400-Italic': require('@expo-google-fonts/inter/400Regular_Italic/Inter_400Regular_Italic.ttf'),
  'Inter-500': require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
  'Inter-600': require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
  'Inter-700': require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  'Inter-700-Italic': require('@expo-google-fonts/inter/700Bold_Italic/Inter_700Bold_Italic.ttf'),
  'Inter-800': require('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
  'Inter-800-Italic': require('@expo-google-fonts/inter/800ExtraBold_Italic/Inter_800ExtraBold_Italic.ttf'),
  'Inter-900': require('@expo-google-fonts/inter/900Black/Inter_900Black.ttf'),
  'Inter-900-Italic': require('@expo-google-fonts/inter/900Black_Italic/Inter_900Black_Italic.ttf'),
};

type Weight = 400 | 500 | 600 | 700 | 800 | 900;

const ITALIC_WEIGHTS: readonly Weight[] = [400, 700, 800, 900];

const toWeight = (fontWeight: TextStyle['fontWeight']): Weight => {
  if (fontWeight === 'bold') return 700;
  const numeric = Number(fontWeight);
  if (!numeric || numeric <= 400) return 400;
  return (Math.min(900, Math.round(numeric / 100) * 100) as Weight);
};

/**
 * Maps a weight/style pair onto a concrete Inter family. Custom fonts on Android ignore
 * `fontWeight`, so every cut is registered as its own family.
 */
export const resolveFontFamily = (
  fontWeight: TextStyle['fontWeight'],
  italic: boolean
): keyof typeof FONT_ASSETS => {
  const weight = toWeight(fontWeight);
  if (!italic) return `Inter-${weight}` as keyof typeof FONT_ASSETS;
  // Nearest bundled italic at or above the requested weight.
  const italicWeight = ITALIC_WEIGHTS.find((w) => w >= weight) ?? 900;
  return `Inter-${italicWeight}-Italic` as keyof typeof FONT_ASSETS;
};
