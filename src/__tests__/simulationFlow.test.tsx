import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import BriefingScreen from '../app/scenario/[id]/index';
import PlayScreen from '../app/scenario/[id]/play';
import OutcomeScreen from '../app/scenario/[id]/outcome';
import { STORAGE_KEY } from '../store/storage';

// Real screens for the flow under test; the tab shell and gallery are stubbed.
const routes = {
  _layout: RootLayout,
  '(tabs)/_layout': () => <Slot />,
  '(tabs)/index': () => null,
  gallery: () => null,
  'scenario/[id]/index': BriefingScreen,
  'scenario/[id]/play': PlayScreen,
  'scenario/[id]/outcome': OutcomeScreen,
};

const choose = async (optionText: string, advanceLabel: string) => {
  await fireEvent.press(await screen.findByRole('radio', { name: optionText }));
  await fireEvent.press(screen.getByRole('button', { name: 'Lock In Decision' }));
  await fireEvent.press(await screen.findByRole('button', { name: advanceLabel }));
};

describe('simulation flow', () => {
  beforeEach(() => AsyncStorage.clear());

  it('plays a scenario from briefing to after-action report and records it', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/operation-midnight' });

    await fireEvent.press(await screen.findByRole('button', { name: 'Start Simulation' }));
    expect(await screen.findByText('DECISION 01 / 03')).toBeOnTheScreen();

    await choose('Move through the river culvert', 'Next Decision');
    await choose('Create a distraction on the far side', 'Next Decision');
    await choose('Exfiltrate on foot back through the culvert', 'View Outcome');

    // 50/50 start → +25 stability, +20 trust → score 73 → DECISIVE.
    expect(await screen.findByText('DECISIVE')).toBeOnTheScreen();
    // The visible number counts up; the accessible label carries the final score immediately.
    expect(screen.getByLabelText('Score 73 out of 100')).toBeOnTheScreen();
    expect(screen.getByText('After Action Report')).toBeOnTheScreen();

    const stored = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? '{}');
    expect(stored.history).toHaveLength(1);
    expect(stored.history[0]).toMatchObject({
      scenarioId: 'operation-midnight',
      score: 73,
      rating: 'DECISIVE',
    });
  });

  it('keeps locked scenarios out of the simulator', async () => {
    await renderRouter(routes, { initialUrl: '/scenario/fallout-rescue' });
    expect(await screen.findByRole('button', { name: 'Locked' })).toBeDisabled();
  });
});
