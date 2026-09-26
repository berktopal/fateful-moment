import { LANGUAGES, LocalizedText, toUpper } from '..';
import { ARCHIVE_NODES, COMMANDER_VITALS, INTEL_DATA, PROTOCOL_OPTIONS, SCENARIOS, SYSTEM_MODULES } from '../../data/mockData';
import { localizeScenario } from '../../repositories/localize';

/** Collects every string leaf of a localized record, with its path for readable failures. */
const strings = (value: unknown, path = ''): [string, string][] => {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
};

/** Every `{ tr, en }` pair inside a record tree. */
const pairsOf = (value: unknown): LocalizedText[] => {
  if (Array.isArray(value)) return value.flatMap(pairsOf);
  if (!value || typeof value !== 'object') return [];
  const keys = Object.keys(value);
  if (keys.length === 2 && keys.includes('tr') && keys.includes('en')) return [value as LocalizedText];
  return Object.values(value).flatMap(pairsOf);
};

describe('toUpper', () => {
  it('uses Turkish dotted and dotless i rules', () => {
    expect(toUpper('Küresel Kriz', 'tr')).toBe('KÜRESEL KRİZ');
    expect(toUpper('ılık iğne', 'tr')).toBe('ILIK İĞNE');
  });

  it('uses standard rules for English', () => {
    expect(toUpper('Global Crisis', 'en')).toBe('GLOBAL CRISIS');
  });
});

describe('bilingual mock data', () => {
  it.each(LANGUAGES)('has non-empty scenario copy in %s', (language) => {
    for (const source of SCENARIOS) {
      const scenario = localizeScenario(source, language);
      const { image: _image, ...copy } = scenario;
      for (const [path, text] of strings(copy)) {
        expect({ path: `${scenario.id}.${path}`, empty: text.trim() === '' }).toEqual({
          path: `${scenario.id}.${path}`,
          empty: false,
        });
      }
    }
  });

  it('translates every text field instead of repeating the English', () => {
    // Vitals values are numbers with units; everything else must be written in both languages.
    const records = [...SCENARIOS, ...ARCHIVE_NODES, ...PROTOCOL_OPTIONS, ...INTEL_DATA, ...SYSTEM_MODULES];
    const pairs = [...pairsOf(records), ...COMMANDER_VITALS.map((v) => v.label)];
    expect(pairs.length).toBeGreaterThan(100);
    expect(pairs.filter(({ tr, en }) => tr === en)).toEqual([]);
  });
});
