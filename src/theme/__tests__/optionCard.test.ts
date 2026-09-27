import { OPTION_CARD } from '../tokens';

/**
 * The Option Card colours are Figma's translucent variables composited onto the Figma canvas.
 * This keeps them traceable to the source values instead of looking like eyeballed hex codes.
 */
const FIGMA_CANVAS = [245, 245, 245]; // #F5F5F5
const FIGMA_FILL = { rgb: [15, 23, 43], alpha: 0.63 }; // rgba(15,23,43,0.63)
const FIGMA_SELECTED_PEAK = { rgb: [0, 211, 243], alpha: 0.63 }; // rgba(0,211,243,0.63)
const FIGMA_PASSIVE_OPACITY = 0.48;

const composite = ({ rgb, alpha }: { rgb: number[]; alpha: number }) =>
  rgb.map((channel, i) => channel * alpha + FIGMA_CANVAS[i] * (1 - alpha));

const toRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const expectClose = (hex: string, expected: number[]) =>
  toRgb(hex).forEach((channel, i) => expect(Math.abs(channel - expected[i])).toBeLessThanOrEqual(1));

const faded = (layer: { rgb: number[]; alpha: number }) => ({
  ...layer,
  alpha: layer.alpha * FIGMA_PASSIVE_OPACITY,
});

describe('Option Card colours', () => {
  it('Default and the Selected edges are the Figma fill on the Figma canvas', () => {
    expectClose(OPTION_CARD.fill, composite(FIGMA_FILL));
    expectClose(OPTION_CARD.selectedGradient[0], composite(FIGMA_FILL));
    expectClose(OPTION_CARD.selectedGradient[2], composite(FIGMA_FILL));
  });

  it('Selected peaks at the Figma cyan on the Figma canvas', () => {
    expectClose(OPTION_CARD.selectedGradient[1], composite(FIGMA_SELECTED_PEAK));
  });

  it('Passive is the Selected card at 48% on the Figma canvas', () => {
    expectClose(OPTION_CARD.passiveGradient[0], composite(faded(FIGMA_FILL)));
    expectClose(OPTION_CARD.passiveGradient[1], composite(faded(FIGMA_SELECTED_PEAK)));
    expectClose(OPTION_CARD.passiveGradient[2], composite(faded(FIGMA_FILL)));
  });
});
