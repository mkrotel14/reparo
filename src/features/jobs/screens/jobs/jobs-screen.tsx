import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';

import { AppButton } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useClaimJob, useJobs } from '@/features/jobs/hooks/use-jobs';
import { styles } from './jobs-screen.styles';

export function JobsScreen() {
  const jobs = useJobs();
  const claimJob = useClaimJob();
  const openJobs = jobs.data?.filter((job) => job.status === 'open') ?? [];

  return (
    <>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        data={openJobs}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={jobs.isError ? <View style={styles.error}><Text style={styles.empty}>Could not load repair jobs.</Text><AppButton accessibilityLabel="Retry repair jobs" onPress={() => jobs.refetch()}>Retry</AppButton></View> : <Text style={styles.empty}>{jobs.isLoading ? 'Finding repair jobs…' : 'No open jobs right now.'}</Text>}
        ListHeaderComponent={null}
        renderItem={({ item }) => (
          <JobCard
            actionLabel="Take job"
            actionDisabled={claimJob.isPending}
            job={item}
            onAction={() => claimJob.mutate(item.id)}
          />
        )}
        style={styles.list}
      />
      {claimJob.isError ? <Text style={styles.mutationError}>Could not take this job. Please try again.</Text> : null}
    </>
  );
}
