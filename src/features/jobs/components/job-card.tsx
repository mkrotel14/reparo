import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton } from '@/design-system/components';
import type { RepairJob } from '@/features/jobs/types';

type JobCardProps = {
  actionLabel?: string;
  actionDisabled?: boolean;
  job: RepairJob;
  onAction?: () => void;
  onPress?: () => void;
};

export function JobCard({ actionDisabled, actionLabel, job, onAction, onPress }: JobCardProps) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={onPress ? `View ${job.title}` : undefined} onPress={onPress} style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={[styles.status, styles.statusColor(job.status)]}>{job.status}</Text>
      </View>
      <Text style={styles.meta}>{job.location} · R${job.budget}</Text>
      {job.description ? <Text style={styles.description}>{job.description}</Text> : null}
      {actionLabel && onAction ? <AppButton accessibilityLabel={`${actionLabel} ${job.title}`} disabled={actionDisabled} onPress={onAction}>{actionLabel}</AppButton> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.md, padding: theme.spacing.lg },
  heading: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'space-between' },
  title: { color: theme.colors.text, flex: 1, fontSize: theme.typography.heading, fontWeight: '800' },
  meta: { color: theme.colors.textMuted, fontSize: theme.typography.body },
  description: { color: theme.colors.text, fontSize: theme.typography.body },
  status: { borderRadius: theme.radius.pill, fontSize: theme.typography.caption, fontWeight: '700', overflow: 'hidden', paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, textTransform: 'capitalize' },
  statusColor: (status) => ({
    backgroundColor: status === 'completed' ? theme.colors.success : status === 'claimed' ? theme.colors.warning : theme.colors.surfaceMuted,
    color: status === 'open' ? theme.colors.textMuted : theme.colors.onPrimary,
  }),
}));
