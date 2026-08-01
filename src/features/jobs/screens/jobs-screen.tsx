import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useClaimJob, useJobs } from '@/features/jobs/hooks/use-jobs';

export function JobsScreen() {
  const jobs = useJobs();
  const claimJob = useClaimJob();
  const openJobs = jobs.data?.filter((job) => job.status === 'open') ?? [];

  return (
    <AppScreen>
      <FlashList
        contentContainerStyle={styles.content}
        data={openJobs}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={jobs.isError ? <View style={styles.error}><Text style={styles.empty}>Could not load repair jobs.</Text><AppButton accessibilityLabel="Retry repair jobs" onPress={() => jobs.refetch()}>Retry</AppButton></View> : <Text style={styles.empty}>{jobs.isLoading ? 'Finding repair jobs…' : 'No open jobs right now.'}</Text>}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Pro workspace</Text>
            <Text style={styles.title}>Find your next repair</Text>
            <Text style={styles.description}>Take an open job, then complete it from My jobs.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            actionLabel="Take job"
            actionDisabled={claimJob.isPending}
            job={item}
            onAction={() => claimJob.mutate(item.id)}
          />
        )}
      />
      {claimJob.isError ? <Text style={styles.mutationError}>Could not take this job. Please try again.</Text> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.md, padding: theme.spacing.xl },
  header: { gap: theme.spacing.md, marginBottom: theme.spacing.md },
  eyebrow: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 22 },
  empty: { color: theme.colors.textMuted, fontSize: theme.typography.body, paddingTop: theme.spacing.xl, textAlign: 'center' },
  error: { gap: theme.spacing.md },
  mutationError: { color: theme.colors.danger, paddingHorizontal: theme.spacing.xl },
}));
