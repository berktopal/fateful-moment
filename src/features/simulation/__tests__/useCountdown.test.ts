import { act, renderHook } from '@testing-library/react-native';
import { formatCountdown, useCountdown } from '../useCountdown';

describe('useCountdown', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('counts down and fires onExpire once at zero', async () => {
    const onExpire = jest.fn();
    const { result } = await renderHook(() => useCountdown(1000, true, 'k', onExpire));

    await act(async () => jest.advanceTimersByTime(500));
    expect(result.current).toBeLessThanOrEqual(500);
    expect(onExpire).not.toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(700));
    expect(result.current).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('pauses while not running', async () => {
    const onExpire = jest.fn();
    const { result, rerender } = await renderHook(
      ({ running }: { running: boolean }) => useCountdown(1000, running, 'k', onExpire),
      { initialProps: { running: true } }
    );
    await act(async () => jest.advanceTimersByTime(300));
    await rerender({ running: false });
    const paused = result.current;
    await act(async () => jest.advanceTimersByTime(2000));
    expect(result.current).toBe(paused);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('resets when the key changes', async () => {
    const { result, rerender } = await renderHook(
      ({ k }: { k: string }) => useCountdown(1000, true, k, jest.fn()),
      { initialProps: { k: 'a' } }
    );
    await act(async () => jest.advanceTimersByTime(600));
    await rerender({ k: 'b' });
    expect(result.current).toBe(1000);
  });
});

it('formats the HUD countdown label', () => {
  expect(formatCountdown(12_000)).toBe('T-00:12');
  expect(formatCountdown(61_500)).toBe('T-01:02');
  expect(formatCountdown(0)).toBe('T-00:00');
});
