import { StyleSheet } from "react-native-unistyles";
export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 0,
  },
  empty: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    paddingTop: theme.spacing.xl,
    textAlign: "center",
  },
  error: { gap: theme.spacing.md },
  list: { flex: 1 },
  separator: { height: theme.spacing.md },
  mutationError: {
    color: theme.colors.danger,
    paddingHorizontal: theme.spacing.xl,
  },
}));
