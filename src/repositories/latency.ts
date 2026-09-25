/**
 * Repositories are async so the UI is already shaped for a real backend (loading states,
 * error handling). The small delay keeps that path exercised with dummy data.
 */
export const simulateLatency = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));
