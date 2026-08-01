import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { useSession } from '@/features/session/session-context';

export function ProfileScreen() {
  const { session, signOut } = useSession();
  if (!session) return null;

  const roleLabel = session.role === 'pro' ? 'Pro' : 'Client';
  const roleDescription = session.role === 'pro' ? 'Take repair jobs and mark completed work.' : 'Post and track your repair requests.';

  return (
    <AppScreen>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Reparo test account</Text>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.description}>Log out to return to role selection. Your local identity and repair jobs remain available on this device.</Text>
        <View style={styles.details}>
          <View style={[styles.roleCard, styles.roleCardActive]}>
            <Text style={styles.roleLabel}>{roleLabel}</Text>
            <Text style={styles.roleDescription}>{roleDescription}</Text>
            <Text style={styles.currentRole}>Current workspace</Text>
          </View>
          <View style={styles.identityCard}>
            <Text style={styles.identityLabel}>Local identity</Text>
            <Text selectable style={styles.identityValue}>{session.identityId}</Text>
            {session.dummyJsonUserId ? <Text style={styles.identityMeta}>Demo API user #{session.dummyJsonUserId}</Text> : null}
          </View>
        </View>
        <View style={styles.actions}>
          <AppButton accessibilityLabel="Log out" tone="secondary" onPress={() => signOut()}>Log out</AppButton>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { flex: 1, gap: theme.spacing.md, padding: theme.spacing.xl },
  eyebrow: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 23 },
  details: { gap: theme.spacing.md },
  roleCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.lg },
  roleCardActive: { borderColor: theme.colors.primary, borderWidth: 2 },
  roleLabel: { color: theme.colors.text, fontSize: theme.typography.heading, fontWeight: '800' },
  roleDescription: { color: theme.colors.textMuted, fontSize: theme.typography.body },
  currentRole: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: '800', textTransform: 'uppercase' },
  identityCard: { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.lg, gap: theme.spacing.xs, padding: theme.spacing.lg },
  identityLabel: { color: theme.colors.textMuted, fontSize: theme.typography.caption, fontWeight: '700', textTransform: 'uppercase' },
  identityValue: { color: theme.colors.text, fontSize: theme.typography.body },
  identityMeta: { color: theme.colors.textMuted, fontSize: theme.typography.caption },
  actions: { gap: theme.spacing.md, marginTop: 'auto', paddingTop: theme.spacing.xl },
}));
