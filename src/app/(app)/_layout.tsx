import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/session/session-context';

export default function AuthenticatedLayout() {
  const { status } = useSession();
  if (status !== 'authenticated') return <Redirect href="/(auth)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
