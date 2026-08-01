import type { PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";

import { styles } from "./button.styles";

type AppButtonProps = PropsWithChildren<{
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  tone?: "primary" | "secondary";
}>;

export function AppButton({
  accessibilityLabel,
  children,
  disabled,
  onPress,
  tone = "primary",
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "secondary" && styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[styles.label, tone === "secondary" && styles.secondaryLabel]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
