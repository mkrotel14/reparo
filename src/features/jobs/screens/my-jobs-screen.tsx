import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useCompleteJob, useJobs } from '@/features/jobs/hooks/use-jobs';
import { useRole } from '@/features/session/role-context';
import { useSession } from '@/features/session/session-context';

export function MyJobsScreen() {
  const router = useRouter();
  const { role } = useRole();
  const { session } = useSession();
  const jobs = useJobs();
  const completeJob = useCompleteJob();
  const myJobs = (jobs.data ?? []).filter((job) => (role === 'pro' ? job.proId === session?.identityId : job.clientId === session?.identityId));
  const isPro = role === 'pro';

  return (
    <AppScreen>
      <FlashList
        contentContainerStyle={styles.content}
        data={myJobs}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={jobs.isError ? <View style={styles.error}><Text style={styles.empty}>Could not load your jobs.</Text><AppButton accessibilityLabel="Retry jobs" onPress={() => jobs.refetch()}>Retry</AppButton></View> : <Text style={styles.empty}>{jobs.isLoading ? 'Loading your jobs…' : 'No jobs here yet.'}</Text>}
        ListHeaderComponent={null}
        renderItem={({ item }) => <JobCard actionDisabled={completeJob.isPending} actionLabel={isPro && item.status === 'claimed' ? 'Mark complete' : undefined} job={item} onAction={isPro && item.status === 'claimed' ? () => completeJob.mutate(item.id) : undefined} onPress={() => router.push(`/job/${item.id}`)} />}
      />
      {completeJob.isError ? <Text style={styles.mutationError}>Could not complete this repair job. Please try again.</Text> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.md, padding: theme.spacing.xl },
  empty: { color: theme.colors.textMuted, fontSize: theme.typography.body, paddingTop: theme.spacing.xl, textAlign: 'center' },
  error: { gap: theme.spacing.md },
  mutationError: { color: theme.colors.danger, paddingHorizontal: theme.spacing.xl },
}));
