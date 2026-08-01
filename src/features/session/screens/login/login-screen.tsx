import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { useSession } from '@/features/session/session-context';

export function LoginScreen() {
  const { selectRole } = useSession();

  return (
    <AppScreen>
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>Welcome to Reparo</Text>
          <Text style={styles.title}>Repairs, without the mystery.</Text>
          <Text style={styles.description}>Choose a demo workspace to post repair requests or take repair jobs.</Text>
        </View>
        <View style={styles.actions}>
          <AppButton accessibilityLabel="Continue as Client" onPress={() => selectRole('client')}>Continue as Client</AppButton>
          <AppButton accessibilityLabel="Continue as Pro" onPress={() => selectRole('pro')}>Continue as Pro</AppButton>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { flex: 1, justifyContent: 'space-between', padding: theme.spacing.xl },
  intro: { gap: theme.spacing.md, paddingTop: theme.spacing['3xl'] },
  eyebrow: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: theme.colors.text, fontSize: 38, fontWeight: '800', letterSpacing: -0.8, lineHeight: 44 },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 24 },
  actions: { gap: theme.spacing.md, paddingBottom: theme.spacing.xl },
}));
