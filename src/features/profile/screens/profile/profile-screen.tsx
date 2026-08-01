import Constants from "expo-constants";
import { useState, type ReactNode } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { AppButton } from "@/design-system/components";
import { useProfileSummary } from "@/features/profile/hooks/use-profile-summary";
import { useSession } from "@/features/session/session-context";

const appVersion = Constants.expoConfig?.version ?? "1.0.0";

export function ProfileScreen() {
  const { signOut } = useSession();
  const profile = useProfileSummary();
  const [settingsError, setSettingsError] = useState(false);

  if (!profile) return null;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <View style={styles.identity}>
        <Text accessibilityRole="header" style={styles.name}>
          {profile.identity.displayName}
        </Text>
        <Text style={styles.email}>{profile.identity.email}</Text>
        <Text style={styles.role}>{profile.identity.roleLabel}</Text>
        <Text selectable style={styles.localId}>
          Local ID · {profile.identity.localId}
        </Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>
          {profile.isLoading ? "—" : profile.summary.primaryMetric.value}
        </Text>
        <Text style={styles.metricLabel}>
          {profile.summary.primaryMetric.label}
        </Text>
        <View style={styles.metricDivider} />
        <View style={styles.supportingMetrics}>
          {profile.summary.supportingMetrics.map((metric) => (
            <View key={metric.label} style={styles.supportingMetric}>
              <Text style={styles.supportingValue}>
                {profile.isLoading ? "—" : metric.value}
              </Text>
              <Text style={styles.supportingLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <SettingsSection title="Personal info">
        <SettingsRow label="Profile" value={profile.identity.roleLabel} />
      </SettingsSection>
      <SettingsSection title="Preferences">
        <SettingsRow label="Language" value="English" />
      </SettingsSection>
      <SettingsSection title="About">
        <SettingsRow label="App version" value={appVersion} />
        <SettingsRow
          label="Device settings"
          onPress={() => openDeviceSettings(setSettingsError)}
          value="Open"
        />
      </SettingsSection>

      {settingsError ? (
        <Text accessibilityRole="alert" style={styles.settingsError}>
          Could not open device settings. Please try again.
        </Text>
      ) : null}

      <AppButton
        accessibilityLabel="Log out"
        tone="secondary"
        onPress={() => signOut()}
      >
        Log out
      </AppButton>
    </ScrollView>
  );
}

async function openDeviceSettings(
  setSettingsError: (hasError: boolean) => void,
) {
  try {
    await Linking.openSettings();
    setSettingsError(false);
  } catch {
    setSettingsError(true);
  }
}

function SettingsSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.settingsCard}>{children}</View>
    </View>
  );
}

function SettingsRow({
  label,
  onPress,
  value,
}: {
  label: string;
  onPress?: () => void;
  value: string;
}) {
  const content = (
    <>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </>
  );
  if (onPress)
    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.settingRow}
      >
        {content}
      </Pressable>
    );
  return <View style={styles.settingRow}>{content}</View>;
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 0,
  },
  identity: { alignItems: "center", gap: theme.spacing.xs },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.heading,
    fontWeight: "800",
  },
  email: { color: theme.colors.textMuted, fontSize: theme.typography.body },
  role: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: "700",
    marginTop: theme.spacing.xs,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  localId: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  metricCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.xl,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 56,
    fontWeight: "800",
    lineHeight: 62,
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.xs,
  },
  metricDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.lg,
  },
  supportingMetrics: { flexDirection: "row", gap: theme.spacing.lg },
  supportingMetric: { flex: 1, gap: theme.spacing.xs },
  supportingValue: {
    color: theme.colors.text,
    fontSize: theme.typography.heading,
    fontWeight: "800",
  },
  supportingLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
  },
  section: { gap: theme.spacing.sm },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "800",
  },
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  settingLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "700",
  },
  settingValue: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
  },
  settingsError: {
    color: theme.colors.danger,
    fontSize: theme.typography.body,
  },
}));
