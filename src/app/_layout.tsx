import '../../unistyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router/stack';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { SessionLoadingScreen } from '@/features/session/components/session-loading-screen';
import { RoleProvider } from '@/features/session/role-context';
import { SessionProvider, useSession } from '@/features/session/session-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
