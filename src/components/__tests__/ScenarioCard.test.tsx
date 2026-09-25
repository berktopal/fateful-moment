import { fireEvent, render, screen } from '@testing-library/react-native';
import { ScenarioCard } from '../ScenarioCard';

const props = { title: 'Cyber Heist', description: 'Breach the mainframe.', image: null };

describe('ScenarioCard', () => {
  it('starts an active scenario', async () => {
    const onStart = jest.fn();
    await render(<ScenarioCard {...props} onStart={onStart} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start Cyber Heist' }));
    expect(onStart).toHaveBeenCalled();
  });

  it('disables the CTA for locked scenarios', async () => {
    const onStart = jest.fn();
    await render(<ScenarioCard {...props} onStart={onStart} isActive={false} />);
    const button = screen.getByRole('button', { name: 'Cyber Heist is locked' });
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onStart).not.toHaveBeenCalled();
  });

  it('uses the hero CTA in the large layout', async () => {
    await render(<ScenarioCard {...props} onStart={jest.fn()} isLarge />);
    expect(screen.getByText('Start Simulation')).toBeOnTheScreen();
  });
});
