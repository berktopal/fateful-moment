import { Alert, AlertButton } from 'react-native';
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
import * as HudCardModule from '../components/HudCard';

// Jest's AppState mock never reports "active", which would keep every countdown paused.
jest.mock('../hooks/useAppActive', () => ({ useAppActive: () => true }));

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

  it('ignores a tap that lands just as the timer runs out', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight/play' });
    expect(await screen.findByText('T-00:20')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(20_000));

    // The player was reaching for "Lock In"; the same button now reads "Next Decision".
    await fireEvent.press(await screen.findByRole('button', { name: 'Sonraki Karar' }));
    expect(screen.getByText('KARAR 01 / 03')).toBeOnTheScreen();

    await pause();
    await fireEvent.press(screen.getByRole('button', { name: 'Sonraki Karar' }));
    expect(await screen.findByText('KARAR 02 / 03')).toBeOnTheScreen();
  });

  it('pauses the decision timer while the abort confirmation is open', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight/play' });
    expect(await screen.findByText('T-00:20')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText('T-00:19')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Geri' }));
    expect(alert).toHaveBeenCalledTimes(1);
    await act(() => jest.advanceTimersByTime(5000));
    expect(screen.getByText('T-00:19')).toBeOnTheScreen();

    // "Continue" resumes the countdown where it stopped.
    const buttons = alert.mock.calls[0][2] as AlertButton[];
    await act(() => buttons.find((b) => b.style === 'cancel')?.onPress?.());
    await act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByText('T-00:17')).toBeOnTheScreen();
    jest.restoreAllMocks();
  });

  it('re-renders only the timer while the countdown ticks', async () => {
    const hudCard = jest.spyOn(HudCardModule, 'HudCard');
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight/play' });
    expect(await screen.findByText('T-00:20')).toBeOnTheScreen();
    const rendersBefore = hudCard.mock.calls.length;

    // One act per 100 ms tick, as on a device (a single act would batch all 20 into one render).
    for (let tick = 0; tick < 20; tick++) await act(() => jest.advanceTimersByTime(100));
    expect(screen.getByText('T-00:18')).toBeOnTheScreen();
    expect(hudCard.mock.calls.length).toBe(rendersBefore);
    jest.restoreAllMocks();
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
