import { DARK_TOKENS, LIGHT_TOKENS, ThemeColors, ThemeTokens } from '../tokens';

/** WCAG 2.x relative luminance of a `#RRGGBB` colour. */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Colours the screens use for body-size text (HUD labels, readouts, ratings, chips). */
const TEXT: (keyof ThemeColors)[] = ['textPrimary', 'textMuted', 'primary', 'danger', 'warning', 'success'];

const expectAA = (theme: ThemeTokens) => {
  const { colors } = theme;
  for (const surface of ['background', 'surface'] as const) {
    for (const text of TEXT) {
      const ratio = contrast(colors[text] as string, colors[surface]);
      expect({ pair: `${text} on ${surface}`, ok: ratio >= 4.5 }).toEqual({
        pair: `${text} on ${surface}`,
        ok: true,
      });
    }
  }
};

describe('theme contrast (WCAG AA, 4.5:1 for text)', () => {
  it('dark theme text meets AA on its surfaces', () => expectAA(DARK_TOKENS));

  it('light theme text meets AA on its surfaces', () => expectAA(LIGHT_TOKENS));

  it('light theme button labels meet AA on their fills', () => {
    const { colors } = LIGHT_TOKENS;
    expect(contrast(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onPrimary, colors.primaryStrong)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onAccent, colors.danger)).toBeGreaterThanOrEqual(4.5);
  });
});
