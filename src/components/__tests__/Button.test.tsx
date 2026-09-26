import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, PRESS_GUARD_MS } from '../Button';

describe('Button', () => {
  it('renders its title and handles presses', async () => {
    const onPress = jest.fn();
    await render(<Button title="Start Simulation" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start Simulation' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores a double tap but accepts a later press', async () => {
    const onPress = jest.fn();
    const now = jest.spyOn(Date, 'now').mockReturnValue(10_000);
    await render(<Button title="Start Simulation" onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Start Simulation' });

    await fireEvent.press(button);
    now.mockReturnValue(10_000 + PRESS_GUARD_MS - 1);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    now.mockReturnValue(10_000 + PRESS_GUARD_MS);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(2);
    now.mockRestore();
  });

  it('does not fire when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="Locked" onPress={onPress} disabled />);
    const button = screen.getByRole('button', { name: 'Locked' });
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a busy state while loading', async () => {
    await render(<Button title="Save" onPress={jest.fn()} loading />);
    expect(screen.getByRole('button')).toBeBusy();
    expect(screen.queryByText('Save')).toBeNull();
  });
});
