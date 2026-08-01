import { StyleSheet } from 'react-native-unistyles';

import type { AppTagTone } from './tag';

export const styles = StyleSheet.create((theme) => ({
  label: { fontSize: theme.typography.caption, fontWeight: '700', textTransform: 'capitalize' },
  labelTone: (tone: AppTagTone) => ({ color: tone === 'neutral' ? theme.colors.textMuted : theme.colors.onPrimary }),
  tag: { alignSelf: 'flex-start', borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  tone: (tone: AppTagTone) => ({ backgroundColor: tone === 'success' ? theme.colors.success : tone === 'warning' ? theme.colors.warning : theme.colors.surfaceMuted }),
}));
