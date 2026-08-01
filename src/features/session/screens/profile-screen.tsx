import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { useSession } from '@/features/session/session-context';
import type { Role } from '@/features/session/types';

const roles: Array<{ value: Role; label: string; description: string }> = [
  { value: 'client', label: 'Client', description: 'Post and track repair requests.' },
  { value: 'pro', label: 'Pro', description: 'Take jobs and mark repairs complete.' },
];

export function ProfileScreen() {
  const { session, selectRole, signOut } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSessionActionLocked = useRef(false);
  if (!session) return null;

  const otherRole: Role = session.role === 'client' ? 'pro' : 'client';

  async function runSessionAction(action: () => Promise<void>) {
    if (isSessionActionLocked.current) return;
    isSessionActionLocked.current = true;
    setIsSubmitting(true);
    try {
      await action();
    } finally {
      isSessionActionLocked.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Reparo test account</Text>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.description}>This local identity remains available after you log out, so you can try both Reparo workspaces.</Text>
        <View style={styles.details}>
          {roles.map((option) => (
            <View key={option.value} style={[styles.roleCard, session.role === option.value && styles.roleCardActive]}>
            <Text style={styles.roleLabel}>{option.label}</Text>
            <Text style={styles.roleDescription}>{option.description}</Text>
            {session.role === option.value ? <Text style={styles.currentRole}>Current workspace</Text> : null}
            </View>
          ))}
          <View style={styles.identityCard}>
            <Text style={styles.identityLabel}>Local identity</Text>
            <Text selectable style={styles.identityValue}>{session.identityId}</Text>
            {session.dummyJsonUserId ? <Text style={styles.identityMeta}>Demo API user #{session.dummyJsonUserId}</Text> : null}
          </View>
        </View>
        <View style={styles.actions}>
          <AppButton accessibilityLabel={`Switch to ${otherRole === 'pro' ? 'Pro' : 'Client'}`} disabled={isSubmitting} tone="secondary" onPress={() => runSessionAction(() => selectRole(otherRole))}>
            Switch to {otherRole === 'pro' ? 'Pro' : 'Client'}
          </AppButton>
          <AppButton accessibilityLabel="Log out" disabled={isSubmitting} tone="secondary" onPress={() => runSessionAction(signOut)}>Log out</AppButton>
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
