import { ActivityIndicator, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '@/design-system/components';

export function SessionLoadingScreen() {
  return (
    <AppScreen>
      <View accessibilityLabel="Restoring your session" style={styles.content}>
        <ActivityIndicator color={styles.indicator.color} />
        <Text style={styles.label}>Restoring Reparo…</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { alignItems: 'center', flex: 1, gap: theme.spacing.md, justifyContent: 'center' },
  indicator: { color: theme.colors.primary },
  label: { color: theme.colors.textMuted, fontSize: theme.typography.body },
}));
