import {
  initialSimulationState,
  simulationReducer,
  SimulationAction,
  SimulationState,
} from '../simulationReducer';

const run = (actions: SimulationAction[], from: SimulationState = initialSimulationState) =>
  actions.reduce(simulationReducer, from);

describe('simulationReducer', () => {
  it('selects and confirms an option', () => {
    const state = run([{ type: 'SELECT', optionId: 'a' }, { type: 'CONFIRM' }]);
    expect(state.phase).toBe('reviewing');
    expect(state.choices).toEqual(['a']);
  });

  it('ignores CONFIRM without a selection', () => {
    expect(run([{ type: 'CONFIRM' }])).toEqual(initialSimulationState);
  });

  it('commits the highlighted option on timeout', () => {
    expect(run([{ type: 'SELECT', optionId: 'b' }, { type: 'TIMEOUT' }]).choices).toEqual(['b']);
  });

  it('records a timeout as null when nothing is highlighted', () => {
    expect(run([{ type: 'TIMEOUT' }]).choices).toEqual([null]);
  });

  it('ignores a timeout that lands after the confirm', () => {
    const state = run([{ type: 'SELECT', optionId: 'a' }, { type: 'CONFIRM' }, { type: 'TIMEOUT' }]);
    expect(state.choices).toEqual(['a']);
  });

  it('locks the selection while reviewing', () => {
    const state = run([
      { type: 'SELECT', optionId: 'a' },
      { type: 'CONFIRM' },
      { type: 'SELECT', optionId: 'b' },
    ]);
    expect(state.selectedId).toBe('a');
  });

  it('advances to the next step and completes after the last one', () => {
    const afterFirst = run([
      { type: 'SELECT', optionId: 'a' },
      { type: 'CONFIRM' },
      { type: 'NEXT', stepCount: 2 },
    ]);
    expect(afterFirst).toMatchObject({ stepIndex: 1, phase: 'deciding', selectedId: null });

    const done = run(
      [{ type: 'SELECT', optionId: 'c' }, { type: 'CONFIRM' }, { type: 'NEXT', stepCount: 2 }],
      afterFirst
    );
    expect(done.phase).toBe('complete');
    expect(done.choices).toEqual(['a', 'c']);
  });
});
