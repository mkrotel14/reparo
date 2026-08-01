import { Tabs } from 'expo-router/tabs';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

import { useSession } from '@/features/session/session-context';

export default function TabLayout() {
  const router = useRouter();
  const { session } = useSession();
  const isPro = session?.role === 'pro';

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ href: isPro ? undefined : null, title: 'Jobs' }} />
      <Tabs.Screen name="my-jobs" options={{ title: 'My Jobs', headerRight: isPro ? undefined : () => <Pressable accessibilityLabel="Add repair job" accessibilityRole="button" onPress={() => router.push('/job/new')} style={styles.add}><Text style={styles.addLabel}>+</Text></Pressable> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({ add: { alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, height: 30, justifyContent: 'center', marginRight: theme.spacing.sm, width: 30 }, addLabel: { color: theme.colors.onPrimary, fontSize: 24, fontWeight: '500', lineHeight: 28 } }));
