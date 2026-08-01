import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/session/session-context';

export default function AuthenticatedLayout() {
  const { status } = useSession();
  if (status !== 'authenticated') return <Redirect href="/(auth)" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="job/new" options={{ headerShown: true, presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.5, 1], title: 'New repair job' }} />
      <Stack.Screen name="job/[id]" options={{ headerShown: true, presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.5, 1], title: 'Repair job' }} />
    </Stack>
  );
}
