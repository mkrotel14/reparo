import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type AppButtonProps = PropsWithChildren<{
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
}>;

export function AppButton({ accessibilityLabel, children, disabled, onPress, tone = 'primary' }: AppButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, tone === 'secondary' && styles.secondary, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={[styles.label, tone === 'secondary' && styles.secondaryLabel]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: theme.spacing.lg,
  },
  secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
  secondaryLabel: { color: theme.colors.text },
  label: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  pressed: { backgroundColor: theme.colors.primaryPressed },
  disabled: { opacity: 0.45 },
}));
