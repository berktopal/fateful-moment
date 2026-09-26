import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import SettingsScreen from '../app/(tabs)/settings';
import BriefingScreen from '../app/scenario/[id]/index';
import PlayScreen from '../app/scenario/[id]/play';
import OutcomeScreen from '../app/scenario/[id]/outcome';
import { DEFAULT_STATE, STORAGE_KEY } from '../store/storage';
import { PRESS_GUARD_MS } from '../components/Button';

// Real screens for the flow under test; the other tabs and the gallery are stubbed.
const routes = {
  _layout: RootLayout,
  '(tabs)/_layout': () => <Slot />,
  '(tabs)/index': () => null,
  '(tabs)/settings': SettingsScreen,
  gallery: () => null,
  'scenario/[id]/index': BriefingScreen,
  'scenario/[id]/play': PlayScreen,
  'scenario/[id]/outcome': OutcomeScreen,
};

const readStored = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? '{}');

// The footer button ignores a second tap within PRESS_GUARD_MS. Tests tap far faster than a
// person, so `pause()` moves renderRouter's fake clock past that window.
const pause = () => act(() => jest.advanceTimersByTime(PRESS_GUARD_MS));

const choose = async (optionText: string, advanceLabel: string) => {
  await fireEvent.press(await screen.findByRole('radio', { name: optionText }));
  await pause();
  await fireEvent.press(screen.getByRole('button', { name: 'Kararı Kilitle' }));
  await pause();
  await fireEvent.press(await screen.findByRole('button', { name: advanceLabel }));
};

describe('simulation flow', () => {
  beforeEach(() => AsyncStorage.clear());

  it('plays a scenario from briefing to after-action report and records it', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight' });

    await fireEvent.press(await screen.findByRole('button', { name: 'Simülasyonu Başlat' }));
    expect(await screen.findByText('KARAR 01 / 03')).toBeOnTheScreen();

    await choose('Dere menfezinden ilerle', 'Sonraki Karar');
    await choose('Karşı tarafta dikkat dağıtacak bir şey yap', 'Sonraki Karar');
    await choose('Menfezden yaya olarak geri çekil', 'Sonucu Gör');

    // 50/50 start → +25 stability, +20 trust → score 73 → DECISIVE.
    expect(await screen.findByText('KESİN ZAFER')).toBeOnTheScreen();
    // The visible number counts up; the accessible label carries the final score immediately.
    expect(screen.getByLabelText('Skor: 100 üzerinden 73')).toBeOnTheScreen();
    expect(screen.getByText('Harekât Sonrası Rapor')).toBeOnTheScreen();

    const stored = await readStored();
    expect(stored.history).toHaveLength(1);
    expect(stored.history[0]).toMatchObject({
      scenarioId: 'operation-midnight',
      score: 73,
      rating: 'DECISIVE',
    });
  });

  it('does not let a double tap on "Lock In" skip the consequence', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight/play' });

    await fireEvent.press(await screen.findByRole('radio', { name: 'Dere menfezinden ilerle' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Kararı Kilitle' }));
    // The second tap of the double tap lands on the same button, now labelled "Next Decision".
    await fireEvent.press(await screen.findByRole('button', { name: 'Sonraki Karar' }));
    expect(screen.getByText('KARAR 01 / 03')).toBeOnTheScreen();

    await pause();
    await fireEvent.press(screen.getByRole('button', { name: 'Sonraki Karar' }));
    expect(await screen.findByText('KARAR 02 / 03')).toBeOnTheScreen();
  });

  it('keeps locked scenarios out of the simulator', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/fallout-rescue' });
    expect(await screen.findByRole('button', { name: 'Kilitli' })).toBeDisabled();
  });

  it('renders scenario content in English when that language is saved', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences, language: 'en' } })
    );
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight' });

    expect(await screen.findByRole('button', { name: 'Start Simulation' })).toBeOnTheScreen();
    expect(screen.getByText('OPERATION MIDNIGHT')).toBeOnTheScreen();
    expect(screen.getByText('3 decisions')).toBeOnTheScreen();
  });
});

describe('language setting', () => {
  beforeEach(() => AsyncStorage.clear());

  it('switches the app between Turkish and English and persists the choice', async () => {
    await renderRouter(routes, { initialUrl: '/settings' });

    expect(await screen.findByText('Uygulama Dili')).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Türkçe' })).toBeChecked();

    await fireEvent.press(screen.getByRole('radio', { name: 'English' }));

    expect(await screen.findByText('App Language')).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
    await waitFor(async () => expect((await readStored()).preferences.language).toBe('en'));

    await fireEvent.press(screen.getByRole('radio', { name: 'Türkçe' }));
    expect(await screen.findByText('Uygulama Dili')).toBeOnTheScreen();
  });
});
