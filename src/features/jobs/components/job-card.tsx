import { Pressable, Text, View } from 'react-native';

import { AppButton, AppTag } from '@/design-system/components';
import type { RepairJob } from '@/features/jobs/types';
import { styles } from './job-card.styles';

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
        <AppTag tone={job.status === 'completed' ? 'success' : job.status === 'claimed' ? 'warning' : 'neutral'}>{job.status}</AppTag>
      </View>
      <Text style={styles.meta}>{job.location} · R${job.budget}</Text>
      {job.description ? <Text style={styles.description}>{job.description}</Text> : null}
      {actionLabel && onAction ? <AppButton accessibilityLabel={`${actionLabel} ${job.title}`} disabled={actionDisabled} onPress={onAction}>{actionLabel}</AppButton> : null}
    </Pressable>
  );
}
