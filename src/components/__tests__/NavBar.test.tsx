import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavBar } from '../NavBar';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe('NavBar', () => {
  it('announces actions by their label and hides decorative icons', async () => {
    const onBack = jest.fn();
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <NavBar
          title="Briefing"
          left={{ icon: 'arrow-left', onPress: onBack, accessibilityLabel: 'Back' }}
          right="squiggle"
        />
      </SafeAreaProvider>
    );

    expect(screen.getByRole('header', { name: 'Briefing' })).toBeOnTheScreen();
    // Only the action is a button; the squiggle is decoration.
    expect(screen.getAllByRole('button')).toHaveLength(1);

    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
