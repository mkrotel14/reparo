import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '@/design-system/components';
import { type Role, useRole } from '@/features/session/role-context';

const roles: Array<{ value: Role; label: string; description: string }> = [
  { value: 'client', label: 'Client', description: 'Post and track repair requests.' },
  { value: 'pro', label: 'Pro', description: 'Take jobs and mark repairs complete.' },
];

export function ProfileScreen() {
  const { role, setRole } = useRole();

  return (
    <AppScreen>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Reparo test account</Text>
        <Text style={styles.title}>Choose a workspace</Text>
        <Text style={styles.description}>This local switch exercises the same screens with each RBAC role.</Text>
        {roles.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: role === option.value }}
            onPress={() => setRole(option.value)}
            style={[styles.roleCard, role === option.value && styles.roleCardActive]}>
            <Text style={styles.roleLabel}>{option.label}</Text>
            <Text style={styles.roleDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { flex: 1, gap: theme.spacing.md, padding: theme.spacing.xl },
  eyebrow: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 23, marginBottom: theme.spacing.lg },
  roleCard: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.lg },
  roleCardActive: { borderColor: theme.colors.primary, borderWidth: 2 },
  roleLabel: { color: theme.colors.text, fontSize: theme.typography.heading, fontWeight: '800' },
  roleDescription: { color: theme.colors.textMuted, fontSize: theme.typography.body },
}));
