import { Tabs } from 'expo-router/tabs';

import { useSession } from '@/features/session/session-context';

export default function TabLayout() {
  const { session } = useSession();
  const isPro = session?.role === 'pro';

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: isPro ? undefined : null, title: 'Jobs' }} />
      <Tabs.Screen name="my-jobs" options={{ title: 'My jobs' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
