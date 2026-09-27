import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import ExploreScreen from '../app/(tabs)/explore';

const routes = {
  _layout: RootLayout,
  '(tabs)/_layout': () => <Slot />,
  '(tabs)/explore': ExploreScreen,
};

describe('Intel screen', () => {
  beforeEach(() => AsyncStorage.clear());

  it('starts on the default protocol from the data and lets the player switch', async () => {
    await renderRouter(routes, { initialUrl: '/explore' });

    const standing = await screen.findByRole('radio', { name: 'Uydu tarama protokolünü başlat' });
    expect(standing).toBeChecked();

    await fireEvent.press(screen.getByRole('radio', { name: 'Doğrudan müdahaleye yetki ver' }));
    expect(screen.getByRole('radio', { name: 'Doğrudan müdahaleye yetki ver' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Uydu tarama protokolünü başlat' })).not.toBeChecked();
  });
});
