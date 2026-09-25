import type { ThemeTokens } from '../../theme';
import type { Rating, ThreatLevel } from '../../types';

export const threatColor = (theme: ThemeTokens, level: ThreatLevel): string => {
  switch (level) {
    case 'CRITICAL':
    case 'HIGH':
      return theme.colors.danger;
    case 'MEDIUM':
      return theme.colors.warning;
    case 'LOW':
    default:
      return theme.colors.success;
  }
};

export const ratingColor = (theme: ThemeTokens, rating: Rating): string => {
  switch (rating) {
    case 'DECISIVE':
      return theme.colors.primary;
    case 'CONTAINED':
      return theme.colors.success;
    case 'COMPROMISED':
      return theme.colors.warning;
    case 'CATASTROPHIC':
    default:
      return theme.colors.danger;
  }
};
