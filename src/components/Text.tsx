import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { resolveFontFamily } from '../theme/fonts';

/**
 * Drop-in replacement for React Native's `Text` that renders Inter. Styles keep using plain
 * `fontWeight` / `fontStyle`; this resolves them to the matching Inter file. Text with an
 * explicit `fontFamily` (e.g. the monospace HUD face) is left untouched.
 */
export const Text = ({ style, ...props }: TextProps) => {
  const flat = StyleSheet.flatten(style) ?? {};
  if (flat.fontFamily) return <RNText style={style} {...props} />;

  const fontFamily = resolveFontFamily(flat.fontWeight, flat.fontStyle === 'italic');
  return (
    <RNText
      {...props}
      style={[style, { fontFamily, fontWeight: 'normal', fontStyle: 'normal' }]}
    />
  );
};
