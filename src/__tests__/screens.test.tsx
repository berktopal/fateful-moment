import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import ExploreScreen from '../app/(tabs)/explore';
import HomeScreen from '../app/(tabs)/index';
import * as intelRepository from '../repositories/intelRepository';
import * as scenarioRepository from '../repositories/scenarioRepository';

const routes = {
  _layout: RootLayout,
  '(tabs)/_layout': () => <Slot />,
  '(tabs)/index': HomeScreen,
  '(tabs)/explore': ExploreScreen,
};

beforeEach(() => AsyncStorage.clear());
afterEach(() => jest.restoreAllMocks());

describe('empty lists', () => {
  it('Home says so when there are no scenarios', async () => {
    jest.spyOn(scenarioRepository, 'getScenarios').mockResolvedValue([]);
    await renderRouter(routes, { initialUrl: '/' });
    expect(await screen.findByText('Şu anda oynanabilecek senaryo yok.')).toBeOnTheScreen();
  });

  it('Intel says so when there are no protocols or intel', async () => {
    jest.spyOn(intelRepository, 'getProtocolOptions').mockResolvedValue([]);
    jest.spyOn(intelRepository, 'getIntelData').mockResolvedValue([]);
    await renderRouter(routes, { initialUrl: '/explore' });
    expect(await screen.findByText('Tanımlı protokol yok.')).toBeOnTheScreen();
    expect(screen.getByText('Yeni istihbarat yok.')).toBeOnTheScreen();
  });
});

describe('Intel screen', () => {
  it('starts on the default protocol from the data and lets the player switch', async () => {
    await renderRouter(routes, { initialUrl: '/explore' });

    const standing = await screen.findByRole('radio', { name: 'Uydu tarama protokolünü başlat' });
    expect(standing).toBeChecked();

    await fireEvent.press(screen.getByRole('radio', { name: 'Doğrudan müdahaleye yetki ver' }));
    expect(screen.getByRole('radio', { name: 'Doğrudan müdahaleye yetki ver' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Uydu tarama protokolünü başlat' })).not.toBeChecked();
  });
});
