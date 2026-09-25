import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import { AppStoreProvider, useAppStore } from '../store/AppStore';
import { ThemeProvider, useTheme } from '../theme';
import { FONT_ASSETS } from '../theme/fonts';

// Keep the native splash up until preferences and fonts are loaded, so the first frame is
// already in the user's theme and in Inter (no theme flash, no font swap).
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { hydrated } = useAppStore();
  const { theme, isDark } = useTheme();
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  // A font failure falls back to the system face rather than blocking the app.
  const ready = hydrated && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // The root window shows behind the system navigation bar and during transitions.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {});
  }, [theme.colors.background]);

  if (!ready) return null;

  return (
    <>
      {/* backgroundColor is ignored when drawing edge-to-edge; it only paints the bar where the
          app is inset below it (e.g. Expo Go on Android 14), keeping icons legible in both themes. */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scenario/[id]/index" />
        {/* No swipe-back mid-simulation: leaving goes through the abort confirmation. */}
        <Stack.Screen name="scenario/[id]/play" options={{ gestureEnabled: false }} />
        <Stack.Screen
          name="scenario/[id]/outcome"
          options={{ gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="gallery"
          options={{ headerShown: true, title: 'Design System Gallery' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AppStoreProvider>
  );
}
