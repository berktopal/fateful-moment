import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its title and handles presses', async () => {
    const onPress = jest.fn();
    await render(<Button title="Start Simulation" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start Simulation' }));
    expect(onPress).toHaveBeenCalledTimes(1);
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
