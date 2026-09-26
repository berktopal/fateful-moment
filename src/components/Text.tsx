import { Children, ReactNode } from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { resolveFontFamily } from '../theme/fonts';
import { useI18n } from '../i18n';

/**
 * Drop-in replacement for React Native's `Text` that renders Inter. Styles keep using plain
 * `fontWeight` / `fontStyle`; this resolves them to the matching Inter file. Text with an
 * explicit `fontFamily` (e.g. the monospace HUD face) keeps its face.
 *
 * `textTransform: 'uppercase'` is applied here in JS for Turkish, because the native transform
 * ignores the app language and turns "i" into "I" instead of "İ".
 */
export const Text = ({ style, children, ...props }: TextProps) => {
  const { language, upper } = useI18n();
  const flat = StyleSheet.flatten(style) ?? {};

  const localUpper = flat.textTransform === 'uppercase' && language === 'tr';
  const content: ReactNode = localUpper
    ? Children.map(children, (child) => (typeof child === 'string' ? upper(child) : child))
    : children;
  const transform = localUpper ? { textTransform: 'none' as const } : null;

  if (flat.fontFamily) {
    return (
      <RNText {...props} style={[style, transform]}>
        {content}
      </RNText>
    );
  }

  const fontFamily = resolveFontFamily(flat.fontWeight, flat.fontStyle === 'italic');
  return (
    <RNText {...props} style={[style, { fontFamily, fontWeight: 'normal', fontStyle: 'normal' }, transform]}>
      {content}
    </RNText>
  );
};
