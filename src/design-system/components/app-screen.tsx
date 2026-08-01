import type { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export function AppScreen({ children }: PropsWithChildren) {
  return <SafeAreaView edges={['top']} style={styles.screen}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
