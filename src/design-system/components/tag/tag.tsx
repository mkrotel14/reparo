import { Text, View } from "react-native";

import { styles } from "./tag.styles";

export type AppTagTone = "neutral" | "success" | "warning";

type AppTagProps = { children: string; tone?: AppTagTone };

export function AppTag({ children, tone = "neutral" }: AppTagProps) {
  return (
    <View style={[styles.tag, styles.tone(tone)]}>
      <Text style={[styles.label, styles.labelTone(tone)]}>{children}</Text>
    </View>
  );
}
