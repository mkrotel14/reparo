import '../../unistyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router/stack';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { darkTheme, lightTheme } from '@/design-system/tokens/theme';

import { SessionLoadingScreen } from '@/features/session/components/loading/session-loading-screen';
import { RoleProvider } from '@/features/session/role-context';
import { SessionProvider, useSession } from '@/features/session/session-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const appTheme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const navigationTheme = { ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme), colors: { ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors, background: appTheme.colors.background, border: appTheme.colors.border, card: appTheme.colors.surface, primary: appTheme.colors.primary, text: appTheme.colors.text } };
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 60_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RoleProvider>
          <ThemeProvider value={navigationTheme}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RootNavigator />
          </ThemeProvider>
        </RoleProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export function RootNavigator() {
  const { status } = useSession();
  if (status === 'loading') return <SessionLoadingScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
