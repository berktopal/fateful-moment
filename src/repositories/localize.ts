import type {
  ArchiveNode,
  ArchiveNodeSource,
  CommanderVital,
  CommanderVitalSource,
  IntelItem,
  IntelItemSource,
  ProtocolOption,
  ProtocolOptionSource,
  Scenario,
  ScenarioSource,
  SystemModule,
  SystemModuleSource,
} from '../types';
import type { Language } from '../i18n/languages';
import { en } from '../i18n/strings/en';
import { tr } from '../i18n/strings/tr';

/** Resolves bilingual source records into the single-language shapes the UI renders. */

const durationLabel = (minutes: number, language: Language) =>
  (language === 'tr' ? tr : en).scenario.duration(minutes);

export const localizeScenario = (
  { title, description, durationMin, steps, ...rest }: ScenarioSource,
  language: Language
): Scenario => ({
  ...rest,
  title: title[language],
  description: description[language],
  duration: durationLabel(durationMin, language),
  steps: steps.map(({ prompt, context, options, ...step }) => ({
    ...step,
    prompt: prompt[language],
    context: context[language],
    options: options.map(({ text, consequence, ...option }) => ({
      ...option,
      text: text[language],
      consequence: consequence[language],
    })),
  })),
});

export const localizeIntel = ({ title, location, ...rest }: IntelItemSource, language: Language): IntelItem => ({
  ...rest,
  title: title[language],
  location: location[language],
});

export const localizeProtocol = ({ text, ...rest }: ProtocolOptionSource, language: Language): ProtocolOption => ({
  ...rest,
  text: text[language],
});

export const localizeModule = ({ name, status, ...rest }: SystemModuleSource, language: Language): SystemModule => ({
  ...rest,
  name: name[language],
  status: status[language],
});

export const localizeArchive = ({ title, ...rest }: ArchiveNodeSource, language: Language): ArchiveNode => ({
  ...rest,
  title: title[language],
});

export const localizeVital = ({ label, value, ...rest }: CommanderVitalSource, language: Language): CommanderVital => ({
  ...rest,
  label: label[language],
  value: value[language],
});
