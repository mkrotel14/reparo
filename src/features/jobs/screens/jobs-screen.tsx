import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useClaimJob, useCreateJob, useJobs } from '@/features/jobs/hooks/use-jobs';
import { useRole } from '@/features/session/role-context';

export function JobsScreen() {
  const { role } = useRole();
  const jobs = useJobs();
  const createJob = useCreateJob();
  const claimJob = useClaimJob();
  const openJobs = jobs.data?.filter((job) => job.status === 'open') ?? [];
  const isClient = role === 'client';

  return (
    <AppScreen>
      <FlashList
        contentContainerStyle={styles.content}
        data={openJobs}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={<Text style={styles.empty}>{jobs.isLoading ? 'Finding repair jobs…' : 'No open jobs right now.'}</Text>}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{isClient ? 'Client workspace' : 'Pro workspace'}</Text>
            <Text style={styles.title}>{isClient ? 'Need something repaired?' : 'Find your next repair'}</Text>
            <Text style={styles.description}>{isClient ? 'Post a request and follow its progress.' : 'Take an open job, then complete it from My jobs.'}</Text>
            {isClient ? <AppButton accessibilityLabel="Post a repair job" disabled={createJob.isPending} onPress={() => createJob.mutate('General home repair')}>Post a repair job</AppButton> : null}
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            actionLabel={isClient ? undefined : 'Take job'}
            job={item}
            onAction={isClient ? undefined : () => claimJob.mutate({ jobId: item.id, proId: 'pro-1' })}
          />
        )}
      />
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
}));
