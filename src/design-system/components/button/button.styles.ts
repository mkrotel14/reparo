import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  button: { alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, justifyContent: 'center', minHeight: 48, paddingHorizontal: theme.spacing.lg },
  disabled: { opacity: 0.45 },
  label: { color: theme.colors.onPrimary, fontSize: theme.typography.body, fontWeight: '700' },
  pressed: { backgroundColor: theme.colors.primaryPressed },
  secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
  secondaryLabel: { color: theme.colors.text },
}));
