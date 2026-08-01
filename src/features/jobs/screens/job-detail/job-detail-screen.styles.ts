import { StyleSheet } from "react-native-unistyles";
export const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.md, padding: theme.spacing.xl },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "800",
  },
  description: { color: theme.colors.text, fontSize: theme.typography.body },
  meta: { color: theme.colors.textMuted, fontSize: theme.typography.body },
  message: { color: theme.colors.textMuted, padding: theme.spacing.xl },
}));
