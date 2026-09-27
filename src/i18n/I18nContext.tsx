import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAppStore } from '../store/AppStore';
import { DEFAULT_LANGUAGE, Language, LOCALES } from './languages';
import { toUpper } from './text';
import { en, Strings } from './strings/en';
import { tr } from './strings/tr';

const STRINGS: Record<Language, Strings> = { tr, en };

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  /** UI copy for the current language. */
  t: Strings;
  /** BCP 47 locale for `Intl` formatting, e.g. dates. */
  locale: string;
  /** Upper-cases with the current language's rules (Turkish dotted/dotless i). */
  upper: (text: string) => string;
}

const createValue = (
  language: Language,
  setLanguage: I18nContextType['setLanguage']
): I18nContextType => ({
  language,
  setLanguage,
  t: STRINGS[language],
  locale: LOCALES[language],
  upper: (text) => toUpper(text, language),
});

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/** Resolves the persisted language preference into copy and formatting helpers. */
export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, setPreference } = useAppStore();
  const language = preferences.language;

  const value = useMemo(
    () => createValue(language, (next) => setPreference('language', next)),
    [language, setPreference]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Renders a subtree in a fixed language, whatever the app language is: its copy and its
 * upper-casing (no Turkish "İ" in English words). Used by the design-system gallery, which
 * mirrors the English Figma labels.
 */
export const I18nOverride = ({ language, children }: { language: Language; children: ReactNode }) => {
  const { setLanguage } = useI18n();
  const value = useMemo(() => createValue(language, setLanguage), [language, setLanguage]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

const FALLBACK = createValue(DEFAULT_LANGUAGE, () => {});

/** Falls back to the default language so components render in isolation, e.g. tests. */
export const useI18n = (): I18nContextType => useContext(I18nContext) ?? FALLBACK;
