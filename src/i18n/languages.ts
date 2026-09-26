export type Language = 'tr' | 'en';

/** Turkish is the app's primary language; English is the alternative. */
export const DEFAULT_LANGUAGE: Language = 'tr';

export const LANGUAGES: readonly Language[] = ['tr', 'en'];

/** BCP 47 tags for `Intl`-backed formatting (dates, numbers). */
export const LOCALES: Record<Language, string> = { tr: 'tr-TR', en: 'en-US' };

/** Each language is always shown in its own name, whatever the current UI language is. */
export const LANGUAGE_NAMES: Record<Language, string> = { tr: 'Türkçe', en: 'English' };

/** A piece of copy authored in every supported language. */
export type LocalizedText = Record<Language, string>;

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);
