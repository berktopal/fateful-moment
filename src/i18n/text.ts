import type { Language } from './languages';

/**
 * Locale-correct upper-casing. JavaScript's `toUpperCase()` and React Native's
 * `textTransform: 'uppercase'` map "i" to "I", which is wrong in Turkish ("i" → "İ", "ı" → "I").
 * Doing the mapping by hand keeps it identical on every engine and device locale.
 */
export const toUpper = (text: string, language: Language): string =>
  language === 'tr'
    ? text.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase()
    : text.toUpperCase();
