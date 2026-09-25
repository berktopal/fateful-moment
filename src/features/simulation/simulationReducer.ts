import type { Choice } from './engine';

export type SimulationPhase = 'deciding' | 'reviewing' | 'complete';

export interface SimulationState {
  stepIndex: number;
  selectedId: string | null;
  phase: SimulationPhase;
  choices: Choice[];
}

export type SimulationAction =
  | { type: 'SELECT'; optionId: string }
  | { type: 'CONFIRM' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT'; stepCount: number };

export const initialSimulationState: SimulationState = {
  stepIndex: 0,
  selectedId: null,
  phase: 'deciding',
  choices: [],
};

/**
 * Flow per step: deciding → (CONFIRM | TIMEOUT) → reviewing → NEXT → deciding … → complete.
 * Actions that don't apply to the current phase are ignored, which makes double taps and
 * a timer firing at the same moment as a confirm harmless.
 */
export const simulationReducer = (
  state: SimulationState,
  action: SimulationAction
): SimulationState => {
  switch (action.type) {
    case 'SELECT':
      return state.phase === 'deciding' ? { ...state, selectedId: action.optionId } : state;

    case 'CONFIRM':
      if (state.phase !== 'deciding' || !state.selectedId) return state;
      return { ...state, phase: 'reviewing', choices: [...state.choices, state.selectedId] };

    case 'TIMEOUT':
      if (state.phase !== 'deciding') return state;
      // A highlighted-but-unconfirmed option is committed rather than thrown away.
      return { ...state, phase: 'reviewing', choices: [...state.choices, state.selectedId] };

    case 'NEXT': {
      if (state.phase !== 'reviewing') return state;
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= action.stepCount) return { ...state, phase: 'complete' };
      return { ...state, stepIndex: nextIndex, selectedId: null, phase: 'deciding' };
    }

    default:
      return state;
  }
};
