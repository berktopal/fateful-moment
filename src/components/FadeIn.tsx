import React, { ReactNode, useEffect } from 'react';
import { Animated, Easing, ViewStyle, useAnimatedValue } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface FadeInProps {
  children: ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  /** Distance the content rises while fading in. */
  offset?: number;
  style?: ViewStyle;
}

/**
 * Fade + short rise on mount (native driver, 260 ms). Re-key it to replay, e.g. per decision
 * step. Renders statically when the OS "Reduce motion" setting is on.
 */
export const FadeIn = ({ children, delay = 0, offset = 12, style }: FadeInProps) => {
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 260,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, reducedMotion]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};
