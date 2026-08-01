import { Tabs } from 'expo-router/tabs';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Jobs' }} />
      <Tabs.Screen name="my-jobs" options={{ title: 'My jobs' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
